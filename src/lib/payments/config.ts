import type { RegionCode } from '@/types';

export type PaymentRegion = RegionCode;

export type PaymentProviderId =
  | 'payhere'
  | 'onepay'
  | 'bank_transfer'
  | 'easypaisa'
  | 'jazzcash'
  | 'stripe'
  | 'wise'
  | 'payoneer';

export interface PaymentProviderConfig {
  id: PaymentProviderId;
  label: string;
  currency: 'LKR' | 'PKR' | 'USD';
  envKeys: string[];
  publicEnvKeys?: string[];
}

export const REGION_CURRENCY: Record<PaymentRegion, 'LKR' | 'PKR' | 'USD'> = {
  lk: 'LKR',
  pk: 'PKR',
  int: 'USD',
};

export const PAYMENT_PROVIDERS_BY_REGION: Record<PaymentRegion, PaymentProviderConfig[]> = {
  lk: [
    { id: 'payhere', label: 'PayHere', currency: 'LKR', envKeys: ['PAYHERE_MERCHANT_ID', 'PAYHERE_SECRET'] },
    { id: 'onepay', label: 'OnePay', currency: 'LKR', envKeys: ['ONEPAY_API_KEY'] },
    { id: 'bank_transfer', label: 'Bank Transfer', currency: 'LKR', envKeys: [] },
  ],
  pk: [
    { id: 'easypaisa', label: 'Easypaisa', currency: 'PKR', envKeys: ['EASYPAISA_API_KEY'] },
    { id: 'jazzcash', label: 'JazzCash', currency: 'PKR', envKeys: ['JAZZCASH_API_KEY'] },
    { id: 'bank_transfer', label: 'Bank Transfer', currency: 'PKR', envKeys: [] },
  ],
  int: [
    { id: 'stripe', label: 'Stripe', currency: 'USD', envKeys: ['STRIPE_SECRET_KEY'], publicEnvKeys: ['VITE_STRIPE_PUBLIC_KEY'] },
    { id: 'wise', label: 'Wise', currency: 'USD', envKeys: ['WISE_API_KEY'] },
    { id: 'payoneer', label: 'Payoneer', currency: 'USD', envKeys: ['PAYONEER_API_KEY'] },
    { id: 'bank_transfer', label: 'Bank Transfer', currency: 'USD', envKeys: [] },
  ],
};

export function resolvePaymentRegion(pathRegion?: string | null, profileRegion?: string | null): PaymentRegion {
  if (pathRegion === 'lk' || pathRegion === 'pk' || pathRegion === 'int') return pathRegion;
  if (profileRegion === 'lk' || profileRegion === 'pk' || profileRegion === 'int') return profileRegion;
  return 'int';
}

export function currencyForRegion(region: PaymentRegion): 'LKR' | 'PKR' | 'USD' {
  return REGION_CURRENCY[region];
}
