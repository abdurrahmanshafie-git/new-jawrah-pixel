export type RegionSeoKey = 'lk' | 'pk' | 'int';

type RegionPageMeta = {
  title: string;
  description: string;
  path: string;
  schemaType?: string;
  schemaData?: Record<string, unknown>;
  keywords?: string[];
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
      title: 'Web Design Agency Sri Lanka | Jawrah Pixel',
      description: 'Premium web design, branding, SEO, ecommerce development and digital solutions for Sri Lankan businesses.',
      schemaType: 'Organization',
      keywords: ['web design agency Sri Lanka', 'Sri Lanka ecommerce development', 'SEO services Sri Lanka', 'Jawrah Pixel'],
    },
    services: {
      ...BASE,
      path: '/services',
      title: 'Digital Solutions & Services | Jawrah Pixel',
      description: 'Explore premium digital solutions including websites, e-commerce platforms, business systems, UI/UX design, and custom software development by Jawrah Pixel.',
      schemaType: 'Service',
      schemaData: { name: 'Premium Digital Services Sri Lanka', areaServed: 'Sri Lanka' },
      keywords: ['Digital Agency', 'Web Development Services', 'E-Commerce Development', 'Business Systems', 'Custom Software Development', 'UI UX Design'],
    },
    contact: {
      ...BASE,
      path: '/contact',
      title: 'Contact Jawrah Pixel Sri Lanka',
      description: 'Submit your project brief or book a strategy consultation with Jawrah Pixel in Sri Lanka.',
    },
    agents: {
      ...BASE,
      path: '/partner',
      title: 'Become a Jawrah Pixel Partner | Sri Lanka',
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
      title: 'Pricing & Project Packages | Jawrah Pixel',
      description: 'Explore transparent pricing for premium websites, e-commerce platforms, business systems, and custom digital solutions tailored to your business goals.',
      keywords: ['Website Pricing', 'Web Development Packages', 'E-Commerce Pricing', 'Business System Pricing', 'Digital Agency Pricing'],
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
      title: 'Web Design Agency Pakistan | Jawrah Pixel',
      description: 'Premium web design, ecommerce development, SEO, branding and digital systems for ambitious businesses in Pakistan.',
      schemaType: 'Organization',
      keywords: ['web design agency Pakistan', 'ecommerce development Pakistan', 'SEO services Pakistan', 'Jawrah Pixel'],
    },
    services: {
      ...BASE,
      path: '/services',
      title: 'Digital Solutions & Services | Jawrah Pixel',
      description: 'Explore premium digital solutions including websites, e-commerce platforms, business systems, UI/UX design, and custom software development by Jawrah Pixel.',
      schemaType: 'Service',
      schemaData: { name: 'Premium Digital Services Pakistan', areaServed: 'Pakistan' },
      keywords: ['Digital Agency', 'Web Development Services', 'E-Commerce Development', 'Business Systems', 'Custom Software Development', 'UI UX Design'],
    },
    contact: {
      ...BASE,
      path: '/contact',
      title: 'Contact Jawrah Pixel Pakistan',
      description: 'Submit your project brief or book a strategy consultation with Jawrah Pixel in Pakistan.',
    },
    agents: {
      ...BASE,
      path: '/partner',
      title: 'Become a Jawrah Pixel Partner | Pakistan',
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
      title: 'Pricing & Project Packages | Jawrah Pixel',
      description: 'Explore transparent pricing for premium websites, e-commerce platforms, business systems, and custom digital solutions tailored to your business goals.',
      keywords: ['Website Pricing', 'Web Development Packages', 'E-Commerce Pricing', 'Business System Pricing', 'Digital Agency Pricing'],
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
      title: 'Premium Digital Agency for Global Brands | Jawrah Pixel',
      description: 'Luxury websites, SaaS platforms, ecommerce, and AI-ready digital systems for global brands.',
      schemaType: 'Organization',
      keywords: ['premium digital agency', 'international web design agency', 'global ecommerce development', 'Jawrah Pixel'],
    },
    services: {
      ...BASE,
      path: '/services',
      title: 'Digital Solutions & Services | Jawrah Pixel',
      description: 'Explore premium digital solutions including websites, e-commerce platforms, business systems, UI/UX design, and custom software development by Jawrah Pixel.',
      schemaType: 'Service',
      schemaData: { name: 'International Premium Digital Services', areaServed: 'Worldwide' },
      keywords: ['Digital Agency', 'Web Development Services', 'E-Commerce Development', 'Business Systems', 'Custom Software Development', 'UI UX Design'],
    },
    contact: {
      ...BASE,
      path: '/contact',
      title: 'Contact Jawrah Pixel International',
      description: 'Submit your global project brief or book a remote strategy consultation with Jawrah Pixel.',
    },
    agents: {
      ...BASE,
      path: '/partner',
      title: 'Become a Jawrah Pixel Partner | International',
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
      title: 'Pricing & Project Packages | Jawrah Pixel',
      description: 'Explore transparent pricing for premium websites, e-commerce platforms, business systems, and custom digital solutions tailored to your business goals.',
      keywords: ['Website Pricing', 'Web Development Packages', 'E-Commerce Pricing', 'Business System Pricing', 'Digital Agency Pricing'],
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
