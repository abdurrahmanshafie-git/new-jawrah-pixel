import { appEnv, toAbsoluteUrl } from '@/lib/env';
import type { RegionCode } from '@/types';

export type JsonLdNode = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  url: string;
}

const regionNames: Record<RegionCode, string> = {
  lk: 'Sri Lanka',
  pk: 'Pakistan',
  int: 'International',
};

const regionLanguage: Record<RegionCode, string> = {
  lk: 'en-LK',
  pk: 'en-PK',
  int: 'en',
};

const regionCountry: Record<RegionCode, string> = {
  lk: 'LK',
  pk: 'PK',
  int: '001',
};

export function getRegionLanguage(region?: RegionCode) {
  return region ? regionLanguage[region] : 'en';
}

export function buildOrganizationSchema(): JsonLdNode {
  return {
        '@type': 'Organization',
    '@id': `${appEnv.siteUrl}/#organization`,
    name: 'Jawrah Pixel',
    legalName: 'Jawrah Pixel',
    alternateName: ['JawrahPixel', 'jawrahpixel', 'Jawrah'],
    url: appEnv.siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: toAbsoluteUrl('/assets/logo.png'),
      width: 512,
      height: 512,
    },
    image: toAbsoluteUrl('/assets/logo.png'),
    email: appEnv.contactEmail,
    telephone: appEnv.contactWhatsapp,
    founder: {
      '@type': 'Person',
      '@id': `${appEnv.siteUrl}/#founder`,
      name: 'Abdurrahman Shafie',
      jobTitle: 'Founder & Creative Director',
      worksFor: { '@id': `${appEnv.siteUrl}/#organization` },
      sameAs: 'https://www.linkedin.com/in/abdurrahman-shafie-5a16923a3/',
    },
    sameAs: [
      'https://www.instagram.com/jawrahpixel',
    ],
    areaServed: ['Sri Lanka', 'Pakistan', 'Worldwide'],
    knowsAbout: [
      'Web Design',
      'Ecommerce Development',
      'Technical SEO',
      'Branding',
      'React Development',
      'Supabase Systems',
      'Conversion Optimization',
      'Software Development',
      'SaaS Development',
      'UI/UX Design',
    ],
    description:
      'Jawrah Pixel is a digital agency providing web development, web design, UI/UX design, SEO, ecommerce, branding, AI solutions, custom web applications, digital products, and client portals across Sri Lanka, Pakistan, and international markets.',
  };
}

export function buildWebsiteSchema(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': `${appEnv.siteUrl}/#website`,
    url: appEnv.siteUrl,
    name: 'Jawrah Pixel',
    alternateName: ['JawrahPixel', 'Jawrah'],
    inLanguage: ['en-LK', 'en-PK', 'en'],
    publisher: {
      '@id': `${appEnv.siteUrl}/#organization`,
    },
  };
}

export function buildLocalBusinessSchema(region: RegionCode): JsonLdNode {
  const area = regionNames[region];

  return {
    '@type': 'LocalBusiness',
    '@id': `${appEnv.siteUrl}/${region}#local-business`,
    name: `Jawrah Pixel ${area}`,
    alternateName: ['JawrahPixel', 'Jawrah'],
    url: `${appEnv.siteUrl}/${region}`,
    image: toAbsoluteUrl('/assets/logo.png'),
    logo: toAbsoluteUrl('/assets/logo.png'),
    email: appEnv.contactEmail,
    telephone: appEnv.contactWhatsapp,
    priceRange: '$$',
    parentOrganization: {
      '@id': `${appEnv.siteUrl}/#organization`,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: regionCountry[region],
    },
    areaServed: area,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFAQSchema(faqs: Array<{ q: string; a: string }>): JsonLdNode {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function buildServiceSchema({
  name,
  description,
  url,
  region,
  serviceType,
}: {
  name: string;
  description: string;
  url: string;
  region: RegionCode;
  serviceType?: string | string[];
}): JsonLdNode {
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    description,
    serviceType: serviceType ?? name,
    provider: {
      '@id': `${appEnv.siteUrl}/#organization`,
    },
    areaServed: regionNames[region],
    url,
  };
}

export function buildArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  url,
}: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
}): JsonLdNode {
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline,
    description,
    image: [toAbsoluteUrl(image)],
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@id': `${appEnv.siteUrl}/#organization`,
    },
    mainEntityOfPage: url,
  };
}

export function buildCaseStudySchema({
  title,
  description,
  url,
  client,
  industry,
  image,
}: {
  title: string;
  description: string;
  url: string;
  client: string;
  industry: string;
  image?: string;
}): JsonLdNode {
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#case-study`,
    name: title,
    headline: title,
    description,
    about: industry,
    image: image ? toAbsoluteUrl(image) : toAbsoluteUrl('/assets/logo.png'),
    creator: {
      '@id': `${appEnv.siteUrl}/#organization`,
    },
    client: {
      '@type': 'Organization',
      name: client,
    },
    mainEntityOfPage: url,
  };
}
