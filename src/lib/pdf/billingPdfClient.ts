import { supabase } from '@/lib/supabase/client';

async function authHeader(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function requestBillingPdfGeneration(params: {
  invoiceId: string;
  paymentId?: string;
  includeInvoice?: boolean;
  includeReceipt?: boolean;
  sendEmails?: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/generate-billing-pdf', {
      method: 'POST',
      headers: await authHeader(),
      body: JSON.stringify({
        invoiceId: params.invoiceId,
        paymentId: params.paymentId,
        includeInvoice: params.includeInvoice ?? true,
        includeReceipt: params.includeReceipt ?? true,
        sendEmails: params.sendEmails ?? true,
      }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || 'PDF generation failed.' };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'PDF generation failed.' };
  }
}

export async function getBillingPdfSignedUrl(
  invoiceId: string,
  type: 'invoice' | 'receipt',
): Promise<{ ok: boolean; signedUrl?: string; error?: string }> {
  try {
    const res = await fetch('/api/billing-pdf-url', {
      method: 'POST',
      headers: await authHeader(),
      body: JSON.stringify({ invoiceId, type }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };
    return { ok: true, signedUrl: data.signedUrl };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Could not get PDF link.' };
  }
}

async function ensureBillingPdf(invoiceId: string, type: 'invoice' | 'receipt') {
  let result = await getBillingPdfSignedUrl(invoiceId, type);
  if (result.ok && result.signedUrl) return result;

  const needsGen =
    !result.ok &&
    (result.error?.toLowerCase().includes('not generated') ||
      result.error?.toLowerCase().includes('not found'));
  if (!needsGen) return result;

  const gen = await requestBillingPdfGeneration({
    invoiceId,
    includeInvoice: type === 'invoice',
    includeReceipt: type === 'receipt',
    sendEmails: false,
  });
  if (!gen.ok) return { ok: false as const, error: gen.error };

  return getBillingPdfSignedUrl(invoiceId, type);
}

export async function viewBillingPdf(invoiceId: string, type: 'invoice' | 'receipt') {
  const result = await ensureBillingPdf(invoiceId, type);
  if (!result.ok || !result.signedUrl) throw new Error(result.error || 'PDF unavailable.');
  window.open(result.signedUrl, '_blank', 'noopener,noreferrer');
}

export async function downloadBillingPdf(invoiceId: string, type: 'invoice' | 'receipt') {
  const result = await ensureBillingPdf(invoiceId, type);
  if (!result.ok || !result.signedUrl) throw new Error(result.error || 'PDF unavailable.');

  const link = document.createElement('a');
  link.href = result.signedUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.download = `${type}-${invoiceId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
