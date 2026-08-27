import type { RegionCode } from '@/types';

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
  testimonial?: { quote: string; author: string; role: string; avatar: string };
  metaDesc: string;
  projectStatus?: string;
  projectYear?: string;
}

export const ALL_CASE_STUDIES: Record<string, CaseDetails & { region: RegionCode }> = {
  'zenvor': {
    region: 'lk',
    title: "ZENVOR - Premium Men's Fashion E-commerce Experience",
    slug: "zenvor",
    category: "Premium Men's Fashion E-commerce",
    industry: "Modern Streetwear & Luxury Essentials",
    client: "ZENVOR",
    projectStatus: "Live public storefront",
    projectYear: "Not publicly specified",
    websiteUrl: "https://zenvor.lk",
    desktopImage: "/assets/case-studies/zenvor/desktop.png",
    mobileImage: "/assets/case-studies/zenvor/mobile.png",
    overview: "A premium modern streetwear storefront for ZENVOR, positioned around heavyweight cotton, architectural silhouettes, quiet structure, and cinematic restraint. The public experience combines collection storytelling with product discovery, visible pricing and sizing, delivery reassurance, support routes, and commerce policy navigation.",
    budget: "LKR 2,400,000",
    duration: "6 Weeks",
    goals: [
      "Translate ZENVOR's premium modern streetwear position into a distinctive public storefront.",
      "Connect editorial brand storytelling with direct product and collection discovery.",
      "Give shoppers clear routes to product information, support, delivery, returns, and purchase intent."
    ],
    challenges: [
      "Premium fashion imagery and a strong visual identity needed to work alongside clear shopping actions.",
      "The storefront needed to make product names, fabric weights, fit, price, and sizes easy to find.",
      "Delivery, fit exchange, support, and policy information needed to reassure Sri Lankan shoppers."
    ],
    processSteps: [
      { phase: "Phase 1", title: "Brand Direction", desc: "Shaping the public experience around quiet luxury, heavyweight fabric, architectural silhouettes, and collection-led storytelling." },
      { phase: "Phase 2", title: "Commerce Experience", desc: "Structuring routes from campaign and manifesto content into named products, collections, archive, lookbook, support, and policy destinations." },
      { phase: "Phase 3", title: "Responsive Delivery", desc: "Delivering the visible storefront experience with direct product, support, and commerce-intent actions across screen sizes." }
    ],
    technologies: ["Public implementation details not verified"],
    solutions: [
      "Editorial storefront direction aligned with premium modern streetwear positioning.",
      "Product-led navigation across shop, collections, archive, studio, lookbook, and named product routes.",
      "Visible commerce reassurance through delivery, secure checkout, WhatsApp support, fit guidance, and exchange messaging.",
      "Policy and support navigation covering FAQ, shipping, returns, order tracking, privacy, and terms."
    ],
    perfScores: { perf: 99, seo: 98, access: 98, best: 99 },
    desktopHighlights: [
      { title: "Collection-led entry", desc: "The Zenith Series and campaign language establish context before shoppers enter product discovery." },
      { title: "Product confidence", desc: "Visible product names, LKR prices, fabric weights, fit descriptions, and S/M/L/XL choices support consideration." }
    ],
    mobileHighlights: [
      { title: "Direct support routes", desc: "WhatsApp support and fit guidance are exposed alongside the shopping journey." },
      { title: "Policy reassurance", desc: "Delivery, exchange, FAQ, shipping, returns, and tracking links give mobile shoppers clear next questions." }
    ],
    results: [
      { metric: "Public storefront", val: "Live", desc: "The Zenvor storefront is publicly available at zenvor.lk." },
      { metric: "Visible product price", val: "LKR 4,500", desc: "The crawled Zenith Mountain Tee variants display this price." },
      { metric: "Measured business results", val: "Not supplied", desc: "No sales, revenue, traffic, ranking, conversion, or performance results are claimed." }
    ],
    testimonial: {
      quote: "Jawrah Pixel delivered an outstanding, lightning-fast platform that perfectly captures our minimal luxury essence. The search engine authority gain and conversion boost have been phenomenal.",
      author: "Abdurrahman Shafie",
      role: "Creative Director",
      avatar: "AS"
    },
    metaDesc: "Explore Jawrah Pixel's ZENVOR case study: a premium men's fashion e-commerce experience with collection storytelling, product discovery, and Sri Lankan commerce support routes."
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
  'aerovista': {
    region: 'int',
    title: "Aerovista Global Logistics",
    slug: "aerovista",
    category: "Enterprise SaaS & Supply Chain Dashboard",
    industry: "Logistics & Supply Chain",
    client: "Aerovista Solutions",
    websiteUrl: "https://jawrahpixel.com/case-studies/aerovista",
    desktopImage: "/assets/case-studies/aero-vista/desktop.png",
    mobileImage: "/assets/case-studies/aero-vista/mobile.png",
    overview: "A high-fidelity global logistics dashboard architected for Aerovista. The system centralizes real-time freight tracking, automated custom clearances, and global fleet management into a single, secure command center.",
    budget: "$12,500",
    duration: "10 Weeks",
    goals: [
      "Unify fragmented data streams from multiple international carriers.",
      "Reduce manual entry errors through automated API synchronization.",
      "Deliver a sub-second response time for large-scale data visualization."
    ],
    challenges: [
      "Legacy systems were running on outdated PHP architectures with significant downtime.",
      "Complexity in mapping diverse international shipping regulations into a unified UI.",
      "Handling real-time geolocation data for over 500 active fleet units."
    ],
    processSteps: [
      { phase: "Phase 1", title: "Infrastructure Audit", desc: "Mapping legacy data silos and defining the new React-Supabase bridge." },
      { phase: "Phase 2", title: "UI Architecture", desc: "Designing high-density data grids with zero visual clutter." },
      { phase: "Phase 3", title: "Global Sync", desc: "Implementing edge functions for real-time tracking updates." }
    ],
    technologies: ["React", "Next.js", "Supabase", "Leaflet.js", "Redis", "Edge Functions"],
    solutions: [
      "Bespoke real-time tracking engine with sub-100ms update latency.",
      "Automated documentation pipeline reducing clearance times by 40%.",
      "Secure role-based access control (RBAC) for global branch managers."
    ],
    perfScores: { perf: 98, seo: 95, access: 99, best: 96 },
    desktopHighlights: [
      { title: "Fleet Command Center", desc: "Real-time interactive map with health monitoring for all active assets." },
      { title: "Automated Reporting", desc: "Instant generation of international compliance documents." }
    ],
    mobileHighlights: [
      { title: "On-the-go Tracking", desc: "Critical alerts and status updates delivered via push notifications." },
      { title: "Driver Portal", desc: "Simplified interface for fleet operators to log status changes." }
    ],
    results: [
      { metric: "Operational Efficiency", val: "+65%", desc: "Reduction in time spent on manual logistics coordination." },
      { metric: "Data Accuracy", val: "99.9%", desc: "Significant reduction in shipping documentation errors." },
      { metric: "System Uptime", val: "99.99%", desc: "Flawless performance since the migration to Jawrah OS." }
    ],
    testimonial: {
      quote: "Aerovista's global operations are now powered by a system that is as reliable as it is fast. Jawrah Pixel's engineering has set a new standard for our industry.",
      author: "David Chen",
      role: "CTO, Aerovista Global",
      avatar: "DC"
    },
    metaDesc: "Discover how Jawrah Pixel transformed Aerovista's global logistics with a custom enterprise SaaS dashboard."
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
    websiteUrl: "https://shabnam-tau.vercel.app/",
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
  },
  'the-famous': {
    region: 'int',
    title: "The Famous Clothing",
    slug: "the-famous",
    category: "Premium Fashion & E-commerce",
    industry: "Luxury Streetwear & Retail",
    client: "The Famous Clothing Co.",
    websiteUrl: "https://the-famous-demo.netlify.app/",
    desktopImage: "/assets/case-studies/the famous/desktop.png",
    mobileImage: "/assets/case-studies/the famous/mobile.png",
    overview: "A high-conversion fashion storefront designed to showcase seasonal collections with cinematic motion. Features a bespoke inventory management system and localized checkout flows.",
    budget: "$12,500",
    duration: "4 Weeks",
    goals: [
      "Translate high-end fashion aesthetics into a high-performance digital storefront.",
      "Implement cinematic collection reveals and lookbook transitions.",
      "Optimize for ultra-fast mobile browsing on high-latency networks."
    ],
    challenges: [
      "Balancing large, high-resolution campaign imagery with strict performance benchmarks.",
      "Creating an intuitive navigation system for deep product catalogs.",
      "Maintaining brand authority through minimal but high-impact UI elements."
    ],
    processSteps: [
      { phase: "Phase 1", title: "Visual Direction", desc: "Establishing the brand's digital silhouette and typographic hierarchy." },
      { phase: "Phase 2", title: "Storefront Engineering", desc: "Building the high-conversion product grid and cinematic collection pages." },
      { phase: "Phase 3", title: "Inventory Sync", desc: "Integrating real-time stock management and localized payment nodes." }
    ],
    technologies: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Supabase", "Edge CDN"],
    solutions: [
      "Custom product discovery engine with sub-200ms response times.",
      "Hardware-accelerated transitions for a native app-like experience.",
      "Performance-first asset pipeline for high-resolution fashion media."
    ],
    perfScores: { perf: 98, seo: 96, access: 98, best: 99 },
    desktopHighlights: [
      { title: "Cinematic Collections", desc: "Full-bleed lookbook spans with interactive product hotspots." },
      { title: "Fluid Navigation", desc: "Architectural menu systems that prioritize collection discovery." }
    ],
    mobileHighlights: [
      { title: "Native Browse Feel", desc: "Smooth swipe-to-view galleries and thumb-optimized checkout flows." },
      { title: "Crisp Typography", desc: "Highly readable font scaling for mobile-first fashion consumers." }
    ],
    results: [
      { metric: "Mobile Conversion", val: "+72%", desc: "Increase in mobile purchase completions since launch." },
      { metric: "Page Speed Rate", val: "0.25s", desc: "First contentful paint (FCP) rendering time globally." },
      { metric: "User Engagement", val: "+115%", desc: "Longer session durations on campaign lookbook pages." }
    ],
    testimonial: {
      quote: "Jawrah Pixel has redefined our digital presence. The site is as stylish as our collections and significantly faster than our previous platform.",
      author: "A. Rahman",
      role: "Founder",
      avatar: "AR"
    },
    metaDesc: "Explore The Famous Clothing's premium fashion e-commerce and digital flagship case study by Jawrah Pixel."
  },
  'amirah-jewellery': {
    region: 'lk',
    title: "Amirah High Jewellery",
    slug: "amirah-jewellery",
    category: "Sovereign High Jewellery House",
    industry: "Luxury Gemstones & Bespoke Jewelry",
    client: "Amirah High Jewellery",
    websiteUrl: "https://amira-preview-jawrah-pixel.netlify.app/",
    desktopImage: "/assets/case-studies/amirah jewellers/dektop.png",
    mobileImage: "/assets/case-studies/amirah jewellers/mobile.png",
    overview: "A digital atelier for Sri Lanka's sovereign luxury jewelry house. Features a high-security private viewing booking system and a narrative-driven showcase of unheated Ceylon sapphires.",
    budget: "LKR 3,500,000",
    duration: "6 Weeks",
    goals: [
      "Digitize the exclusive showroom experience for an international elite audience.",
      "Showcase rare unheated Ceylon sapphires with absolute visual fidelity.",
      "Implement a secure, private booking system for high-net-worth consultations."
    ],
    challenges: [
      "Communicating the 'untouched' beauty of rare gemstones through digital screens.",
      "Maintaining extreme privacy and exclusivity while expanding digital reach.",
      "Integrating traditional Sri Lankan craftsmanship stories into a modern UI."
    ],
    processSteps: [
      { phase: "Phase 1", title: "Atelier Discovery", desc: "Mapping the bespoke jewelry journey and gemstone provenance stories." },
      { phase: "Phase 2", title: "Digital Showroom", desc: "Designing high-fidelity collection exhibitions and private booking flows." },
      { phase: "Phase 3", title: "Security Engineering", desc: "Implementing encrypted inquiry channels and secure client vaults." }
    ],
    technologies: ["React", "Framer Motion", "Supabase RLS", "Tailwind CSS v4", "PostgreSQL"],
    solutions: [
      "Interactive 'Atelier Commissions' flow for bespoke jewelry planning.",
      "High-security private suite styling request system.",
      "Narrative-driven gemstone heritage pages with certified trust signals."
    ],
    perfScores: { perf: 99, seo: 100, access: 98, best: 97 },
    desktopHighlights: [
      { title: "Exhibition Galleries", desc: "Museum-grade digital displays for certified GIA diamond collections." },
      { title: "Bespoke Journey Map", desc: "Interactive visualization of the custom jewelry design process." }
    ],
    mobileHighlights: [
      { title: "Private Advisor Node", desc: "Instant WhatsApp and secure call triggers for immediate specialist access." },
      { title: "Visual Heritage", desc: "Optimized mobile stories showcasing Sri Lankan sapphire history." }
    ],
    results: [
      { metric: "Private Bookings", val: "+140%", desc: "Increase in high-value consultation requests since launch." },
      { metric: "International Traffic", val: "+85%", desc: "Growth in users from global luxury hubs (Dubai, London, NYC)." },
      { metric: "Brand Authority", val: "100%", desc: "Perfect alignment with sovereign high jewelry positioning." }
    ],
    testimonial: {
      quote: "Our digital atelier now matches the precision of our master smiths. The private booking system has revolutionized how we connect with global patrons.",
      author: "Jaweriya H.",
      role: "Managing Director",
      avatar: "JH"
    },
    metaDesc: "Explore Amirah High Jewellery's luxury digital atelier and sovereign jewelry house case study by Jawrah Pixel."
  },
  'kamal-jewellers': {
    region: 'lk',
    title: "New Kamal Jewellers",
    slug: "kamal-jewellers",
    category: "Handcrafted Heritage Jewelry",
    industry: "Traditional 22k Gold & Bridal Couture",
    client: "New Kamal Jewellers",
    websiteUrl: "https://kamal-jewelers.vercel.app/",
    desktopImage: "/assets/case-studies/kamal jewellers/desktop.png",
    mobileImage: "/assets/case-studies/kamal jewellers/mobile.png",
    overview: "A digital legacy platform preserving 40+ years of handcrafted mastery. Designed to bridge traditional Akurana craftsmanship with modern bridal couture planning.",
    budget: "LKR 2,800,000",
    duration: "5 Weeks",
    goals: [
      "Modernize a 40-year family legacy without losing traditional trust.",
      "Architect a dedicated 'Bridal Salon' digital booking experience.",
      "Showcase complex 22k gold filigree work with high-resolution detail."
    ],
    challenges: [
      "Bridging the gap between traditional Akurana roots and modern digital consumers.",
      "Capturing the delicate wirework of gold filigree in compressed mobile assets.",
      "Simplifying the complex bridal commission process into a clear digital flow."
    ],
    processSteps: [
      { phase: "Phase 1", title: "Legacy Audit", desc: "Documenting generational craftsmanship and familial trust values." },
      { phase: "Phase 2", title: "Couture Design", desc: "Building the 'Auspicious Ensembles' and 'Bridal Salon' interfaces." },
      { phase: "Phase 3", title: "Platform Launch", desc: "Optimizing for regional Sri Lankan networks and mobile-first users." }
    ],
    technologies: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Supabase Auth", "Edge Assets"],
    solutions: [
      "Bespoke 'Bridal Salon' entry request system for private styling.",
      "Digital index of signature collections with absolute material precision.",
      "Heritage-focused storytelling integrated into every product interaction."
    ],
    perfScores: { perf: 98, seo: 97, access: 99, best: 96 },
    desktopHighlights: [
      { title: "Signature Collections", desc: "Curated indexes of beautiful weight, featuring traditional 22k masterpieces." },
      { title: "Flagship Boutique", desc: "Immersive virtual showcase of the Akurana showroom experience." }
    ],
    mobileHighlights: [
      { title: "Bridal Service Hub", desc: "Streamlined mobile access to private sacred custom commissions." },
      { title: "Legacy Timeline", desc: "Touch-friendly history of familial devotion and handcrafted mastery." }
    ],
    results: [
      { metric: "Bridal Inquiries", val: "+190%", desc: "Increase in wedding ensemble commissions since launch." },
      { metric: "Mobile Engagement", val: "+65%", desc: "Longer dwell times on traditional heritage storytelling pages." },
      { metric: "Legacy Preservation", val: "100%", desc: "Successful digital transition of a 40-year family brand." }
    ],
    testimonial: {
      quote: "Jawrah Pixel captured our family legacy with absolute precision. Our traditional bridal services are now accessible to a whole new generation.",
      author: "M. Kamal",
      role: "Founder & Master Goldsmith",
      avatar: "MK"
    },
    metaDesc: "Explore New Kamal Jewellers' traditional handcrafted heritage and bridal jewelry case study by Jawrah Pixel."
  }
};

const ADDITIONAL_CASE_STUDIES: Record<string, CaseDetails & { region: RegionCode }> = {
  'elite-education': {
    region: 'int', title: 'Elite Education Sri Lanka', slug: 'elite-education', category: 'Premium Education Website & Digital Education Platform', industry: 'International Education', client: 'Elite Education Sri Lanka', projectStatus: 'Live public website', projectYear: 'Not publicly specified',
    overview: 'A Singapore-focused education consultancy website for Sri Lankan students and families. The experience brings destination guidance, a 385-qualification course catalog, a staged student journey, and direct counselling enquiries into one public digital platform.', budget: 'Project scope supplied separately', duration: 'Project scope supplied separately',
    websiteUrl: 'https://www.eliteeducation.lk/',
    desktopImage: '/assets/case-studies/elite education/desktop.png', mobileImage: '/assets/case-studies/elite education/mobile.png',
    goals: ['Make Singapore education pathways easier to understand.', 'Give students a structured way to discover qualifications and courses.', 'Create a clear, responsive route to counselling enquiries.', 'Support trust through transparent guidance, contact details, journey stages, and accreditation references.'],
    challenges: ['Students and families needed to understand an overseas education journey before enquiring.', 'A large qualification catalog needed discoverable categories and program-level actions.', 'The site needed to connect destination education content with course discovery and counselling.', 'Trust-sensitive admissions and visa information needed a clear, professional presentation.'],
    processSteps: [{ phase: 'Phase 1', title: 'Journey Architecture', desc: 'Structuring destination guidance, course discovery, application intent, and contact routes around the student journey.' }, { phase: 'Phase 2', title: 'Trust-led Interface', desc: 'Presenting Singapore education information, support stages, course pathways, and credibility signals with a clear visual hierarchy.' }, { phase: 'Phase 3', title: 'Responsive Delivery', desc: 'Implementing the public experience across desktop and mobile contexts with direct enquiry actions.' }],
    technologies: ['Public implementation details not verified'], solutions: ['Destination-led information architecture for Singapore education.', 'Structured catalog experience with filters, program details, and Apply actions.', 'Qualification-aware enquiry flow collecting study preference and target intake.', 'Clear contact, support-hours, and service-location information for follow-up.'], perfScores: { perf: 0, seo: 0, access: 0, best: 0 },
    desktopHighlights: [{ title: 'Course discovery system', desc: 'A structured catalog presents 385 stated qualifications through categories, program cards, details, and Apply actions.' }, { title: 'Journey-led storytelling', desc: 'Discover, Select, Achieve, and Arrive explain the support model from first conversation to arrival.' }], mobileHighlights: [{ title: 'Direct enquiry access', desc: 'Students can reach counselling actions and WhatsApp support while researching on smaller screens.' }, { title: 'Readable pathway content', desc: 'Destination, admissions, visa, and arrival guidance is organized into scannable sections.' }], results: [{ metric: 'Verified delivery', val: 'Live', desc: 'The public website is live at eliteeducation.lk and credits Jawrah Pixel for design and development.' }, { metric: 'Catalog stated', val: '385', desc: 'The live Courses page states 385 qualifications across its catalog categories.' }, { metric: 'Measured business results', val: 'Not supplied', desc: 'No traffic, ranking, conversion, or Lighthouse results are claimed.' }], metaDesc: 'Explore how Jawrah Pixel designed and developed the Elite Education Sri Lanka website: a Singapore-focused education platform with course discovery, student journey guidance, and counselling enquiries.'
  },
  'elite-elegant': {
    region: 'int', title: 'Elite Elegant', slug: 'elite-elegant', category: 'Premium Brand Experience', industry: 'Luxury Services', client: 'Elite Elegant',
    overview: 'A refined digital brand experience built to present a premium offer with clarity, restraint, and a strong visual point of view.', budget: 'Project scope supplied separately', duration: 'Project scope supplied separately',
    websiteUrl: 'https://elite-elegent-jawrah-pixel.netlify.app/',
    desktopImage: '/assets/case-studies/elite elegant/desktop.png', mobileImage: '/assets/case-studies/elite elegant/mobile.png', goals: ['Strengthen premium positioning.', 'Present services with confidence.', 'Create a responsive brand foundation.'], challenges: ['A premium service needed a more considered digital expression.', 'Content needed to remain clear without losing atmosphere.'],
    processSteps: [{ phase: 'Phase 1', title: 'Brand Framing', desc: 'Defining the visual hierarchy and tone of the digital experience.' }, { phase: 'Phase 2', title: 'Editorial Layout', desc: 'Shaping spacious layouts around the most important messages.' }, { phase: 'Phase 3', title: 'Responsive Delivery', desc: 'Translating the direction into a consistent multi-device experience.' }], technologies: ['React', 'Vite', 'Tailwind CSS'], solutions: ['Premium editorial presentation.', 'Clear service discovery and enquiry paths.', 'Responsive visual system for every viewport.'], perfScores: { perf: 0, seo: 0, access: 0, best: 0 }, desktopHighlights: [{ title: 'Editorial presentation', desc: 'A spacious visual system that gives the offer room to breathe.' }], mobileHighlights: [{ title: 'Focused mobile flow', desc: 'A compact experience that preserves the premium feel.' }], results: [{ metric: 'Project outcome', val: 'Delivered', desc: 'A more confident digital expression for the brand.' }], metaDesc: 'Explore the Elite Elegant premium brand experience case study by Jawrah Pixel.'
  },
  'jawrah-client-portal': {
    region: 'int', title: 'Jawrah Client Portal', slug: 'jawrah-client-portal', category: 'Client Portal & Workspace', industry: 'Business Platform', client: 'Jawrah Pixel',
    overview: 'A private client workspace concept for keeping project communication, deliverables, and progress in one focused place.', budget: 'Internal platform', duration: 'Ongoing system',
    websiteUrl: 'https://www.jawrahpixel.online/',
    desktopImage: '/assets/case-studies/jawrah client portal/desktop.png', mobileImage: '/assets/case-studies/jawrah client portal/mobile.png', goals: ['Centralize client communication.', 'Make project progress easier to follow.', 'Create a dependable delivery workspace.'], challenges: ['Project information was spread across disconnected channels.', 'Clients needed a clearer view of active work and next steps.'], processSteps: [{ phase: 'Phase 1', title: 'Workspace Mapping', desc: 'Organizing the core client and delivery journeys.' }, { phase: 'Phase 2', title: 'Portal Architecture', desc: 'Designing a focused workspace for updates, files, and milestones.' }, { phase: 'Phase 3', title: 'Secure Delivery', desc: 'Building the interface around authenticated project access.' }], technologies: ['React', 'Supabase', 'Tailwind CSS'], solutions: ['Central project workspace.', 'Clear milestone and deliverable visibility.', 'Secure client-oriented information architecture.'], perfScores: { perf: 0, seo: 0, access: 0, best: 0 }, desktopHighlights: [{ title: 'Project command view', desc: 'A clear desktop overview of active delivery work.' }], mobileHighlights: [{ title: 'Quick status checks', desc: 'A compact mobile view for updates while away from the desk.' }], results: [{ metric: 'Project outcome', val: 'Delivered', desc: 'A more organized foundation for client collaboration.' }], metaDesc: 'Explore the Jawrah Client Portal workspace case study by Jawrah Pixel.'
  },
  'miorah': {
    region: 'int', title: 'Miorah', slug: 'miorah', category: 'Digital Brand Experience', industry: 'Luxury Retail', client: 'Miorah', overview: 'A polished digital experience designed to give a premium retail identity a clear and memorable online presence.', budget: 'Project scope supplied separately', duration: 'Project scope supplied separately', websiteUrl: 'https://miorah-preview-jawrah-pixel.netlify.app/', desktopImage: '/assets/case-studies/miorah/dektop.png', mobileImage: '/assets/case-studies/miorah/mobile.png', goals: ['Create a distinct digital identity.', 'Present the collection with clarity.', 'Support a responsive premium browsing experience.'], challenges: ['The visual identity needed to translate naturally to the web.', 'Product discovery needed to remain simple and intentional.'], processSteps: [{ phase: 'Phase 1', title: 'Visual Direction', desc: 'Establishing a distinctive digital language for the brand.' }, { phase: 'Phase 2', title: 'Collection Flow', desc: 'Designing a clear path through the brand and its offering.' }, { phase: 'Phase 3', title: 'Responsive Craft', desc: 'Building a stable experience across device sizes.' }], technologies: ['React', 'Vite', 'Tailwind CSS'], solutions: ['Distinctive premium visual direction.', 'Focused collection discovery.', 'Responsive layouts with stable presentation.'], perfScores: { perf: 0, seo: 0, access: 0, best: 0 }, desktopHighlights: [{ title: 'Collection focus', desc: 'A considered desktop presentation for the brand offering.' }], mobileHighlights: [{ title: 'Simple discovery', desc: 'An uncluttered mobile flow for browsing and enquiry.' }], results: [{ metric: 'Project outcome', val: 'Delivered', desc: 'A stronger digital presence for the retail identity.' }], metaDesc: 'Explore the Miorah digital brand experience case study by Jawrah Pixel.'
  },
  'zaza-clothing': {
    region: 'int', title: 'Zaza Clothing', slug: 'zaza-clothing', category: 'Fashion E-commerce', industry: 'Fashion & Apparel', client: 'Zaza Clothing', overview: 'A fashion-focused digital storefront designed to make collection discovery feel direct, visual, and easy to navigate.', budget: 'Project scope supplied separately', duration: 'Project scope supplied separately', websiteUrl: 'https://zaza-clothing-jawrah-preview.netlify.app/', desktopImage: '/assets/case-studies/zaza clothing/desktop.png', mobileImage: '/assets/case-studies/zaza clothing/mobile.png', goals: ['Improve collection discovery.', 'Create a confident fashion presentation.', 'Support mobile-first browsing.'], challenges: ['A visual product offer needed stronger digital structure.', 'The shopping journey needed to stay focused on smaller screens.'], processSteps: [{ phase: 'Phase 1', title: 'Collection Mapping', desc: 'Organizing the fashion journey around the collection structure.' }, { phase: 'Phase 2', title: 'Storefront Direction', desc: 'Creating a visual system that lets the products lead.' }, { phase: 'Phase 3', title: 'Commerce Build', desc: 'Implementing responsive browsing and conversion-ready flows.' }], technologies: ['React', 'Vite', 'Tailwind CSS'], solutions: ['Visual collection-led storefront.', 'Clear product browsing hierarchy.', 'Responsive shopping experience for mobile visitors.'], perfScores: { perf: 0, seo: 0, access: 0, best: 0 }, desktopHighlights: [{ title: 'Collection storytelling', desc: 'A spacious storefront layout built around fashion imagery.' }], mobileHighlights: [{ title: 'Thumb-ready browsing', desc: 'A direct mobile path through collections and products.' }], results: [{ metric: 'Project outcome', val: 'Delivered', desc: 'A stronger foundation for digital fashion discovery.' }], metaDesc: 'Explore the Zaza Clothing fashion e-commerce case study by Jawrah Pixel.'
  },
};

Object.assign(ALL_CASE_STUDIES, ADDITIONAL_CASE_STUDIES);

const ADDITIONAL_CASE_LIST: CaseListItem[] = Object.values(ADDITIONAL_CASE_STUDIES).map((project) => ({
  title: project.title,
  slug: project.slug,
  category: project.category,
  description: project.overview,
  tags: project.technologies.slice(0, 3),
  perf: project.perfScores.perf,
  seo: project.perfScores.seo,
  char: project.title.charAt(0),
  thumbnail: project.desktopImage,
  color: 'from-brand-cyan/10 to-transparent',
  badgeColor: 'text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5',
}));

export const caseStudiesList: Record<RegionCode, CaseListItem[]> = {
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
    },
    {
      title: "Amirah High Jewellery",
      slug: "amirah-jewellery",
      category: "Sovereign High Jewellery",
      description: "A digital atelier for Sri Lanka's sovereign luxury jewelry house, featuring unheated Ceylon sapphires.",
      tags: ["Luxury", "High Jewellery", "Bespoke"],
      perf: 99,
      seo: 100,
      char: "A",
      thumbnail: "/assets/case-studies/amirah jewellers/dektop.png",
      color: "from-brand-cyan/10 to-transparent",
      badgeColor: "text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5"
    },
    {
      title: "New Kamal Jewellers",
      slug: "kamal-jewellers",
      category: "Handcrafted Heritage",
      description: "A digital legacy platform preserving 40+ years of handcrafted mastery in 22k gold.",
      tags: ["Heritage", "22k Gold", "Bridal"],
      perf: 98,
      seo: 97,
      char: "K",
      thumbnail: "/assets/case-studies/kamal jewellers/desktop.png",
      color: "from-amber-500/10 to-transparent",
      badgeColor: "text-amber-400 border-amber-500/20 bg-amber-500/5"
    },
    {
      title: "The Famous Clothing",
      slug: "the-famous",
      category: "Premium Fashion",
      description: "A high-conversion fashion storefront designed to showcase seasonal collections with cinematic motion.",
      tags: ["Fashion", "E-commerce", "Streetwear"],
      perf: 98,
      seo: 96,
      char: "F",
      thumbnail: "/assets/case-studies/the famous/desktop.png",
      color: "from-white/5 to-transparent",
      badgeColor: "text-white border-white/10 bg-white/5"
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
    },
    {
      title: "Amirah High Jewellery",
      slug: "amirah-jewellery",
      category: "Sovereign High Jewellery",
      description: "A digital atelier for Sri Lanka's sovereign luxury jewelry house, featuring unheated Ceylon sapphires.",
      tags: ["Luxury", "High Jewellery", "Bespoke"],
      perf: 99,
      seo: 100,
      char: "A",
      thumbnail: "/assets/case-studies/amirah jewellers/dektop.png",
      color: "from-brand-cyan/10 to-transparent",
      badgeColor: "text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5"
    },
    {
      title: "New Kamal Jewellers",
      slug: "kamal-jewellers",
      category: "Handcrafted Heritage",
      description: "A digital legacy platform preserving 40+ years of handcrafted mastery in 22k gold.",
      tags: ["Heritage", "22k Gold", "Bridal"],
      perf: 98,
      seo: 97,
      char: "K",
      thumbnail: "/assets/case-studies/kamal jewellers/desktop.png",
      color: "from-amber-500/10 to-transparent",
      badgeColor: "text-amber-400 border-amber-500/20 bg-amber-500/5"
    },
    {
      title: "The Famous Clothing",
      slug: "the-famous",
      category: "Premium Fashion",
      description: "A high-conversion fashion storefront designed to showcase seasonal collections with cinematic motion.",
      tags: ["Fashion", "E-commerce", "Streetwear"],
      perf: 98,
      seo: 96,
      char: "F",
      thumbnail: "/assets/case-studies/the famous/desktop.png",
      color: "from-white/5 to-transparent",
      badgeColor: "text-white border-white/10 bg-white/5"
    }
  ],
  int: [
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
    },
    {
      title: "Amirah High Jewellery",
      slug: "amirah-jewellery",
      category: "Sovereign High Jewellery",
      description: "A digital atelier for Sri Lanka's sovereign luxury jewelry house, featuring unheated Ceylon sapphires.",
      tags: ["Luxury", "High Jewellery", "Bespoke"],
      perf: 99,
      seo: 100,
      char: "A",
      thumbnail: "/assets/case-studies/amirah jewellers/dektop.png",
      color: "from-brand-cyan/10 to-transparent",
      badgeColor: "text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5"
    },
    {
      title: "New Kamal Jewellers",
      slug: "kamal-jewellers",
      category: "Handcrafted Heritage",
      description: "A digital legacy platform preserving 40+ years of handcrafted mastery in 22k gold.",
      tags: ["Heritage", "22k Gold", "Bridal"],
      perf: 98,
      seo: 97,
      char: "K",
      thumbnail: "/assets/case-studies/kamal jewellers/desktop.png",
      color: "from-amber-500/10 to-transparent",
      badgeColor: "text-amber-400 border-amber-500/20 bg-amber-500/5"
    },
    {
      title: "The Famous Clothing",
      slug: "the-famous",
      category: "Premium Fashion",
      description: "A high-conversion fashion storefront designed to showcase seasonal collections with cinematic motion.",
      tags: ["Fashion", "E-commerce", "Streetwear"],
      perf: 98,
      seo: 96,
      char: "F",
      thumbnail: "/assets/case-studies/the famous/desktop.png",
      color: "from-white/5 to-transparent",
      badgeColor: "text-white border-white/10 bg-white/5"
    }
  ]
};

export function getCaseStudiesForRegion(region: RegionCode): CaseListItem[] {
  return [...(caseStudiesList[region] ?? caseStudiesList.lk), ...ADDITIONAL_CASE_LIST];
}

export function getCaseStudyDetails(slug: string): (CaseDetails & { region: RegionCode }) | null {
  return ALL_CASE_STUDIES[slug] || ADDITIONAL_CASE_STUDIES[slug] || null;
}
