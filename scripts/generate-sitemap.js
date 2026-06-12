import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://jawrahpixel.com';
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
  '/about',
  '/contact',
  '/process',
  '/partner',
  '/case-studies',
  '/leadership',
  '/blog',
  '/faq',
];
const regionalPaths = ['/lk', '/pk', '/int'];
const regionalCorePages = regionalPaths.flatMap((region) => [
  `${region}/`,
  `${region}/about`,
  `${region}/contact`,
  `${region}/process`,
  `${region}/partner`,
  `${region}/case-studies`,
  `${region}/leadership`,
  `${region}/blog`,
]);

// Services Sitemap
const servicesPages = [
  { path: '/services', priority: '0.9' },
  '/lk/services',
  '/pk/services',
  '/int/services',
];

const serviceSlugs = [
  'web-development',
  'ecommerce-development',
  'ui-ux-design',
  'branding',
  'seo',
  'mobile-app-development',
  'digital-marketing',
  'ai-solutions',
];

const regionalServicePages = regionalPaths.flatMap((region) =>
  serviceSlugs.map((slug) => `${region}/${slug}`),
);

const hiddenSeoLandingPages = [
  '/lk/web-development-sri-lanka',
  '/lk/ecommerce-development-sri-lanka',
  '/pk/web-development-pakistan',
  '/pk/ecommerce-development-pakistan',
  '/int/web-development-agency',
  '/int/custom-software-development',
];

// Pricing Sitemap
const pricingPages = [
  { path: '/pricing', priority: '0.9' },
  '/lk/pricing',
  '/pk/pricing',
  '/int/pricing',
];

// Projects Sitemap (placeholder for future)
const caseStudyPages = [
  '/case-studies/zenvor',
  '/case-studies/shabnam-jewellers',
  '/case-studies/aerovista',
  '/case-studies/veloura-cafe',
  ...regionalPaths.flatMap((region) => [
    `${region}/case-studies/zenvor`,
    `${region}/case-studies/shabnam-jewellers`,
    `${region}/case-studies/aerovista`,
    `${region}/case-studies/veloura-cafe`,
  ]),
];

// Legal Pages
const legalPages = [
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
  '/cookie-policy',
  ...regionalPaths.flatMap((region) => [
    `${region}/privacy-policy`,
    `${region}/terms-and-conditions`,
    `${region}/refund-policy`,
  ]),
];

// Generate all sitemaps
generateSitemapFile('sitemap-pages.xml', [...corePages, ...regionalCorePages, ...legalPages]);
generateSitemapFile('sitemap-services.xml', [...servicesPages, ...regionalServicePages, ...hiddenSeoLandingPages]);
generateSitemapFile('sitemap-pricing.xml', pricingPages);
generateSitemapFile('sitemap-projects.xml', caseStudyPages);
// Placeholder sitemaps for future expansion
generateSitemapFile('sitemap-blog.xml', ['/blog', ...regionalPaths.map((r) => `${r}/blog`)]);
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
