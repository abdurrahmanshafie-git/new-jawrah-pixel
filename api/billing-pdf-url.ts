import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyUserToken, getSupabaseAdmin } from './_lib/supabaseAdmin.js';
import { assertInvoiceAccess, createSignedPdfUrl } from './_pdf/billingPdfService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed.' });

  try {
    const user = await verifyUserToken(req.headers.authorization);
    if (!user) return res.status(401).json({ ok: false, error: 'Unauthorized.' });

    const body = (req.body ?? {}) as { invoiceId?: string; type?: 'invoice' | 'receipt' };
    if (!body.invoiceId || !body.type) {
      return res.status(400).json({ ok: false, error: 'invoiceId and type are required.' });
    }

    const admin = getSupabaseAdmin();
    const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single();
    const isAdmin = profile?.role === 'admin';

    const { invoice } = await assertInvoiceAccess(body.invoiceId, user.id, isAdmin);

    const path =
      body.type === 'receipt'
        ? (invoice.latest_receipt_pdf_path as string | null)
        : (invoice.invoice_pdf_path as string | null);

    if (!path) {
      return res.status(404).json({ ok: false, error: 'PDF not generated yet.' });
    }

    const signedUrl = await createSignedPdfUrl(path, 3600);
    return res.status(200).json({ ok: true, signedUrl, expiresIn: 3600 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not create PDF URL.';
    return res.status(403).json({ ok: false, error: message });
  }
}
