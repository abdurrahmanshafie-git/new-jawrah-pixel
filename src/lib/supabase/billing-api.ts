import { supabase, isSupabaseConfigured } from './client';
import {
  calculateBillingFields,
  computeRemainingBalance,
  type BillingMilestoneKey,
} from '@/lib/billing/calculations';
import { sendPaymentEmailNotification } from '@/lib/email/paymentEmails';
import { requestBillingPdfGeneration } from '@/lib/pdf/billingPdfClient';
import { createUserNotification } from '@/lib/platform/notifications';
import { projectProgressFromStatus } from '@/lib/platform/ecosystem';
import { notifyUser } from './ecosystem-api';
import type { RegionCode } from '@/types';
import {
  RECEIPT_UPLOAD_SETTINGS,
  type PaymentProviderId,
} from '@/lib/payments/config';
import { logSupabaseQuery } from './query-debug';
import { generateInvoiceNumber } from '@/lib/payments/checkout';

const FILE_BUCKET = RECEIPT_UPLOAD_SETTINGS.bucket;
const PAYMENT_ADMIN_ROLES = new Set(['admin', 'superadmin']);

function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }
}

function validateReceiptFile(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const mimeAllowed = RECEIPT_UPLOAD_SETTINGS.allowedMimeTypes.includes(file.type);
  const extAllowed = RECEIPT_UPLOAD_SETTINGS.allowedExtensions.includes(ext);

  if (file.size > RECEIPT_UPLOAD_SETTINGS.maxBytes) {
    throw new Error('Receipt file must be 10MB or smaller.');
  }

  if (!mimeAllowed || !extAllowed) {
    throw new Error('Receipt must be a JPG, PNG, or PDF file.');
  }
}

async function assertPaymentAdmin(actorId?: string | null) {
  ensureConfigured();
  if (!actorId) throw new Error('Admin access is required for payment verification.');

  const { data, error } = await supabase.from('profiles').select('role').eq('id', actorId).single();
  if (error || !data || !PAYMENT_ADMIN_ROLES.has(String(data.role))) {
    throw new Error('Admin access is required for payment verification.');
  }
}

async function logPaymentVerificationAction(params: {
  actorId: string;
  action: string;
  invoiceId: string;
  paymentId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  await logSupabaseQuery(
    `audit_events.${params.action}`,
    supabase.from('audit_events').insert({
      actor_id: params.actorId,
      action: params.action,
      entity_table: 'invoices',
      entity_id: params.invoiceId,
      metadata: {
        payment_id: params.paymentId ?? null,
        region: 'lk',
        ...(params.metadata ?? {}),
      },
    }),
  );
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
  captcha_token?: string | null;
}) {
  ensureConfigured();

  const checkout = await fetchInvoiceForCheckout(params.invoiceId, params.clientId, false);
  if (checkout.error || !checkout.data) throw new Error(checkout.error?.message ?? 'Invoice not found.');

  const { invoice } = checkout.data;
  let proofPath: string | null = null;
  const referenceNumber = params.referenceNumber.trim();

  if (invoice.region === 'lk' && params.paymentMethod !== 'bank_transfer') {
    throw new Error('Sri Lanka invoices currently support bank transfer only.');
  }

  if (!referenceNumber && !params.proofFile) {
    throw new Error('Upload a receipt or enter the bank transfer reference number.');
  }

  const existingReview = await logSupabaseQuery(
    'invoice_payments.manual_existing_review',
    supabase
      .from('invoice_payments')
      .select('id')
      .eq('invoice_id', params.invoiceId)
      .eq('client_id', params.clientId)
      .eq('status', 'manual_review')
      .maybeSingle(),
  );

  if (existingReview.data?.id) {
    throw new Error('Your latest payment confirmation is already awaiting verification.');
  }

  if (params.proofFile) {
    validateReceiptFile(params.proofFile);
    const safeName = params.proofFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    proofPath = `payment-receipts/${params.clientId}/${params.invoiceId}/${Date.now()}-${safeName}`;
    const upload = await supabase.storage.from(FILE_BUCKET).upload(proofPath, params.proofFile, {
      upsert: false,
      contentType: params.proofFile.type || undefined,
    });
    if (upload.error) throw new Error(upload.error.message);
  }

  const amountDue = Number(invoice.amount_due_now ?? invoice.amount);

  const paymentRes = await logSupabaseQuery(
    'invoice_payments.manual',
    supabase
      .from('invoice_payments')
      .insert({
        invoice_id: params.invoiceId,
        client_id: params.clientId,
        amount: amountDue,
        currency: invoice.currency,
        payment_method: params.paymentMethod,
        status: 'manual_review',
        reference_number: referenceNumber || null,
        notes: params.notes ?? null,
        proof_storage_path: proofPath,
        milestone_key: invoice.current_milestone,
      })
      .select('id')
      .single(),
  );

  if (paymentRes.error) throw new Error(paymentRes.error.message);

  await logSupabaseQuery(
    'invoices.manual_review',
    supabase
      .from('invoices')
      .update({
        payment_status: 'manual_review',
        payment_method: params.paymentMethod,
        payment_reference: referenceNumber || null,
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
    referenceNumber: referenceNumber || 'Receipt uploaded',
    captcha_token: params.captcha_token ?? undefined,
  });

  void createUserNotification({
    userId: params.clientId,
    title: 'Payment Submitted',
    body: `Your payment proof for ${invoice.invoice_number} is under review.`,
  });

  return { ok: true, paymentId: paymentRes.data?.id ?? null };
}

export async function fetchPaymentVerificationQueue() {
  ensureConfigured();

  return logSupabaseQuery(
    'invoice_payments.verification_queue',
    supabase
      .from('invoice_payments')
      .select(
        `
        id,
        invoice_id,
        client_id,
        amount,
        currency,
        payment_method,
        status,
        reference_number,
        proof_storage_path,
        notes,
        milestone_key,
        created_at,
        updated_at,
        invoice:invoices!inner(
          id,
          invoice_number,
          title,
          amount,
          amount_due_now,
          currency,
          region,
          payment_status,
          current_milestone,
          project_id,
          client_id,
          proof_storage_path,
          client:profiles(full_name, email),
          project:projects(title, status)
        )
        `,
      )
      .eq('status', 'manual_review')
      .eq('invoice.region', 'lk')
      .order('created_at', { ascending: true }),
  );
}

export async function getPaymentProofSignedUrl(proofStoragePath: string, expiresIn = 600) {
  ensureConfigured();
  return logSupabaseQuery(
    'storage.payment_proof.signed_url',
    supabase.storage.from(FILE_BUCKET).createSignedUrl(proofStoragePath, expiresIn),
  );
}

export async function completeInvoicePayment(params: {
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentProviderId;
  transactionId?: string;
  milestoneKey?: BillingMilestoneKey;
  adminApproved?: boolean;
  existingPaymentId?: string | null;
}) {
  ensureConfigured();

  const { data: invoice, error } = await supabase.from('invoices').select('*').eq('id', params.invoiceId).single();
  if (error || !invoice) throw new Error(error?.message ?? 'Invoice not found.');

  if (invoice.region === 'lk' && invoice.payment_method === 'bank_transfer' && !params.adminApproved) {
    throw new Error('Sri Lanka bank transfer payments require admin verification.');
  }

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

  if (invoice.project_id && milestoneKey === 'deposit') {
    await supabase
      .from('projects')
      .update({
        status: 'development',
        progress: projectProgressFromStatus('development'),
      })
      .eq('id', invoice.project_id)
      .in('status', ['lead', 'discovery', 'planning']);
  }

  const paymentWrite = params.existingPaymentId
    ? await supabase
        .from('invoice_payments')
        .update({
          amount: params.amount,
          currency: invoice.currency,
          payment_method: params.paymentMethod,
          status: 'paid',
          provider_transaction_id: params.transactionId ?? null,
          milestone_key: milestoneKey,
          submission_id: params.transactionId ?? undefined,
        })
        .eq('id', params.existingPaymentId)
        .select('id')
        .single()
    : await supabase
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

  if (paymentWrite.error) throw new Error(paymentWrite.error.message);
  const paymentRow = paymentWrite.data;

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

async function findManualPayment(invoiceId: string, paymentId?: string | null) {
  if (paymentId) {
    const { data, error } = await supabase.from('invoice_payments').select('*').eq('id', paymentId).single();
    if (error || !data) throw new Error(error?.message ?? 'Payment submission not found.');
    return data;
  }

  const { data, error } = await supabase
    .from('invoice_payments')
    .select('*')
    .eq('invoice_id', invoiceId)
    .eq('status', 'manual_review')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) throw new Error(error?.message ?? 'No payment submission is awaiting verification.');
  return data;
}

export async function adminApproveManualPayment(
  invoiceId: string,
  paymentId?: string | null,
  actorId?: string | null,
) {
  await assertPaymentAdmin(actorId);

  const { data: invoice } = await supabase.from('invoices').select('*').eq('id', invoiceId).single();
  if (!invoice) throw new Error('Invoice not found.');
  if (invoice.region !== 'lk') throw new Error('This verification queue is only for Sri Lanka invoices.');

  const payment = await findManualPayment(invoiceId, paymentId);

  const amount = Number(invoice.amount_due_now ?? invoice.amount);
  const result = await completeInvoicePayment({
    invoiceId,
    amount,
    paymentMethod: 'bank_transfer',
    transactionId: payment.reference_number ?? invoice.payment_reference ?? invoice.transaction_id ?? undefined,
    milestoneKey: (invoice.current_milestone as BillingMilestoneKey) ?? 'deposit',
    adminApproved: true,
    existingPaymentId: payment.id,
  });

  if (invoice.client_id) {
    void createUserNotification({
      userId: invoice.client_id,
      title: 'Payment Confirmed',
      body: 'Your Sri Lanka bank transfer has been verified. Your project has been moved into production.',
    });
  }

  await logPaymentVerificationAction({
    actorId: actorId!,
    action: 'payment_verification_approved',
    invoiceId,
    paymentId: payment.id,
    metadata: {
      invoice_number: invoice.invoice_number,
      amount,
      reference_number: payment.reference_number ?? null,
    },
  });

  return result;
}

export async function adminRejectManualPayment(params: {
  invoiceId: string;
  paymentId?: string | null;
  actorId?: string | null;
  reason?: string;
}) {
  await assertPaymentAdmin(params.actorId);

  const payment = await findManualPayment(params.invoiceId, params.paymentId);
  const { data: invoice } = await supabase.from('invoices').select('*').eq('id', params.invoiceId).single();
  if (!invoice) throw new Error('Invoice not found.');
  if (invoice.region !== 'lk') throw new Error('This verification queue is only for Sri Lanka invoices.');

  const reason = params.reason?.trim() || 'Payment proof could not be verified.';

  await logSupabaseQuery(
    'invoice_payments.reject',
    supabase
      .from('invoice_payments')
      .update({
        status: 'failed',
        notes: [payment.notes, `Admin rejected: ${reason}`].filter(Boolean).join('\n'),
      })
      .eq('id', payment.id),
  );

  await logSupabaseQuery(
    'invoices.reject_manual_payment',
    supabase
      .from('invoices')
      .update({
        payment_status: 'failed',
        status: 'pending',
        payment_notes: reason,
      })
      .eq('id', params.invoiceId),
  );

  if (invoice.client_id) {
    void createUserNotification({
      userId: invoice.client_id,
      title: 'Payment Verification Rejected',
      body: reason,
    });
  }

  await logPaymentVerificationAction({
    actorId: params.actorId!,
    action: 'payment_verification_rejected',
    invoiceId: params.invoiceId,
    paymentId: payment.id,
    metadata: { reason, invoice_number: invoice.invoice_number },
  });

  return { ok: true };
}

export async function adminRequestUpdatedReceipt(params: {
  invoiceId: string;
  paymentId?: string | null;
  actorId?: string | null;
  message?: string;
}) {
  await assertPaymentAdmin(params.actorId);

  const payment = await findManualPayment(params.invoiceId, params.paymentId);
  const { data: invoice } = await supabase.from('invoices').select('*').eq('id', params.invoiceId).single();
  if (!invoice) throw new Error('Invoice not found.');
  if (invoice.region !== 'lk') throw new Error('This verification queue is only for Sri Lanka invoices.');

  const message = params.message?.trim() || 'Please upload a clearer payment receipt or submit the correct transaction reference number.';

  await logSupabaseQuery(
    'invoice_payments.request_updated_receipt',
    supabase
      .from('invoice_payments')
      .update({
        status: 'failed',
        notes: [payment.notes, `Updated receipt requested: ${message}`].filter(Boolean).join('\n'),
      })
      .eq('id', payment.id),
  );

  await logSupabaseQuery(
    'invoices.request_updated_receipt',
    supabase
      .from('invoices')
      .update({
        payment_status: 'pending',
        status: 'pending',
        payment_notes: message,
      })
      .eq('id', params.invoiceId),
  );

  if (invoice.client_id) {
    void createUserNotification({
      userId: invoice.client_id,
      title: 'Updated Receipt Requested',
      body: message,
    });
  }

  await logPaymentVerificationAction({
    actorId: params.actorId!,
    action: 'payment_verification_update_requested',
    invoiceId: params.invoiceId,
    paymentId: payment.id,
    metadata: { message, invoice_number: invoice.invoice_number },
  });

  return { ok: true };
}
