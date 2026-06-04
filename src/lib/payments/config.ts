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

export interface BankTransferDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
}

export const LK_BANK_TRANSFER_DETAILS: BankTransferDetails = {
  bankName: 'Commercial Bank',
  accountName: 'MSA RAHMAN',
  accountNumber: '8018782406',
  branch: 'Akurana',
};

export const LK_PAYMENT_CLIENT_MESSAGE =
  'To begin your project, please transfer the agreed advance payment using the bank details below. Once payment is completed, upload your receipt or submit the transaction reference number for verification. Our team will confirm your payment and begin the project promptly.';

export const RECEIPT_UPLOAD_SETTINGS = {
  bucket: 'project-files',
  maxBytes: 10 * 1024 * 1024,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf'],
};

export const REGION_CURRENCY: Record<PaymentRegion, 'LKR' | 'PKR' | 'USD'> = {
  lk: 'LKR',
  pk: 'PKR',
  int: 'USD',
};

export const PAYMENT_PROVIDERS_BY_REGION: Record<PaymentRegion, PaymentProviderConfig[]> = {
  lk: [
    { id: 'bank_transfer', label: 'Bank Transfer', currency: 'LKR', envKeys: [] },
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
