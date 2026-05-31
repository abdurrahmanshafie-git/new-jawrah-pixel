import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendPaymentEmails, type PaymentEmailPayload } from './_email/paymentEmails.js';

const ALLOWED = new Set([
  'payment_confirmation',
  'admin_payment_notification',
  'manual_review',
  'invoice_paid',
  'invoice_created',
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const body = (req.body ?? {}) as Partial<PaymentEmailPayload>;
  if (!body.emailType || !ALLOWED.has(body.emailType)) {
    return res.status(400).json({ ok: false, error: 'Invalid email type.' });
  }
  const result = await sendPaymentEmails(body as PaymentEmailPayload);
  return res.status(result.ok ? 200 : 500).json(result);
}
