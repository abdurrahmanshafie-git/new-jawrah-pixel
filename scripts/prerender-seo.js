/**
 * Build-time SEO snapshots for public marketing routes.
 * Provides useful, path-specific HTML to non-JavaScript crawlers while React
 * continues to own the interactive experience when JS becomes available.
 * Never snapshots dashboards, authentication, checkout or personalized content.
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const file = path.join(dist, 'index.html');
const original = fs.readFileSync(file, 'utf8');
const origin = 'https://www.jawrahpixel.com';
const regions = {
  lk: { country: 'Sri Lanka', label: 'Sri Lanka' },
  pk: { country: 'Pakistan', label: 'Pakistan' },
  int: { country: 'international businesses', label: 'International' },
  uk: { country: 'the UK', label: 'United Kingdom' }
};
const pages = {
  '': {
    heading: 'Jawrah Pixel — Web Design & Digital Solutions',
    title: 'Jawrah Pixel | Web Design & Digital Solutions Sri Lanka',
    description: 'Jawrah Pixel creates premium websites, ecommerce stores and custom web applications with technical SEO for businesses in Sri Lanka and worldwide.',
    intro: 'Jawrah Pixel is a digital agency designing and developing business websites, ecommerce storefronts, user experiences and custom software.',
    links: ['/lk', '/pk', '/int', '/uk', '/lk/services', '/lk/contact']
  },
  about: { heading: 'About Jawrah Pixel', title: 'About Jawrah Pixel | Digital Agency', description: 'Meet Jawrah Pixel, a web design and development agency building websites, ecommerce experiences, and custom software.', intro: 'Learn about our approach to premium digital design, engineering and long-term client partnerships.' },
  services: { heading: 'Web Design, SEO & Digital Services', title: 'Web Design, Ecommerce & SEO Services | Jawrah Pixel', description: 'Explore web design, ecommerce development, UI/UX, technical SEO, and custom software services from Jawrah Pixel.', intro: 'We design and build business websites, ecommerce platforms, custom web applications, and high-performance digital experiences.' },
  blog: { heading: 'Jawrah Pixel Insights & News', title: 'Web Design, Ecommerce & SEO Insights | Jawrah Pixel', description: 'Explore Jawrah Pixel insights about web design, SEO, ecommerce, UI/UX, and digital engineering for ambitious brands.', intro: 'Read our insights on digital design, ecommerce, technical SEO and modern web technology.' },
  contact: { heading: 'Contact Jawrah Pixel', title: 'Contact Jawrah Pixel | Start Your Project', description: 'Contact Jawrah Pixel about a website, ecommerce store, SEO project, digital branding, or custom software solution.', intro: 'Tell our team about your business and the website, ecommerce or software project you want to build.' },
  pricing: { heading: 'Website Design & Development Pricing', title: 'Web Design & Development Pricing | Jawrah Pixel', description: 'Learn about Jawrah Pixel web design, ecommerce development and custom digital project pricing and consultation options.', intro: 'Explore project engagement options for premium websites, ecommerce, UI/UX, and custom development.' },
  'case-studies': { heading: 'Jawrah Pixel Portfolio & Case Studies', title: 'Web Design Portfolio & Case Studies | Jawrah Pixel', description: 'Explore Jawrah Pixel portfolio projects and case studies across web design, ecommerce and digital product development.', intro: 'See selected projects demonstrating our approach to business websites, digital products and ecommerce solutions.' }
};
const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const setTag = (html, re, replacement) => re.test(html) ? html.replace(re, replacement) : html.replace('</head>', replacement + '\n</head>');
function render(pathname, page, region) {
  const url = origin + (pathname || '/');
  const country = region ? regions[region].country : null;
  const title = country ? page.title.replace(' | Jawrah Pixel', ' in ' + country + ' | Jawrah Pixel') : page.title;
  const heading = country ? page.heading + ' — ' + regions[region].label : page.heading;
  const description = country ? page.description.replace(/\.$/, '') + ' Serving ' + country + '.' : page.description;
  const prefix = region ? '/' + region : '/lk';
  const links = page.links || [prefix, prefix + '/services', prefix + '/case-studies', prefix + '/blog', prefix + '/contact'];
  const nav = links.map(link => '<a href="' + esc(link) + '">' + esc(link === prefix ? 'Home' : link.split('/').pop().replace(/-/g,' ')) + '</a>').join(' ');
  const content = '<main id="seo-pre-rendered-content" style="max-width:1100px;margin:0 auto;padding:8rem 1.5rem;color:inherit;font:16px/1.7 system-ui,sans-serif"><h1>' + esc(heading) + '</h1><p>' + esc(page.intro) + '</p><p>' + esc(description) + '</p><nav aria-label="Explore Jawrah Pixel">' + nav + '</nav></main>';
  let html = original;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, '<title>' + esc(title) + '</title>');
  html = setTag(html, /<meta name="description"[^>]*>/, '<meta name="description" content="' + esc(description) + '" />');
  html = setTag(html, /<link rel="canonical"[^>]*>/, '<link rel="canonical" href="' + esc(url) + '" />');
  html = setTag(html, /<meta property="og:url"[^>]*>/, '<meta property="og:url" content="' + esc(url) + '" />');
  html = setTag(html, /<meta property="og:title"[^>]*>/, '<meta property="og:title" content="' + esc(title) + '" />');
  html = setTag(html, /<meta property="og:description"[^>]*>/, '<meta property="og:description" content="' + esc(description) + '" />');
  html = setTag(html, /<meta name="twitter:title"[^>]*>/, '<meta name="twitter:title" content="' + esc(title) + '" />');
  html = setTag(html, /<meta name="twitter:description"[^>]*>/, '<meta name="twitter:description" content="' + esc(description) + '" />');
  html = html.replace(/(<div id="root">)/, '$1\n' + content);
  html = html.replace('</head>', '<noscript><style>#initial-splash{display:none!important}</style></noscript>\n</head>');
  return html;
}
// '/' is a country selector; provide meaningful brand and regional links.
fs.writeFileSync(file, render('', pages[''], null));
for (const [slug, page] of Object.entries(pages)) {
  if (!slug) continue;
  // Vercel cleanUrls resolves /blog to /blog.html without redirecting to /blog/.
  fs.writeFileSync(path.join(dist, slug + '.html'), render('/' + slug, page, null));
}
for (const region of Object.keys(regions)) {
  fs.writeFileSync(path.join(dist, region + '.html'), render('/' + region, pages[''], region));
  for (const [slug, page] of Object.entries(pages)) {
    if (!slug) continue;
    fs.mkdirSync(path.join(dist, region), {recursive:true});
    fs.writeFileSync(path.join(dist, region, slug + '.html'), render('/' + region + '/' + slug, page, region));
  }
}
console.log('Generated build-time SEO HTML for public marketing routes.');
