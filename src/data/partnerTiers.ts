import type { RegionCode } from '@/types';

export interface PartnerTier {
  id: 'starter' | 'growth' | 'elite';
  name: string;
  bestFor: string;
  commissionRate: number;
  requirements: string[];
  benefits: string[];
  upgradeCondition: string;
  featured?: boolean;
}

const tiers: PartnerTier[] = [
  {
    id: 'starter',
    name: 'Starter Partner',
    bestFor: 'New partners with a warm network and a few qualified business relationships.',
    commissionRate: 8,
    requirements: [
      'Approved partner application',
      'Verified email and WhatsApp contact',
      'Ethical, accurate client introductions',
    ],
    benefits: [
      'Starter referral commission',
      'Partner onboarding guidance',
      'Application and referral tracking',
      'Access to core service positioning',
    ],
    upgradeCondition: 'Upgrade after 3 qualified referrals or 1 paid project.',
  },
  {
    id: 'growth',
    name: 'Growth Partner',
    bestFor: 'Consultants, marketers, and connectors who can introduce clients every month.',
    commissionRate: 12,
    requirements: [
      'Consistent qualified referrals',
      'Clear business communication',
      'Positive client introduction quality',
    ],
    benefits: [
      'Higher commission rate',
      'Priority partner desk support',
      'Referral pipeline visibility',
      'Early access to new service offers',
    ],
    upgradeCondition: 'Upgrade after 5 paid projects or strong monthly referral volume.',
    featured: true,
  },
  {
    id: 'elite',
    name: 'Elite Partner',
    bestFor: 'High-trust partners serving premium businesses, founders, and decision makers.',
    commissionRate: 15,
    requirements: [
      'Proven paid referral history',
      'Premium business network',
      'Consistent communication quality',
    ],
    benefits: [
      'Top-tier commission potential',
      'Strategic account collaboration',
      'Custom partner support',
      'Long-term commission and payout reporting',
    ],
    upgradeCondition: 'Invite or review based on paid project volume and partner quality.',
  },
];

export function getPartnerTiers(_region: RegionCode): PartnerTier[] {
  return tiers;
}
