import fs from 'fs';
import path from 'path';

// This script generates the sitemap.xml automatically based on the application routes and data
// Run with: node scripts/generate-sitemap.js

const SITE_URL = 'https://jawrahpixel.com';
const LAST_MOD = '2026-06-01';

// Import case studies data (mocking the data structure since we're in a node environment)
// In a real build step, we'd import the actual TS file or use a dynamic approach
const CASE_STUDIES = [
  { slug: 'zenvor', regions: ['lk'] },
  { slug: 'jawrah-pixel', regions: ['lk'] },
  { slug: 'velora-estates', regions: ['lk'] },
  { slug: 'shabnam-jewellers', regions: ['pk'] },
  { slug: 'aerovista', regions: ['int'] },
  { slug: 'veloura-cafe', regions: ['int'] }
];

const REGIONS = ['lk', 'pk', 'int'];
const STATIC_PAGES = [
  { path: '', priority: 1.0, changefreq: 'monthly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/services', priority: 0.85, changefreq: 'monthly' },
  { path: '/process', priority: 0.75, changefreq: 'monthly' },
  { path: '/case-studies', priority: 0.9, changefreq: 'weekly' },
  { path: '/blog', priority: 0.8, changefreq: 'weekly' },
  { path: '/contact', priority: 0.9, changefreq: 'monthly' },
  { path: '/what-is-jawrah-pixel', priority: 0.7, changefreq: 'monthly' },
  { path: '/why-jawrah-pixel', priority: 0.7, changefreq: 'monthly' },
  { path: '/about-founder', priority: 0.7, changefreq: 'monthly' }
];

const LEGAL_PAGES = [
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms-and-conditions', priority: 0.3, changefreq: 'yearly' },
  { path: '/refund-policy', priority: 0.3, changefreq: 'yearly' }
];

function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Root
  xml += `  <url><loc>${SITE_URL}/</loc><lastmod>${LAST_MOD}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>\n`;

  // Regional Pages
  REGIONS.forEach(region => {
    xml += `\n  <!-- ${region.toUpperCase()} REGION -->\n`;
    
    // Region Root
    xml += `  <url><loc>${SITE_URL}/${region}</loc><lastmod>${LAST_MOD}</lastmod><changefreq>weekly</changefreq><priority>0.95</priority></url>\n`;

    // Regional Static Pages
    STATIC_PAGES.filter(p => p.path !== '').forEach(page => {
      xml += `  <url><loc>${SITE_URL}/${region}${page.path}</loc><lastmod>${LAST_MOD}</lastmod><changefreq>${page.changefreq}</changefreq><priority>${page.priority}</priority></url>\n`;
    });

    // Regional Case Studies
    CASE_STUDIES.filter(cs => cs.regions.includes(region) || region === 'int').forEach(cs => {
      xml += `  <url><loc>${SITE_URL}/${region}/case-studies/${cs.slug}</loc><lastmod>${LAST_MOD}</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>\n`;
    });
  });

  // Global Legal Pages
  xml += '\n  <!-- LEGAL -->\n';
  LEGAL_PAGES.forEach(page => {
    xml += `  <url><loc>${SITE_URL}${page.path}</loc><lastmod>${LAST_MOD}</lastmod><changefreq>${page.changefreq}</changefreq><priority>${page.priority}</priority></url>\n`;
  });

  xml += '</urlset>';

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`Sitemap generated successfully at ${outputPath}`);
}

generateSitemap();
