import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';
import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';

/** 
 * PayHere Webhook Foundation 
 * 
 * This handler processes server-to-server notifications from PayHere.
 * Status 2 = Success.
 * 
 * TODO: Finalize PayHere Merchant Credentials in production environment variables:
 * - PAYHERE_MERCHANT_ID
 * - PAYHERE_SECRET (or PAYHERE_MERCHANT_SECRET)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const secret = process.env.PAYHERE_SECRET || process.env.PAYHERE_MERCHANT_SECRET;
  
  const body = req.body as Record<string, string> | undefined;
  
  // Basic validation of payload existence
  if (!body || typeof body !== 'object') {
    console.error('[PayHere] Missing or invalid notification body');
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    payment_id,
    custom_1, // Used for invoice_id in Jawrah Pixel checkout
  } = body;

  // Log the notification for auditing (safely)
  console.log('[PayHere] Notification received:', {
    merchant_id,
    order_id,
    status_code,
    payment_id,
    invoice_id: custom_1,
    amount: payhere_amount,
    currency: payhere_currency
  });

  // 1. Verify required fields exist
  if (!merchant_id || !order_id || !status_code || !md5sig || !custom_1) {
    console.error('[PayHere] Missing required fields in notification');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 2. Verify Merchant ID matches our configuration
  if (merchantId && merchant_id !== merchantId) {
    console.error('[PayHere] Merchant ID mismatch');
    return res.status(403).json({ error: 'Unauthorized merchant' });
  }

  // 3. Signature Verification (Foundation)
  if (!secret) {
    console.warn('[PayHere] Secret not configured. Signature verification skipped (DEV MODE).');
    // In production, we MUST fail if secret is missing
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({ error: 'Security configuration missing' });
    }
  } else {
    // PayHere Hash Calculation: UpperCase(MD5( merchant_id + order_id + payhere_amount + payhere_currency + status_code + UpperCase(MD5(merchant_secret)) ))
    const hashedSecret = createHash('md5').update(secret).digest('hex').toUpperCase();
    const hashString = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`;
    const localHash = createHash('md5').update(hashString).digest('hex').toUpperCase();

    if (localHash !== md5sig) {
      console.error('[PayHere] Invalid signature hash');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    console.log('[PayHere] Signature verified successfully');
  }

  // 4. Handle Successful Payment
  if (status_code === '2') {
    const invoiceId = custom_1;
    console.log('[PayHere] Payment Success confirmed for Invoice:', invoiceId);

    /**
     * DATABASE UPDATE (Foundation)
     * 
     * DISABLED until final verification with real credentials.
     * This logic will update the invoice and milestones when enabled.
     */
    const ENABLE_AUTO_UPDATE = false; // SET TO TRUE ONLY AFTER CREDENTIALS VERIFIED

    if (ENABLE_AUTO_UPDATE) {
      try {
        const admin = getSupabaseAdmin();
        
        // Update Invoice Status
        const { error: invoiceError } = await admin
          .from('invoices')
          .update({
            payment_status: 'paid',
            status: 'paid',
            transaction_id: payment_id || order_id,
            payment_method: 'payhere',
            paid_at: new Date().toISOString()
          })
          .eq('id', invoiceId);

        if (invoiceError) throw invoiceError;

        // Note: Further logic to update milestones and send emails should be handled here
        // or via database triggers on the invoices table.
        
        console.log('[PayHere] Database updated for Invoice:', invoiceId);
      } catch (dbError) {
        console.error('[PayHere] Failed to update database:', dbError);
        // We still return 200 to PayHere to acknowledge receipt, 
        // but we've logged the error for manual intervention.
      }
    } else {
      console.log('[PayHere] Auto-update is currently disabled. Manual verification required.');
    }
  } else {
    console.log('[PayHere] Notification received for non-success status:', status_code);
  }

  // Always return 200 to acknowledge receipt to PayHere
  return res.status(200).send('OK');
}
