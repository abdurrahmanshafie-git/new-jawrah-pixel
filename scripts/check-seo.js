import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const host = 'https://www.jawrahpixel.com';
const files = ['sitemap.xml','sitemap-pages.xml','sitemap-services.xml','sitemap-pricing.xml','sitemap-projects.xml','sitemap-blog.xml','sitemap-locations.xml','sitemap-images.xml'];
const errors = [];
const urls = new Set();
for (const file of files) {
  const filepath = path.join(root, file);
  if (!fs.existsSync(filepath)) { errors.push('Missing ' + file); continue; }
  const xml = fs.readFileSync(filepath, 'utf8');
  const fileUrls = new Set();
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = match[1].replaceAll('&amp;', '&');
    if (!url.startsWith(host + '/')) errors.push(file + ': noncanonical URL ' + url);
    if (file !== 'sitemap.xml' && file !== 'sitemap-images.xml') {
      if (fileUrls.has(url)) errors.push('Duplicate URL within ' + file + ': ' + url);
      fileUrls.add(url);
      urls.add(url);
    }
  }
}
const robots = fs.readFileSync(path.join(root,'robots.txt'),'utf8');
for (const file of files) if (!robots.includes('Sitemap: ' + host + '/' + file)) errors.push('robots missing ' + file);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('SEO sitemap checks passed: ' + urls.size + ' unique page URLs');
