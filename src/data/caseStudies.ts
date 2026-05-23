export interface CaseListItem {
  title: string;
  slug: string;
  category: string;
  description: string;
  tags: string[];
  perf: number;
  seo: number;
  char: string;
  thumbnail?: string;
  color: string;
  badgeColor: string;
}

export interface CaseDetails {
  title: string;
  slug: string;
  category: string;
  industry: string;
  client: string;
  overview: string;
  budget: string;
  duration: string;
  websiteUrl?: string;
  desktopImage?: string;
  mobileImage?: string;
  goals: string[];
  challenges: string[];
  processSteps: { phase: string; title: string; desc: string }[];
  technologies: string[];
  solutions: string[];
  perfScores: { perf: number; seo: number; access: number; best: number };
  desktopHighlights: { title: string; desc: string }[];
  mobileHighlights: { title: string; desc: string }[];
  results: { metric: string; val: string; desc: string }[];
  testimonial: { quote: string; author: string; role: string; avatar: string };
  metaDesc: string;
}

export const ALL_CASE_STUDIES: Record<string, CaseDetails & { region: 'lk' | 'pk' }> = {
  'zenvor': {
    region: 'lk',
    title: "Zenvor Premium Streetwear",
    slug: "zenvor",
    category: "Luxury E-commerce & Brand boutique",
    industry: "Fashion & Premium Apparel",
    client: "Zenvor Streetwear",
    websiteUrl: "https://zenvor.lk",
    desktopImage: "/assets/case-studies/zenvor/desktop.png",
    mobileImage: "/assets/case-studies/zenvor/mobile.png",
    overview: "A high-performance digital flagship boutique architected for one of the leading premium streetwear houses. The build translates architectural silhouettes and heavyweight cotton essentials into a cinematic, ultra-fast e-commerce experience.",
    budget: "LKR 2,400,000",
    duration: "6 Weeks",
    goals: [
      "Architect a highly authoritative luxury e-commerce portal with top-tier Lighthouse audit scores.",
      "Integrate secure checkout channels and real-time inventory synchronization.",
      "Achieve significant organic visibility for premium streetwear and minimal luxury design search terms."
    ],
    challenges: [
      "High-resolution professional photography was causing performance bottlenecks on mobile networks.",
      "Need to represent the 'minimal luxury' brand aesthetic without sacrificing e-commerce conversion power.",
      "Requirement for a seamless user experience across various high-end fashion browsing devices."
    ],
    processSteps: [
      { phase: "Phase 1", title: "Brand Blueprinting", desc: "Defining minimal luxury layout grids, atmospheric typography pairing, and visual pacing." },
      { phase: "Phase 2", title: "Cinematic UI Layout", desc: "Designing high-contrast product cards, hardware-accelerated transitions, and responsive lookbooks." },
      { phase: "Phase 3", title: "System Engineering", desc: "Integrating Supabase for inventory, custom checkout flows, and edge asset routing." }
    ],
    technologies: ["React OS", "Vite", "Tailwind CSS v4", "Framer Motion", "Supabase", "Edge CDN"],
    solutions: [
      "Custom lightning-fast e-commerce layouts with 100% responsive readability.",
      "Secure checkout-ready infrastructure connected to the Admin dashboard.",
      "Fully structured technical SEO and minimal aesthetic layout optimization."
    ],
    perfScores: { perf: 99, seo: 98, access: 98, best: 99 },
    desktopHighlights: [
      { title: "Atmospheric Lookbooks", desc: "Full-bleed cinematic photography layouts showing fine heavyweight cotton textiles clearly." },
      { title: "Fluid Checkout Lane", desc: "Optimized e-commerce funnel that segments luxury prospects immediately." }
    ],
    mobileHighlights: [
      { title: "Thumb-Optimal Browse", desc: "Instant product selection flows sized perfectly for quick mobile swipes and high-speed browsing." },
      { title: "Crisp Material Details", desc: "Read highly detailed fabric specifications without visual pinch or stretch." }
    ],
    results: [
      { metric: "Organic SEO Gain", val: "+340%", desc: "Search visibility lift on competitive premium fashion keywords." },
      { metric: "Page Speed Rate", val: "0.28s", desc: "First contentful paint (FCP) rendering time on global edge servers." },
      { metric: "Conversion Rate", val: "+84%", desc: "Increase in direct digital checkout completions since launch." }
    ],
    testimonial: {
      quote: "Jawrah Pixel delivered an outstanding, lightning-fast platform that perfectly captures our minimal luxury essence. The search engine authority gain and conversion boost have been phenomenal.",
      author: "Abdurrahman Shafie",
      role: "Creative Director",
      avatar: "AS"
    },
    metaDesc: "Explore Zenvor Premium Streetwear's luxury e-commerce and boutique website design case study by Jawrah Pixel."
  },
  'jawrah-pixel': {
    region: 'lk',
    title: "Jawrah Pixel OS",
    slug: "jawrah-pixel",
    category: "Internal Operations & Client CRM",
    industry: "Digital Engineering & Luxury Branding",
    client: "Jawrah Pixel Sri Lanka",
    websiteUrl: "https://jawrah-pixel-itpe.vercel.app/",
    desktopImage: "/assets/case-studies/jawrah-pixel/desktop.png",
    mobileImage: "/assets/case-studies/jawrah-pixel/mobile.png",
    overview: "Official presence and operational command desk of Jawrah Pixel. Incorporates our automated discovery bookkeeping portals, secure client proposal vaults, and collaborative agent modules.",
    budget: "LKR 2,500,000",
    duration: "5 Weeks",
    goals: [
      "Build a robust flagship workspace connecting global clients to engineering team leads.",
      "Implement fully secure client portals and real-time project milestone tracking grids.",
      "Achieve 100/100 Lighthouse benchmark speed performance."
    ],
    challenges: [
      "Inefficient client coordination through generic chat platforms led to bloated feedback rounds.",
      "Difficulty displaying live project progress logs securely.",
      "Need to demonstrate absolute peak engineering capability through our own agency website."
    ],
    processSteps: [
      { phase: "Phase 1", title: "Product Blueprint", desc: "Analyzing multi-tier dashboard structures and RLS database requirements." },
      { phase: "Phase 2", title: "Aesthetic Core UI", desc: "Formulating standard pixel-crisp flag-ship theme components and premium logos." },
      { phase: "Phase 3", title: "Supabase Integration", desc: "Mapping active client tables, ticket structures, and secure authentication lines." }
    ],
    technologies: ["React Enterprise Router", "Tailwind CSS", "Supabase Client", "D3.js Layouts", "PostgreSQL RLS"],
    solutions: [
      "Fully secure, multi-tier administration panel for agents, admins, and verified customers.",
      "Clean visual tracker for project velocity and customized deliverable milestones.",
      "Unified global contact hub featuring our customized Secure WhatsApp routing desk."
    ],
    perfScores: { perf: 99, seo: 100, access: 98, best: 97 },
    desktopHighlights: [
      { title: "Bento Analytics Control", desc: "An operations center combining ticketing lines, budgets, and milestones." },
      { title: "Secure Proposal Valleys", desc: "Encryption protected private sections storing design deliverables and contracts." }
    ],
    mobileHighlights: [
      { title: "Agent Fast-Desk", desc: "An optimized administrative control center sized comfortably for mobile viewport sizes." },
      { title: "Interactive Milestone Status", desc: "Swipe to view approved milestones and remaining design sprint deadlines." }
    ],
    results: [
      { metric: "Operational Velocity", val: "+195%", desc: "Increase in design-sprint approval cycles." },
      { metric: "Client Retention Rate", val: "99.2%", desc: "Unmatched customer portal satisfaction score." },
      { metric: "Mobile Speed Rating", val: "0.22s", desc: "Optimized time-to-interactive showing zero render layout shift (CLS)." }
    ],
    testimonial: {
      quote: "Our presence has scaled to serve international clients securely. The customized client portal has made collaboration exceptionally transparent.",
      author: "Prageeth Fernando",
      role: "Lead Systems Architect",
      avatar: "PF"
    },
    metaDesc: "Discover Jawrah Pixel's leading operational client CRM, custom bento dashboard, and Supabase database architecture."
  },
  'velora-estates': {
    region: 'lk',
    title: "Velora Estates",
    slug: "velora-estates",
    category: "Luxury Real Estate Portal",
    industry: "Real Estate & Property Development",
    client: "Velora Group",
    websiteUrl: "https://real-estate-jawrah-project.netlify.app/",
    desktopImage: "/assets/case-studies/velora/desktop.png",
    mobileImage: "/assets/case-studies/velora/mobile.png",
    overview: "A flagship digital portal architected for a premium real estate group. The platform translates complex property portfolios into a cinematic, high-speed browsing experience with integrated lead management.",
    budget: "LKR 3,200,000",
    duration: "8 Weeks",
    goals: [
      "Architect a highly authoritative real estate portal with top-tier search visibility.",
      "Integrate high-resolution 3D virtual tour embeds without sacrificing performance.",
      "Achieve significant organic visibility for luxury property and real estate investment terms."
    ],
    challenges: [
      "Extremely high-resolution property photography was bloating page weights.",
      "Complex property filtering requirements needed to be instant and frictionless on mobile.",
      "Integration of multiple data streams for real-time availability tracking."
    ],
    processSteps: [
      { phase: "Phase 1", title: "Visual Formulation", desc: "Defining high-contrast property layouts, premium serif accents, and cinematic pacing." },
      { phase: "Phase 2", title: "Interactive Lead Desk", desc: "Building modular lead capture forms and automated property alert systems." },
      { phase: "Phase 3", title: "Performance Tuning", desc: "Optimizing asset delivery and implementing intelligent property data caching." }
    ],
    technologies: ["React OS", "Vite", "Tailwind CSS v4", "Framer Motion", "Supabase", "Edge CDN"],
    solutions: [
      "Custom lightning-fast real estate layouts with 100% responsive readability.",
      "Secure lead management infrastructure connected to the Admin dashboard.",
      "Fully structured technical SEO and architectural layout optimization."
    ],
    perfScores: { perf: 97, seo: 99, access: 98, best: 97 },
    desktopHighlights: [
      { title: "Cinematic Inventories", desc: "Full-bleed architectural spans and interactive property galleries." },
      { title: "Instant Search Desk", desc: "Bespoke property filters that update the global inventory state in real-time." }
    ],
    mobileHighlights: [
      { title: "Thumb-Optimal Cards", desc: "Frictionless property selection flows sized perfectly for quick mobile swipes." },
      { title: "Direct Connect Nodes", desc: "One-tap button to package and transmit property inquiries to verified agents." }
    ],
    results: [
      { metric: "Organic SEO Gain", val: "+280%", desc: "Search visibility lift on competitive luxury real estate keywords." },
      { metric: "Lead Conversion", val: "+94%", desc: "Increase in verified property inquiries since platform launch." },
      { metric: "Mobile Speed Rate", val: "0.32s", desc: "First contentful paint (FCP) rendering time on global edge servers." }
    ],
    testimonial: {
      quote: "Velora Estates has been transformed. Our property portfolio is presented with absolute luxury and the speed is unmatched in the real estate sector.",
      author: "Sarath Wijesinghe",
      role: "CEO, Veloura Estates",
      avatar: "SW"
    },
    metaDesc: "Explore Velora Estates' luxury real estate portal design and development case study by Jawrah Pixel."
  },
  'shabnam-jewellers': {
    region: 'pk',
    title: "Shabnam Jewellers",
    slug: "shabnam-jewellers",
    category: "Bespoke Ecommerce & UI Branding",
    industry: "Fine Jewelry & Luxury Retail",
    client: "Shabnam International Ltd.",
    websiteUrl: "https://shabnam-jawrah-project.netlify.app/",
    desktopImage: "/assets/case-studies/shabnam-jewellers/desktop.png",
    mobileImage: "/assets/case-studies/shabnam-jewellers/mobile.png",
    overview: "A premium digital flagship boutique engineered for one of Pakistan's elite luxury jewellery houses. The high-performance experience translates fine heritage gold designs into highly curated, responsive digital layouts.",
    budget: "PKR 2,200,000",
    duration: "6 Weeks",
    goals: [
      "Deliver a lightning-fast premium ecommerce showcase to display highly detailed karats of gold and diamond photography.",
      "Incorporate secure checkout supporting bank wire, Easypaisa, JazzCash, and direct WhatsApp invoice routing.",
      "Maintain average page load times under 0.5 seconds globally using edge rendering cachers."
    ],
    challenges: [
      "Legacy website media loads were exceedingly slow, leading to high abandon rates on premium catalog paths.",
      "High image counts with heavy megapixel files from professional jewellery photo shoots damaged core web vitals.",
      "Inflexible backend workflows which didn't allow real-time product price adjustments in response to global gold market fluctuations."
    ],
    processSteps: [
      { phase: "Phase 1 - Discovery", title: "Luxury Brand Blueprinting", desc: "Interactive mood boards, custom layout grids, spacing proportions definition, typography pairing." },
      { phase: "Phase 2 - Design", title: "Cinematic High-Fidelity UI", desc: "Crafting fine layout mockups, micro-interaction flows, multi-device view models, golden ratios." },
      { phase: "Phase 3 - Arch", title: "Database & API Schema", desc: "Supabase Postgres layout, secure Row Level Security (RLS) definitions, local payment gateway hooks, gold price parser." },
      { phase: "Phase 4 - Launch", title: "Edge Caching Optimizations", desc: "Setting up CDN edge distribution network nodes, lazy loading assets, compression ratios tuning." }
    ],
    technologies: ["React Router-DOM", "Vite", "Tailwind CSS", "Supabase DB", "PostgreSQL", "AlfaPay API", "Framer Motion", "Vercel Edge CDN"],
    solutions: [
      "Next-gen lazy image layout utilizing SVG color placeholders and responsive resolution pipelines.",
      "Autopilot gold price API crawler that synchronizes individual retail piece appraisals instantly every hour.",
      "A streamlined checkout flow featuring simple 3-step validation, mobile-wallet payment nodes, and direct client relationship manager support."
    ],
    perfScores: { perf: 98, seo: 96, access: 99, best: 97 },
    desktopHighlights: [
      { title: "Bespoke Grid Layout", desc: "Expansive layouts with geometric dividers, near-black cards, and large luxury spacing." },
      { title: "Dynamic Product Appraiser", desc: "Interactive weight-to-karat calculators showing real-time appraisal and immediate checkout actions." }
    ],
    mobileHighlights: [
      { title: "Thumb-Optimal Checkout", desc: "All navigation triggers and primary call-to-actions placed safely within thumb-reach boundary grids." },
      { title: "WhatsApp Quick Connect", desc: "Instant checkout routing that packages the shopping bag details directly into a beautiful template agent inquiry." }
    ],
    results: [
      { metric: "Conversion Boost", val: "+148%", desc: "Direct client conversions on highly appraised gold sets in the first 30 days." },
      { metric: "Page Speed Rate", val: "0.45s", desc: "Average time to interactive (TTI) rendering across standard desktop devices." },
      { metric: "Organic SEO Gain", val: "+215%", desc: "Search visibility lift on local luxury keywords 'Pakistani custom gold'." }
    ],
    testimonial: {
      quote: "Jawrah Pixel didn't just rebuild our website; they codified the soul of our fine heritage jewellery. The website is mesmerizing, ultra-fast, and our sales inquiries have skyrocketed.",
      author: "M. Faris Shabnam",
      role: "Managing Director",
      avatar: "FS"
    },
    metaDesc: "Explore Shabnam Jewellers' flagship digital ecommerce and custom gold appraiser case study by Jawrah Pixel."
  },
  'aerovista-travels': {
    region: 'pk',
    title: "AeroVista Travels",
    slug: "aerovista-travels",
    category: "Luxury Travel System & Booking Engine",
    industry: "High-Ticket Tourism & Corporate Travel",
    client: "AeroVista Pakistan Ltd.",
    overview: "Highly responsive booking platform and travel scheduler processing curated itineraries safely. Built with elite travel API custom edge-cachers, reducing backend query latency by 91% for regional and international travelers.",
    budget: "PKR 1,950,000",
    duration: "5 Weeks",
    websiteUrl: "https://aero-vista-jawrah-project.vercel.app/#home",
    desktopImage: "/assets/case-studies/aero-vista/desktop.png",
    mobileImage: "/assets/case-studies/aero-vista/mobile.png",
    goals: [
      "Deliver a seamless multi-city flight and luxury hotel itinerary planner.",
      "Optimize heavy nested data objects from flight APIs for high speed on mobile networks.",
      "Build dynamic itinerary tracking guides accessible on and offline."
    ],
    challenges: [
      "Unoptimized, multi-nested flight database queries were blocking mobile search operations.",
      "High layout shifts occurred when live travel price variables refreshed dynamically.",
      "Poor user retention on traditional booking forms on 3G and 4G networks."
    ],
    processSteps: [
      { phase: "Phase 1", title: "API Mapping Sprints", desc: "Prototyping payload compression, request throttling, and custom cache intervals." },
      { phase: "Phase 2", title: "Atmospheric UI Mockups", desc: "Crafting beautiful cinematic layout cards, interactive maps, and responsive sliders." },
      { phase: "Phase 3", title: "Client Portal Sync", desc: "Developing collaborative customer sections where group members access shared files." }
    ],
    technologies: ["React Router Hooks", "Vite JS", "Tailwind CSS", "Redis Edge Cache", "Supabase PostgreSQL", "Amadeus API Layer"],
    solutions: [
      "Custom scheduler dashboards grouping tickets, hotels, and tourist guides in interactive tables.",
      "A fast asynchronous pipeline utilizing memory-cached global transit data.",
      "Direct digital notification nodes syncing schedules with local coordinate offices."
    ],
    perfScores: { perf: 97, seo: 95, access: 98, best: 96 },
    desktopHighlights: [
      { title: "Bento Planner Map", desc: "Side-by-side split screen showing interactive travel legs intersecting geographic coordinates." },
      { title: "Corporate Quote Hub", desc: "Corporate dashboard processing automated bulk travel requests in under 60 seconds." }
    ],
    mobileHighlights: [
      { title: "Offline Itinerary Viewer", desc: "Client Portal data cache storing flight numbers, schedules, and PDF coupons locally." },
      { title: "Thumb-Sized Gate Actions", desc: "Critical actions safely layouted for easy access under bumpy transport states." }
    ],
    results: [
      { metric: "Inquiry Latency Rate", val: "-91%", desc: "Reduction in travel database search response duration." },
      { metric: "Active Booking Sales", val: "+88%", desc: "Direct client itinerary configurations created in the first 45 days." },
      { metric: "Mobile Conversion", val: "+160%", desc: "Increase in booking form completions on cellular connection nodes." }
    ],
    testimonial: {
      quote: "Our clients enjoy an effortless booking process. The offline itinerary vault has drastically improved passenger satisfaction during transits.",
      author: "Zubair Shah",
      role: "Operations Manager",
      avatar: "ZS"
    },
    metaDesc: "Review AeroVista Travels custom itinerary scheduler and API optimization case study."
  }
};

export const caseStudiesList: Record<'lk' | 'pk', CaseListItem[]> = {
  lk: [
    {
      title: "Zenvor Premium",
      slug: "zenvor",
      category: "Luxury E-commerce Boutique",
      description: "A high-performance flagship digital boutique for Zenvor. Translates minimal luxury silhouettes and heavyweight cotton essentials into a cinematic shopping experience.",
      tags: ["Luxury E-commerce", "Minimal Design", "High Perf", "Supabase"],
      perf: 99,
      seo: 98,
      char: "Z",
      thumbnail: "/assets/case-studies/zenvor/desktop.png",
      color: "from-brand-cyan/10 to-transparent",
      badgeColor: "text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5"
    },
    {
      title: "Jawrah Pixel OS",
      slug: "jawrah-pixel",
      category: "Internal Operations & Client CRM",
      description: "Official presence and client workspace command systems. Features active milestone monitors, collaborative tickets, and secure contract vaults.",
      tags: ["D3.js Charts", "Database Security", "Supabase RLS"],
      perf: 99,
      seo: 100,
      char: "J",
      thumbnail: "/assets/case-studies/jawrah-pixel/desktop.png",
      color: "from-white/5 to-transparent",
      badgeColor: "text-white border-white/10 bg-white/5"
    },
    {
      title: "Velora Estates",
      slug: "velora-estates",
      category: "Luxury Real Estate Portal",
      description: "A flagship digital portal architected for Velora. Translates complex property portfolios into a cinematic, high-speed browsing experience.",
      tags: ["Real Estate", "3D Virtual Tours", "Lead Management"],
      perf: 97,
      seo: 99,
      char: "V",
      thumbnail: "/assets/case-studies/velora/desktop.png",
      color: "from-amber-600/10 to-transparent",
      badgeColor: "text-amber-500 border-amber-600/20 bg-amber-600/5"
    },
    {
      title: "Shabnam Jewellers",
      slug: "shabnam-jewellers",
      category: "Bespoke Ecommerce & UI Branding",
      description: "A premium digital flagship boutique representing fine gold heritage with automated appraisal systems.",
      tags: ["Jewelry Tech", "Gold Appraiser", "Local Gateway"],
      perf: 98,
      seo: 96,
      char: "S",
      thumbnail: "/assets/case-studies/shabnam-jewellers/desktop.png",
      color: "from-amber-500/10 to-transparent",
      badgeColor: "text-amber-400 border-amber-500/20 bg-amber-500/5"
    },
    {
      title: "AeroVista Travels",
      slug: "aerovista-travels",
      category: "Luxury Travel System",
      description: "Highly responsive booking platform and travel scheduler processing curated itineraries safely. Engineered for maximum travel authority.",
      tags: ["Travel Tech", "API Integration", "Booking Engine"],
      perf: 97,
      seo: 95,
      char: "A",
      thumbnail: "/assets/case-studies/aero-vista/desktop.png",
      color: "from-blue-600/10 to-transparent",
      badgeColor: "text-blue-500 border-blue-600/20 bg-blue-600/5"
    }
  ],
  pk: [
    {
      title: "Zenvor Premium",
      slug: "zenvor",
      category: "Luxury E-commerce Boutique",
      description: "High-performance digital flagship boutique for Zenvor's premium streetwear collections. Engineered for minimal luxury and maximum speed.",
      tags: ["React SPA", "Supabase", "Luxury fashion", "SEO Audit"],
      perf: 99,
      seo: 98,
      char: "Z",
      thumbnail: "/assets/case-studies/zenvor/desktop.png",
      color: "from-brand-cyan/10 to-transparent",
      badgeColor: "text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5"
    },
    {
      title: "Jawrah Pixel OS",
      slug: "jawrah-pixel",
      category: "Internal Operations & Client CRM",
      description: "Official presence and client workspace command systems. Features active milestone monitors, collaborative tickets, and secure contract vaults.",
      tags: ["D3.js Charts", "Database Security", "Supabase RLS"],
      perf: 99,
      seo: 100,
      char: "J",
      thumbnail: "/assets/case-studies/jawrah-pixel/desktop.png",
      color: "from-white/5 to-transparent",
      badgeColor: "text-white border-white/10 bg-white/5"
    },
    {
      title: "Velora Estates",
      slug: "velora-estates",
      category: "Luxury Real Estate Portal",
      description: "A flagship digital portal architected for Velora. Translates complex property portfolios into a cinematic, high-speed browsing experience.",
      tags: ["Real Estate", "3D Virtual Tours", "Lead Management"],
      perf: 97,
      seo: 99,
      char: "V",
      thumbnail: "/assets/case-studies/velora/desktop.png",
      color: "from-amber-600/10 to-transparent",
      badgeColor: "text-amber-500 border-amber-600/20 bg-amber-600/5"
    },
    {
      title: "Shabnam Jewellers",
      slug: "shabnam-jewellers",
      category: "Bespoke Ecommerce & UI Branding",
      description: "A premium digital flagship boutique representing fine gold heritage with automated appraisal systems.",
      tags: ["Jewelry Tech", "Gold Appraiser", "Local Gateway"],
      perf: 98,
      seo: 96,
      char: "S",
      thumbnail: "/assets/case-studies/shabnam-jewellers/desktop.png",
      color: "from-amber-500/10 to-transparent",
      badgeColor: "text-amber-400 border-amber-500/20 bg-amber-500/5"
    },
    {
      title: "AeroVista Travels",
      slug: "aerovista-travels",
      category: "Luxury Travel System",
      description: "Highly responsive booking platform and travel scheduler processing curated itineraries safely. Engineered for maximum travel authority.",
      tags: ["Travel Tech", "API Integration", "Booking Engine"],
      perf: 97,
      seo: 95,
      char: "A",
      thumbnail: "/assets/case-studies/aero-vista/desktop.png",
      color: "from-blue-600/10 to-transparent",
      badgeColor: "text-blue-500 border-blue-600/20 bg-blue-600/5"
    }
  ]
};

export function getCaseStudiesForRegion(region: 'lk' | 'pk'): CaseListItem[] {
  return caseStudiesList[region];
}

export function getCaseStudyDetails(slug: string): CaseDetails | null {
  return ALL_CASE_STUDIES[slug] || null;
}
