import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layout, TrendingUp, MonitorSmartphone, Server, ShieldCheck, ShoppingCart, ExternalLink, Globe, Gauge, LockKeyhole, Workflow, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { useRegion } from '@/hooks/useRegion';
import { useRegionalSeo } from '@/hooks/useRegionalSeo';
import { getCanonicalUrl } from '@/lib/seo/pageSeo';
import { SEO } from '@/components/layout/SEO';
import { Logo } from '@/components/layout/Logo';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';

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
    url: "https://jawrah-pixel-itpe.vercel.app/",
    slug: "jawrah-pixel",
    glowColor: "rgba(255,255,255,0.08)",
    gradient: "from-white/10 to-transparent",
  },
  {
    title: "Velora Estates",
    category: "Premium Real Estate Portal",
    desc: "A high-trust property acquisition portal built to present architectural inventory, qualify buyers, and protect luxury brand perception.",
    image: "/assets/case-studies/velora/desktop.png",
    url: "https://real-estate-jawrah-project.netlify.app/",
    slug: "velora-estates",
    glowColor: "rgba(245,158,11,0.12)",
    gradient: "from-amber-600/20 to-transparent",
  },
  {
    title: "Shabnam Jewellers",
    category: "Bespoke Jewelry E-commerce",
    desc: "A heritage jewelry storefront shaped around product confidence, appraisal clarity, and premium mobile-first catalog discovery.",
    image: "/assets/case-studies/shabnam-jewellers/desktop.png",
    url: "https://shabnam-jawrah-project.netlify.app/",
    slug: "shabnam-jewellers",
    glowColor: "rgba(217,119,6,0.12)",
    gradient: "from-amber-600/15 to-transparent",
  },
  {
    title: "AeroVista Travels",
    category: "Bespoke Tour Planner & Booking Engine",
    desc: "A travel planning system designed to move visitors from inspiration to itinerary confidence through structured booking flows.",
    image: "/assets/case-studies/aero-vista/desktop.png",
    url: "https://aero-vista-jawrah-project.vercel.app/#home",
    slug: "aerovista-travels",
    glowColor: "rgba(59,130,246,0.15)",
    gradient: "from-blue-600/20 to-transparent",
  }
];

export default function Home() {
  const { config, p } = useRegion();
  const seo = useRegionalSeo('home');
  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"]
  });

  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.7, 0.8]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const nextStep = latest < 0.34 ? 0 : latest < 0.68 ? 1 : 2;
    setActiveStoryStep((currentStep) => (currentStep === nextStep ? currentStep : nextStep));
  });

  const servicesList = [
    { icon: <Layout className="text-brand-blue" />, title: "Premium Digital Experiences", desc: "We craft immersive, award-winning interfaces engineered to elevate brand perception, improve customer trust, and increase conversions." },
    { icon: <ShoppingCart className="text-brand-cyan" />, title: "Enterprise Commerce", desc: `High-performance, scalable commerce architectures designed exclusively for luxury retail, jewellery, and lifestyle brands.` },
    { icon: <MonitorSmartphone className="text-brand-blue" />, title: "Strategic UI/UX Architecture", desc: "Data-driven user journeys combined with cinematic motion design to maximize retention, engagement, and conversion rates." },
    { icon: <TrendingUp className="text-brand-cyan" />, title: "SEO & Performance Scaling", desc: "Technical edge-optimization and intelligent search strategies to dominate your market share and outperform competitors." },
    { icon: <Server className="text-brand-blue" />, title: "SaaS & Systems Architecture", desc: "Bespoke internal tools, robust admin dashboards, and scalable database systems built on modern Supabase and React infrastructure." },
    { icon: <ShieldCheck className="text-brand-cyan" />, title: "Long-Term Digital Partnership", desc: `Continuous technical audits, strategic advisory, and unshakeable security infrastructure ensuring your digital assets remain flawless.` }
  ];

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
  const activeStory = storySteps[activeStoryStep] ?? storySteps[0];

  return (
    <div className="flex flex-col min-h-screen bg-brand-black">
      <SEO 
        title={seo.title}
        description={seo.description}
        canonicalUrl={getCanonicalUrl(seo.path)}
        schemaType={seo.schemaType}
        schemaData={seo.schemaData}
      />

      {/* Cinematic Hero Section */}
      <section className="premium-hero-stage relative pt-28 pb-20 md:pt-48 md:pb-40 overflow-hidden flex items-center md:min-h-[95vh] blue-gradient-bg">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-brand-cyan/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2"></div>
          
          {/* Mobile-only additional intense glow */}
          <div className="md:hidden absolute top-1/2 left-1/2 w-[350px] h-[400px] bg-brand-cyan/20 rounded-full blur-[110px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>
        </div>
        <div className="premium-particles"></div>
        
        <div className="container mx-auto px-5 md:px-8 relative z-10 flex w-full max-w-7xl flex-col justify-center items-center md:items-start text-center md:text-left overflow-visible md:overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="inline-flex max-w-full items-center justify-center md:justify-start gap-2 mb-8 px-4 py-2 md:px-4 md:py-1.5 rounded-full border border-brand-cyan/30 md:border-white/10 bg-brand-cyan/10 md:bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.15)] md:shadow-none"
          >
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)] md:shadow-none"></span>
            <span className="text-zinc-200 text-[10px] md:text-xs font-semibold tracking-[0.15em] md:tracking-[0.3em] uppercase text-center leading-relaxed">
              Elite Transformation Partner
            </span>
          </motion.div>
          
          {/* Mobile-Optimized Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden w-full max-w-[min(100%,42rem)] text-[clamp(2.2rem,9vw,3.5rem)] font-medium text-white tracking-tight leading-[1.1] mb-6 flex flex-col uppercase break-words"
          >
            <span className="font-display tracking-tight text-white/90">Architecting</span>
            <span className="premium-gradient-brand font-bold italic drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">Digital</span>
            <span className="font-serif italic font-light text-zinc-400 text-[0.95em]">Excellence</span>
          </motion.h1>

          {/* Desktop Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block text-[clamp(2.8rem,6vw,5.75rem)] font-medium text-white tracking-tight leading-[1.02] mb-6 md:mb-8 uppercase font-display max-w-[min(100%,46rem)] break-words"
          >
            Architecting <span className="premium-gradient-brand font-bold italic">Digital</span><br/>
            <span className="text-zinc-100">Excellence</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-lg md:text-2xl text-zinc-300 md:text-zinc-400 max-w-[min(100%,38rem)] mb-10 md:mb-12 leading-relaxed font-light px-0 mx-auto md:mx-0"
          >
            Jawrah Pixel engineers premium digital experiences designed to elevate brand perception and drive measurable revenue for ambitious enterprises.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="premium-logo-aura mb-12 md:mb-16"
          >
            <Logo size="xl" className="w-[200px] sm:w-[240px] md:w-[320px]" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto items-center"
          >
            <Link to={p('/contact')} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-[11px] font-mono tracking-[0.2em] font-bold uppercase shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_45px_rgba(34,211,238,0.5)] transition-all duration-500 luxury-glow">
                Initiate Project
                <ArrowRight className="ml-3 w-4 h-4" />
              </Button>
            </Link>
            <Link to={p('/case-studies')} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-[11px] font-mono tracking-[0.2em] font-bold uppercase border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300">
                Explore Work
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Authority Metrics Strip */}
      <section className="relative border-y border-white/5 bg-brand-black overflow-hidden">
        <div className="absolute inset-0 premium-grid-overlay opacity-40 pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/5">
            {authorityMetrics.map((metric, idx) => (
              <Reveal key={metric.label} delay={idx * 0.05} className="premium-stat-card p-8 sm:p-10 border-white/5 flex flex-col items-center text-center sm:items-start sm:text-left">
                <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-white tracking-tighter mb-3">
                  <AnimatedCounter
                    value={metric.value}
                    suffix={metric.suffix}
                    prefix={metric.prefix}
                    className="drop-shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                  />
                </div>
                <h3 className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-brand-cyan mb-3 font-bold">
                  {metric.label}
                </h3>
                <p className="text-[10px] sm:text-xs text-brand-gray leading-relaxed font-light max-w-[160px]">
                  {metric.caption}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* Explore Live Projects Section */}
      <section className="py-20 md:py-32 relative border-t border-white/5 bg-brand-black overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/5 rounded-full blur-[160px] pointer-events-none z-0"></div>
        
        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-brand-cyan/25 bg-brand-cyan/5"
            >
              <Globe className="w-3.5 h-3.5 text-brand-cyan animate-spin-slow" />
              <span className="text-brand-cyan text-[10px] sm:text-xs font-semibold tracking-widest uppercase font-mono">
                Active Deployments
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-6xl font-display font-medium text-white tracking-tight mb-6 uppercase leading-tight"
            >
              Explore <span className="premium-gradient-brand font-bold italic">Live</span> <br className="sm:hidden" /> Projects
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-zinc-400 text-sm sm:text-lg font-light leading-relaxed px-4 sm:px-0"
            >
              Interact directly with fully responsive production-grade web assets compiled from our flagship case studies.
            </motion.p>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {liveProjects.map((project, idx) => (
              <StaggerItem
                key={project.slug}
                className="glass-card overflow-hidden group rounded-2xl border border-white/5 bg-brand-navy/20 relative flex flex-col justify-between transition-all duration-500 hover:border-white/10 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] h-full"
              >
                {/* Browser Mockup Header */}
                <div className="bg-zinc-950/90 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500/40 group-hover:bg-red-500/80 transition-colors duration-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/40 group-hover:bg-yellow-500/80 transition-colors duration-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/40 group-hover:bg-green-500/80 transition-colors duration-500"></div>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500 font-light select-none tracking-widest lowercase">
                    {project.slug}.jawrah.live
                  </div>
                  <div className="w-4"></div>
                </div>

                {/* Cover Interface Preview */}
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900 border-b border-white/5 group">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.05] transition-transform duration-700 ease-[0.16, 1, 0.3, 1]"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* Immediate Quick Actions overlay */}
                  <div className="absolute inset-0 bg-brand-black/75 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-brand-navy rounded-full text-[10px] font-mono font-bold tracking-wider uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visit Site
                    </a>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between bg-gradient-to-b from-transparent to-brand-black/20">
                  <div className="mb-6">
                    <span className="text-[9px] font-mono tracking-[0.25em] text-brand-cyan uppercase block mb-3 font-bold">
                      {project.category}
                    </span>
                    <h4 className="text-xl sm:text-xl font-display font-medium text-white mb-3 group-hover:text-brand-cyan transition-colors duration-300 leading-tight">
                      {project.title}
                    </h4>
                    <p className="text-zinc-400 text-[13px] leading-relaxed font-light">
                      {project.desc}
                    </p>
                  </div>
                  
                  <div className="flex gap-4 items-center pt-5 border-t border-white/5">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.15em] uppercase text-brand-cyan hover:text-white transition-colors duration-300 group/link"
                    >
                      Visit Live
                      <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
                    </a>
                    <span className="text-zinc-800 font-light select-none">|</span>
                    <Link
                      to={p(`/case-studies/${project.slug}`)}
                      className="text-[10px] font-mono font-bold tracking-[0.15em] uppercase text-zinc-400 hover:text-white transition-colors duration-300"
                    >
                      Case Study
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Premium Services Grid */}
      <section className="py-20 md:py-32 relative border-y border-white/5 bg-brand-navy/30">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6 md:gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-[11px] md:text-sm font-semibold tracking-[0.3em] uppercase text-brand-blue mb-4">Core Capabilities</h2>
              <h3 className="text-3xl sm:text-3xl md:text-5xl font-display font-medium text-white tracking-tight leading-tight">Engineering Growth Through <br className="hidden md:block" /> Strategic Design.</h3>
            </div>
            <p className="text-zinc-400 max-w-md text-[13px] sm:text-sm md:text-lg leading-relaxed font-light mx-auto md:mx-0">
              We leverage modern technology and luxury aesthetics to build digital assets that position your brand at the absolute pinnacle of your industry.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {servicesList.map((service, i) => (
              <StaggerItem
                key={i} 
                className="glass-card p-8 md:p-10 rounded-2xl group cursor-default border border-white/5 hover:border-brand-blue/30 transition-all duration-500"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-cyan/5 border border-white/5 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {React.cloneElement(service.icon, { className: 'w-5 h-5 md:w-6 md:h-6 text-brand-blue group-hover:text-white transition-colors duration-300' })}
                </div>
                <h4 className="text-lg sm:text-base md:text-xl font-display font-medium mb-3 md:mb-4 text-white group-hover:text-brand-cyan transition-colors duration-300 uppercase tracking-tight">{service.title}</h4>
                <p className="text-zinc-400 text-[13px] md:text-base leading-relaxed font-light">{service.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>


      {/* Agency Operating System Layer */}
      <section className="py-20 md:py-32 relative bg-brand-black overflow-hidden">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl relative z-10">
          <div className="cinematic-divider mb-16 md:mb-20"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <Reveal className="lg:col-span-5 lg:sticky lg:top-28 text-center lg:text-left">
              <span className="text-[10px] md:text-xs font-mono text-brand-cyan uppercase tracking-[0.3em] font-bold block mb-4">
                Built Like A Business OS
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-medium uppercase tracking-tight leading-[1.1] mb-6 text-balance">
                Not a website. <br className="hidden md:block" /> A scalable <span className="text-brand-cyan italic">ecosystem</span>.
              </h2>
              <p className="text-sm sm:text-lg text-brand-gray font-light leading-relaxed mb-10 max-w-md mx-auto lg:mx-0">
                Jawrah Pixel connects premium storytelling with the operational structure serious brands expect: secure client workspaces, lead routing, and automation-ready delivery paths.
              </p>
              <Link to={p('/process')}>
                <Button variant="outline" className="h-14 px-8 text-[11px] font-mono uppercase tracking-[0.22em] font-bold border-white/10 bg-white/5 hover:bg-white/10">
                  View Delivery System
                </Button>
              </Link>
            </Reveal>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {ecosystemLayers.map((layer, idx) => (
                <Reveal key={layer.title} delay={idx * 0.08}>
                  <div className="interactive-lift h-full rounded-2xl border border-white/5 bg-white/[0.02] p-8 md:p-8 hover:border-brand-cyan/30 hover:shadow-[0_18px_60px_rgba(6,182,212,0.08)] transition-all duration-500">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-brand-cyan/25 bg-brand-cyan/10 text-brand-cyan shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                      {layer.icon}
                    </div>
                    <h3 className="text-xl md:text-xl font-display font-bold uppercase tracking-tight text-white mb-4">
                      {layer.title}
                    </h3>
                    <p className="text-[13px] md:text-sm text-brand-gray leading-relaxed font-light">
                      {layer.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Storytelling Sequence */}
      <section ref={storyRef} className="relative h-[280vh] md:h-[340vh] bg-brand-black">
        <div className="sticky top-0 h-[100svh] min-h-[560px] w-full overflow-hidden flex items-center justify-center border-y border-white/5">
          
          {/* Dynamic Background */}
          <motion.div 
            style={{ scale: imageScale }}
            className="absolute inset-0 bg-[url('/assets/hero_bg.png')] bg-cover bg-center opacity-40"
          ></motion.div>
          
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-brand-black/95"
          ></motion.div>

          <div className="absolute top-28 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:top-28">
            {storySteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const section = storyRef.current;
                  if (!section) return;
                  const top = section.getBoundingClientRect().top + window.scrollY;
                  const scrollable = section.offsetHeight - window.innerHeight;
                  window.scrollTo({
                    top: top + scrollable * (idx / (storySteps.length - 1)),
                    behavior: 'smooth',
                  });
                }}
                className={`h-1 transition-all duration-500 rounded-full ${
                  activeStoryStep === idx ? "w-8 bg-brand-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)]" : "w-4 bg-white/10 hover:bg-white/30"
                }`}
              />
            ))}
          </div>

          <div className="container relative z-10 mx-auto px-6 text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeStoryStep}
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl mx-auto"
              >
                <span className={`block text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] mb-6 font-bold ${activeStory.eyebrowClass}`}>
                  {activeStory.eyebrow}
                </span>
                <h2 className={`text-[clamp(1.8rem,8vw,4.5rem)] md:text-7xl lg:text-8xl font-display font-medium uppercase tracking-tight leading-[1.1] md:leading-[1.02] ${activeStory.titleClass}`}>
                  {activeStory.title}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-blue/10"></div>
        <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl relative z-10">
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
