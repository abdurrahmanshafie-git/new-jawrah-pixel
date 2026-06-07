import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { buildInvoicePdf, buildReceiptPdf } from './buildBrandedPdf.js';
import type { BillingPdfData } from './types.js';
import { sendPaymentEmailsWithPdf } from '../_email/paymentEmails.js';

const BUCKET = 'project-files';

function receiptNumber(): string {
  return `JP-RCP-${Date.now().toString(36).toUpperCase()}`;
}

function formatDate(iso?: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export async function loadBillingPdfData(
  invoiceId: string,
  paymentId?: string,
): Promise<{ data: BillingPdfData; invoice: Record<string, unknown>; paymentId?: string; clientId: string | null }> {
  const admin = getSupabaseAdmin();

  const { data: invoice, error } = await admin
    .from('invoices')
    .select('*, client:profiles(full_name, email, region)')
    .eq('id', invoiceId)
    .single();

  if (error || !invoice) throw new Error('Invoice not found.');

  const { data: milestones } = await admin
    .from('invoice_billing_milestones')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('sort_order', { ascending: true });

  let payment: Record<string, unknown> | null = null;
  if (paymentId) {
    const { data } = await admin.from('invoice_payments').select('*').eq('id', paymentId).maybeSingle();
    payment = data;
  } else {
    const { data } = await admin
      .from('invoice_payments')
      .select('*')
      .eq('invoice_id', invoiceId)
      .eq('status', 'paid')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    payment = data;
  }

  const client = (invoice as { client?: { full_name?: string; email?: string; region?: string } }).client;
  const lockedRegion = client?.region || invoice.region || 'lk';
  const lockedCurrency = lockedRegion === 'int' ? 'USD' : lockedRegion === 'pk' ? 'PKR' : 'LKR';
  const projectValue = Number(invoice.project_value ?? invoice.amount ?? 0);
  const depositPct = Number(invoice.deposit_percentage ?? 10);
  const depositAmount = Number(invoice.deposit_amount ?? projectValue * (depositPct / 100));

  const pdfData: BillingPdfData = {
    documentType: 'invoice',
    invoiceNumber: String(invoice.invoice_number),
    receiptNumber: payment?.receipt_number ? String(payment.receipt_number) : undefined,
    submissionId: payment?.submission_id ? String(payment.submission_id) : payment?.id ? String(payment.id) : undefined,
    clientName: String(invoice.guest_name || client?.full_name || 'Client'),
    clientEmail: String(invoice.guest_email || client?.email || ''),
    region: String(lockedRegion),
    projectName: String(invoice.title),
    projectValue,
    depositPercentage: depositPct,
    depositAmount,
    amountPaid: payment ? Number(payment.amount) : undefined,
    amountDueNow: Number(invoice.amount_due_now ?? invoice.amount ?? 0),
    remainingBalance: Number(invoice.remaining_balance ?? 0),
    paymentMethod: String(payment?.payment_method || invoice.payment_method || '—'),
    paymentStatus: String(invoice.payment_status || invoice.status || 'pending'),
    paymentDate: formatDate(payment?.created_at ?? invoice.paid_at ?? invoice.updated_at),
    currency: lockedCurrency,
    currentMilestone: String(invoice.current_milestone || 'deposit'),
    milestones: (milestones ?? []).map((m) => ({
      label: String(m.label),
      percentage: Number(m.percentage),
      amount: Number(m.amount),
      status: String(m.status),
    })),
  };

  return {
    data: pdfData,
    invoice: invoice as Record<string, unknown>,
    paymentId: payment?.id ? String(payment.id) : undefined,
    clientId: invoice.client_id ? String(invoice.client_id) : null,
  };
}

function storagePath(clientId: string | null, invoiceId: string, filename: string): string {
  const owner = clientId || 'guest';
  return `billing/${owner}/${invoiceId}/${filename}`;
}

export async function generateAndStoreInvoicePdf(invoiceId: string): Promise<{ path: string }> {
  const admin = getSupabaseAdmin();
  const { data, clientId } = await loadBillingPdfData(invoiceId);
  const bytes = await buildInvoicePdf({ ...data, documentType: 'invoice' });
  const path = storagePath(clientId, invoiceId, `invoice-${data.invoiceNumber.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`);

  const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, bytes, {
    contentType: 'application/pdf',
    upsert: true,
  });
  if (uploadError) throw new Error(uploadError.message);

  await admin.from('invoices').update({ invoice_pdf_path: path }).eq('id', invoiceId);
  return { path };
}

export async function generateAndStoreReceiptPdf(
  invoiceId: string,
  paymentId?: string,
): Promise<{ path: string; receiptNumber: string; paymentId: string }> {
  const admin = getSupabaseAdmin();
  const { data, clientId, paymentId: resolvedPaymentId } = await loadBillingPdfData(invoiceId, paymentId);

  let payId = resolvedPaymentId;
  if (!payId) {
    const { data: latest } = await admin
      .from('invoice_payments')
      .select('id')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    payId = latest?.id;
  }
  if (!payId) throw new Error('No payment record found for receipt generation.');

  const rcpNumber = data.receiptNumber || receiptNumber();
  const submissionId = data.submissionId || payId;

  await admin
    .from('invoice_payments')
    .update({
      receipt_number: rcpNumber,
      submission_id: submissionId,
    })
    .eq('id', payId);

  const receiptData: BillingPdfData = {
    ...data,
    documentType: 'receipt',
    receiptNumber: rcpNumber,
    submissionId,
    amountPaid: data.amountPaid ?? data.amountDueNow,
    paymentStatus: 'paid',
  };

  const bytes = await buildReceiptPdf(receiptData);
  const path = storagePath(clientId, invoiceId, `receipt-${rcpNumber}.pdf`);

  const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, bytes, {
    contentType: 'application/pdf',
    upsert: true,
  });
  if (uploadError) throw new Error(uploadError.message);

  await admin.from('invoice_payments').update({ receipt_pdf_path: path }).eq('id', payId);
  await admin.from('invoices').update({ latest_receipt_pdf_path: path }).eq('id', invoiceId);

  return { path, receiptNumber: rcpNumber, paymentId: payId };
}

export async function generateBillingPdfs(params: {
  invoiceId: string;
  paymentId?: string;
  includeInvoice?: boolean;
  includeReceipt?: boolean;
  sendEmails?: boolean;
}) {
  const results: { invoicePath?: string; receiptPath?: string; receiptNumber?: string } = {};

  if (params.includeInvoice !== false) {
    const inv = await generateAndStoreInvoicePdf(params.invoiceId);
    results.invoicePath = inv.path;
  }

  if (params.includeReceipt) {
    const rcp = await generateAndStoreReceiptPdf(params.invoiceId, params.paymentId);
    results.receiptPath = rcp.path;
    results.receiptNumber = rcp.receiptNumber;
  }

  if (params.sendEmails) {
    const { data } = await loadBillingPdfData(params.invoiceId, params.paymentId);
    const admin = getSupabaseAdmin();
    let invoiceBytes: Uint8Array | undefined;
    let receiptBytes: Uint8Array | undefined;

    if (results.invoicePath) {
      const { data: file } = await admin.storage.from(BUCKET).download(results.invoicePath);
      if (file) invoiceBytes = new Uint8Array(await file.arrayBuffer());
    }
    if (results.receiptPath) {
      const { data: file } = await admin.storage.from(BUCKET).download(results.receiptPath);
      if (file) receiptBytes = new Uint8Array(await file.arrayBuffer());
    }

    const { data: signedInvoice } = results.invoicePath
      ? await admin.storage.from(BUCKET).createSignedUrl(results.invoicePath, 60 * 60 * 24)
      : { data: null };
    const { data: signedReceipt } = results.receiptPath
      ? await admin.storage.from(BUCKET).createSignedUrl(results.receiptPath, 60 * 60 * 24)
      : { data: null };

    await sendPaymentEmailsWithPdf({
      email: data.clientEmail,
      invoiceNumber: data.invoiceNumber,
      projectName: data.projectName,
      amountDue: String(data.amountPaid ?? data.amountDueNow),
      currency: data.currency,
      invoicePdfUrl: signedInvoice?.signedUrl,
      receiptPdfUrl: signedReceipt?.signedUrl,
      invoicePdfBytes: invoiceBytes,
      receiptPdfBytes: receiptBytes,
      isReceipt: Boolean(params.includeReceipt),
    });
  }

  return results;
}

export async function createSignedPdfUrl(
  storagePath: string,
  expiresIn = 3600,
): Promise<string> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(storagePath, expiresIn);
  if (error || !data?.signedUrl) throw new Error(error?.message ?? 'Could not create signed URL.');
  return data.signedUrl;
}

export async function assertInvoiceAccess(
  invoiceId: string,
  userId: string,
  isAdmin: boolean,
): Promise<{ invoice: Record<string, unknown> }> {
  const admin = getSupabaseAdmin();
  const { data: invoice, error } = await admin.from('invoices').select('*').eq('id', invoiceId).single();
  if (error || !invoice) throw new Error('Invoice not found.');
  if (!isAdmin && invoice.client_id && invoice.client_id !== userId) {
    throw new Error('Access denied.');
  }
  return { invoice: invoice as Record<string, unknown> };
}
