import { appEnv } from '@/lib/env';
import {
  PAYMENT_PROVIDERS_BY_REGION,
  type PaymentProviderConfig,
  type PaymentProviderId,
  type PaymentRegion,
  currencyForRegion,
  resolvePaymentRegion,
} from './config';

export * from './config';

export interface PaymentInitRequest {
  invoiceId: string;
  amount: number;
  currency: string;
  provider: PaymentProviderId;
  region: PaymentRegion;
  clientEmail?: string | null;
  invoiceNumber?: string;
}

export interface PaymentInitResult {
  ok: boolean;
  configured: boolean;
  provider: PaymentProviderId;
  redirectUrl?: string;
  message: string;
  transactionReference?: string;
}

/** Live gateways need server keys (edge function). Public keys can be checked in the browser. */
export function isProviderConfigured(provider: PaymentProviderConfig): boolean {
  if (provider.id === 'bank_transfer') return true;
  if (provider.publicEnvKeys?.length) {
    return provider.publicEnvKeys.every((key) => {
      const value = import.meta.env[key as keyof ImportMetaEnv];
      return typeof value === 'string' && value.length > 0 && !value.includes('your_');
    });
  }
  return false;
}

export function isOnlineGatewayAvailable(region: PaymentRegion, providerId: PaymentProviderId): boolean {
  const provider = getAvailablePaymentMethods(region).find((p) => p.id === providerId);
  if (!provider) return false;
  return isProviderConfigured(provider);
}

export function getAvailablePaymentMethods(region: PaymentRegion): PaymentProviderConfig[] {
  return PAYMENT_PROVIDERS_BY_REGION[region] ?? PAYMENT_PROVIDERS_BY_REGION.int;
}

export async function initiatePayment(request: PaymentInitRequest): Promise<PaymentInitResult> {
  const providers = getAvailablePaymentMethods(request.region);
  const provider = providers.find((p) => p.id === request.provider);

  if (!provider) {
    return {
      ok: false,
      configured: false,
      provider: request.provider,
      message: 'Payment provider is not available for this region.',
    };
  }

  if (provider.id === 'bank_transfer') {
    return {
      ok: true,
      configured: true,
      provider: provider.id,
      message: 'Bank transfer instructions will be sent with your invoice. No live gateway redirect is required.',
      transactionReference: `BT-${request.invoiceNumber ?? request.invoiceId}`,
    };
  }

  return {
    ok: false,
    configured: false,
    provider: provider.id,
    message:
      'Live payment gateway is not connected yet. Add provider API keys on the server and deploy the payment edge function to enable checkout.',
    transactionReference: `PENDING-${request.invoiceId}`,
  };
}

export function buildPaymentContext(options: {
  pathRegion?: string | null;
  profileRegion?: string | null;
}) {
  const region = resolvePaymentRegion(options.pathRegion, options.profileRegion);
  return {
    region,
    currency: currencyForRegion(region),
    methods: getAvailablePaymentMethods(region),
    appUrl: appEnv.siteUrl,
  };
}
