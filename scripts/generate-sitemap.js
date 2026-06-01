import fs from 'fs';
import path from 'path';

const SITE_URL = (process.env.VITE_APP_URL || process.env.VITE_SITE_URL || 'https://jawrahpixel.com').replace(/\/$/, '');
const LAST_MOD = new Date().toISOString().slice(0, 10);

const REGIONS = ['lk', 'pk', 'int'];
const HREFLANG = {
  lk: 'en-LK',
  pk: 'en-PK',
  int: 'en',
};

const TOP_LEVEL_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/about', priority: '0.70', changefreq: 'monthly' },
  { path: '/services', priority: '0.75', changefreq: 'weekly' },
  { path: '/contact', priority: '0.80', changefreq: 'monthly' },
  { path: '/partner', priority: '0.55', changefreq: 'monthly' },
  { path: '/process', priority: '0.65', changefreq: 'monthly' },
  { path: '/case-studies', priority: '0.70', changefreq: 'weekly' },
  { path: '/pricing', priority: '0.65', changefreq: 'monthly' },
  { path: '/auth/login', priority: '0.25', changefreq: 'yearly' },
  { path: '/auth/signup', priority: '0.35', changefreq: 'yearly' },
];

const REGIONAL_PAGES = [
  { path: '', priority: '0.95', changefreq: 'weekly' },
  { path: '/about', priority: '0.80', changefreq: 'monthly' },
  { path: '/services', priority: '0.90', changefreq: 'weekly' },
  { path: '/contact', priority: '0.85', changefreq: 'monthly' },
  { path: '/partner', priority: '0.65', changefreq: 'monthly' },
  { path: '/process', priority: '0.75', changefreq: 'monthly' },
  { path: '/case-studies', priority: '0.85', changefreq: 'weekly' },
  { path: '/pricing', priority: '0.80', changefreq: 'monthly' },
  { path: '/blog', priority: '0.78', changefreq: 'weekly' },
  { path: '/what-is-jawrah-pixel', priority: '0.62', changefreq: 'monthly' },
  { path: '/why-jawrah-pixel', priority: '0.62', changefreq: 'monthly' },
  { path: '/about-founder', priority: '0.58', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.30', changefreq: 'yearly' },
  { path: '/terms-and-conditions', priority: '0.30', changefreq: 'yearly' },
  { path: '/refund-policy', priority: '0.30', changefreq: 'yearly' },
];

const SERVICE_PAGES = [
  {
    group: 'web-design',
    priority: '0.92',
    changefreq: 'monthly',
    routes: {
      lk: '/lk/services/web-design-sri-lanka',
      pk: '/pk/services/web-design-pakistan',
      int: '/int/services/international-digital-services',
    },
  },
  {
    group: 'ecommerce',
    priority: '0.92',
    changefreq: 'monthly',
    routes: {
      lk: '/lk/services/ecommerce-development-sri-lanka',
      pk: '/pk/services/ecommerce-development-pakistan',
      int: '/int/services/international-digital-services',
    },
  },
  {
    group: 'seo-lk',
    priority: '0.88',
    changefreq: 'monthly',
    routes: {
      lk: '/lk/services/seo-services-sri-lanka',
    },
  },
];

const CASE_STUDY_SLUGS = ['zenvor', 'jawrah-pixel', 'velora-estates', 'shabnam-jewellers', 'aerovista-travels'];
const BLOG_SLUGS = [
  'seo-architecture-for-premium-websites',
  'regional-seo-for-sri-lanka-pakistan-global',
  'core-web-vitals-for-agency-sites',
];

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function absolute(pathname) {
  if (pathname === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${pathname}`;
}

function regionalAlternates(suffix) {
  const cleanSuffix = suffix === '/' ? '' : suffix;
  return [
    ...REGIONS.map((region) => ({
      hrefLang: HREFLANG[region],
      href: absolute(`/${region}${cleanSuffix}`),
    })),
    {
      hrefLang: 'x-default',
      href: cleanSuffix ? absolute(`/int${cleanSuffix}`) : absolute('/'),
    },
  ];
}

function urlEntry({ loc, priority, changefreq, alternates = [] }) {
  const alternateXml = alternates
    .map(
      (alternate) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hrefLang)}" href="${escapeXml(alternate.href)}" />`,
    )
    .join('\n');

  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${LAST_MOD}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    alternateXml,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

function generateEntries() {
  const entries = [];
  const seenLocs = new Set();
  const addEntry = (entry) => {
    if (seenLocs.has(entry.loc)) return;
    seenLocs.add(entry.loc);
    entries.push(urlEntry(entry));
  };

  TOP_LEVEL_PAGES.forEach((page) => {
    addEntry({
      loc: absolute(page.path),
      priority: page.priority,
      changefreq: page.changefreq,
    });
  });

  REGIONAL_PAGES.forEach((page) => {
    const suffix = page.path || '/';
    REGIONS.forEach((region) => {
      addEntry({
        loc: absolute(`/${region}${page.path}`),
        priority: page.priority,
        changefreq: page.changefreq,
        alternates: regionalAlternates(suffix),
      });
    });
  });

  SERVICE_PAGES.forEach((service) => {
    Object.entries(service.routes).forEach(([, route]) => {
      const alternates = Object.entries(service.routes).map(([region, href]) => ({
        hrefLang: HREFLANG[region],
        href: absolute(href),
      }));
      addEntry({
        loc: absolute(route),
        priority: service.priority,
        changefreq: service.changefreq,
        alternates: [
          ...alternates,
          { hrefLang: 'x-default', href: absolute(service.routes.int || service.routes.lk) },
        ],
      });
    });
  });

  REGIONS.forEach((region) => {
    CASE_STUDY_SLUGS.forEach((slug) => {
      addEntry({
        loc: absolute(`/${region}/case-studies/${slug}`),
        priority: '0.74',
        changefreq: 'monthly',
      });
    });

    BLOG_SLUGS.forEach((slug) => {
      addEntry({
        loc: absolute(`/${region}/blog/${slug}`),
        priority: '0.68',
        changefreq: 'monthly',
      });
    });
  });

  return entries;
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...generateEntries(),
  '</urlset>',
  '',
].join('\n');

const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml);
console.log(`Sitemap generated at ${outputPath}`);
