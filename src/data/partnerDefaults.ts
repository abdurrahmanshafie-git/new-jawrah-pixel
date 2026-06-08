import type { RegionCode } from '@/types';

export interface CommissionDefault {
  currency: 'LKR' | 'PKR' | 'USD';
  locale: string;
  projectValue: number;
  commissionPercent: number;
  clientsPerMonth: number;
  minProjectValue: number;
  maxProjectValue: number;
  projectStep: number;
}

export interface RegionPartnerCopy {
  eyebrow: string;
  headline: string;
  subheadline: string;
  regionLine: string;
  seoTitle: string;
  seoDescription: string;
  cityOptions: string[];
}

export const partnerRegionCopy: Record<RegionCode, RegionPartnerCopy> = {
  lk: {
    eyebrow: 'Sri Lanka Partner Network',
    headline: 'Earn by connecting Sri Lankan businesses with premium digital systems.',
    subheadline:
      'Earn commissions by connecting businesses with premium websites, e-commerce systems, AI automation, and digital growth solutions from Jawrah Pixel.',
    regionLine:
      'Built for consultants, marketers, founders, and business connectors across Colombo, Galle, Kandy, and remote-first Sri Lanka.',
    seoTitle: 'Website Referral Program Sri Lanka | Jawrah Pixel Partner Network',
    seoDescription:
      'Join the Jawrah Pixel digital agency partner program in Sri Lanka and earn commission by referring premium website, ecommerce, SEO, and AI automation clients.',
    cityOptions: ['Colombo', 'Galle', 'Kandy', 'Jaffna', 'Negombo', 'Remote Sri Lanka', 'Other Sri Lanka region'],
  },
  pk: {
    eyebrow: 'Pakistan Partner Network',
    headline: 'Earn by referring Pakistani businesses that need premium digital growth.',
    subheadline:
      'Earn commissions by connecting businesses with premium websites, e-commerce systems, AI automation, and digital growth solutions from Jawrah Pixel.',
    regionLine:
      'Built for business connectors across Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, and remote-first Pakistan.',
    seoTitle: 'Website Referral Program Pakistan | Jawrah Pixel Partner Network',
    seoDescription:
      'Join the Jawrah Pixel web design partner program in Pakistan and earn commission by referring website, ecommerce, SEO, and AI automation clients.',
    cityOptions: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Remote Pakistan', 'Other Pakistan region'],
  },
  int: {
    eyebrow: 'Global Partner Network',
    headline: 'Earn by connecting ambitious businesses with premium digital execution.',
    subheadline:
      'Earn commissions by connecting businesses with premium websites, e-commerce systems, AI automation, and digital growth solutions from Jawrah Pixel.',
    regionLine:
      'Built for consultants, marketers, operators, and business connectors serving clients across global and remote markets.',
    seoTitle: 'Digital Agency Partner Program | Jawrah Pixel Partner Network',
    seoDescription:
      'Join the Jawrah Pixel international website referral program and earn commission by referring premium website, ecommerce, AI automation, and digital growth clients.',
    cityOptions: ['Global Remote', 'North America', 'Europe', 'Middle East', 'Asia Pacific', 'Africa', 'Other international region'],
  },
};

export const commissionDefaults: Record<RegionCode, CommissionDefault> = {
  lk: {
    currency: 'LKR',
    locale: 'en-LK',
    projectValue: 750000,
    commissionPercent: 10,
    clientsPerMonth: 2,
    minProjectValue: 150000,
    maxProjectValue: 5000000,
    projectStep: 50000,
  },
  pk: {
    currency: 'PKR',
    locale: 'en-PK',
    projectValue: 850000,
    commissionPercent: 10,
    clientsPerMonth: 2,
    minProjectValue: 150000,
    maxProjectValue: 6000000,
    projectStep: 50000,
  },
  int: {
    currency: 'USD',
    locale: 'en-US',
    projectValue: 2500,
    commissionPercent: 12,
    clientsPerMonth: 2,
    minProjectValue: 500,
    maxProjectValue: 25000,
    projectStep: 250,
  },
};

export const partnerValueItems = [
  {
    icon: 'commission',
    title: 'Earn From Referred Clients',
    description:
      'Introduce qualified businesses and earn commission when projects are approved and paid.',
  },
  {
    icon: 'noCode',
    title: 'No Coding Required',
    description:
      'You focus on relationships, discovery, and introductions. Jawrah Pixel handles the technical delivery.',
  },
  {
    icon: 'delivery',
    title: 'Full Delivery Handled',
    description:
      'Design, development, deployment, SEO foundations, support, and launch coordination stay with our team.',
  },
  {
    icon: 'tracking',
    title: 'Updates And Tracking',
    description:
      'Approved partners get visibility into referral progress, project status, commission records, and payout history.',
  },
  {
    icon: 'repeat',
    title: 'Long-Term Revenue Potential',
    description:
      'Strong clients often return for ecommerce, automation, SEO, dashboards, support, and new campaigns.',
  },
  {
    icon: 'services',
    title: 'Premium Services To Offer',
    description:
      'Confidently refer websites, ecommerce systems, AI automation, SEO, branding, dashboards, and growth systems.',
  },
] as const;

export const partnerProcessSteps = [
  {
    title: 'Apply',
    partner: 'Submit your profile, region, communication details, and business network.',
    jawrah: 'Jawrah Pixel receives the application and checks that the basics are complete.',
    outcome: 'Your application enters the partner review queue.',
  },
  {
    title: 'Application Review',
    partner: 'Respond to any follow-up questions if the team needs more context.',
    jawrah: 'We review fit, region, communication quality, and referral potential.',
    outcome: 'Qualified applicants move toward partner approval.',
  },
  {
    title: 'Receive Partner Approval',
    partner: 'Confirm acceptance and the ethical referral guidelines.',
    jawrah: 'We approve the profile, starting tier, and partner onboarding path.',
    outcome: 'You become an official Jawrah Pixel partner.',
  },
  {
    title: 'Get Your Unique Referral Code',
    partner: 'Use the code or tracked introduction path when sharing qualified leads.',
    jawrah: 'We connect referrals to your partner record for transparent tracking.',
    outcome: 'Every qualified introduction has a clear attribution trail.',
  },
  {
    title: 'Refer Businesses',
    partner: 'Connect founders, teams, and decision makers who need premium digital systems.',
    jawrah: 'We handle discovery, proposal, design, engineering, deployment, and support.',
    outcome: 'You stay visible in the referral workflow without doing delivery work.',
  },
  {
    title: 'Project Closed',
    partner: 'Track the lead as it moves from conversation to approved paid project.',
    jawrah: 'We confirm scope, agreement, and client payment status.',
    outcome: 'A closed project becomes eligible for commission review.',
  },
  {
    title: 'Commission Approved',
    partner: 'Review the approved commission status inside the partner workflow.',
    jawrah: 'We verify attribution, payment, project value, and partner tier.',
    outcome: 'Your payout is approved according to the partner terms.',
  },
  {
    title: 'Get Paid',
    partner: 'Receive payment through the supported method for your region.',
    jawrah: 'We send the commission and notify you when the payout is complete.',
    outcome: 'You can keep referring and progress toward higher tiers.',
  },
] as const;

export const partnerTypes = [
  'Freelance consultant',
  'Digital marketer',
  'Business connector',
  'Agency owner',
  'Sales professional',
  'Ambitious individual',
];

export const experienceLevels = [
  'Starting out',
  '1-2 years',
  '3-5 years',
  '5+ years',
  'Senior consultant',
];

export const networkSizeOptions = [
  '1-25 contacts',
  '26-100 contacts',
  '101-300 contacts',
  '301-1000 contacts',
  '1000+ contacts',
];

export const businessTypeOptions = [
  'Retail and ecommerce',
  'Jewellery and luxury brands',
  'Restaurants and hospitality',
  'Real estate and property',
  'Travel and logistics',
  'Professional services',
  'SaaS and startups',
  'Local SMEs',
];

export const partnerTrustPillars = [
  'Production-ready systems',
  'Premium UI and conversion UX',
  'Technical SEO foundations',
  'Secure Supabase-backed portals',
  'Professional launch process',
  'Long-term client support',
] as const;
