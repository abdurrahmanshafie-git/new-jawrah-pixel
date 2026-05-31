import type { RegionCode } from '@/types';
import { currencyForRegion } from '@/lib/payments/config';

export function formatCurrencyAmount(amount: number, currency: string, region?: RegionCode): string {
  const safe = Math.max(0, Number(amount) || 0);
  const code = currency || (region ? currencyForRegion(region) : 'LKR');

  if (code === 'USD') {
    return `USD $${safe.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  return `${code} ${safe.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatPayButtonLabel(amount: number, currency: string, region?: RegionCode): string {
  const formatted = formatCurrencyAmount(amount, currency, region);
  return `Pay ${formatted}`;
}

export function formatPercent(value: number): string {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return `${safe % 1 === 0 ? safe.toFixed(0) : safe.toFixed(1)}%`;
}
