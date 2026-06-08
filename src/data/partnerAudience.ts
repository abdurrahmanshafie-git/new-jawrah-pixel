export interface PartnerAudienceItem {
  icon: 'consultant' | 'marketing' | 'connector' | 'ambitious';
  title: string;
  description: string;
}

export const partnerAudience: PartnerAudienceItem[] = [
  {
    icon: 'connector',
    title: 'Sales Professionals',
    description:
      'Introduce qualified decision makers and let Jawrah Pixel handle proposal, delivery, technical scope, and support.',
  },
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
    title: 'Agency Owners',
    description:
      'Refer overflow or adjacent digital work without adding more internal production load to your agency.',
  },
  {
    icon: 'consultant',
    title: 'Business Consultants',
    description:
      'Bring premium digital execution into client conversations while keeping strategy and relationship trust intact.',
  },
  {
    icon: 'ambitious',
    title: 'Entrepreneurs',
    description:
      'Turn founder networks, local relationships, and market access into a practical long-term partner channel.',
  },
];
