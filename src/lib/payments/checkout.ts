import { createDepositInvoice, updateInvoice } from '@/lib/supabase/api';
import { notifyInvoiceCreated, notifyPaymentPending } from '@/lib/email/notifications';
import { createUserNotification } from '@/lib/platform/notifications';
import { formatMoney } from './amounts';
import type { PaymentProviderId, PaymentRegion } from './config';
import { calculateDeposit, type DepositPercent } from './amounts';
import { calculateBillingFields } from '@/lib/billing/calculations';
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

function paymentTitle(intent: PaymentModalIntent | undefined, percent: DepositPercent): string {
  if (intent === 'advance_10') return '10% Advance';
  if (intent === 'deposit_50') return '50% Deposit';
  if (percent === 100) return 'Full Payment';
  return `${percent}% Deposit`;
}

export async function runDepositCheckout(params: CheckoutParams): Promise<CheckoutResult> {
  const depositAmount = calculateDeposit(params.totalAmount, params.depositPercent);
  let invoiceId = params.existingInvoiceId ?? '';
  let invoiceNumber = params.existingInvoiceNumber ?? generateInvoiceNumber(params.region);

  if (params.existingInvoiceId) {
    const { error } = await updateInvoice(params.existingInvoiceId, {
      payment_status: 'pending',
      payment_method: params.provider,
      status: 'pending',
    });
    if (error) throw new Error(error.message);
    invoiceId = params.existingInvoiceId;
  } else {
    const invoiceNumberNew = generateInvoiceNumber(params.region);
    const billing = calculateBillingFields(params.totalAmount, params.depositPercent, params.region);
    const { data, error } = await createDepositInvoice({
      client_id: params.clientId ?? null,
      guest_email: params.guestEmail ?? null,
      guest_name: params.guestName ?? null,
      project_id: params.projectId ?? null,
      invoice_number: invoiceNumberNew,
      title: `${params.serviceName} - ${paymentTitle(params.intent, params.depositPercent)}`,
      amount: billing.amount_due_now,
      currency: params.currency,
      status: 'pending',
      payment_status: 'pending',
      payment_method: params.provider,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      project_value: billing.project_value,
      deposit_percentage: billing.deposit_percentage,
      deposit_amount: billing.deposit_amount,
      remaining_balance: billing.remaining_balance,
      amount_due_now: billing.amount_due_now,
      current_milestone: billing.current_milestone,
      region: params.region,
      milestones: billing.milestones,
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
        params.region === 'lk'
          ? 'Sri Lanka bank transfer invoice is ready. Submit receipt or reference number from the secure invoice payment area.'
          : 'Online payment gateway is not connected yet. Please use manual bank transfer or WhatsApp confirmation.',
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
