import type { RegionCode } from '@/types';
import { formatCurrencyAmount } from '@/lib/billing/format';

export type DepositPercent = 10 | 25 | 50 | 100;

const BUDGET_ESTIMATES_LK: Record<string, number> = {
  'Under LKR 200k': 200_000,
  'LKR 200k - 500k': 350_000,
  'LKR 500k - 1.5M': 1_000_000,
  'Over LKR 1.5M': 2_000_000,
};

const BUDGET_ESTIMATES_PK: Record<string, number> = {
  'Under PKR 150k': 150_000,
  'PKR 150k - 400k': 275_000,
  'PKR 400k - 1.2M': 800_000,
  'Over PKR 1.2M': 1_500_000,
};

const BUDGET_ESTIMATES_INT: Record<string, number> = {
  '$500 - $1,000': 1_000,
  '$1,000 - $3,000': 2_000,
  '$3,000 - $10,000': 6_500,
  '$10,000+': 12_000,
};

const BOOKING_SERVICE_ESTIMATES: Record<RegionCode, Record<string, number>> = {
  lk: {
    'Web Design': 500_000,
    Ecommerce: 950_000,
    'Admin Dashboard': 900_000,
    Branding: 80_000,
    Other: 600_000,
  },
  pk: {
    'Web Design': 450_000,
    Ecommerce: 850_000,
    'Admin Dashboard': 800_000,
    Branding: 70_000,
    Other: 500_000,
  },
  int: {
    'Web Design': 5_000,
    Ecommerce: 12_000,
    'Admin Dashboard': 15_000,
    Branding: 2_500,
    Other: 8_000,
  },
};

export function parsePriceAmount(priceLabel: string): number {
  const normalized = priceLabel.replace(/,/g, '');
  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  const value = Number(match[1]);
  if (normalized.toLowerCase().includes('m')) return value * 1_000_000;
  if (normalized.toLowerCase().includes('k') && value < 1000) return value * 1_000;
  return value;
}

export function estimateFromBudget(budgetRange: string | undefined, region: RegionCode): number {
  const defaults: Record<RegionCode, number> = { lk: 350_000, pk: 275_000, int: 8_000 };
  if (!budgetRange) return defaults[region];
  const map = region === 'pk' ? BUDGET_ESTIMATES_PK : region === 'int' ? BUDGET_ESTIMATES_INT : BUDGET_ESTIMATES_LK;
  return map[budgetRange] ?? defaults[region];
}

export function estimateBookingService(projectType: string, region: RegionCode): number {
  const defaults: Record<RegionCode, number> = { lk: 500_000, pk: 450_000, int: 8_000 };
  return BOOKING_SERVICE_ESTIMATES[region][projectType] ?? defaults[region];
}

export function calculateDeposit(total: number, percent: DepositPercent): number {
  const safeTotal = Math.max(0, Number(total) || 0);
  const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
  return Math.round((safeTotal * safePercent) / 100);
}

export function formatMoney(amount: number, currency: string): string {
  return formatCurrencyAmount(amount, currency);
}
