import type { RegionCode } from '@/types';
import { currencyForRegion, type PaymentRegion } from '@/lib/payments/config';

export type BillingMilestoneKey = 'deposit' | 'development' | 'final';

export interface BillingMilestoneDraft {
  milestone_key: BillingMilestoneKey;
  label: string;
  percentage: number;
  amount: number;
  sort_order: number;
}

export interface BillingCalculation {
  project_value: number;
  deposit_percentage: number;
  deposit_amount: number;
  remaining_balance: number;
  amount_due_now: number;
  current_milestone: BillingMilestoneKey;
  currency: string;
  milestones: BillingMilestoneDraft[];
}

const DEFAULT_SPLIT: Array<{ key: BillingMilestoneKey; label: string; percent: number; order: number }> = [
  { key: 'deposit', label: 'Deposit', percent: 10, order: 0 },
  { key: 'development', label: 'Development', percent: 40, order: 1 },
  { key: 'final', label: 'Final Delivery', percent: 50, order: 2 },
];

function roundMoney(value: number): number {
  return Math.round(Math.max(0, value) * 100) / 100;
}

export function buildMilestoneSplit(
  projectValue: number,
  depositPercentage = 10,
): BillingMilestoneDraft[] {
  const total = roundMoney(projectValue);
  const depositPercent = Math.max(0, Math.min(100, depositPercentage));
  const depositAmount = roundMoney((total * depositPercent) / 100);
  const remainder = roundMoney(total - depositAmount);
  const devPercent = 40;
  const finalPercent = 50;
  const devAmount = roundMoney((remainder * devPercent) / (devPercent + finalPercent));
  const finalAmount = roundMoney(remainder - devAmount);

  return [
    {
      milestone_key: 'deposit',
      label: `${depositPercent}% Deposit`,
      percentage: depositPercent,
      amount: depositAmount,
      sort_order: 0,
    },
    {
      milestone_key: 'development',
      label: `${devPercent}% Development`,
      percentage: devPercent,
      amount: devAmount,
      sort_order: 1,
    },
    {
      milestone_key: 'final',
      label: `${finalPercent}% Final Delivery`,
      percentage: finalPercent,
      amount: finalAmount,
      sort_order: 2,
    },
  ];
}

export function calculateBillingFields(
  projectValue: number,
  depositPercentage = 10,
  region: RegionCode | PaymentRegion = 'lk',
): BillingCalculation {
  const milestones = buildMilestoneSplit(projectValue, depositPercentage);
  const deposit = milestones[0];
  const project_value = roundMoney(projectValue);
  const deposit_amount = deposit.amount;
  const remaining_balance = roundMoney(project_value - deposit_amount);

  return {
    project_value,
    deposit_percentage: deposit.percentage,
    deposit_amount,
    remaining_balance,
    amount_due_now: deposit_amount,
    current_milestone: 'deposit',
    currency: currencyForRegion(region),
    milestones,
  };
}

export function getCurrentMilestoneDue(
  milestones: Array<{ milestone_key: BillingMilestoneKey; amount: number; status: string }>,
  currentKey: BillingMilestoneKey,
): number {
  const current = milestones.find((m) => m.milestone_key === currentKey && m.status !== 'paid');
  return current?.amount ?? 0;
}

export function computeRemainingBalance(
  projectValue: number,
  milestones: Array<{ amount: number; status: string }>,
): number {
  const paid = milestones
    .filter((m) => m.status === 'paid')
    .reduce((sum, m) => sum + Number(m.amount || 0), 0);
  return roundMoney(Math.max(0, projectValue - paid));
}

export function paymentStatusLabel(paymentStatus?: string | null, currentMilestone?: string | null): string {
  const ps = (paymentStatus || '').toLowerCase();
  if (ps === 'paid') return 'Paid';
  if (ps === 'manual_review') return 'Manual Review';
  if (ps === 'processing') return 'Processing';
  if (ps === 'failed') return 'Failed';
  if (ps === 'cancelled') return 'Cancelled';
  if (currentMilestone === 'deposit') return 'Pending Deposit';
  if (currentMilestone === 'development') return 'Pending Development Payment';
  if (currentMilestone === 'final') return 'Pending Final Payment';
  return 'Pending Payment';
}
