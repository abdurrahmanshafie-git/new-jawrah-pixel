import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://www.jawrahpixel.com';
const LAST_MOD = new Date().toISOString().slice(0, 10);
const FORBIDDEN_HOST_PATTERN = /(?:localhost|127\.0\.0\.1|\.vercel\.app|\.netlify\.app)/i;
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SOURCE_DIR = path.join(process.cwd(), 'src');

function escapeXml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function absoluteUrl(pagePath) {
  if (/^https?:\/\//i.test(pagePath)) return pagePath;
  if (pagePath === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${pagePath.startsWith('/') ? pagePath : `/${pagePath}`}`;
}

function urlEntry(pagePath, priority = '0.80') {
  const loc = absoluteUrl(pagePath);
  if (FORBIDDEN_HOST_PATTERN.test(loc) || !loc.startsWith(`${SITE_URL}/`)) throw new Error(`Refusing to write invalid sitemap URL: ${loc}`);
  return ['  <url>', `    <loc>${escapeXml(loc)}</loc>`, `    <lastmod>${LAST_MOD}</lastmod>`, '  </url>'].join('\n');
}

function sitemapEntry(pagePath) {
  return ['  <sitemap>', `    <loc>${escapeXml(absoluteUrl(pagePath))}</loc>`, `    <lastmod>${LAST_MOD}</lastmod>`, '  </sitemap>'].join('\n');
}

function generateSitemapFile(filename, entries) {
  const uniqueEntries = [...new Map(entries.map((entry) => {
    const value = typeof entry === 'string' ? { path: entry } : entry;
    return [value.path, value];
  })).values()];
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...uniqueEntries.map((entry) => urlEntry(entry.path, entry.priority || '0.80')), '</urlset>', ''].join('\n');
  fs.writeFileSync(path.join(PUBLIC_DIR, filename), xml);
  console.log(`${filename} URL count: ${uniqueEntries.length}`);
}

function generateImageSitemap(entries) {
  const uniqueEntries = [...new Map(entries.map((entry) => [`${entry.page}|${entry.image}`, entry])).values()];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...uniqueEntries.map(({ page, image }) => ['  <url>', `    <loc>${escapeXml(absoluteUrl(page))}</loc>`, `    <image:image><image:loc>${escapeXml(absoluteUrl(image))}</image:loc></image:image>`, '  </url>'].join('\n')),
    '</urlset>',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-images.xml'), xml);
  console.log(`sitemap-images.xml image associations: ${uniqueEntries.length}`);
}

function generateSitemapIndex(sitemaps) {
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...sitemaps.map(sitemapEntry), '</sitemapindex>', ''].join('\n');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml);
}

// Read the project's source-of-truth content data so new fallback posts and
// portfolio entries are automatically included in sitemaps at build time.
function readBlogRecords() {
  const file = path.join(SOURCE_DIR, 'data', 'blogPosts.ts');
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split(/^  \{$/m).slice(1).map((part) => part.split(/^  \},?$/m)[0]).map((block) => ({
    slug: block.match(/^\s*slug:\s*['"]([^'"]+)['"]/m)?.[1],
    region: block.match(/^\s*region:\s*['"]([^'"]+)['"]/m)?.[1] || 'global',
    image: block.match(/^\s*featured_image:\s*['"]([^'"]+)['"]/m)?.[1],
  })).filter((record) => record.slug);
}

function listImageFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listImageFiles(fullPath);
    return /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(entry.name) ? [fullPath] : [];
  });
}

function readCaseStudyRecords() {
  const file = path.join(SOURCE_DIR, 'data', 'caseStudies.ts');
  if (!fs.existsSync(file)) return [];
  const parts = fs.readFileSync(file, 'utf8').split(/^  '([^']+)': \{$/m).slice(1);
  const records = [];
  for (let i = 0; i + 1 < parts.length; i += 2) {
    const key = parts[i];
    const block = parts[i + 1].split(/^  },?$/m)[0];
    const slug = block.match(/^\s*slug:\s*['"]([^'"]+)['"]/m)?.[1] || key;
    const region = block.match(/^\s*region:\s*['"]([^'"]+)['"]/m)?.[1] || 'global';
    const images = [
      block.match(/^\s*desktopImage:\s*['"]([^'"]+)['"]/m)?.[1],
      block.match(/^\s*mobileImage:\s*['"]([^'"]+)['"]/m)?.[1],
    ].filter((image) => image && image.startsWith('/assets/'));
    records.push({ slug, region, images });
  }
  return records;
}

const regions = ['lk', 'pk', 'int', 'uk'];
const corePages = [
  { path: '/', priority: '1.0' }, '/about', '/contact', '/process', '/partner',
  '/case-studies', '/leadership', '/blog', '/what-is-jawrah-pixel',
  '/why-jawrah-pixel', '/about-founder', '/services', '/pricing',
  '/services/web-development', '/services/software-development',
  '/services/ecommerce-development', '/services/mobile-app-development',
  '/services/seo', '/services/ui-ux', '/privacy-policy',
  '/terms-and-conditions', '/refund-policy', '/cookie-policy',
];
const regionalPaths = ['/lk', '/pk', '/int', '/uk'];
const regionalCoreSlugs = [
  'about', 'contact', 'process', 'partner', 'case-studies', 'leadership',
  'blog', 'what-is-jawrah-pixel', 'why-jawrah-pixel', 'about-founder',
  'privacy-policy', 'terms-and-conditions', 'refund-policy',
];
const regionalServiceSlugs = [
  'web-development', 'ecommerce-development', 'ui-ux-design', 'branding',
  'seo', 'mobile-app-development', 'digital-marketing', 'ai-solutions',
];
const regionalCorePages = regions.flatMap((region) => [
  `/${region}`,
  ...regionalCoreSlugs.map((slug) => `/${region}/${slug}`),
  `/${region}/services`,
  `/${region}/pricing`,
  ...regionalServiceSlugs.map((slug) => `/${region}/${slug}`),
  ...regionalServiceSlugs.map((slug) => `/${region}/services/${slug}`),
]);

const targetedSeoPages = [
  '/lk/digital-agency-sri-lanka',
  '/lk/web-development-sri-lanka',
  '/lk/ecommerce-development-sri-lanka',
  '/lk/services/web-design-sri-lanka',
  '/lk/services/seo-services-sri-lanka',
  '/lk/luxury-web-design-sri-lanka',
  '/lk/web-design-company-sri-lanka',
  '/lk/ecommerce-website-development-sri-lanka',
  '/lk/jewellery-website-design-sri-lanka',
  '/lk/custom-web-application-development-sri-lanka',
  '/pk/digital-agency-pakistan', '/pk/web-development-pakistan',
  '/pk/ecommerce-development-pakistan', '/pk/services/web-design-pakistan',
  '/int/web-development-agency', '/int/custom-software-development',
  '/uk/digital-agency-uk', '/uk/web-development-uk',
  '/uk/services/seo-services-uk', '/uk/services/monthly-maintenance-uk',
];

const blogRecords = readBlogRecords();
const blogPages = ['/blog', ...regions.map((region) => `/${region}/blog`)];
const blogImages = [];
for (const post of blogRecords) {
  for (const region of regions) {
    if (post.region === 'global' || post.region === region || region === 'int') {
      blogPages.push(`/${region}/blog/${post.slug}`);
      if (post.image?.startsWith('/assets/')) blogImages.push({ page: `/${region}/blog/${post.slug}`, image: post.image });
    }
  }
}

const caseRecords = readCaseStudyRecords();
const projectPages = ['/case-studies', ...regions.map((region) => `/${region}/case-studies`)];
const projectImages = [];
for (const project of caseRecords) {
  const matchingRegions = project.region === 'global' ? regions : [project.region];
  for (const region of matchingRegions) {
    projectPages.push(`/${region}/case-studies/${project.slug}`);
    for (const image of project.images) projectImages.push({ page: `/${region}/case-studies/${project.slug}`, image });
  }
  if (project.region === 'global') projectPages.push(`/case-studies/${project.slug}`);
}

generateSitemapFile('sitemap-pages.xml', [...corePages, ...regionalCorePages, ...regions.flatMap((region) => ['/privacy-policy', '/terms-and-conditions', '/refund-policy'].map((slug) => `/${region}${slug}`))]);
generateSitemapFile('sitemap-services.xml', [
  '/services', '/lk/services', '/pk/services', '/int/services', '/uk/services',
  ...regionalPaths.flatMap((region) => regionalServiceSlugs.map((slug) => `${region}/${slug}`)),
  ...targetedSeoPages,
]);
generateSitemapFile('sitemap-pricing.xml', ['/pricing', ...regions.map((region) => `/${region}/pricing`)]);
generateSitemapFile('sitemap-projects.xml', projectPages);
generateSitemapFile('sitemap-blog.xml', blogPages);
generateSitemapFile('sitemap-locations.xml', regions.map((region) => `/${region}`));
const projectSlugByAssetFolder = {
  'aero-vista': 'aerovista',
  'amirah jewellers': 'amirah-jewellery',
  'elite education': 'elite-education',
  'elite elegant': 'elite-elegant',
  'jawrah client portal': 'jawrah-pixel',
  'jawrah-pixel': 'jawrah-pixel',
  'kamal jewellers': 'kamal-jewellers',
  miorah: 'miorah',
  'meraki-motors': 'meraki-motors',
  rankala: 'rankala-gold',
  'shabnam-jewellers': 'shabnam-jewellers',
  'the famous': 'the-famous',
  velora: 'velora-estates',
  'zaza clothing': 'zaza-clothing',
  zenvor: 'zenvor',
};
const allPublicImageAssociations = [];
for (const file of listImageFiles(path.join(PUBLIC_DIR, 'assets'))) {
  const image = `/${path.relative(PUBLIC_DIR, file).split(path.sep).join('/')}`;
  const relativeAssetPath = path.relative(path.join(PUBLIC_DIR, 'assets'), file).split(path.sep).join('/');
  const caseStudyMatch = relativeAssetPath.match(/^case-studies\/([^/]+)\//i);
  if (caseStudyMatch) {
    const projectSlug = projectSlugByAssetFolder[caseStudyMatch[1].toLowerCase()];
    const project = caseRecords.find((record) => record.slug === projectSlug);
    if (project) {
      const projectRegions = project.region === 'global' ? regions : [project.region];
      for (const region of projectRegions) allPublicImageAssociations.push({ page: `/${region}/case-studies/${project.slug}`, image });
    }
    continue;
  }
  if (/^founder-image\./i.test(path.basename(file))) {
    allPublicImageAssociations.push({ page: '/lk/about-founder', image }, { page: '/int/about-founder', image });
  } else if (/^hero_bg\./i.test(path.basename(file))) {
    for (const region of regions) allPublicImageAssociations.push({ page: `/${region}`, image });
  } else if (/^(logo|logo-white|logo-navbar|logo-navbar-white)\./i.test(path.basename(file)) || relativeAssetPath.startsWith('optimized/')) {
    allPublicImageAssociations.push({ page: '/lk', image }, { page: '/', image });
  }
}

generateImageSitemap([
  ...blogImages,
  ...projectImages,
  ...allPublicImageAssociations,
]);
generateSitemapIndex([
  '/sitemap-pages.xml', '/sitemap-services.xml', '/sitemap-pricing.xml',
  '/sitemap-projects.xml', '/sitemap-blog.xml', '/sitemap-locations.xml',
  '/sitemap-images.xml',
]);
