import { createDepositInvoice, updateInvoice } from '@/lib/supabase/api';
import { notifyInvoiceCreated, notifyPaymentPending } from '@/lib/email/notifications';
import { createUserNotification } from '@/lib/platform/notifications';
import { formatMoney } from './amounts';
import type { PaymentProviderId, PaymentRegion } from './config';
import { calculateDeposit, type DepositPercent } from './amounts';
import { initiatePayment, isProviderConfigured, getAvailablePaymentMethods } from './index';

export type PaymentModalIntent = 'start' | 'advance_10' | 'deposit_50' | 'invoice' | 'booking_advance';

export interface CheckoutParams {
  serviceName: string;
  totalAmount: number;
  depositPercent: DepositPercent;
  currency: string;
  region: PaymentRegion;
  provider: PaymentProviderId;
  intent?: PaymentModalIntent;
  clientId?: string | null;
  guestEmail?: string | null;
  guestName?: string | null;
  projectId?: string | null;
  bookingId?: string | null;
  inquiryId?: string | null;
  existingInvoiceId?: string;
  existingInvoiceNumber?: string;
}

export interface CheckoutResult {
  invoiceId: string;
  invoiceNumber: string;
  depositAmount: number;
  paymentConfigured: boolean;
  redirectUrl?: string;
  message: string;
  ok: boolean;
}

export function generateInvoiceNumber(region: PaymentRegion): string {
  const prefix = region === 'pk' ? 'JP-PK' : region === 'lk' ? 'JP-LK' : 'JP-INT';
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

export async function runDepositCheckout(params: CheckoutParams): Promise<CheckoutResult> {
  const depositAmount = calculateDeposit(params.totalAmount, params.depositPercent);
  let invoiceId = params.existingInvoiceId ?? '';
  let invoiceNumber = params.existingInvoiceNumber ?? generateInvoiceNumber(params.region);

  if (params.existingInvoiceId) {
    const { error } = await updateInvoice(params.existingInvoiceId, {
      payment_status: 'pending',
      payment_method: params.provider,
      status: 'sent',
    });
    if (error) throw new Error(error.message);
    invoiceId = params.existingInvoiceId;
  } else {
    const invoiceNumberNew = generateInvoiceNumber(params.region);
    const { data, error } = await createDepositInvoice({
      client_id: params.clientId ?? null,
      guest_email: params.guestEmail ?? null,
      guest_name: params.guestName ?? null,
      project_id: params.projectId ?? null,
      invoice_number: invoiceNumberNew,
      title: `${params.serviceName} — ${params.depositPercent}% Deposit`,
      amount: depositAmount,
      currency: params.currency,
      status: 'sent',
      payment_status: 'pending',
      payment_method: params.provider,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    if (error || !data) {
      throw new Error(error?.message ?? 'Could not create invoice record.');
    }
    invoiceId = data.id;
    invoiceNumber = data.invoice_number;
  }

  const providers = getAvailablePaymentMethods(params.region);
  const providerConfig = providers.find((p) => p.id === params.provider);
  const paymentConfigured = providerConfig ? isProviderConfigured(providerConfig) : false;

  const paymentResult = await initiatePayment({
    invoiceId,
    amount: depositAmount,
    currency: params.currency,
    provider: params.provider,
    region: params.region,
    clientEmail: params.guestEmail,
    invoiceNumber,
  });

  const notifyEmail = params.guestEmail ?? undefined;
  if (notifyEmail) {
    void notifyInvoiceCreated({
      email: notifyEmail,
      invoiceNumber,
      amount: formatMoney(depositAmount, params.currency),
      currency: params.currency,
      serviceName: params.serviceName,
    });
    void notifyPaymentPending({
      email: notifyEmail,
      invoiceNumber,
      amount: formatMoney(depositAmount, params.currency),
      currency: params.currency,
    });
  }

  if (params.clientId) {
    void createUserNotification({
      userId: params.clientId,
      title: 'Invoice created',
      body: `${invoiceNumber} — ${formatMoney(depositAmount, params.currency)} pending payment.`,
    });
  }

  const isManual =
    params.provider === 'bank_transfer' ||
    !paymentConfigured ||
    !paymentResult.configured ||
    !paymentResult.redirectUrl;

  if (isManual) {
    return {
      invoiceId,
      invoiceNumber,
      depositAmount,
      paymentConfigured: false,
      ok: true,
      message:
        'Online payment gateway is not connected yet. Please use manual bank transfer or WhatsApp confirmation.',
    };
  }

  return {
    invoiceId,
    invoiceNumber,
    depositAmount,
    paymentConfigured: true,
    redirectUrl: paymentResult.redirectUrl,
    ok: paymentResult.ok,
    message: paymentResult.message,
  };
}
