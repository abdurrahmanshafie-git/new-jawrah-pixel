import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://www.jawrahpixel.com';
const LAST_MOD = new Date().toISOString().slice(0, 10);
const FORBIDDEN_HOST_PATTERN = /(?:localhost|127\.0\.0\.1|\.vercel\.app|\.netlify\.app)/i;

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function absoluteUrl(pagePath) {
  if (pagePath === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${pagePath}`;
}

function urlEntry(pagePath, priority = '0.80') {
  const loc = absoluteUrl(pagePath);
  if (FORBIDDEN_HOST_PATTERN.test(loc) || !loc.startsWith(`${SITE_URL}/`)) {
    throw new Error(`Refusing to write invalid sitemap URL: ${loc}`);
  }

  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${LAST_MOD}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

function sitemapEntry(pagePath) {
  const loc = absoluteUrl(pagePath);
  return [
    '  <sitemap>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${LAST_MOD}</lastmod>`,
    '  </sitemap>',
  ].join('\n');
}

function generateSitemapFile(filename, paths, defaultPriority = '0.80') {
  const uniquePaths = [...new Set(paths)];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...uniquePaths.map((p) => urlEntry(p.path || p, p.priority || defaultPriority)),
    '</urlset>',
    '',
  ].join('\n');

  const outputPath = path.join(process.cwd(), 'public', filename);
  fs.writeFileSync(outputPath, xml);
  console.log(`${filename} generated at ${outputPath}`);
  console.log(`${filename} URL count: ${uniquePaths.length}`);
}

function generateSitemapIndex(sitemaps) {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemaps.map(sitemapEntry),
    '</sitemapindex>',
    '',
  ].join('\n');

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`Master sitemap index generated at ${outputPath}`);
}

// Pages Sitemap
const corePages = [
  { path: '/', priority: '1.0' },
  '/insights',
];
const regionalPaths = ['/lk', '/pk', '/int', '/uk'];
const regionalCorePages = regionalPaths.flatMap((region) => [
  `${region}/`,
  `${region}/about`,
  `${region}/services`,
  `${region}/contact`,
  `${region}/process`,
  `${region}/partner`,
  `${region}/case-studies`,
  `${region}/leadership`,
  `${region}/blog`,
  `${region}/what-is-jawrah-pixel`,
  `${region}/why-jawrah-pixel`,
  `${region}/about-founder`,
  `${region}/pricing`,
  `${region}/privacy-policy`,
  `${region}/terms-and-conditions`,
  `${region}/refund-policy`,
]);

const insightSlugs = [
  'seo-architecture-for-premium-websites',
  'regional-seo-for-sri-lanka-pakistan-global',
  'core-web-vitals-for-agency-sites',
];

// Services Sitemap
const serviceSlugs = [
  'web-development',
  'software-development',
  'ecommerce-development',
  'mobile-app-development',
  'seo',
  'ui-ux',
];

const regionalServicePages = regionalPaths.flatMap((region) =>
  serviceSlugs.map((slug) => ({ path: `${region}/services/${slug}`, priority: '0.85' })),
);

// Pricing Sitemap
const pricingPages = regionalPaths.map((region) => ({ path: `${region}/pricing`, priority: '0.85' }));

// Projects Sitemap
const caseStudySlugs = [
  'zenvor',
  'jawrah-pixel',
  'aerovista',
  'velora-estates',
  'shabnam-jewellers',
  'aerovista-travels',
  'the-famous',
  'amirah-jewellery',
  'kamal-jewellers',
  'elite-education',
  'elite-elegant',
  'miorah',
  'zaza-clothing',
];
const caseStudyPages = [
  ...caseStudySlugs.map((slug) => `/case-studies/${slug}`),
  ...regionalPaths.flatMap((region) => caseStudySlugs.map((slug) => `${region}/case-studies/${slug}`)),
];

// Generate all sitemaps
generateSitemapFile('sitemap-pages.xml', [...corePages, ...regionalCorePages]);
generateSitemapFile('sitemap-services.xml', regionalServicePages);
generateSitemapFile('sitemap-pricing.xml', pricingPages);
generateSitemapFile('sitemap-projects.xml', caseStudyPages);
// Placeholder sitemaps for future expansion
generateSitemapFile('sitemap-blog.xml', [
  ...regionalPaths.flatMap((region) => [
    `${region}/blog`,
    ...insightSlugs.map((slug) => `${region}/blog/${slug}`),
  ]),
]);
generateSitemapFile('sitemap-locations.xml', regionalPaths);

// Generate master sitemap index
generateSitemapIndex([
  '/sitemap-pages.xml',
  '/sitemap-services.xml',
  '/sitemap-pricing.xml',
  '/sitemap-projects.xml',
  '/sitemap-blog.xml',
  '/sitemap-locations.xml',
]);
