import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layout, TrendingUp, MonitorSmartphone, Server, ShieldCheck, ShoppingCart, ExternalLink, Globe, Gauge, LockKeyhole, Workflow, Sparkles, CheckCircle2, Globe2, Building2, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { useRegion } from '@/hooks/useRegion';
import { useRegionalSeo } from '@/hooks/useRegionalSeo';
import { getCanonicalUrl } from '@/lib/seo/pageSeo';
import { SEO } from '@/components/layout/SEO';
import { Logo } from '@/components/layout/Logo';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { TrustSection } from '@/components/sections/TrustSection';
import Magnetic from '@/components/ui/Magnetic';

const liveProjects = [
  {
    title: "Zenvor Streetwear",
    category: "Luxury E-commerce Boutique",
    desc: "A cinematic commerce flagship engineered to turn premium streetwear launches into fast, trusted, conversion-ready buying journeys.",
    image: "/assets/case-studies/zenvor/desktop.png",
    url: "https://zenvor.lk",
    slug: "zenvor",
    glowColor: "rgba(34,211,238,0.15)",
    gradient: "from-brand-cyan/20 to-brand-blue/5",
  },
  {
    title: "Jawrah Pixel OS",
    category: "Internal Operations & Client CRM",
    desc: "A secure agency operating layer for proposals, client workspaces, lead routing, and Supabase-backed delivery governance.",
    image: "/assets/case-studies/jawrah-pixel/desktop.png",
    url: "https://jawrahpixel.com/",
    slug: "jawrah-pixel",
    glowColor: "rgba(255,255,255,0.08)",
    gradient: "from-white/10 to-transparent",
  },
  {
    title: "Velora Estates",
    category: "Premium Real Estate Portal",
    desc: "A high-trust property acquisition portal built to present architectural inventory, qualify buyers, and protect luxury brand perception.",
    image: "/assets/case-studies/velora/desktop.png",
    url: "https://jawrahpixel.com/case-studies/velora-estates",
    slug: "velora-estates",
    glowColor: "rgba(245,158,11,0.12)",
    gradient: "from-amber-600/20 to-transparent",
  },
  {
    title: "Shabnam Jewellers",
    category: "Bespoke Jewelry E-commerce",
    desc: "A heritage jewelry storefront shaped around product confidence, appraisal clarity, and premium mobile-first catalog discovery.",
    image: "/assets/case-studies/shabnam-jewellers/desktop.png",
    url: "https://jawrahpixel.com/case-studies/shabnam-jewellers",
    slug: "shabnam-jewellers",
    glowColor: "rgba(217,119,6,0.12)",
    gradient: "from-amber-600/15 to-transparent",
  },
  {
    title: "AeroVista Travels",
    category: "Bespoke Tour Planner & Booking Engine",
    desc: "A travel planning system designed to move visitors from inspiration to itinerary confidence through structured booking flows.",
    image: "/assets/case-studies/aero-vista/desktop.png",
    url: "https://jawrahpixel.com/case-studies/aerovista",
    slug: "aerovista-travels",
    glowColor: "rgba(59,130,246,0.15)",
    gradient: "from-blue-600/20 to-transparent",
  }
];

const intPricingPackages = [
  {
    name: 'Starter',
    price: '$500 - $1,500',
    desc: 'A premium entry system for focused launches, creators, portfolios, and early-stage global brands.',
    features: ['Landing page or compact website', 'Premium responsive UI', 'Core SEO foundation', 'Global inquiry routing'],
  },
  {
    name: 'Growth',
    price: '$2,000 - $5,000',
    desc: 'A conversion-ready digital platform for startups, SaaS teams, ecommerce brands, and international businesses.',
    features: ['Multi-page website architecture', 'CMS or commerce-ready structure', 'Analytics-ready conversion paths', 'Remote-first launch support'],
    isRecommended: true,
  },
  {
    name: 'Premium',
    price: '$5,000 - $15,000+',
    desc: 'A high-end brand and product experience for premium global brands that need deeper design and engineering.',
    features: ['Custom UI/UX system', 'Ecommerce or SaaS interface flows', 'AI integration planning', 'Performance and accessibility tuning'],
  },
  {
    name: 'Enterprise',
    price: 'Custom Pricing',
    desc: 'A bespoke engagement for complex systems, AI workflows, global launches, and long-term creative technology support.',
    features: ['Discovery-led scope mapping', 'Advanced integrations', 'Scalable systems architecture', 'Priority strategic partnership'],
  },
];

const globalNodes = ['Europe Operations', 'Middle East Operations', 'Asia Operations', 'North America Operations', 'Remote-First Agency', 'Global Support'];

export default function Home() {
  const { config, p, isInternational, currentRegion } = useRegion();
  const seo = useRegionalSeo('home');

  const servicesList = [
    { icon: <Layout className="text-brand-blue" />, title: "Premium Digital Experiences", desc: "We craft immersive, award-winning interfaces engineered to elevate brand perception, improve customer trust, and increase conversions." },
    { icon: <ShoppingCart className="text-brand-cyan" />, title: "Enterprise Commerce", desc: `High-performance, scalable commerce architectures designed exclusively for luxury retail, jewellery, and lifestyle brands.` },
    { icon: <MonitorSmartphone className="text-brand-blue" />, title: "Strategic UI/UX Architecture", desc: "Data-driven user journeys combined with cinematic motion design to maximize retention, engagement, and conversion rates." },
    { icon: <TrendingUp className="text-brand-cyan" />, title: "SEO & Performance Scaling", desc: "Technical edge-optimization and intelligent search strategies to dominate your market share and outperform competitors." },
    { icon: <Server className="text-brand-blue" />, title: "SaaS & Systems Architecture", desc: "Bespoke internal tools, robust admin dashboards, and scalable database systems built on modern Supabase and React infrastructure." },
    { icon: <ShieldCheck className="text-brand-cyan" />, title: "Long-Term Digital Partnership", desc: `Continuous technical audits, strategic advisory, and unshakeable security infrastructure ensuring your digital assets remain flawless.` }
  ];

  const getHomeServiceLandingPath = (title: string) => {
    const webPath = currentRegion === 'lk'
      ? '/web-development-sri-lanka'
      : currentRegion === 'pk'
        ? '/web-development-pakistan'
        : '/web-development-agency';
    const ecommercePath = currentRegion === 'lk'
      ? '/ecommerce-development-sri-lanka'
      : currentRegion === 'pk'
        ? '/ecommerce-development-pakistan'
        : '/custom-software-development';
    const softwarePath = currentRegion === 'int' ? '/custom-software-development' : webPath;

    const paths: Record<string, string> = {
      'Premium Digital Experiences': webPath,
      'Enterprise Commerce': ecommercePath,
      'Strategic UI/UX Architecture': '/ui-ux-design',
      'SEO & Performance Scaling': '/seo',
      'SaaS & Systems Architecture': softwarePath,
      'Long-Term Digital Partnership': softwarePath,
    };

    return paths[title] ?? '/services';
  };

  const authorityMetrics = [
    { value: 99, suffix: '/100', label: 'Performance-first delivery target', caption: 'Core Web Vitals, accessibility, and SEO treated as business assets.' },
    { value: 12, suffix: 'h', label: 'Executive response window', caption: 'Every serious brief receives a human architecture review within one working day.' },
    { value: 5, suffix: 'M+', prefix: `${config.currency} `, label: 'Enterprise-ready budget ceiling', caption: 'Structured for premium engagements, retainers, and scalable client operations.' },
    { value: 3, suffix: 'x', label: 'Portal ecosystem coverage', caption: 'Admin, agent, and client operating layers already built into the platform.' },
  ];

  const ecosystemLayers = [
    {
      icon: <Gauge className="w-5 h-5" />,
      title: 'Conversion Intelligence',
      desc: 'Briefing flows, premium consultation slots, and segmented project scopes route serious prospects into the right sales motion.',
    },
    {
      icon: <LockKeyhole className="w-5 h-5" />,
      title: 'Secure Client OS',
      desc: 'Protected dashboards, project milestones, invoices, revisions, files, and support tickets are modeled for production Supabase RLS.',
    },
    {
      icon: <Workflow className="w-5 h-5" />,
      title: 'Agency Operations Layer',
      desc: 'Admin and agent workspaces manage leads, bookings, proposals, content, testimonials, and delivery status from one command surface.',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'AI Expansion Ready',
      desc: 'The assistant, proposal builder, and lead-capture architecture are prepared for future automated support and content workflows.',
    },
  ];

  const storySteps = [
    {
      eyebrow: '01 / The Standard',
      eyebrowClass: 'text-brand-cyan',
      title: (
        <>
          We Don't Build <br /> Websites.
        </>
      ),
      titleClass: 'text-white',
    },
    {
      eyebrow: '02 / The Asset',
      eyebrowClass: 'text-brand-blue',
      title: (
        <>
          We Architect <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">
            Digital Monopolies.
          </span>
        </>
      ),
      titleClass: 'text-white',
    },
    {
      eyebrow: '03 / The Legacy',
      eyebrowClass: 'text-white',
      title: (
        <>
          Your Competition Will <br /> Feel The Difference.
        </>
      ),
      titleClass: 'text-white',
    },
  ];

  return (
    <div className="bg-brand-black">
      <SEO 
        title={seo.title}
        description={seo.description}
        canonicalUrl={getCanonicalUrl(seo.path)}
        keywords={seo.keywords}
        schemaType={seo.schemaType}
        schemaData={seo.schemaData}
      />

      {/* Cinematic Hero Section */}
      <section className="relative z-0 min-h-[90vh] md:min-h-[95vh] flex flex-col items-center pt-20 md:pt-32 pb-20 overflow-hidden isolate">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 premium-grid-overlay opacity-[0.15]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="absolute top-[15%] left-[15%] cinematic-light opacity-30 blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[15%] right-[15%] cinematic-light opacity-20 blur-[100px] animate-glow" style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.08), transparent 70%)' }} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-transparent to-brand-black" />
        </div>

        <div className="container relative z-20 mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 mb-6 md:mb-10 px-5 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-2xl"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-40"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-blue"></span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-zinc-500">
                Strategic Digital Architecture
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-20 mb-5 sm:mb-6 md:mb-8 lg:mb-10 flex w-full justify-center pointer-events-none"
            >
              <div className="absolute inset-0 blur-[100px] bg-white/[0.02] rounded-full scale-125 pointer-events-none" />
              <Logo size="xl" className="relative z-10 h-[clamp(160px,28vh,220px)] w-[min(82vw,320px)] max-w-[320px] shrink-0 opacity-90 brightness-110 drop-shadow-[0_0_30px_rgba(255,255,255,0.05)] sm:w-[min(76vw,420px)] sm:max-w-[420px] md:h-[min(34vh,300px)] md:w-[min(68vw,560px)] md:max-w-[560px] lg:h-[min(40vh,340px)] lg:w-[min(52vw,680px)] lg:max-w-[680px] xl:max-w-[720px] [&>img]:h-full [&>img]:max-h-full [&>img]:w-full [&>img]:object-contain" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-30 text-[clamp(2.4rem,9vw,3.25rem)] md:text-6xl lg:text-8xl font-medium tracking-tight leading-[1] mb-8 uppercase font-display"
            >
              <span className="premium-text-gradient block mb-2">Architecting</span>
              <span className="italic font-serif font-light text-zinc-500 lowercase opacity-70">Digital</span>
              <span className="block text-white mt-2">Monopolies</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-30 text-base md:text-lg text-zinc-500 max-w-xl mb-12 leading-relaxed font-light mx-auto px-4 sm:px-0"
            >
              We engineer high-trust digital ecosystems for ambitious brands ready to establish absolute market authority.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-30 flex flex-row gap-2 md:gap-6 items-center justify-center w-full sm:w-auto px-4 sm:px-0 max-w-full sm:max-w-none mx-auto"
            >
              <Magnetic strength={0.15}>
                <Link to={p('/contact')} className="flex-1 sm:flex-none block min-w-0">
                  <Button size="lg" className="w-full sm:min-w-[220px] font-bold text-[10px] sm:text-[11px] md:text-base px-2 sm:px-4 md:px-10 h-[46px] md:h-14">
                    Initiate
                    <ArrowRight className="ml-1.5 sm:ml-2 w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1.5 duration-500" />
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic strength={0.12}>
                <Link to={p('/services')} className="flex-1 sm:flex-none block min-w-0">
                  <Button variant="secondary" size="lg" className="w-full sm:min-w-[220px] font-bold text-[10px] sm:text-[11px] md:text-base px-2 sm:px-4 md:px-10 h-[46px] md:h-14">
                    Services
                  </Button>
                </Link>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Authority Metrics Strip */}
      <section className="relative border-y border-white/[0.03] bg-brand-black overflow-hidden py-8 md:py-10">
        <div className="absolute inset-0 premium-grid-overlay opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.03] border border-white/[0.03]">
            {authorityMetrics.map((metric, idx) => (
              <Reveal key={metric.label} delay={idx * 0.1} className="bg-brand-black p-6 sm:p-8 md:p-10 flex flex-col items-center text-center group">
                <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-white tracking-tighter mb-3 md:mb-4 group-hover:scale-[1.05] transition-transform duration-700">
                  <AnimatedCounter
                    value={metric.value}
                    suffix={metric.suffix}
                    prefix={metric.prefix}
                  />
                </div>
                <h3 className="text-[9px] font-mono uppercase tracking-[0.35em] sm:tracking-[0.4em] text-brand-blue mb-3 md:mb-4 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                  {metric.label}
                </h3>
                <p className="hidden sm:block text-[11px] text-zinc-600 leading-relaxed font-light max-w-[200px]">
                  {metric.caption}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Value Prop Section */}
      <section className="relative overflow-hidden border-b border-white/5 bg-brand-black py-20 md:py-32">
        <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />
        <div className="container relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:gap-20 px-6 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <span className="mb-6 block text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-cyan">
              Digital Craftsmanship
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase leading-[1] tracking-tight text-white mb-8">
              Global remote agency. <br /> Premium digital <span className="premium-text-gradient italic">engineering</span>.
            </h2>
            <p className="text-lg text-zinc-500 font-light leading-relaxed max-w-xl">
              We operate at the intersection of luxury aesthetics and high-performance technology, delivering unshakeable digital assets for brands that refuse to settle for average.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['Remote-first delivery', 'A focused international workflow built for founders, operators, and luxury teams across time zones.'],
              ['Modern Tech Stack', 'React interfaces, scalable Supabase architecture, and automation-ready data foundations.'],
              ['Performance Engineering', 'Speed, accessibility, and SEO are architected into the core from the first wireframe.'],
              ['UI/UX Obsession', 'Every interaction and content rhythm is tuned for trust, clarity, and absolute brand authority.'],
            ].map(([title, desc], idx) => (
              <div key={title} className="p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-brand-blue/20 transition-all duration-500 group">
                <h3 className="mb-4 text-xs font-display font-bold uppercase tracking-widest text-white group-hover:text-brand-cyan transition-colors">{title}</h3>
                <p className="text-[11px] leading-relaxed text-zinc-500 font-light group-hover:text-zinc-400 transition-colors">{desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>


      {/* Explore Live Projects Section - Manual Horizontal Carousel */}
      <section className="py-24 md:py-32 bg-brand-black overflow-hidden relative border-t border-white/5">
        <div className="container mx-auto px-5 sm:px-6 md:px-8 max-w-7xl relative z-20 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-left max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-brand-cyan/20 bg-brand-cyan/[0.02]"
              >
                <Globe className="w-3 h-3 text-brand-cyan opacity-60" />
                <span className="text-brand-cyan text-[9px] font-bold tracking-[0.4em] uppercase font-mono">
                  Active Deployments
                </span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-6xl font-display font-medium text-white tracking-tight uppercase leading-tight"
              >
                Explore <span className="premium-gradient-brand font-bold italic">Live</span> Projects
              </motion.h2>
            </div>

            {/* Desktop Scroll Hint */}
            <div className="hidden md:flex items-center gap-4 text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
              <span>Scroll to explore</span>
              <div className="w-12 h-px bg-zinc-800"></div>
              <ArrowRight className="w-3 h-3 animate-pulse" />
            </div>

            {/* Mobile Swipe Hint */}
            <div className="flex md:hidden items-center gap-3 text-zinc-500 font-mono text-[9px] uppercase tracking-[0.2em]">
              <ArrowRight className="w-3 h-3 animate-pulse rotate-180" />
              <span>Swipe</span>
              <ArrowRight className="w-3 h-3 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Track - Manual Carousel */}
        <div className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory pb-12">
          <div className="flex gap-4 md:gap-12 px-6 md:px-[15vw] w-max">
            {liveProjects.map((project, idx) => (
              <div
                key={project.slug}
                data-cursor="premium"
                className="relative h-[400px] md:h-[600px] w-[85vw] md:w-[60vw] lg:w-[40vw] flex-shrink-0 snap-center group overflow-hidden bg-brand-black border border-white/5"
              >
                {/* Background Image with Darker Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-50 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-brand-black/40 group-hover:via-brand-black/60 transition-colors duration-700" />
                </div>

                <div className="absolute inset-0 z-10 p-6 md:p-10 flex flex-col justify-end">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-[9px] font-mono text-brand-blue uppercase tracking-widest mb-4">
                      {idx === 0 ? "Featured Case Study" : "Client Transformation"}
                    </span>
                    <h4 className="text-3xl md:text-4xl font-display font-medium text-white mb-2 leading-tight">
                      {project.title}
                    </h4>
                    <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] text-zinc-400 uppercase">
                      {project.category}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 line-clamp-3">
                    {project.desc}
                  </p>

                  {/* Agency Metrics / Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {['Performance-ready', 'UX Audit', 'Conversion-led'].map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-zinc-500 border border-white/10 px-2 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <Link
                      to={p(`/case-studies/${project.slug}`)}
                      className="flex-1 sm:flex-none"
                    >
                      <Button size="sm" className="w-full sm:px-6 text-[10px] tracking-widest h-11">
                        View Case Study
                      </Button>
                    </Link>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none"
                    >
                      <Button variant="secondary" size="sm" className="w-full sm:px-6 text-[10px] tracking-widest h-11">
                        Visit Live <ExternalLink className="ml-2 w-3 h-3" />
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Hover Border Glow */}
                <div className="absolute inset-0 border border-white/5 group-hover:border-brand-blue/30 transition-colors duration-700 pointer-events-none" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustSection />

      {/* Premium Services Grid */}
      <section className="py-20 md:py-32 relative border-y border-white/5 bg-brand-navy/30">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-brand-blue mb-6">Core Capabilities</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-white tracking-tight leading-[1.1]">Engineering Growth Through <br className="hidden md:block" /> Strategic Architecture.</h3>
            </div>
            <p className="text-zinc-500 max-w-md text-base md:text-lg leading-relaxed font-light mx-auto md:mx-0">
              We leverage modern technology and luxury aesthetics to build digital assets that position your brand at the absolute pinnacle of your industry.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {servicesList.map((service, i) => (
              <StaggerItem
                key={i} 
                className="group relative p-6 sm:p-8 md:p-12 bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] hover:border-brand-blue/20 transition-all duration-700 overflow-hidden h-full"
              >
                {/* Edge Highlight */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="mb-6 sm:mb-8 text-zinc-500 group-hover:scale-110 group-hover:text-brand-blue transition-all duration-500">
                  {React.cloneElement(service.icon as React.ReactElement, { className: 'w-9 h-9 sm:w-10 sm:h-10' })}
                </div>
                <h4 className="text-[11px] sm:text-lg md:text-xl font-display font-medium mb-3 sm:mb-5 text-white uppercase tracking-tight leading-snug">
                  {service.title}
                </h4>
                <p className="text-zinc-500 text-[10px] sm:text-sm leading-relaxed font-light group-hover:text-zinc-400 transition-colors duration-500 line-clamp-3">
                  {service.desc}
                </p>
                <Link
                  to={p(getHomeServiceLandingPath(service.title))}
                  className="mt-6 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-blue transition-colors hover:text-white sm:text-[10px]"
                >
                  Learn More
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-blue/40 to-brand-cyan/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>


      {/* Agency Operating System Layer */}
      <section className="py-20 md:py-32 relative bg-brand-black overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            <Reveal className="lg:col-span-5 lg:sticky lg:top-32">
              <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">
                Operational Excellence
              </span>
              <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight leading-[1] mb-8">
                Not a website. <br /> A scalable <span className="premium-text-gradient italic">ecosystem</span>.
              </h2>
              <p className="text-lg text-zinc-500 font-light leading-relaxed mb-12 max-w-md">
                We connect premium storytelling with the operational structure serious brands expect: secure client workspaces, lead routing, and automation-ready delivery paths.
              </p>
              <Link to={p('/process')}>
                <Button variant="outline" size="lg" className="group">
                  View Delivery System
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Reveal>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              {ecosystemLayers.map((layer, idx) => (
                <Reveal key={layer.title} delay={idx * 0.1}>
                  <div className="group p-10 bg-white/[0.01] border border-white/5 hover:border-brand-blue/20 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="mb-8 text-zinc-500 group-hover:scale-110 group-hover:text-brand-cyan transition-transform duration-500">
                      {React.cloneElement(layer.icon as React.ReactElement, { className: 'w-8 h-8' })}
                    </div>
                    <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white mb-4">
                      {layer.title}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed font-light group-hover:text-zinc-400 transition-colors duration-500">
                      {layer.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* International Pricing Section */}
      {isInternational && (
        <section className="relative overflow-hidden border-y border-white/5 bg-brand-black py-24 md:py-32">
          <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />
          <div className="container relative z-10 mx-auto max-w-7xl px-6">
            <div className="text-center mb-20">
              <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.4em] font-bold block mb-6">
                Strategic Investment
              </span>
              <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight leading-[1] mb-8">
                International <span className="premium-text-gradient italic">Pricing</span>.
              </h2>
              <p className="text-lg text-zinc-500 font-light leading-relaxed max-w-2xl mx-auto">
                Transparent starting ranges for global clients, with custom quotes for advanced AI systems, complex ecommerce, and enterprise-grade platforms.
              </p>
            </div>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {intPricingPackages.map((plan) => (
                <StaggerItem
                  key={plan.name}
                  className={`relative p-10 bg-white/[0.01] border transition-all duration-500 flex flex-col h-full group ${
                    plan.isRecommended ? 'border-brand-cyan/30 bg-brand-cyan/[0.02]' : 'border-white/5 hover:border-brand-blue/20'
                  }`}
                >
                  {plan.isRecommended && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-cyan text-brand-black text-[9px] font-mono font-bold uppercase px-4 py-1 tracking-widest">
                      Recommended
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-xs font-mono font-bold text-brand-blue uppercase tracking-widest mb-4">{plan.name}</h3>
                    <div className="text-3xl font-display font-bold text-white mb-4">{plan.price}</div>
                    <p className="text-xs text-zinc-500 font-light leading-relaxed">{plan.desc}</p>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[11px] text-zinc-400 font-light">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={p('/contact')} className="mt-auto">
                    <Button variant={plan.isRecommended ? 'primary' : 'secondary'} size="sm" className="w-full text-[10px] tracking-widest font-bold">
                      Request Quote
                    </Button>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <Reveal className="mt-16 p-8 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h4 className="text-sm font-display font-bold uppercase tracking-widest text-white mb-2">International Payment Support</h4>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  We support USD invoices via PayPal, Wise, and International Bank Transfers, ensuring a seamless remote engagement for global teams.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                {['PayPal', 'Wise', 'Bank Transfer', 'Visa', 'Mastercard'].map(method => (
                  <span key={method} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                    {method}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Cinematic Storytelling Sequence */}
      <section className="relative w-full max-w-full overflow-hidden bg-brand-black py-16 md:py-20 lg:py-24" data-story-section>
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden bg-brand-black pointer-events-none">
          <div className="absolute inset-0 premium-grid-overlay opacity-[0.12]" />
          <div className="absolute left-1/2 top-1/2 h-[70vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/[0.035] blur-[140px]" />
          <div className="absolute bottom-[12%] right-[12%] h-[42vh] w-[42vh] rounded-full bg-brand-cyan/[0.025] blur-[110px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-black/90 to-brand-black" />
        </div>

        <div
          className="story-marquee relative z-10 w-full max-w-full overflow-hidden focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan/50"
          tabIndex={0}
          aria-label="Jawrah Pixel story carousel"
        >
          <div className="story-marquee-track flex w-max max-w-none" data-story-track>
            {[0, 1].map((groupIndex) => (
              <div
                key={groupIndex}
                className="flex shrink-0 gap-4 pr-4 md:gap-6 md:pr-6"
                aria-hidden={groupIndex === 1}
              >
                {storySteps.map((step, idx) => (
                  <div
                    key={`${groupIndex}-${idx}`}
                    className="flex min-h-[240px] w-[86vw] max-w-[760px] flex-none flex-col items-center justify-center px-6 py-8 text-center sm:w-[82vw] sm:min-h-[280px] md:w-[78vw] md:min-h-[320px] md:px-10 lg:w-[86vw] lg:max-w-[1280px] lg:min-h-[360px] xl:w-[82vw]"
                  >
                    <div className="mx-auto max-w-4xl">
                      <span className={`block text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] mb-6 font-bold ${step.eyebrowClass}`}>
                        {step.eyebrow}
                      </span>
                      <h2 className={`text-[clamp(1.8rem,8vw,4.5rem)] md:text-7xl xl:text-8xl font-display font-medium uppercase tracking-tight leading-[1.1] md:leading-[1.02] ${step.titleClass}`}>
                        {step.title}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach Section (International Only) */}
      {isInternational && (
        <section className="relative overflow-hidden border-y border-white/5 bg-brand-black py-24 md:py-32">
          <div className="absolute inset-0 premium-grid-overlay opacity-30 pointer-events-none" />
          <div className="container relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <span className="mb-6 block text-[10px] font-mono text-brand-cyan uppercase tracking-[0.4em] font-bold">
                Global Network
              </span>
              <h2 className="text-4xl md:text-6xl font-display font-medium uppercase leading-[1] tracking-tight text-white mb-8">
                Worldwide remote <span className="premium-text-gradient italic">collaboration</span>.
              </h2>
              <p className="text-lg text-zinc-500 font-light leading-relaxed max-w-xl mb-10">
                Jawrah Pixel serves clients internationally with flexible communication, remote-first workflows, and a delivery rhythm designed for global businesses.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Worldwide Remote Workflows',
                  'International Delivery Standards',
                  'Flexible Time-Zone Sync',
                  'USD Secure Transactions'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-xs text-zinc-300 font-light">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="relative min-h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-brand-cyan/10 blur-[120px]" />
              <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center rounded-full border border-white/5 bg-white/[0.01] backdrop-blur-3xl shadow-[inset_0_0_80px_rgba(6,182,212,0.05)]">
                <div className="absolute inset-[15%] rounded-full border border-white/[0.03]" />
                <div className="absolute inset-[30%] rounded-full border border-white/[0.03]" />
                <Globe2 className="w-32 h-32 text-brand-cyan/20" />
                
                {globalNodes.map((node, idx) => {
                  const positions = [
                    'left-[15%] top-[25%]',
                    'right-[15%] top-[30%]',
                    'left-[45%] top-[10%]',
                    'right-[20%] bottom-[20%]',
                    'left-[18%] bottom-[25%]',
                    'left-[48%] bottom-[12%]',
                  ];
                  return (
                    <motion.div
                      key={node}
                      className={`absolute ${positions[idx]} flex items-center gap-2`}
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] }}
                      transition={{ duration: 4 + idx, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <div className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                      <span className="hidden sm:block text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest bg-brand-black/50 px-2 py-1 rounded border border-white/5 backdrop-blur-sm">
                        {node}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-blue/10"></div>
        <div className="container mx-auto px-5 sm:px-6 md:px-8 text-center max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-xl sm:text-4xl md:text-6xl font-display font-medium tracking-tight mb-5 md:mb-8">Ready to elevate your digital presence?</h2>
            <p className="text-zinc-400 text-xs sm:text-xl mb-8 md:mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Schedule a strategic consultation to discover how Jawrah Pixel can transform your brand's digital ecosystem and accelerate growth.
            </p>
            <Link to={p('/contact')}>
              <Button className="h-12 md:h-16 w-full max-w-[320px] md:w-auto md:max-w-none px-4 md:px-10 text-[9px] md:text-xs font-mono uppercase tracking-[0.13em] md:tracking-widest font-bold shadow-[0_0_40px_rgba(59,130,246,0.3)] luxury-glow leading-tight">
                Request a Consultation
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
