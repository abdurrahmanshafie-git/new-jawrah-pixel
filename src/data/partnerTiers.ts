import type { RegionCode } from '@/types';

export interface PartnerTier {
  id: 'bronze' | 'silver' | 'gold' | 'elite';
  name: string;
  bestFor: string;
  commissionRate?: number;
  commissionLabel: string;
  completedReferrals: string;
  benefits: string[];
  progressionNote: string;
  featured?: boolean;
}

const tiers: PartnerTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Partner',
    bestFor: 'Newly approved partners starting with a few warm business introductions.',
    commissionRate: 10,
    commissionLabel: '10%',
    completedReferrals: 'Up to 3 completed referrals',
    benefits: [
      '10% commission on approved paid projects',
      'Partner onboarding guidance',
      'Referral code and tracking setup',
      'Core service positioning support',
    ],
    progressionNote: 'Build your first wins and move into Silver after consistent completed referrals.',
  },
  {
    id: 'silver',
    name: 'Silver Partner',
    bestFor: 'Reliable partners with recurring client conversations and stronger referral quality.',
    commissionRate: 12,
    commissionLabel: '12%',
    completedReferrals: '4-9 completed referrals',
    benefits: [
      '12% commission on approved paid projects',
      'Priority referral review',
      'Referral pipeline visibility',
      'Early access to new offers',
    ],
    progressionNote: 'Move toward Gold by proving repeatable qualified introductions.',
    featured: true,
  },
  {
    id: 'gold',
    name: 'Gold Partner',
    bestFor: 'High-trust partners who regularly introduce premium businesses and decision makers.',
    commissionRate: 15,
    commissionLabel: '15%',
    completedReferrals: '10-19 completed referrals',
    benefits: [
      '15% commission on approved paid projects',
      'Strategic account collaboration',
      'Priority support',
      'Advanced payout reporting',
    ],
    progressionNote: 'Designed for partners turning relationships into a serious channel.',
  },
  {
    id: 'elite',
    name: 'Elite Partner',
    bestFor: 'Established channel partners, consultants, and agency owners with premium deal flow.',
    commissionLabel: 'Custom rewards',
    completedReferrals: '20+ completed referrals',
    benefits: [
      'Custom rewards and bonus opportunities',
      'Priority support',
      'Strategic pipeline planning',
      'Direct collaboration on larger accounts',
    ],
    progressionNote: 'Reviewed individually based on volume, quality, and long-term partner fit.',
  },
];

export function getPartnerTiers(_region: RegionCode): PartnerTier[] {
  return tiers;
}
