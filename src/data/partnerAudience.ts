export interface PartnerAudienceItem {
  icon: 'consultant' | 'marketing' | 'connector' | 'ambitious';
  title: string;
  description: string;
}

export const partnerAudience: PartnerAudienceItem[] = [
  {
    icon: 'consultant',
    title: 'Freelance Consultants',
    description:
      'Add premium websites, ecommerce systems, automation, and dashboards to your offer without hiring a delivery team.',
  },
  {
    icon: 'marketing',
    title: 'Digital Marketers',
    description:
      'Refer clients who need stronger landing pages, technical SEO foundations, ecommerce funnels, and campaign-ready systems.',
  },
  {
    icon: 'connector',
    title: 'Business Connectors',
    description:
      'Turn your founder, retail, property, hospitality, or professional network into a serious referral channel.',
  },
  {
    icon: 'ambitious',
    title: 'Ambitious Individuals',
    description:
      'Build a practical income path by learning how to identify businesses that need premium digital execution.',
  },
];
