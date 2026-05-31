export type RegionSeoKey = 'lk' | 'pk' | 'int';

type RegionPageMeta = {
  title: string;
  description: string;
  path: string;
  schemaType?: 'Organization' | 'Service' | 'Project' | 'BlogPosting';
  schemaData?: Record<string, unknown>;
};

type RegionSeoMap = Record<
  'home' | 'services' | 'contact' | 'agents' | 'about' | 'process' | 'pricing' | 'caseStudies' | 'blog',
  RegionPageMeta
>;

const BASE: Omit<RegionPageMeta, 'title' | 'description'> = { path: '' };

export const REGION_SEO: Record<RegionSeoKey, RegionSeoMap> = {
  lk: {
    home: {
      ...BASE,
      path: '',
      title: 'Premium Web Design Sri Lanka | Jawrah Pixel',
      description: 'Luxury websites, ecommerce platforms, and digital systems for ambitious Sri Lankan brands.',
      schemaType: 'Organization',
    },
    services: {
      ...BASE,
      path: '/services',
      title: 'Web Design & Ecommerce Services Sri Lanka',
      description: 'Premium web design, ecommerce development, branding, SEO, and custom systems for LK businesses.',
      schemaType: 'Service',
      schemaData: { name: 'Premium Digital Services Sri Lanka', areaServed: 'Sri Lanka' },
    },
    contact: {
      ...BASE,
      path: '/contact',
      title: 'Contact Jawrah Pixel Sri Lanka',
      description: 'Submit your project brief or book a strategy consultation with Jawrah Pixel in Sri Lanka.',
    },
    agents: {
      ...BASE,
      path: '/agents',
      title: 'Agent Network Sri Lanka | Jawrah Pixel',
      description: 'Join the Jawrah Pixel partner network in Sri Lanka and earn commission on referred projects.',
    },
    about: {
      ...BASE,
      path: '/about',
      title: 'About Jawrah Pixel Sri Lanka',
      description: 'Learn about Jawrah Pixel, a premium digital agency building luxury web experiences in Sri Lanka.',
    },
    process: {
      ...BASE,
      path: '/process',
      title: 'Our Process | Jawrah Pixel Sri Lanka',
      description: 'Discover the Jawrah Pixel delivery process for premium websites and digital systems in Sri Lanka.',
    },
    pricing: {
      ...BASE,
      path: '/pricing',
      title: 'Pricing & Maintenance Plans Sri Lanka',
      description: 'Transparent premium pricing and maintenance plans for Sri Lankan businesses.',
    },
    caseStudies: {
      ...BASE,
      path: '/case-studies',
      title: 'Case Studies Sri Lanka | Jawrah Pixel',
      description: 'Explore premium digital case studies and results from Jawrah Pixel Sri Lanka.',
    },
    blog: {
      ...BASE,
      path: '/blog',
      title: 'Digital Insights Sri Lanka | Jawrah Pixel Blog',
      description: 'Premium digital strategy, design, and growth insights for Sri Lankan brands.',
      schemaType: 'BlogPosting',
    },
  },
  pk: {
    home: {
      ...BASE,
      path: '',
      title: 'Premium Web Design Pakistan | Jawrah Pixel',
      description: 'Luxury websites, ecommerce platforms, and digital systems for ambitious Pakistani brands.',
      schemaType: 'Organization',
    },
    services: {
      ...BASE,
      path: '/services',
      title: 'Web Design & Ecommerce Services Pakistan',
      description: 'Premium web design, ecommerce development, branding, SEO, and custom systems for PK businesses.',
      schemaType: 'Service',
      schemaData: { name: 'Premium Digital Services Pakistan', areaServed: 'Pakistan' },
    },
    contact: {
      ...BASE,
      path: '/contact',
      title: 'Contact Jawrah Pixel Pakistan',
      description: 'Submit your project brief or book a strategy consultation with Jawrah Pixel in Pakistan.',
    },
    agents: {
      ...BASE,
      path: '/agents',
      title: 'Agent Network Pakistan | Jawrah Pixel',
      description: 'Join the Jawrah Pixel partner network in Pakistan and earn commission on referred projects.',
    },
    about: {
      ...BASE,
      path: '/about',
      title: 'About Jawrah Pixel Pakistan',
      description: 'Learn about Jawrah Pixel, a premium digital agency building luxury web experiences in Pakistan.',
    },
    process: {
      ...BASE,
      path: '/process',
      title: 'Our Process | Jawrah Pixel Pakistan',
      description: 'Discover the Jawrah Pixel delivery process for premium websites and digital systems in Pakistan.',
    },
    pricing: {
      ...BASE,
      path: '/pricing',
      title: 'Pricing & Maintenance Plans Pakistan',
      description: 'Transparent premium pricing and maintenance plans for Pakistani businesses.',
    },
    caseStudies: {
      ...BASE,
      path: '/case-studies',
      title: 'Case Studies Pakistan | Jawrah Pixel',
      description: 'Explore premium digital case studies and results from Jawrah Pixel Pakistan.',
    },
    blog: {
      ...BASE,
      path: '/blog',
      title: 'Digital Insights Pakistan | Jawrah Pixel Blog',
      description: 'Premium digital strategy, design, and growth insights for Pakistani brands.',
      schemaType: 'BlogPosting',
    },
  },
  int: {
    home: {
      ...BASE,
      path: '',
      title: 'Premium Global Web Design | Jawrah Pixel International',
      description: 'Luxury websites, SaaS platforms, ecommerce, and AI-ready digital systems for global brands.',
      schemaType: 'Organization',
    },
    services: {
      ...BASE,
      path: '/services',
      title: 'International Digital Services | Jawrah Pixel',
      description: 'Premium global web design, ecommerce, SaaS interfaces, branding, SEO, and AI integrations.',
      schemaType: 'Service',
      schemaData: { name: 'International Premium Digital Services', areaServed: 'Worldwide' },
    },
    contact: {
      ...BASE,
      path: '/contact',
      title: 'Contact Jawrah Pixel International',
      description: 'Submit your global project brief or book a remote strategy consultation with Jawrah Pixel.',
    },
    agents: {
      ...BASE,
      path: '/agents',
      title: 'Global Partner Network | Jawrah Pixel',
      description: 'Join the Jawrah Pixel international partner network and earn USD commissions.',
    },
    about: {
      ...BASE,
      path: '/about',
      title: 'About Jawrah Pixel International',
      description: 'Learn about Jawrah Pixel, a premium global digital agency for luxury brand experiences.',
    },
    process: {
      ...BASE,
      path: '/process',
      title: 'Our Process | Jawrah Pixel International',
      description: 'Discover the Jawrah Pixel global delivery process for premium digital products.',
    },
    pricing: {
      ...BASE,
      path: '/pricing',
      title: 'International Pricing | Jawrah Pixel',
      description: 'Premium USD pricing and maintenance plans for international businesses.',
    },
    caseStudies: {
      ...BASE,
      path: '/case-studies',
      title: 'Global Case Studies | Jawrah Pixel',
      description: 'Explore international digital case studies and premium results from Jawrah Pixel.',
    },
    blog: {
      ...BASE,
      path: '/blog',
      title: 'Global Digital Insights | Jawrah Pixel Blog',
      description: 'Premium strategy, design, and growth insights for international brands.',
      schemaType: 'BlogPosting',
    },
  },
};
