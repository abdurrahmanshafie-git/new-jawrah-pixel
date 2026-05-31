import { supabase, isSupabaseConfigured } from './client';
import {
  calculateBillingFields,
  computeRemainingBalance,
  type BillingMilestoneKey,
} from '@/lib/billing/calculations';
import { sendPaymentEmailNotification, type PaymentEmailType } from '@/lib/email/paymentEmails';
import { requestBillingPdfGeneration } from '@/lib/pdf/billingPdfClient';
import { createUserNotification } from '@/lib/platform/notifications';
import { notifyUser } from './ecosystem-api';
import type { RegionCode } from '@/types';
import type { PaymentProviderId } from '@/lib/payments/config';
import { logSupabaseQuery } from './query-debug';
import { generateInvoiceNumber } from '@/lib/payments/checkout';

const FILE_BUCKET = 'project-files';

function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }
}

export function normalizeInvoiceRow(inv: Record<string, unknown>) {
  const projectValue = Number(inv.project_value ?? inv.amount ?? 0);
  const depositPercentage = Number(inv.deposit_percentage ?? 10);
  const billing = calculateBillingFields(projectValue, depositPercentage, (inv.region as RegionCode) ?? 'lk');

  return {
    ...inv,
    project_value: Number(inv.project_value ?? billing.project_value),
    deposit_percentage: Number(inv.deposit_percentage ?? billing.deposit_percentage),
    deposit_amount: Number(inv.deposit_amount ?? billing.deposit_amount),
    remaining_balance: Number(inv.remaining_balance ?? billing.remaining_balance),
    amount_due_now: Number(inv.amount_due_now ?? inv.amount ?? billing.amount_due_now),
    current_milestone: (inv.current_milestone as string) ?? billing.current_milestone,
  };
}

export async function fetchInvoiceForCheckout(invoiceId: string, userId: string, isAdmin: boolean) {
  ensureConfigured();

  const invoiceRes = await logSupabaseQuery(
    'invoices.checkout',
    supabase
      .from('invoices')
      .select('*, client:profiles(full_name, email, region), project:projects(title, status)')
      .eq('id', invoiceId)
      .single(),
  );

  if (invoiceRes.error || !invoiceRes.data) return invoiceRes;

  const inv = invoiceRes.data;
  if (!isAdmin && inv.client_id && inv.client_id !== userId) {
    return { data: null, error: { message: 'You do not have access to this invoice.', code: '403' } as any };
  }

  const milestonesRes = await logSupabaseQuery(
    'invoice_billing_milestones',
    supabase
      .from('invoice_billing_milestones')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('sort_order', { ascending: true }),
  );

  let milestones = milestonesRes.data ?? [];
  if (milestones.length === 0) {
    const normalized = normalizeInvoiceRow(inv);
    const billing = calculateBillingFields(
      normalized.project_value,
      normalized.deposit_percentage,
      (inv.region as RegionCode) ?? 'lk',
    );
    milestones = billing.milestones.map((m) => ({
      ...m,
      invoice_id: invoiceId,
      status: m.milestone_key === normalized.current_milestone ? 'pending' : 'pending',
      id: m.milestone_key,
    }));
  }

  return {
    data: { invoice: normalizeInvoiceRow(inv), milestones },
    error: null,
  };
}

export async function createProfessionalInvoice(input: {
  client_id: string;
  project_id?: string | null;
  title: string;
  project_value: number;
  deposit_percentage: number;
  region: RegionCode;
  due_date?: string | null;
}) {
  ensureConfigured();

  const billing = calculateBillingFields(input.project_value, input.deposit_percentage, input.region);
  const invoiceNumber = generateInvoiceNumber(input.region);

  const invoiceRes = await logSupabaseQuery(
    'invoices.professional_create',
    supabase
      .from('invoices')
      .insert({
        client_id: input.client_id,
        project_id: input.project_id ?? null,
        invoice_number: invoiceNumber,
        title: input.title,
        amount: billing.amount_due_now,
        amount_due_now: billing.amount_due_now,
        project_value: billing.project_value,
        deposit_percentage: billing.deposit_percentage,
        deposit_amount: billing.deposit_amount,
        remaining_balance: billing.remaining_balance,
        current_milestone: billing.current_milestone,
        currency: billing.currency,
        region: input.region,
        status: 'pending',
        payment_status: 'pending',
        due_date: input.due_date ?? null,
      })
      .select('*')
      .single(),
  );

  if (invoiceRes.error || !invoiceRes.data) return invoiceRes;

  const milestoneRows = billing.milestones.map((m) => ({
    invoice_id: invoiceRes.data!.id,
    milestone_key: m.milestone_key,
    label: m.label,
    percentage: m.percentage,
    amount: m.amount,
    status: 'pending' as const,
    sort_order: m.sort_order,
  }));

  await logSupabaseQuery(
    'invoice_billing_milestones.insert',
    supabase.from('invoice_billing_milestones').insert(milestoneRows),
  );

  await notifyUser(
    input.client_id,
    'Invoice Ready',
    `Invoice ${invoiceNumber} is ready. Amount due now: ${billing.currency} ${billing.amount_due_now.toLocaleString()}.`,
  );

  const { data: clientProfile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', input.client_id)
    .single();

  void sendPaymentEmailNotification({
    emailType: 'invoice_created',
    email: clientProfile?.email ?? undefined,
    invoiceNumber,
    projectName: input.title,
    amountDue: String(billing.amount_due_now),
    currency: billing.currency,
    clientId: input.client_id,
  });

  if (invoiceRes.data?.id) {
    void requestBillingPdfGeneration({
      invoiceId: invoiceRes.data.id,
      includeInvoice: true,
      includeReceipt: false,
      sendEmails: true,
    });
  }

  return invoiceRes;
}

export async function submitManualPaymentProof(params: {
  invoiceId: string;
  clientId: string;
  paymentMethod: PaymentProviderId;
  referenceNumber: string;
  notes?: string;
  proofFile?: File | null;
}) {
  ensureConfigured();

  const checkout = await fetchInvoiceForCheckout(params.invoiceId, params.clientId, false);
  if (checkout.error || !checkout.data) throw new Error(checkout.error?.message ?? 'Invoice not found.');

  const { invoice } = checkout.data;
  let proofPath: string | null = null;

  if (params.proofFile) {
    const safeName = params.proofFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    proofPath = `invoices/${params.invoiceId}/${Date.now()}-${safeName}`;
    const upload = await supabase.storage.from(FILE_BUCKET).upload(proofPath, params.proofFile);
    if (upload.error) throw new Error(upload.error.message);
  }

  const amountDue = Number(invoice.amount_due_now ?? invoice.amount);

  await logSupabaseQuery(
    'invoice_payments.manual',
    supabase.from('invoice_payments').insert({
      invoice_id: params.invoiceId,
      client_id: params.clientId,
      amount: amountDue,
      currency: invoice.currency,
      payment_method: params.paymentMethod,
      status: 'manual_review',
      reference_number: params.referenceNumber,
      notes: params.notes ?? null,
      proof_storage_path: proofPath,
      milestone_key: invoice.current_milestone,
    }),
  );

  await logSupabaseQuery(
    'invoices.manual_review',
    supabase
      .from('invoices')
      .update({
        payment_status: 'manual_review',
        payment_method: params.paymentMethod,
        payment_reference: params.referenceNumber,
        payment_notes: params.notes ?? null,
        proof_storage_path: proofPath,
        status: 'pending',
      })
      .eq('id', params.invoiceId),
  );

  void sendPaymentEmailNotification({
    emailType: 'manual_review',
    invoiceNumber: invoice.invoice_number,
    amountDue: String(amountDue),
    currency: invoice.currency,
    projectName: invoice.title,
    referenceNumber: params.referenceNumber,
  });

  void createUserNotification({
    userId: params.clientId,
    title: 'Payment Submitted',
    body: `Your payment proof for ${invoice.invoice_number} is under review.`,
  });

  return { ok: true };
}

export async function completeInvoicePayment(params: {
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentProviderId;
  transactionId?: string;
  milestoneKey?: BillingMilestoneKey;
}) {
  ensureConfigured();

  const { data: invoice, error } = await supabase.from('invoices').select('*').eq('id', params.invoiceId).single();
  if (error || !invoice) throw new Error(error?.message ?? 'Invoice not found.');

  const milestoneKey = (params.milestoneKey ?? invoice.current_milestone ?? 'deposit') as BillingMilestoneKey;
  const now = new Date().toISOString();

  await supabase
    .from('invoice_billing_milestones')
    .update({ status: 'paid', paid_at: now })
    .eq('invoice_id', params.invoiceId)
    .eq('milestone_key', milestoneKey);

  const { data: milestones } = await supabase
    .from('invoice_billing_milestones')
    .select('*')
    .eq('invoice_id', params.invoiceId)
    .order('sort_order', { ascending: true });

  const milestoneList = milestones ?? [];
  const nextPending = milestoneList.find((m) => m.status !== 'paid');
  const projectValue = Number(invoice.project_value ?? invoice.amount);
  const remaining = computeRemainingBalance(projectValue, milestoneList);
  const allPaid = milestoneList.length > 0 && milestoneList.every((m) => m.status === 'paid');

  const nextMilestone = allPaid ? 'completed' : (nextPending?.milestone_key ?? 'completed');
  const amountDueNow = allPaid ? 0 : Number(nextPending?.amount ?? 0);

  await supabase
    .from('invoices')
    .update({
      payment_status: allPaid ? 'paid' : 'pending',
      status: allPaid ? 'paid' : 'pending',
      payment_method: params.paymentMethod,
      transaction_id: params.transactionId ?? invoice.transaction_id,
      paid_at: allPaid ? now : invoice.paid_at,
      current_milestone: nextMilestone,
      amount_due_now: amountDueNow,
      amount: amountDueNow > 0 ? amountDueNow : invoice.amount,
      remaining_balance: remaining,
    })
    .eq('id', params.invoiceId);

  const { data: paymentRow } = await supabase
    .from('invoice_payments')
    .insert({
      invoice_id: params.invoiceId,
      client_id: invoice.client_id,
      amount: params.amount,
      currency: invoice.currency,
      payment_method: params.paymentMethod,
      status: 'paid',
      provider_transaction_id: params.transactionId ?? null,
      milestone_key: milestoneKey,
      submission_id: params.transactionId ?? undefined,
    })
    .select('id')
    .single();

  const clientEmail = invoice.guest_email;
  if (invoice.client_id) {
    const { data: profile } = await supabase.from('profiles').select('email').eq('id', invoice.client_id).single();
    void sendPaymentEmailNotification({
      emailType: allPaid ? 'invoice_paid' : 'payment_confirmation',
      email: profile?.email ?? clientEmail ?? undefined,
      invoiceNumber: invoice.invoice_number,
      amountDue: String(params.amount),
      currency: invoice.currency,
      projectName: invoice.title,
      transactionId: params.transactionId,
    });
    void notifyUser(
      invoice.client_id,
      allPaid ? 'Invoice Paid' : 'Payment Received',
      `${invoice.invoice_number} — ${invoice.currency} ${params.amount.toLocaleString()} recorded.`,
    );
  }

  void sendPaymentEmailNotification({
    emailType: 'admin_payment_notification',
    invoiceNumber: invoice.invoice_number,
    amountDue: String(params.amount),
    currency: invoice.currency,
    projectName: invoice.title,
    transactionId: params.transactionId,
  });

  if (paymentRow?.id) {
    void requestBillingPdfGeneration({
      invoiceId: params.invoiceId,
      paymentId: paymentRow.id,
      includeInvoice: true,
      includeReceipt: true,
      sendEmails: true,
    });
  }

  return {
    allPaid,
    nextMilestone,
    amountDueNow,
    paymentId: paymentRow?.id ?? null,
    invoiceId: params.invoiceId,
  };
}

export async function adminApproveManualPayment(invoiceId: string) {
  const { data: invoice } = await supabase.from('invoices').select('*').eq('id', invoiceId).single();
  if (!invoice) throw new Error('Invoice not found.');

  const amount = Number(invoice.amount_due_now ?? invoice.amount);
  const result = await completeInvoicePayment({
    invoiceId,
    amount,
    paymentMethod: (invoice.payment_method as PaymentProviderId) ?? 'bank_transfer',
    transactionId: invoice.payment_reference ?? invoice.transaction_id ?? undefined,
    milestoneKey: (invoice.current_milestone as BillingMilestoneKey) ?? 'deposit',
  });

  return result;
}
