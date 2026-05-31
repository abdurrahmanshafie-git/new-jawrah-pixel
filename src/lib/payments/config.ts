import type { RegionCode } from '@/types';

export type PaymentRegion = RegionCode;

export type PaymentProviderId =
  | 'payhere'
  | 'onepay'
  | 'bank_transfer'
  | 'easypaisa'
  | 'jazzcash'
  | 'paypal'
  | 'stripe'
  | 'visa'
  | 'mastercard'
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
    { id: 'payhere', label: 'PayHere Online Payment', currency: 'LKR', envKeys: ['PAYHERE_MERCHANT_ID', 'PAYHERE_SECRET'] },
    { id: 'bank_transfer', label: 'Bank Transfer', currency: 'LKR', envKeys: [] },
    { id: 'onepay', label: 'OnePay', currency: 'LKR', envKeys: ['ONEPAY_API_KEY'] },
  ],
  pk: [
    { id: 'bank_transfer', label: 'Bank Transfer', currency: 'PKR', envKeys: [] },
    { id: 'easypaisa', label: 'Easypaisa', currency: 'PKR', envKeys: ['EASYPAISA_API_KEY'] },
    { id: 'jazzcash', label: 'JazzCash', currency: 'PKR', envKeys: ['JAZZCASH_API_KEY'] },
  ],
  int: [
    { id: 'wise', label: 'Wise', currency: 'USD', envKeys: ['WISE_API_KEY'] },
    { id: 'paypal', label: 'PayPal', currency: 'USD', envKeys: ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET'] },
    { id: 'bank_transfer', label: 'Bank Transfer', currency: 'USD', envKeys: [] },
    { id: 'visa', label: 'Card Payment', currency: 'USD', envKeys: ['STRIPE_SECRET_KEY'], publicEnvKeys: ['VITE_STRIPE_PUBLIC_KEY'] },
    { id: 'mastercard', label: 'Mastercard', currency: 'USD', envKeys: ['STRIPE_SECRET_KEY'], publicEnvKeys: ['VITE_STRIPE_PUBLIC_KEY'] },
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
