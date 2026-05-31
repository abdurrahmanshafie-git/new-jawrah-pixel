import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyUserToken } from './_lib/supabaseAdmin.js';
import { generateBillingPdfs } from './_pdf/billingPdfService.js';
import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed.' });

  try {
    const user = await verifyUserToken(req.headers.authorization);
    if (!user) return res.status(401).json({ ok: false, error: 'Unauthorized.' });

    const body = (req.body ?? {}) as {
      invoiceId?: string;
      paymentId?: string;
      includeInvoice?: boolean;
      includeReceipt?: boolean;
      sendEmails?: boolean;
    };

    if (!body.invoiceId) return res.status(400).json({ ok: false, error: 'invoiceId is required.' });

    const admin = getSupabaseAdmin();
    const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single();
    const isAdmin = profile?.role === 'admin';

    const { data: invoice } = await admin.from('invoices').select('client_id').eq('id', body.invoiceId).single();
    if (!invoice) return res.status(404).json({ ok: false, error: 'Invoice not found.' });
    if (!isAdmin && invoice.client_id && invoice.client_id !== user.id) {
      return res.status(403).json({ ok: false, error: 'Access denied.' });
    }

    const result = await generateBillingPdfs({
      invoiceId: body.invoiceId,
      paymentId: body.paymentId,
      includeInvoice: body.includeInvoice ?? true,
      includeReceipt: body.includeReceipt ?? false,
      sendEmails: body.sendEmails ?? true,
    });

    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'PDF generation failed.';
    console.error('[generate-billing-pdf]', message);
    return res.status(500).json({ ok: false, error: message });
  }
}
