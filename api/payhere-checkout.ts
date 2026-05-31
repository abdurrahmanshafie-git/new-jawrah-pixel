import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';

interface PayhereCheckoutBody {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const secret = process.env.PAYHERE_SECRET;
  const siteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://jawrahpixel.com';

  if (!merchantId || !secret) {
    return res.status(503).json({
      ok: false,
      configured: false,
      message: 'PayHere is not configured on the server.',
    });
  }

  const body = (req.body ?? {}) as Partial<PayhereCheckoutBody>;
  if (!body.invoiceId || !body.invoiceNumber || !body.amount) {
    return res.status(400).json({ ok: false, message: 'Missing checkout fields.' });
  }

  const amountFormatted = Number(body.amount).toFixed(2);
  const currency = body.currency || 'LKR';
  const orderId = body.invoiceNumber;
  const hash = createHash('md5')
    .update(`${merchantId}${orderId}${amountFormatted}${currency}${createHash('md5').update(secret).digest('hex').toUpperCase()}`)
    .digest('hex')
    .toUpperCase();

  const returnUrl = `${siteUrl}/dashboard/payment-success?invoiceId=${encodeURIComponent(body.invoiceId)}`;
  const cancelUrl = `${siteUrl}/dashboard/checkout/${encodeURIComponent(body.invoiceId)}?cancelled=1`;
  const notifyUrl = `${siteUrl}/api/payhere-notify`;

  return res.status(200).json({
    ok: true,
    configured: true,
    checkoutUrl: 'https://www.payhere.lk/pay/checkout',
    fields: {
      merchant_id: merchantId,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      order_id: orderId,
      items: body.invoiceNumber,
      amount: amountFormatted,
      currency,
      hash,
      first_name: body.customerName?.split(' ')[0] || 'Client',
      last_name: body.customerName?.split(' ').slice(1).join(' ') || 'Jawrah',
      email: body.customerEmail || 'client@jawrahpixel.com',
      phone: '',
      address: '',
      city: '',
      country: 'Sri Lanka',
      custom_1: body.invoiceId,
    },
  });
}
