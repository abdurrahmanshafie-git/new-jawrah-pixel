import type { RegionCode } from '@/types';

export type AgentTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'elite';

export interface TierDefinition {
  tier: AgentTier;
  label: string;
  minProjects: number;
  maxProjects: number | null;
  rate: number;
  rateLabel: string;
}

export const AGENT_TIER_DEFINITIONS: TierDefinition[] = [
  { tier: 'bronze', label: 'Bronze', minProjects: 1, maxProjects: 3, rate: 0.08, rateLabel: '8%' },
  { tier: 'silver', label: 'Silver', minProjects: 4, maxProjects: 8, rate: 0.1, rateLabel: '10%' },
  { tier: 'gold', label: 'Gold', minProjects: 9, maxProjects: 15, rate: 0.12, rateLabel: '12%' },
  { tier: 'platinum', label: 'Platinum', minProjects: 16, maxProjects: 25, rate: 0.15, rateLabel: '15%' },
  { tier: 'elite', label: 'Elite', minProjects: 26, maxProjects: null, rate: 0.18, rateLabel: '18%' },
];

export function regionCurrency(region: RegionCode): string {
  if (region === 'pk') return 'PKR';
  if (region === 'int') return 'USD';
  return 'LKR';
}

export function calculateAgentTier(completedPaidProjects: number): TierDefinition {
  const count = Math.max(0, completedPaidProjects);
  if (count >= 26) return AGENT_TIER_DEFINITIONS[4];
  if (count >= 16) return AGENT_TIER_DEFINITIONS[3];
  if (count >= 9) return AGENT_TIER_DEFINITIONS[2];
  if (count >= 4) return AGENT_TIER_DEFINITIONS[1];
  return AGENT_TIER_DEFINITIONS[0];
}

export function calculateCommission(projectAmount: number, rate: number): number {
  const amount = Number(projectAmount) || 0;
  const commissionRate = Number(rate) || 0;
  return Math.round(amount * commissionRate * 100) / 100;
}

export function nextTierProgress(completedPaidProjects: number): {
  current: TierDefinition;
  next: TierDefinition | null;
  projectsToNext: number;
  progressPercent: number;
} {
  const current = calculateAgentTier(completedPaidProjects);
  const currentIndex = AGENT_TIER_DEFINITIONS.findIndex((t) => t.tier === current.tier);
  const next = AGENT_TIER_DEFINITIONS[currentIndex + 1] ?? null;

  if (!next) {
    return { current, next: null, projectsToNext: 0, progressPercent: 100 };
  }

  const rangeStart = current.minProjects;
  const rangeEnd = next.minProjects - 1;
  const span = Math.max(1, rangeEnd - rangeStart + 1);
  const within = Math.min(span, Math.max(0, completedPaidProjects - rangeStart + 1));
  const projectsToNext = Math.max(0, next.minProjects - completedPaidProjects);

  return {
    current,
    next,
    projectsToNext,
    progressPercent: Math.round((within / span) * 100),
  };
}

export function tierCardsForRegion(region: RegionCode) {
  const currency = regionCurrency(region);
  return AGENT_TIER_DEFINITIONS.map((tier) => ({
    level: `${tier.label} Tier`,
    volume:
      tier.maxProjects === null
        ? `${tier.minProjects}+ completed paid projects`
        : `${tier.minProjects}–${tier.maxProjects} completed paid projects`,
    budget: 'Paid & completed projects only',
    rate: `${tier.rateLabel} Commission`,
    reward: `Commission in ${currency}`,
    focus:
      'Only paid and completed client projects count toward your tier. Inquiries, meetings, rejected leads, unpaid, and cancelled projects are excluded.',
    color:
      tier.tier === 'bronze'
        ? 'border-amber-700/30 text-amber-500 bg-amber-500/5'
        : tier.tier === 'silver'
          ? 'border-slate-400/30 text-slate-300 bg-slate-300/5 shadow-[0_0_20px_rgba(255,255,255,0.02)]'
          : tier.tier === 'gold' || tier.tier === 'platinum' || tier.tier === 'elite'
            ? 'border-brand-cyan/30 text-brand-cyan bg-brand-cyan/5 shadow-[0_0_25px_rgba(34,211,238,0.1)]'
            : 'border-white/10 text-white bg-white/5',
  }));
}
