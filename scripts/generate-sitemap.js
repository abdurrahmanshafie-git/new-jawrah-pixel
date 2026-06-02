import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://jawrahpixel.com';
const LAST_MOD = new Date().toISOString().slice(0, 10);
const FORBIDDEN_HOST_PATTERN = /(?:localhost|127\.0\.0\.1|\.vercel\.app|\.netlify\.app)/i;

const corePaths = [
  '/',
  '/about',
  '/services',
  '/pricing',
  '/process',
  '/contact',
  '/book',
  '/partner',
  '/case-studies',
  '/blog',
  '/faq',
];

const regionalPaths = ['/lk', '/pk', '/int'];

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

const regionalServicePaths = regionalPaths.flatMap((region) =>
  serviceSlugs.map((slug) => `${region}/${slug}`),
);

const hiddenSeoLandingPaths = [
  '/lk/web-development-sri-lanka',
  '/lk/ecommerce-development-sri-lanka',
  '/pk/web-development-pakistan',
  '/pk/ecommerce-development-pakistan',
  '/int/web-development-agency',
  '/int/custom-software-development',
];

const caseStudyPaths = [
  '/case-studies/zenvor',
  '/case-studies/shabnam-jewellers',
  '/case-studies/aerovista',
  '/case-studies/veloura-cafe',
];

const legalPaths = [
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
  '/cookie-policy',
];

const authPaths = ['/auth/login', '/auth/signup'];

const PUBLIC_PATHS = [
  ...corePaths,
  ...regionalPaths,
  ...regionalServicePaths,
  ...hiddenSeoLandingPaths,
  ...caseStudyPaths,
  ...legalPaths,
  ...authPaths,
];

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

function urlEntry(pagePath) {
  const loc = absoluteUrl(pagePath);
  if (FORBIDDEN_HOST_PATTERN.test(loc) || !loc.startsWith(`${SITE_URL}/`)) {
    throw new Error(`Refusing to write invalid sitemap URL: ${loc}`);
  }

  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${LAST_MOD}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.80</priority>',
    '  </url>',
  ].join('\n');
}

const uniquePaths = [...new Set(PUBLIC_PATHS)];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniquePaths.map(urlEntry),
  '</urlset>',
  '',
].join('\n');

const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml);
console.log(`Sitemap generated at ${outputPath}`);
console.log(`Sitemap URL count: ${uniquePaths.length}`);
