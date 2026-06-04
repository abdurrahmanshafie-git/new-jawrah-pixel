import { supabase } from '@/lib/supabase/client';

export type PaymentEmailType =
  | 'payment_confirmation'
  | 'admin_payment_notification'
  | 'manual_review'
  | 'invoice_paid'
  | 'invoice_created'
  | 'payment_proof_received_client'
  | 'payment_proof_received_admin'
  | 'payment_confirmed_client'
  | 'payment_confirmed_admin'
  | 'payment_rejected_client'
  | 'payment_update_requested_client';

export interface PaymentEmailPayload {
  emailType: PaymentEmailType;
  email?: string;
  invoiceNumber?: string;
  projectName?: string;
  amountDue?: string;
  currency?: string;
  referenceNumber?: string;
  transactionId?: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  notes?: string;
  submittedAt?: string;
  confirmedAt?: string;
  adminNote?: string;
  receiptSignedUrl?: string;
  adminReviewUrl?: string;
  captcha_token?: string;
}

export async function sendPaymentEmailNotification(payload: PaymentEmailPayload): Promise<{ ok: boolean }> {
  let email = payload.email;
  if (!email && payload.clientId) {
    const { data } = await supabase.from('profiles').select('email').eq('id', payload.clientId).single();
    email = data?.email ?? undefined;
  }

  try {
    const res = await fetch('/api/send-payment-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, email }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
