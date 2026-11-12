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
  const titlesByRegion = {
    lk: 'Digital Insights Sri Lanka | Jawrah Pixel',
    pk: 'Digital Insights Pakistan | Jawrah Pixel',
    int: 'Web Design & SEO Insights | Jawrah Pixel',
    uk: 'Digital Insights UK | Jawrah Pixel'
  };
  const title = region && pathname.endsWith('/blog') ? titlesByRegion[region]
    : region && !pathname.slice(1).includes('/') ? 'Web Design ' + regions[region].label + ' | Jawrah Pixel'
    : page.title;
  const heading = country ? page.heading + ' — ' + regions[region].label : page.heading;
  const description = country ? page.description.replace(/\.$/, '') + (region === 'int' ? '. For international clients.' : '. Serving ' + country + '.') : page.description;
  const prefix = region ? '/' + region : '/lk';
  const links = page.links || [prefix, prefix + '/services', prefix + '/case-studies', prefix + '/blog', prefix + '/contact'];
  const nav = links.map(link => '<a href="' + esc(link) + '">' + esc(link === prefix ? 'Home' : link.split('/').pop().replace(/-/g,' ')) + '</a>').join(' ');
  const editorial = {
    '': [
      ['Web design and development', 'Jawrah Pixel plans, designs and builds responsive websites for businesses that need clear messaging, fast loading experiences and dependable navigation. Every project starts with the needs of its customers, the content they are looking for and the actions they should be able to take.'],
      ['Ecommerce and digital products', 'Our work covers ecommerce storefronts, jewellery and luxury retail experiences, interactive user interfaces and custom web applications. The goal is to help businesses present their products clearly, guide visitors through their services and support useful customer journeys.'],
      ['Search and performance', 'We approach technical SEO alongside design and development. Important pages need descriptive titles, clear headings, useful internal links, accessible content and consistent canonical URLs. We also pay attention to mobile performance, accessibility, structured information and maintainability.'],
      ['Explore the right regional website', 'Choose a regional site to explore services, work, pricing, insights and ways to contact Jawrah Pixel. Our website includes dedicated information for Sri Lanka, Pakistan, the United Kingdom and international clients.']
    ],
    about: [
      ['What we do', 'Jawrah Pixel combines creative website design, front-end development, ecommerce implementation and technical SEO. Our work focuses on useful customer experiences rather than visual decoration alone.'],
      ['How we approach projects', 'We begin by understanding the audience, the business goals and the information visitors need. Design, page structure, mobile usability and content clarity inform each implementation decision.'],
      ['Long-term thinking', 'Business websites need room to evolve. We consider maintainable interfaces, navigation, accessibility, performance and clear ownership of content when building for continued growth.']
    ],
    services: [
      ['Websites and ecommerce', 'We develop responsive business websites, service landing pages, product catalogues and ecommerce storefronts. Good navigation, helpful product detail and clear calls to action make the experience easier to use.'],
      ['UI/UX and custom applications', 'Our design and development work includes interfaces for tailored business software, dashboards and digital products. We focus on structure, usability, readable content and predictable interactions.'],
      ['SEO and performance', 'Technical search optimization includes crawlable page content, descriptive metadata, canonical control, internal linking, structured data where appropriate and mobile performance checks.'],
      ['Project discovery', 'Contact Jawrah Pixel with your goals, intended audience, required functionality and preferred launch scope to discuss a suitable project direction.']
    ],
    blog: [
      ['Web design and interface thinking', 'Our insights explore the decisions behind effective websites: useful page structure, mobile-friendly layouts, clear copy, accessible navigation and interactions that help visitors understand a business.'],
      ['Technical SEO and performance', 'Topics include page titles, structured data, canonical URLs, search crawlability, page speed, image optimization and how modern front-end technology affects visibility in search engines.'],
      ['Ecommerce and digital products', 'We discuss ecommerce experiences, product presentation, conversion journeys, custom web applications and the challenges that come with building polished digital products.'],
      ['Practical context', 'These articles are written to help business owners and digital teams better understand design and development choices. Explore the latest posts on this page when the interactive website loads.']
    ],
    contact: [
      ['Discuss a new website', 'Share what your organization does, who your customers are, and what you want visitors to accomplish. Helpful details include your existing website, required pages and the features that matter most.'],
      ['Ecommerce and software enquiries', 'For an online shop, describe your product range, ordering needs and preferred workflows. For custom software, outline the users, tasks and integrations you need to support.'],
      ['SEO and website improvements', 'For an existing site, tell us the problems you want to solve, such as slow pages, unclear navigation, inconsistent metadata or difficulties with search visibility.']
    ],
    pricing: [
      ['What affects project scope', 'Website and software budgets depend on page count, visual design needs, content preparation, ecommerce functionality, integrations, administration tools, testing and long-term support.'],
      ['Start with your requirements', 'A focused landing page is different from a full ecommerce storefront or a complex web application. Clear goals and a list of essential features help determine an appropriate approach.'],
      ['Review services and contact us', 'Explore the service pages for more context, then explain the scope of your project to request a tailored discussion.']
    ],
    'case-studies': [
      ['What our work demonstrates', 'Jawrah Pixel works across business websites, ecommerce experiences, brand-focused interfaces and custom digital products. Portfolio projects help explain the kinds of problems the design and development process addresses.'],
      ['How to evaluate a project', 'Look for the business goal, the intended audience, the page structure, the user experience and the decisions made around mobile usage, content and performance.'],
      ['Explore our services', 'If you are planning a similar website or digital product, review our design, ecommerce and software services and contact the team with your requirements.'],
      ['Project planning and experience design', 'Different products require different discovery and design decisions. A business website needs clear service descriptions and navigation. Ecommerce experiences need helpful product information, a usable buying journey and support for business processes. Custom software needs well-defined user roles, workflows and maintainable interfaces. These considerations shape how Jawrah Pixel approaches each engagement.'],
      ['From portfolio to your own brief', 'A portfolio is a starting point for discussing possibilities, not a promise that every project needs the same technology or visual style. When considering a new website, bring information about your audience, existing content, important integrations and business goals. Use those requirements to evaluate the kind of experience that would best serve your customers.']
    ]
  };
  const sections = (editorial[pathname.split('/').filter(Boolean).at(-1)] || editorial['']).map(([name, body]) => '<section><h2>' + esc(name) + '</h2><p>' + esc(body) + '</p></section>').join('');
  const content = '<main id="seo-pre-rendered-content" style="max-width:1100px;margin:0 auto;padding:8rem 1.5rem;color:inherit;font:16px/1.7 system-ui,sans-serif"><h1>' + esc(heading) + '</h1><p>' + esc(page.intro) + '</p><p>' + esc(description) + '</p>' + sections + '<nav aria-label="Explore Jawrah Pixel">' + nav + '</nav></main>';
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
