import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';

/** PayHere server notify — verify hash and log; client return page finalizes status via app. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = process.env.PAYHERE_SECRET;
  const body = req.body as Record<string, string> | undefined;
  if (!secret || !body) return res.status(400).end();

  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    payment_id,
    custom_1,
  } = body;

  const localHash = createHash('md5')
    .update(
      `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${createHash('md5').update(secret).digest('hex').toUpperCase()}`,
    )
    .digest('hex')
    .toUpperCase();

  if (localHash !== md5sig) {
    console.error('[PayHere] Invalid notification signature');
    return res.status(400).end();
  }

  if (status_code === '2') {
    console.log('[PayHere] Payment success', { order_id, payment_id, invoiceId: custom_1 });
  }

  return res.status(200).end();
}
