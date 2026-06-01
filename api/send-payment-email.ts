import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendPaymentEmails, type PaymentEmailPayload } from './_email/paymentEmails.js';
import { enforceSecurity, getClientIp } from './_lib/security.js';

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

  // Enforce security for manual payment proof submission
  if (body.emailType === 'manual_review') {
    const ip = getClientIp(req.headers);
    const isSecure = await enforceSecurity({
      req,
      res,
      captchaToken: body.captcha_token,
      rateLimit: {
        key: `payment_proof:${ip}`,
        limit: 5,
        windowSeconds: 3600, // 1 hour
      },
    });
    if (!isSecure) return;
  }

  const result = await sendPaymentEmails(body as PaymentEmailPayload);
  return res.status(result.ok ? 200 : 500).json(result);
}
