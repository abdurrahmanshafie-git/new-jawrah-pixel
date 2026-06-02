import type { RegionCode } from '@/types';

export interface ServiceLandingPage {
  slug: string;
  region: RegionCode;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  serviceName: string;
  market: string;
  audience: string;
  priceSignal: string;
  primaryOutcome: string;
  route: `/${RegionCode}/${string}`;
  relatedCaseSlug?: string;
  relatedServices: Array<{ label: string; path: string }>;
  sections: Array<{ title: string; paragraphs: string[] }>;
  deliverables: string[];
  technologyAngles: string[];
  process: Array<{ step: string; title: string; copy: string }>;
  faqs: Array<{ q: string; a: string }>;
}

interface PageSeed {
  slug: string;
  region: RegionCode;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  serviceName: string;
  market: string;
  audience: string;
  priceSignal: string;
  primaryOutcome: string;
  route: `/${RegionCode}/${string}`;
  relatedCaseSlug?: string;
  positioning: string;
  buyerTriggers: string[];
  localSearchAngles: string[];
  technologyAngles: string[];
  deliverables: string[];
  relatedServices: Array<{ label: string; path: string }>;
}

function buildSections(seed: PageSeed): ServiceLandingPage['sections'] {
  const triggerCopy = seed.buyerTriggers.join(', ');
  const localCopy = seed.localSearchAngles.join(', ');
  const techCopy = seed.technologyAngles.join(', ');

  return [
    {
      title: `${seed.serviceName} built for ${seed.market}`,
      paragraphs: [
        `${seed.positioning} Jawrah Pixel treats ${seed.serviceName.toLowerCase()} as a commercial asset, not a decorative web project. The experience is planned around search intent, buyer confidence, page speed, conversion paths, and the operational realities of ${seed.audience}. That means your page hierarchy, content rhythm, technical structure, call-to-action placement, and analytics events are considered together before interface polish begins.`,
        `For ${seed.market}, ranking and conversion usually depend on trust signals that generic templates miss. Searchers compare proof, pricing clarity, local relevance, mobile speed, and the seriousness of the brand within a few seconds. We shape every section to help visitors understand what you do, why it matters, how the engagement works, and what step they should take next without forcing them through noisy marketing copy.`,
      ],
    },
    {
      title: 'Search intent and conversion strategy',
      paragraphs: [
        `The page is mapped around buyer triggers such as ${triggerCopy}. We identify the keywords that indicate real commercial intent, then align headings, internal links, schema, FAQs, and service copy around that demand. The result is a landing page that can support organic search visibility while also giving sales teams a stronger destination for ads, referrals, WhatsApp conversations, and proposal follow-ups.`,
        `Conversion strategy is built into the structure. Visitors who need fast reassurance see proof-led summaries, while visitors who are evaluating a larger engagement can scan process, deliverables, maintenance, case studies, and contact paths. This gives the page enough depth for search engines and enough clarity for busy founders, directors, ecommerce owners, and operators who need a direct reason to start a project discussion.`,
      ],
    },
    {
      title: `Regional SEO signals for ${seed.market}`,
      paragraphs: [
        `Regional relevance is handled with more than a country name in the title tag. We build content that speaks to ${localCopy}, then connect it with canonical URLs, hreflang, structured data, service schema, FAQ schema, and internal links to supporting pages. The goal is to help Google understand who the service is for, where it applies, and why Jawrah Pixel is a credible provider for that market.`,
        `For multi-region growth, we avoid thin duplicate pages. Each market page has its own value proposition, examples, payment expectations, collaboration style, and search vocabulary. Sri Lankan businesses often need local trust, mobile-first buying journeys, and strong WhatsApp conversion paths. Pakistani businesses often need flexible payment language, marketplace-aware ecommerce planning, and fast discovery on mobile networks. International clients need remote-first delivery, USD clarity, and globally credible presentation.`,
      ],
    },
    {
      title: 'Technical architecture and performance',
      paragraphs: [
        `The technical foundation is designed for speed and maintainability. Jawrah Pixel works with React, Vite, TypeScript, Supabase, secure API routes, structured content models, and deployment patterns that keep pages fast after launch. For ${seed.serviceName.toLowerCase()}, technical decisions can include ${techCopy}. We keep the interface visually premium while protecting Core Web Vitals, crawlability, accessibility, and mobile responsiveness.`,
        `Performance SEO matters because slow pages reduce ranking potential and reduce sales confidence. We optimize image loading, responsive media, code splitting, metadata, semantic headings, and layout stability so the experience feels polished without punishing LCP or CLS. The goal is not only to pass a test; it is to make the site feel immediate on real devices, real connections, and real buying journeys.`,
      ],
    },
    {
      title: 'A premium page that supports sales',
      paragraphs: [
        `A strong landing page should reduce the number of explanations your team has to repeat. The content answers common objections, clarifies what is included, shows how the process works, and gives decision makers confidence that the work is structured. We connect service pages to pricing, process, case studies, contact, and relevant blog content so visitors can move naturally through the site without hitting a dead end.`,
        `The commercial objective for this service is ${seed.primaryOutcome}. Every section is written to support that outcome: clearer positioning, better qualified inquiries, stronger organic discovery, and smoother handoff from first visit to consultation. If a prospect arrives from Google, Instagram, WhatsApp, LinkedIn, a referral partner, or a paid campaign, they should land on a page that feels specific, credible, and ready for action.`,
      ],
    },
    {
      title: 'Launch, measurement, and iteration',
      paragraphs: [
        `After launch, the page should continue improving. We prepare tracking points for service interest, CTA clicks, form starts, checkout starts, and contact actions. Search Console and analytics data then reveal which queries, devices, and pages deserve expansion. This is how a single service page becomes part of a larger SEO system instead of a static brochure.`,
        `Jawrah Pixel can support the page through monthly technical care, content expansion, FAQ refinement, schema updates, internal linking improvements, and conversion analysis. The first launch gives the business a strong search-ready asset. The ongoing work compounds that asset into better topical authority, more precise market coverage, and more confident lead generation over time.`,
      ],
    },
  ];
}

function buildProcess(serviceName: string): ServiceLandingPage['process'] {
  return [
    {
      step: '01',
      title: 'Discovery',
      copy: `We map the offer, audience, competitors, search terms, existing website issues, conversion goals, and operational constraints behind the ${serviceName.toLowerCase()} project.`,
    },
    {
      step: '02',
      title: 'SEO Architecture',
      copy: 'We define the URL, metadata, heading system, internal links, schema, FAQ targets, analytics events, and service content hierarchy before interface production.',
    },
    {
      step: '03',
      title: 'Design And Build',
      copy: 'We craft the premium responsive interface, implement the React page, optimize media, protect layout stability, and connect conversion paths.',
    },
    {
      step: '04',
      title: 'Launch And Measure',
      copy: 'We validate canonical tags, sitemap inclusion, robots rules, structured data, page speed, CTA tracking, and post-launch indexing readiness.',
    },
  ];
}

function buildFaqs(seed: PageSeed): ServiceLandingPage['faqs'] {
  return [
    {
      q: `What makes Jawrah Pixel different for ${seed.serviceName.toLowerCase()}?`,
      a: `Jawrah Pixel combines premium interface design, technical SEO, conversion strategy, and React engineering. The result is a page or platform that looks high-end, loads quickly, supports indexing, and helps qualified prospects take action.`,
    },
    {
      q: `Is this service suitable for ${seed.audience}?`,
      a: `Yes. The offer is shaped for ${seed.audience}, with content, payment expectations, calls to action, and search terms adapted to ${seed.market}.`,
    },
    {
      q: 'Will the page include SEO metadata and schema markup?',
      a: 'Yes. The implementation includes title tags, meta descriptions, canonical URLs, Open Graph tags, Twitter cards, service schema, FAQ schema, breadcrumb schema, and internal links.',
    },
    {
      q: 'How long does a typical service landing page or service build take?',
      a: 'Focused landing pages can move quickly once the offer is clear. Larger ecommerce, SEO, or platform projects require deeper discovery, content planning, design, development, QA, and launch validation.',
    },
    {
      q: 'Can the page connect to case studies and pricing?',
      a: 'Yes. Internal links are planned into the page so visitors can move to service details, case studies, process, pricing, contact, and relevant blog content without becoming orphaned.',
    },
    {
      q: 'Do you optimize for Core Web Vitals?',
      a: 'Yes. We plan responsive images, lazy loading, code splitting, layout stability, accessible controls, and performance-conscious animation so the page can target strong LCP, CLS, and INP scores.',
    },
    {
      q: `Can this page rank for ${seed.market} searches?`,
      a: `The page is built to support ranking potential through relevant copy, regional signals, structured data, technical SEO, and internal links. Search performance also depends on competition, authority, backlinks, content depth, and ongoing iteration.`,
    },
    {
      q: 'Will the design match the existing Jawrah Pixel style?',
      a: 'Yes. The implementation uses the existing visual system, layout language, components, motion style, and brand palette instead of introducing a separate redesign.',
    },
    {
      q: 'Can you support future CMS integration?',
      a: 'Yes. The content structure is typed and modular, so the page can later be connected to Supabase, a headless CMS, or another content workflow without rebuilding the interface from scratch.',
    },
    {
      q: 'What conversion actions can be tracked?',
      a: 'Important events include contact clicks, WhatsApp clicks, service selection, checkout starts, form submissions, pricing views, case study clicks, and consultation requests.',
    },
    {
      q: `What is the expected investment level for ${seed.serviceName.toLowerCase()}?`,
      a: seed.priceSignal,
    },
    {
      q: 'Can Jawrah Pixel maintain the page after launch?',
      a: 'Yes. Ongoing support can include technical updates, SEO monitoring, content expansion, structured data updates, performance audits, and conversion improvements.',
    },
  ];
}

const seeds: PageSeed[] = [
  {
    slug: 'web-development-sri-lanka',
    region: 'lk',
    title: 'Web Development Company Sri Lanka | Jawrah Pixel',
    h1: 'Web Development Sri Lanka',
    description:
      'Premium web development services for ambitious Sri Lankan businesses that need fast, conversion-ready websites and scalable digital systems.',
    keywords: ['web development Sri Lanka', 'web development company Sri Lanka', 'custom website development Sri Lanka', 'React development Sri Lanka'],
    serviceName: 'Web Development Sri Lanka',
    market: 'Sri Lanka',
    audience: 'Sri Lankan founders, retailers, exporters, consultants, hospitality teams, property brands, and premium service businesses',
    priceSignal:
      'Web development in Sri Lanka is scoped around page depth, content readiness, integrations, ecommerce needs, launch support, and long-term technical care. Jawrah Pixel provides clear LKR milestones after discovery.',
    primaryOutcome: 'a high-trust web platform that improves organic discovery, mobile conversion, and premium brand authority for Sri Lankan buyers',
    route: '/lk/web-development-sri-lanka',
    relatedCaseSlug: 'zenvor',
    positioning:
      'Web development in Sri Lanka should feel premium, load quickly on real local devices, and give serious buyers a clear path from first impression to inquiry.',
    buyerTriggers: ['new website launch', 'legacy website rebuild', 'mobile lead generation', 'conversion-focused redesign', 'technical SEO upgrade'],
    localSearchAngles: ['Sri Lankan commercial search intent', 'Colombo and islandwide discovery', 'WhatsApp inquiry paths', 'LKR project planning', 'mobile-first traffic'],
    technologyAngles: ['React and TypeScript builds', 'responsive page systems', 'structured service routes', 'schema-ready content', 'analytics-ready CTAs', 'Supabase-ready architecture'],
    deliverables: [
      'Custom responsive website architecture for Sri Lankan service and product brands',
      'SEO-ready metadata, canonical URLs, internal links, and schema foundations',
      'Premium homepage, service, case study, process, and contact conversion sections',
      'Fast image handling, stable layouts, accessible headings, and mobile-first QA',
      'Lead capture paths for forms, WhatsApp, consultation requests, and proposal handoff',
      'Launch validation for sitemap inclusion, indexing readiness, and analytics events',
    ],
    relatedServices: [
      { label: 'Ecommerce Development Sri Lanka', path: '/ecommerce-development-sri-lanka' },
      { label: 'SEO Services Sri Lanka', path: '/services/seo-services-sri-lanka' },
      { label: 'Case Studies', path: '/case-studies' },
    ],
  },
  {
    slug: 'web-design-sri-lanka',
    region: 'lk',
    title: 'Web Design Sri Lanka | Premium Website Design Agency | Jawrah Pixel',
    h1: 'Web Design Sri Lanka',
    description:
      'Premium web design in Sri Lanka for businesses that need fast, elegant, SEO-ready websites built to convert serious customers.',
    keywords: ['web design Sri Lanka', 'website design Sri Lanka', 'web design agency Sri Lanka', 'premium websites Sri Lanka'],
    serviceName: 'Web Design Sri Lanka',
    market: 'Sri Lanka',
    audience: 'Sri Lankan companies, founders, exporters, property teams, retailers, consultants, and premium local brands',
    priceSignal:
      'Most Sri Lankan web design engagements are scoped around page count, content depth, integrations, and launch support. Jawrah Pixel provides clear LKR milestones after discovery.',
    primaryOutcome: 'a premium website that increases trust, improves search visibility, and turns serious Sri Lankan visitors into qualified inquiries',
    route: '/lk/services/web-design-sri-lanka',
    relatedCaseSlug: 'zenvor',
    positioning:
      'Premium web design in Sri Lanka needs to balance local trust with an international standard of polish.',
    buyerTriggers: ['new brand launch', 'outdated website redesign', 'investor credibility', 'mobile lead generation', 'better Google visibility'],
    localSearchAngles: ['Colombo business discovery', 'Sri Lankan mobile traffic', 'local service intent', 'LKR pricing expectations', 'WhatsApp-first inquiries'],
    technologyAngles: ['semantic React routes', 'responsive image delivery', 'technical SEO metadata', 'lead capture forms', 'Supabase-ready data models'],
    deliverables: [
      'SEO-ready website architecture with regional title tags and canonical URLs',
      'Premium responsive UI design aligned to the current Jawrah Pixel visual system',
      'Conversion-focused homepage, service sections, trust blocks, and contact paths',
      'Optimized image loading, lazy media, accessible headings, and stable layouts',
      'Structured data for Organization, LocalBusiness, Service, FAQ, and BreadcrumbList',
      'Analytics-ready CTA tracking for contact, WhatsApp, pricing, and form events',
    ],
    relatedServices: [
      { label: 'Ecommerce Development Sri Lanka', path: '/services/ecommerce-development-sri-lanka' },
      { label: 'SEO Services Sri Lanka', path: '/services/seo-services-sri-lanka' },
      { label: 'Process', path: '/process' },
    ],
  },
  {
    slug: 'ecommerce-development-sri-lanka',
    region: 'lk',
    title: 'Ecommerce Development Sri Lanka | Online Store Agency | Jawrah Pixel',
    h1: 'Ecommerce Development Sri Lanka',
    description:
      'High-performance ecommerce development in Sri Lanka for premium stores, product catalogs, secure checkout flows, and conversion-ready retail brands.',
    keywords: ['ecommerce development Sri Lanka', 'online store Sri Lanka', 'ecommerce website Sri Lanka', 'React ecommerce Sri Lanka'],
    serviceName: 'Ecommerce Development Sri Lanka',
    market: 'Sri Lanka',
    audience: 'Sri Lankan retailers, fashion labels, jewellery brands, exporters, distributors, and premium product businesses',
    priceSignal:
      'Ecommerce investment depends on catalog size, checkout requirements, payment gateways, inventory logic, admin workflows, and launch support. We scope LKR milestones clearly before build.',
    primaryOutcome: 'a faster ecommerce experience that improves product confidence, checkout intent, and organic discovery for Sri Lankan buyers',
    route: '/lk/ecommerce-development-sri-lanka',
    relatedCaseSlug: 'zenvor',
    positioning:
      'Ecommerce development in Sri Lanka has to do more than display products; it must build confidence quickly on mobile devices and convert buyers who may still prefer assisted purchasing.',
    buyerTriggers: ['online store launch', 'slow catalog experience', 'checkout abandonment', 'premium product presentation', 'payment workflow upgrade'],
    localSearchAngles: ['Sri Lankan ecommerce search terms', 'PayHere and bank transfer expectations', 'mobile catalog browsing', 'local delivery clarity', 'WhatsApp sales support'],
    technologyAngles: ['product data modeling', 'secure checkout routing', 'responsive media compression', 'inventory-ready architecture', 'conversion event tracking'],
    deliverables: [
      'SEO-ready ecommerce category and product page planning',
      'Premium catalog UI for desktop and mobile shoppers',
      'Checkout-ready architecture for local and assisted payment workflows',
      'Product trust sections, delivery notes, FAQ content, and conversion CTAs',
      'Structured data for services, products where applicable, FAQs, and breadcrumbs',
      'Performance tuning for catalog images, layout stability, and fast browsing',
    ],
    relatedServices: [
      { label: 'Web Development Sri Lanka', path: '/web-development-sri-lanka' },
      { label: 'SEO Services Sri Lanka', path: '/services/seo-services-sri-lanka' },
      { label: 'Case Studies', path: '/case-studies' },
    ],
  },
  {
    slug: 'seo-services-sri-lanka',
    region: 'lk',
    title: 'SEO Services Sri Lanka | Technical SEO Agency | Jawrah Pixel',
    h1: 'SEO Services Sri Lanka',
    description:
      'Technical SEO services in Sri Lanka for brands that need better metadata, indexing, content architecture, schema, performance, and organic visibility.',
    keywords: ['SEO services Sri Lanka', 'technical SEO Sri Lanka', 'SEO agency Sri Lanka', 'website SEO Sri Lanka'],
    serviceName: 'SEO Services Sri Lanka',
    market: 'Sri Lanka',
    audience: 'Sri Lankan service companies, ecommerce teams, agencies, consultants, exporters, and local brands competing for organic search',
    priceSignal:
      'SEO pricing depends on technical depth, content volume, keyword competition, analytics setup, and monthly iteration. We quote transparent LKR audit and implementation scopes.',
    primaryOutcome: 'a technically stronger website that Google can crawl, understand, index, and evaluate with clearer relevance for Sri Lankan search demand',
    route: '/lk/services/seo-services-sri-lanka',
    relatedCaseSlug: 'velora-estates',
    positioning:
      'SEO services in Sri Lanka often fail when they focus only on keywords and ignore technical architecture, search intent, internal linking, and page experience.',
    buyerTriggers: ['low Google visibility', 'missing metadata', 'poor indexing', 'slow pages', 'thin service pages', 'weak local search relevance'],
    localSearchAngles: ['Sri Lankan commercial keywords', 'local service pages', 'Colombo and islandwide discovery', 'Search Console readiness', 'regional content depth'],
    technologyAngles: ['schema markup', 'canonical validation', 'sitemap generation', 'robots rules', 'Core Web Vitals improvements', 'semantic content structure'],
    deliverables: [
      'Technical SEO audit with crawl, index, metadata, schema, and performance findings',
      'Regional keyword mapping and service page architecture',
      'Metadata, canonical URLs, hreflang, sitemap, robots, and structured data fixes',
      'FAQ content, internal linking, and conversion-focused SEO copy improvements',
      'Core Web Vitals and image loading recommendations',
      'Search Console and Bing Webmaster indexing readiness checklist',
    ],
    relatedServices: [
      { label: 'Web Design Sri Lanka', path: '/services/web-design-sri-lanka' },
      { label: 'Ecommerce Development Sri Lanka', path: '/services/ecommerce-development-sri-lanka' },
      { label: 'Blog', path: '/blog' },
    ],
  },
  {
    slug: 'web-development-pakistan',
    region: 'pk',
    title: 'Web Development Company Pakistan | Jawrah Pixel',
    h1: 'Web Development Pakistan',
    description:
      'Premium web development services in Pakistan for ambitious brands that need high-trust websites, fast mobile performance, and conversion-ready digital systems.',
    keywords: ['web development Pakistan', 'web development company Pakistan', 'custom website development Pakistan', 'React development Pakistan'],
    serviceName: 'Web Development Pakistan',
    market: 'Pakistan',
    audience: 'Pakistani startups, jewellery houses, retailers, consultants, exporters, service businesses, and premium local companies',
    priceSignal:
      'Pakistan web development engagements are scoped around pages, catalog depth, payment needs, integrations, content readiness, and support. Jawrah Pixel provides clear PKR milestones after discovery.',
    primaryOutcome: 'a premium website that builds trust, loads quickly on mobile networks, and turns Pakistani visitors into qualified inquiries',
    route: '/pk/web-development-pakistan',
    relatedCaseSlug: 'shabnam-jewellers',
    positioning:
      'Web development in Pakistan has to balance premium presentation with practical conversion paths for buyers who compare brands on search, social, WhatsApp, and referrals.',
    buyerTriggers: ['brand relaunch', 'mobile lead generation', 'catalog presentation', 'technical SEO repair', 'website rebuild'],
    localSearchAngles: ['Pakistan commercial search demand', 'Karachi and Lahore discovery', 'PKR project expectations', 'WhatsApp-assisted leads', 'mobile-first browsing'],
    technologyAngles: ['React interface engineering', 'responsive component systems', 'technical SEO metadata', 'schema markup', 'conversion event tracking', 'secure form flows'],
    deliverables: [
      'Custom responsive web development for Pakistani service and product brands',
      'Premium UI sections for services, proof, process, pricing, and contact',
      'SEO-ready route structure, metadata, canonical URLs, and internal links',
      'Fast mobile performance tuning for real customer browsing conditions',
      'Lead paths for consultation, WhatsApp, quote requests, and case study discovery',
      'Launch QA for accessibility, sitemap inclusion, structured data, and analytics',
    ],
    relatedServices: [
      { label: 'Ecommerce Development Pakistan', path: '/ecommerce-development-pakistan' },
      { label: 'Case Studies', path: '/case-studies' },
      { label: 'Process', path: '/process' },
    ],
  },
  {
    slug: 'web-design-pakistan',
    region: 'pk',
    title: 'Web Design Pakistan | Premium Website Design Agency | Jawrah Pixel',
    h1: 'Web Design Pakistan',
    description:
      'Premium web design in Pakistan for brands that need fast, conversion-focused, SEO-ready websites with international polish.',
    keywords: ['web design Pakistan', 'website design Pakistan', 'web design agency Pakistan', 'premium websites Pakistan'],
    serviceName: 'Web Design Pakistan',
    market: 'Pakistan',
    audience: 'Pakistani startups, retailers, jewellery brands, service businesses, consultants, exporters, and premium local companies',
    priceSignal:
      'Pakistan web design scopes are planned around pages, content depth, integrations, payment needs, and launch support. Jawrah Pixel provides clear PKR milestones after discovery.',
    primaryOutcome: 'a premium website that builds trust, loads quickly on mobile, and turns Pakistani visitors into qualified leads',
    route: '/pk/services/web-design-pakistan',
    relatedCaseSlug: 'shabnam-jewellers',
    positioning:
      'Premium web design in Pakistan needs to combine high-trust presentation, fast mobile delivery, and flexible conversion paths for customers who may discover the brand through search, social, WhatsApp, or referrals.',
    buyerTriggers: ['brand relaunch', 'mobile lead generation', 'premium catalog presentation', 'agency credibility', 'better organic discovery'],
    localSearchAngles: ['Pakistan business search', 'Karachi and Lahore buyer intent', 'PKR pricing expectations', 'mobile-first browsing', 'WhatsApp lead capture'],
    technologyAngles: ['React page architecture', 'responsive UI systems', 'image optimization', 'lead forms', 'analytics events', 'schema markup'],
    deliverables: [
      'SEO-ready website structure with Pakistan-focused metadata',
      'Premium responsive interface using the existing Jawrah Pixel design language',
      'Conversion sections for services, proof, process, pricing, and contact',
      'Fast mobile layouts tuned for real browsing conditions',
      'Open Graph, Twitter cards, canonical tags, hreflang, and JSON-LD schema',
      'Launch QA for indexing readiness, accessibility, and performance',
    ],
    relatedServices: [
      { label: 'Ecommerce Development Pakistan', path: '/services/ecommerce-development-pakistan' },
      { label: 'Process', path: '/process' },
      { label: 'Contact', path: '/contact' },
    ],
  },
  {
    slug: 'ecommerce-development-pakistan',
    region: 'pk',
    title: 'Ecommerce Development Pakistan | Online Store Agency | Jawrah Pixel',
    h1: 'Ecommerce Development Pakistan',
    description:
      'Premium ecommerce development in Pakistan for fast online stores, luxury catalogs, assisted checkout, SEO-ready product journeys, and scalable retail systems.',
    keywords: ['ecommerce development Pakistan', 'online store Pakistan', 'ecommerce website Pakistan', 'React ecommerce Pakistan'],
    serviceName: 'Ecommerce Development Pakistan',
    market: 'Pakistan',
    audience: 'Pakistani retailers, jewellery houses, fashion brands, marketplaces, distributors, and premium product companies',
    priceSignal:
      'Ecommerce development pricing depends on product catalog complexity, checkout methods, admin workflow, integrations, and content depth. We quote clear PKR milestones after discovery.',
    primaryOutcome: 'a high-trust ecommerce system that improves product discovery, buyer confidence, checkout flow, and organic growth in Pakistan',
    route: '/pk/ecommerce-development-pakistan',
    relatedCaseSlug: 'shabnam-jewellers',
    positioning:
      'Ecommerce development in Pakistan must respect how customers buy: they compare products on mobile, ask questions before paying, expect flexible payment paths, and judge trust through presentation quality.',
    buyerTriggers: ['new online store', 'catalog redesign', 'checkout friction', 'marketplace independence', 'premium retail positioning'],
    localSearchAngles: ['Pakistan ecommerce keywords', 'Easypaisa and JazzCash expectations', 'mobile product discovery', 'assisted WhatsApp checkout', 'delivery and trust messaging'],
    technologyAngles: ['catalog architecture', 'checkout routing', 'responsive media', 'admin-ready product data', 'payment intent tracking', 'structured ecommerce content'],
    deliverables: [
      'Conversion-focused ecommerce page and catalog architecture',
      'Premium product presentation for mobile and desktop',
      'Checkout and inquiry flows aligned with Pakistani payment behavior',
      'Technical SEO metadata, schema, sitemap inclusion, and internal links',
      'Performance tuning for product images and interactive catalog sections',
      'Analytics-ready tracking for product interest, checkout starts, and contact actions',
    ],
    relatedServices: [
      { label: 'Web Development Pakistan', path: '/web-development-pakistan' },
      { label: 'Case Studies', path: '/case-studies' },
      { label: 'Pricing', path: '/pricing' },
    ],
  },
  {
    slug: 'web-development-agency',
    region: 'int',
    title: 'International Web Development Agency | Jawrah Pixel',
    h1: 'Web Development Agency',
    description:
      'Premium international web development agency for global brands, SaaS teams, ecommerce operators, and remote-first companies that need conversion-ready digital systems.',
    keywords: ['web development agency', 'international web development agency', 'premium web development agency', 'React web development agency'],
    serviceName: 'International Web Development Agency',
    market: 'International',
    audience: 'global brands, SaaS teams, ecommerce operators, consultants, agencies, founders, and remote-first companies',
    priceSignal:
      'International web development is scoped in USD around product complexity, content depth, integrations, design depth, launch support, and long-term growth needs.',
    primaryOutcome: 'a globally credible web platform that supports premium positioning, international search discovery, and serious remote-first sales conversations',
    route: '/int/web-development-agency',
    relatedCaseSlug: 'aerovista-travels',
    positioning:
      'A premium web development agency should turn strategy, interface design, technical SEO, and conversion architecture into one coherent digital asset.',
    buyerTriggers: ['global website launch', 'SaaS marketing site rebuild', 'international ecommerce expansion', 'agency partner support', 'premium brand repositioning'],
    localSearchAngles: ['global search discovery', 'remote-first buyer trust', 'USD engagement clarity', 'international conversion paths', 'multi-region SEO structure'],
    technologyAngles: ['React and TypeScript frontends', 'route-level code splitting', 'schema-rich service pages', 'global CDN delivery', 'analytics-ready funnels', 'CMS-ready content models'],
    deliverables: [
      'Premium international website architecture for global service, SaaS, and ecommerce brands',
      'Search-ready pages with canonical URLs, Open Graph, FAQ schema, and breadcrumbs',
      'Conversion-focused sections for proof, process, services, pricing signals, and contact',
      'Responsive interface systems tuned for desktop, tablet, and mobile readability',
      'Remote-first launch workflow with QA for accessibility, performance, and indexability',
      'Internal linking structure connecting homepage, services, case studies, and CTA paths',
    ],
    relatedServices: [
      { label: 'Custom Software Development', path: '/custom-software-development' },
      { label: 'International Services', path: '/services' },
      { label: 'Case Studies', path: '/case-studies' },
    ],
  },
  {
    slug: 'custom-software-development',
    region: 'int',
    title: 'Custom Software Development Company | Jawrah Pixel',
    h1: 'Custom Software Development',
    description:
      'Custom software development for global teams that need secure portals, SaaS interfaces, internal tools, ecommerce systems, and scalable operational platforms.',
    keywords: ['custom software development', 'custom software development company', 'SaaS development agency', 'internal tools development'],
    serviceName: 'Custom Software Development',
    market: 'International',
    audience: 'SaaS founders, operators, ecommerce teams, agencies, service businesses, and remote-first companies building scalable systems',
    priceSignal:
      'Custom software development is scoped in USD around workflow complexity, data models, integrations, user roles, security requirements, product UI depth, and launch support.',
    primaryOutcome: 'a secure, scalable software system that reduces operational friction and gives teams a premium interface for growth',
    route: '/int/custom-software-development',
    relatedCaseSlug: 'aerovista-travels',
    positioning:
      'Custom software development should solve a real operational bottleneck while still carrying the premium clarity and interface quality expected from Jawrah Pixel.',
    buyerTriggers: ['client portal build', 'SaaS MVP development', 'admin dashboard rebuild', 'workflow automation', 'ecommerce operations scaling'],
    localSearchAngles: ['international software buyers', 'remote-first product delivery', 'USD development scope', 'global SaaS search intent', 'secure operations platforms'],
    technologyAngles: ['React product interfaces', 'Supabase data models', 'role-based dashboards', 'secure API routes', 'workflow automation', 'analytics and reporting layers'],
    deliverables: [
      'Custom software architecture for portals, dashboards, SaaS interfaces, and operational tools',
      'Typed React interface systems with responsive layouts and premium interaction states',
      'Secure data model planning for roles, records, workflows, forms, and reporting',
      'Conversion and usability paths for admins, clients, agents, customers, or internal teams',
      'Technical SEO support where the software includes crawlable public landing pages',
      'Launch validation for security assumptions, performance, accessibility, and support handoff',
    ],
    relatedServices: [
      { label: 'Web Development Agency', path: '/web-development-agency' },
      { label: 'Services', path: '/services' },
      { label: 'Process', path: '/process' },
    ],
  },
  {
    slug: 'international-digital-services',
    region: 'int',
    title: 'International Digital Services | Premium Global Agency | Jawrah Pixel',
    h1: 'International Digital Services',
    description:
      'Premium international digital services for global brands, SaaS teams, ecommerce companies, AI products, and remote-first businesses.',
    keywords: ['international digital services', 'global web design agency', 'premium digital agency', 'international ecommerce development'],
    serviceName: 'International Digital Services',
    market: 'International',
    audience: 'global brands, SaaS teams, ecommerce operators, founders, agencies, consultants, and remote-first companies',
    priceSignal:
      'International engagements are scoped in USD around strategy, page depth, integrations, product complexity, and long-term support. We provide clear milestones before production.',
    primaryOutcome: 'a globally credible digital platform that supports premium positioning, international discovery, and serious remote-first sales conversations',
    route: '/int/services/international-digital-services',
    relatedCaseSlug: 'aerovista-travels',
    positioning:
      'International digital services require more than a beautiful website; global buyers expect clarity, credibility, fast performance, strong UX, and a delivery process that works across time zones.',
    buyerTriggers: ['global brand launch', 'SaaS interface upgrade', 'international ecommerce expansion', 'premium investor presentation', 'remote-first service growth'],
    localSearchAngles: ['global service discovery', 'international buyer trust', 'USD engagement clarity', 'remote collaboration', 'multi-region SEO structure'],
    technologyAngles: ['route-level code splitting', 'schema-rich service pages', 'international canonical strategy', 'global CDN delivery', 'analytics-ready conversion funnels'],
    deliverables: [
      'International service architecture with canonical URLs and hreflang support',
      'Premium global interface system for service, SaaS, ecommerce, or brand pages',
      'Conversion content for international buyers and remote-first consultations',
      'Structured data, FAQ schema, breadcrumb schema, and Open Graph metadata',
      'Performance-conscious React build with lazy media and stable layouts',
      'Launch readiness for Search Console, Bing Webmaster Tools, and analytics',
    ],
    relatedServices: [
      { label: 'Services', path: '/services' },
      { label: 'Case Studies', path: '/case-studies' },
      { label: 'Contact', path: '/contact' },
    ],
  },
];

const aliasServiceCatalog = [
  {
    slug: 'web-development',
    name: 'Web Development',
    keywords: ['web development', 'custom website development', 'React development'],
    buyerTriggers: ['new website build', 'frontend rebuild', 'business credibility', 'conversion-focused pages'],
    technologyAngles: ['React architecture', 'responsive layouts', 'technical SEO metadata', 'analytics-ready forms'],
    deliverables: ['Custom responsive website architecture', 'SEO-ready page structure', 'Conversion sections and contact paths', 'Performance-focused React implementation'],
  },
  {
    slug: 'ecommerce-development',
    name: 'Ecommerce Development',
    keywords: ['ecommerce development', 'online store development', 'premium ecommerce website'],
    buyerTriggers: ['online store launch', 'catalog redesign', 'checkout friction', 'premium product presentation'],
    technologyAngles: ['catalog architecture', 'checkout routing', 'responsive media', 'conversion event tracking'],
    deliverables: ['Premium product and catalog layouts', 'Checkout-ready purchase journeys', 'Ecommerce SEO structure', 'Mobile-first product discovery'],
  },
  {
    slug: 'ui-ux-design',
    name: 'UI/UX Design',
    keywords: ['UI UX design', 'interface design', 'user experience design'],
    buyerTriggers: ['confusing user journeys', 'low conversion clarity', 'interface redesign', 'premium product positioning'],
    technologyAngles: ['interaction design', 'responsive design systems', 'accessibility checks', 'component architecture'],
    deliverables: ['High-fidelity responsive UI direction', 'Conversion-led UX flows', 'Reusable interface sections', 'Accessible interaction states'],
  },
  {
    slug: 'branding',
    name: 'Branding',
    keywords: ['branding', 'brand identity', 'digital branding'],
    buyerTriggers: ['new brand launch', 'premium repositioning', 'visual identity refresh', 'stronger market trust'],
    technologyAngles: ['brand-ready web systems', 'visual hierarchy', 'content rhythm', 'social preview metadata'],
    deliverables: ['Premium brand presentation system', 'Digital identity direction', 'Website-ready brand hierarchy', 'Consistent conversion messaging'],
  },
  {
    slug: 'seo',
    name: 'SEO',
    keywords: ['SEO', 'technical SEO', 'search engine optimization'],
    buyerTriggers: ['low Google visibility', 'weak indexing', 'missing metadata', 'slow pages'],
    technologyAngles: ['schema markup', 'canonical validation', 'sitemap generation', 'Core Web Vitals improvements'],
    deliverables: ['Technical SEO audit and implementation', 'Metadata and canonical fixes', 'Schema and FAQ markup', 'Search Console readiness'],
  },
  {
    slug: 'mobile-app-development',
    name: 'Mobile App Development',
    keywords: ['mobile app development', 'app interface development', 'mobile product design'],
    buyerTriggers: ['mobile product launch', 'customer portal need', 'app-like experience', 'workflow automation'],
    technologyAngles: ['mobile-first React flows', 'secure data models', 'responsive app shells', 'dashboard-ready UX'],
    deliverables: ['Mobile-first product interface', 'Secure app flow planning', 'Responsive dashboard patterns', 'Launch-ready interaction paths'],
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    keywords: ['digital marketing', 'conversion marketing', 'growth strategy'],
    buyerTriggers: ['lead generation', 'campaign landing pages', 'conversion tracking', 'market expansion'],
    technologyAngles: ['analytics events', 'landing page architecture', 'Open Graph metadata', 'conversion funnel tracking'],
    deliverables: ['Campaign-ready landing structure', 'Conversion CTA planning', 'Analytics-ready event paths', 'Search and social metadata'],
  },
  {
    slug: 'ai-solutions',
    name: 'AI Solutions',
    keywords: ['AI solutions', 'AI integration', 'business automation AI'],
    buyerTriggers: ['support automation', 'proposal automation', 'internal workflow scaling', 'AI product planning'],
    technologyAngles: ['assistant architecture', 'secure data workflows', 'automation-ready forms', 'AI integration planning'],
    deliverables: ['AI workflow strategy', 'Automation-ready interface planning', 'Secure data flow architecture', 'Assistant and proposal-flow foundations'],
  },
] as const;

const aliasRegionMeta: Record<RegionCode, {
  market: string;
  audience: string;
  currency: string;
  relatedCaseSlug: string;
  localSearchAngles: string[];
}> = {
  lk: {
    market: 'Sri Lanka',
    audience: 'Sri Lankan founders, retailers, consultants, exporters, service teams, and premium local brands',
    currency: 'LKR',
    relatedCaseSlug: 'zenvor',
    localSearchAngles: ['Sri Lankan buyer intent', 'Colombo and islandwide discovery', 'mobile-first traffic', 'WhatsApp inquiry behavior'],
  },
  pk: {
    market: 'Pakistan',
    audience: 'Pakistani startups, retailers, jewellery brands, consultants, exporters, and service businesses',
    currency: 'PKR',
    relatedCaseSlug: 'shabnam-jewellers',
    localSearchAngles: ['Pakistan search demand', 'Karachi and Lahore discovery', 'mobile-first browsing', 'WhatsApp-assisted conversion'],
  },
  int: {
    market: 'International',
    audience: 'global brands, SaaS teams, ecommerce operators, agencies, consultants, and remote-first companies',
    currency: 'USD',
    relatedCaseSlug: 'aerovista',
    localSearchAngles: ['global search discovery', 'remote-first buyer trust', 'international conversion paths', 'multi-region SEO structure'],
  },
};

const aliasSeeds: PageSeed[] = (['lk', 'pk', 'int'] as RegionCode[]).flatMap((region) => {
  const meta = aliasRegionMeta[region];
  return aliasServiceCatalog.map((service) => ({
    slug: service.slug,
    region,
    title: `${service.name} ${meta.market} | Jawrah Pixel`,
    h1: `${service.name} ${meta.market}`,
    description: `Premium ${service.name.toLowerCase()} for ${meta.market} brands that need credible design, fast performance, search-ready structure, and conversion-focused execution.`,
    keywords: service.keywords.map((keyword) => `${keyword} ${meta.market}`),
    serviceName: `${service.name} ${meta.market}`,
    market: meta.market,
    audience: meta.audience,
    priceSignal: `${service.name} investment is scoped in ${meta.currency} around strategy, content depth, integrations, page complexity, launch support, and long-term growth needs.`,
    primaryOutcome: `a stronger ${service.name.toLowerCase()} asset that improves trust, visibility, and qualified inquiry quality for ${meta.market} buyers`,
    route: `/${region}/${service.slug}`,
    relatedCaseSlug: meta.relatedCaseSlug,
    positioning: `${service.name} for ${meta.market} should work as a commercial system, not a generic page or isolated visual asset.`,
    buyerTriggers: [...service.buyerTriggers],
    localSearchAngles: meta.localSearchAngles,
    technologyAngles: [...service.technologyAngles],
    deliverables: [...service.deliverables],
    relatedServices: [
      { label: 'Services', path: '/services' },
      { label: 'Process', path: '/process' },
      { label: 'Contact', path: '/contact' },
    ],
  }));
});

export const serviceLandingPages: ServiceLandingPage[] = [...seeds, ...aliasSeeds].map((seed) => ({
  ...seed,
  sections: buildSections(seed),
  process: buildProcess(seed.serviceName),
  faqs: buildFaqs(seed),
}));

export function getServiceLandingPage(slug?: string, region?: RegionCode) {
  if (!slug) return null;
  return serviceLandingPages.find((page) => page.slug === slug && (!region || page.region === region)) ?? null;
}

export function getServiceLandingPagesForRegion(region: RegionCode) {
  return serviceLandingPages.filter((page) => page.region === region);
}
