import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Code2,
  Cpu,
  Crown,
  Gem,
  Globe2,
  LayoutDashboard,
  LineChart,
  MessageCircle,
  MonitorSmartphone,
  SearchCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Workflow,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SEO } from '@/components/layout/SEO';
import { useRegion } from '@/hooks/useRegion';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/layout/Logo';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { TrustSection } from '@/components/sections/TrustSection';

interface ServiceCard {
  title: string;
  desc: string;
  icon: LucideIcon;
}

interface ProjectCard {
  title: string;
  type: string;
  desc: string;
  image: string;
  tags: string[];
  signal: string;
}

interface ValueItem {
  title: string;
  desc: string;
  icon: LucideIcon;
}

interface PricingPackage {
  name: string;
  price: string;
  desc: string;
  features: string[];
  isRecommended?: boolean;
}

const services: ServiceCard[] = [
  {
    title: 'Premium Website Design',
    desc: 'Editorial, conversion-focused websites shaped around brand authority, trust, and a high-end first impression.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Ecommerce Development',
    desc: 'Luxury storefronts, checkout flows, product systems, and scalable commerce architecture for premium brands.',
    icon: ShoppingBag,
  },
  {
    title: 'AI Integrations',
    desc: 'Assistants, automations, internal workflows, and intelligent systems connected to modern business operations.',
    icon: BrainCircuit,
  },
  {
    title: 'Branding & Identity',
    desc: 'Refined visual systems, digital brand direction, and premium identity foundations built for global perception.',
    icon: Gem,
  },
  {
    title: 'SEO Optimization',
    desc: 'Technical SEO, performance structure, metadata strategy, and content architecture for sustainable discovery.',
    icon: SearchCheck,
  },
  {
    title: 'UI/UX Systems',
    desc: 'Design systems, product flows, dashboards, and interaction models for SaaS and complex digital products.',
    icon: LayoutDashboard,
  },
  {
    title: 'Conversion Optimization',
    desc: 'Landing pages, funnel refinement, lead capture systems, and testing-ready interface improvements.',
    icon: TrendingUp,
  },
  {
    title: 'High-End Frontend Development',
    desc: 'Fast, responsive, animation-rich interfaces engineered with clean React architecture and premium polish.',
    icon: Code2,
  },
];

const pricingPackages: PricingPackage[] = [
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

const paymentMethods = ['PayPal', 'Wise', 'International Bank Transfer', 'Visa', 'Mastercard'];

const projects: ProjectCard[] = [
  {
    title: 'Zenvor Streetwear',
    type: 'Luxury E-commerce Boutique',
    desc: 'A cinematic commerce flagship engineered to turn premium streetwear launches into fast, trusted, conversion-ready buying journeys.',
    image: '/assets/case-studies/zenvor/desktop.png',
    tags: ['Luxury E-commerce', 'Minimal Design', 'High Perf'],
    signal: '99/100 performance target',
  },
  {
    title: 'Jawrah Pixel OS',
    type: 'Internal Operations & Client CRM',
    desc: 'A secure agency operating layer for proposals, client workspaces, lead routing, and Supabase-backed delivery governance.',
    image: '/assets/case-studies/jawrah-pixel/desktop.png',
    tags: ['D3.js Charts', 'Database Security', 'Supabase RLS'],
    signal: '3x faster workflow handoff',
  },
  {
    title: 'Velora Estates',
    type: 'Premium Real Estate Portal',
    desc: 'A high-trust property acquisition portal built to present architectural inventory, qualify buyers, and protect luxury brand perception.',
    image: '/assets/case-studies/velora/desktop.png',
    tags: ['Real Estate', '3D Virtual Tours', 'Lead Management'],
    signal: '+94% verified property inquiries',
  },
  {
    title: 'Shabnam Jewellers',
    type: 'Bespoke Jewelry E-commerce',
    desc: 'A heritage jewelry storefront shaped around product confidence, appraisal clarity, and premium mobile-first catalog discovery.',
    image: '/assets/case-studies/shabnam-jewellers/desktop.png',
    tags: ['Jewelry Tech', 'Gold Appraiser', 'Local Gateway'],
    signal: '+148% direct client conversions',
  },
  {
    title: 'AeroVista Travels',
    type: 'Bespoke Tour Planner & Booking Engine',
    desc: 'A travel planning system designed to move visitors from inspiration to itinerary confidence through structured booking flows.',
    image: '/assets/case-studies/aero-vista/desktop.png',
    tags: ['Travel Tech', 'API Integration', 'Booking Engine'],
    signal: '+88% active booking sales',
  },
];

const reasons: ValueItem[] = [
  {
    title: 'Fast Communication',
    desc: 'Clear async updates, precise handoffs, and flexible meeting windows for international teams.',
    icon: MessageCircle,
  },
  {
    title: 'Modern Technology',
    desc: 'React, Supabase, automation-ready data models, and scalable deployment patterns.',
    icon: Cpu,
  },
  {
    title: 'Scalable Systems',
    desc: 'Built to support launches, new markets, product growth, and long-term operational clarity.',
    icon: Workflow,
  },
  {
    title: 'Premium Aesthetics',
    desc: 'Minimal, cinematic, brand-first design that feels expensive without becoming noisy.',
    icon: Crown,
  },
  {
    title: 'Conversion Strategy',
    desc: 'Every section is shaped around trust, intent, qualified leads, and decisive action.',
    icon: LineChart,
  },
  {
    title: 'Mobile Optimization',
    desc: 'Interfaces designed for real buying behavior across phones, tablets, and executive devices.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Performance Optimization',
    desc: 'Speed, accessibility, SEO structure, and smooth interaction treated as core business assets.',
    icon: Zap,
  },
  {
    title: 'International Standards',
    desc: 'Premium quality control, semantic structure, and polished details for global expectations.',
    icon: ShieldCheck,
  },
];

const process = [
  {
    step: '01',
    title: 'Discovery',
    desc: 'We map your brand, audience, offer, market, product needs, and conversion goals.',
  },
  {
    step: '02',
    title: 'Strategy',
    desc: 'We define the experience architecture, content hierarchy, feature scope, and launch path.',
  },
  {
    step: '03',
    title: 'Design',
    desc: 'We craft the premium interface system, motion language, responsive layouts, and visual direction.',
  },
  {
    step: '04',
    title: 'Development',
    desc: 'We build clean, scalable, performance-first systems with polished interactions and accessible structure.',
  },
  {
    step: '05',
    title: 'Launch',
    desc: 'We tune SEO, QA responsiveness, optimize performance, connect analytics, and prepare handoff.',
  },
  {
    step: '06',
    title: 'Growth',
    desc: 'We improve conversion paths, expand systems, and support long-term digital momentum.',
  },
];

const testimonials = [
  {
    quote: 'Jawrah Pixel gave our startup the kind of digital presence investors expect from a serious global company. Fast, elegant, and incredibly clear.',
    author: 'Maya Chen',
    role: 'Founder, Helio Labs',
    region: 'Singapore',
  },
  {
    quote: 'Our ecommerce experience finally feels premium enough for the products we sell. The interface is calm, beautiful, and conversion-focused.',
    author: 'Omar Laurent',
    role: 'Owner, Valeur Supply',
    region: 'Paris',
  },
  {
    quote: 'They understood SaaS complexity without making the product look heavy. The new dashboard feels sharper, faster, and much easier to sell.',
    author: 'Elena Voss',
    role: 'Product Lead, Northstar Systems',
    region: 'Berlin',
  },
  {
    quote: 'The brand experience feels international now. Every section has the polish and restraint we wanted for a luxury audience.',
    author: 'Amina Rahman',
    role: 'Director, Shabnam Jewellers',
    region: 'Dubai',
  },
];

const globalNodes = ['Europe Operations', 'Middle East Operations', 'Asia Operations', 'North America Operations', 'Remote-First Agency', 'Global Support'];

const ctaBaseClass =
  'premium-button inline-flex items-center justify-center rounded-sm font-display font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan tracking-wide';
const primaryCtaClass =
  `${ctaBaseClass} bg-brand-blue text-white hover:bg-brand-blue/90 shadow-[0_0_15px_rgba(0,71,255,0.4)] hover:shadow-[0_0_25px_rgba(0,71,255,0.6)] border border-brand-blue/50`;
const outlineCtaClass =
  `${ctaBaseClass} border border-white/10 bg-transparent hover:bg-white/5 text-white`;

function SectionHeader({
  eyebrow,
  title,
  copy,
  align = 'center',
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: 'center' | 'left';
}) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto mb-12 max-w-3xl text-center md:mb-16' : 'mb-10 max-w-3xl md:mb-14'}>
      <span className="mb-4 block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-cyan">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-display font-medium uppercase leading-[1.08] tracking-tight text-white sm:text-4xl md:text-6xl">
        {title}
      </h2>
      {copy && (
        <p className={`mt-5 text-sm font-light leading-relaxed text-brand-gray sm:text-base md:text-lg ${align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
          {copy}
        </p>
      )}
    </Reveal>
  );
}

export default function International() {
  const { config, p } = useRegion();

  return (
    <div className="min-h-screen bg-brand-black text-zinc-300">
      <SEO
        title="Premium Digital Agency for Global Brands | Jawrah Pixel"
        description="Premium websites, ecommerce, branding, SEO, SaaS interfaces, AI integrations, and digital systems for international brands."
        canonicalUrl="https://jawrahpixel.com/int"
        keywords={['premium digital agency', 'international web design agency', 'global ecommerce development', 'SaaS interface design']}
        schemaType="Service"
        schemaData={{
          name: 'International Premium Digital Agency',
          provider: 'Jawrah Pixel',
          areaServed: 'Worldwide',
          serviceType: ['Premium website design', 'Ecommerce development', 'AI integrations', 'UI/UX systems'],
        }}
      />

      <section className="premium-hero-stage relative pt-24 pb-16 md:pt-48 md:pb-40 overflow-hidden flex items-center md:min-h-[95vh] blue-gradient-bg">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-brand-cyan/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2"></div>
          <div className="md:hidden absolute top-1/2 left-1/2 w-[350px] h-[400px] bg-brand-cyan/20 rounded-full blur-[110px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>
        </div>
        <div className="premium-particles"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 flex w-full max-w-7xl flex-col justify-center items-start text-left overflow-visible md:overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="inline-flex max-w-full md:max-w-full items-center justify-start gap-2 mb-7 md:mb-8 px-3 py-2 md:px-4 md:py-1.5 rounded-full border border-brand-cyan/30 md:border-white/10 bg-brand-cyan/10 md:bg-white/5 backdrop-blur-md self-start shadow-[0_0_20px_rgba(34,211,238,0.15)] md:shadow-none"
          >
            <span className="w-2 h-2 md:w-1.5 md:h-1.5 rounded-full bg-brand-cyan md:bg-brand-blue animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)] md:shadow-none"></span>
            <span className="text-zinc-200 md:text-zinc-300 text-[9px] min-[380px]:text-[10px] md:text-xs font-semibold tracking-[0.16em] min-[380px]:tracking-[0.2em] md:tracking-[0.3em] uppercase whitespace-normal text-left leading-relaxed">
              <span className="md:hidden">Elite Transformation Partner</span>
              <span className="hidden md:inline">Elite Digital Transformation Partner</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden max-w-xs text-[clamp(2.05rem,8.2vw,3rem)] font-medium text-white tracking-tight leading-[1.12] mb-5 flex flex-col uppercase overflow-visible"
          >
            <span className="font-display tracking-tight text-white mb-1.5">Architecting</span>
            <span className="premium-gradient-brand text-[clamp(2.6rem,10vw,3.5rem)] font-bold italic pr-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">Digital</span>
            <span className="font-serif italic font-light text-zinc-400 text-[clamp(2.15rem,8vw,3rem)] mt-1.5">Excellence</span>
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] font-medium text-white tracking-tight leading-[1.05] md:leading-[1.02] mb-6 md:mb-8 uppercase font-display"
          >
            Architecting <span className="premium-gradient-brand font-bold italic">Digital</span><br/>
            <span className="text-zinc-100">Excellence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[13px] sm:text-lg md:text-2xl text-zinc-300 md:text-zinc-400 max-w-xs sm:max-w-2xl md:max-w-3xl mb-7 md:mb-10 leading-relaxed font-light px-0 animate-fade-in"
          >
            Jawrah Pixel engineers premium digital experiences designed to elevate brand perception, establish market authority, and drive measurable revenue for ambitious enterprises worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="premium-logo-aura mb-8 md:mb-12 self-center md:self-start"
          >
            <Logo size="xl" className="w-[180px] sm:w-[240px] md:w-[320px]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid max-w-xs sm:max-w-none grid-cols-1 sm:flex sm:flex-row gap-3 md:gap-6 w-full sm:w-auto items-center self-center md:self-start"
          >
            <Link to={p('/contact')} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 md:h-14 px-4 md:px-8 text-[9px] sm:text-[11px] font-mono tracking-[0.12em] sm:tracking-[0.2em] font-bold uppercase shadow-[0_0_30px_rgba(59,130,246,0.5)] md:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-500 group luxury-glow py-2 leading-tight">
                Initiate Project
                <ArrowRight className="hidden sm:inline ml-3 group-hover:translate-x-1 transition-transform duration-300 w-3 h-3 md:w-[14px] md:h-[14px]" />
              </Button>
            </Link>
            <Link to={p('/case-studies')} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 md:h-14 px-4 md:px-8 text-[9px] sm:text-[11px] font-mono tracking-[0.12em] sm:tracking-[0.2em] font-bold uppercase border-white/20 md:border-zinc-800 text-white md:text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all duration-300 bg-white/5 md:bg-transparent py-2 leading-tight">
                Explore Work
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <TrustSection />

      <section className="relative overflow-hidden border-y border-white/5 bg-brand-black py-16 md:py-24">
        <div className="absolute inset-0 premium-grid-overlay opacity-40" />
        <div className="container relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-[0.9fr_1.1fr] md:px-8">
          <Reveal>
            <span className="mb-4 block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-cyan">
              About Jawrah Pixel
            </span>
            <h2 className="text-3xl font-display font-medium uppercase leading-[1.08] tracking-tight text-white sm:text-4xl md:text-6xl">
              Global remote agency. Premium digital craftsmanship.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              ['Remote-first delivery', 'A focused international workflow built for founders, operators, agencies, and luxury teams across time zones.'],
              ['Modern stack', 'React interfaces, scalable backend architecture, clean component systems, and automation-ready foundations.'],
              ['Performance-first systems', 'Speed, accessibility, responsiveness, and SEO are engineered from the first wireframe onward.'],
              ['UI/UX obsession', 'Every section, interaction, spacing choice, and content rhythm is tuned for trust and premium perception.'],
            ].map(([title, desc]) => (
              <div key={title} className="interactive-lift rounded-xl border border-white/10 bg-white/[0.025] p-4 min-[390px]:p-5 sm:rounded-2xl sm:p-6">
                <h3 className="mb-2 text-[12px] font-display font-semibold uppercase leading-snug tracking-tight text-white min-[390px]:text-[13px] sm:mb-3 sm:text-base">{title}</h3>
                <p className="text-[11px] font-light leading-relaxed text-brand-gray sm:text-sm">{desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-navy/30 py-20 md:py-32">
        <div className="absolute left-1/2 top-0 h-64 w-[70vw] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Services"
            title="Premium digital systems for global growth."
            copy="Focused capabilities for startups, SaaS companies, luxury brands, ecommerce teams, agencies, creators, AI companies, and global businesses."
          />

          <StaggerContainer className="grid grid-cols-2 gap-3 min-[430px]:grid-cols-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <StaggerItem key={service.title} className="glass-card group flex h-full min-w-0 flex-col rounded-xl p-3.5 transition-all duration-500 hover:border-brand-cyan/30 hover:shadow-[0_18px_60px_rgba(6,182,212,0.12)] min-[390px]:p-4 sm:rounded-2xl sm:p-5 md:p-6">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-brand-cyan/20 bg-brand-cyan/10 text-brand-cyan transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-cyan group-hover:text-brand-black min-[390px]:h-10 min-[390px]:w-10 sm:mb-6 sm:h-12 sm:w-12 sm:rounded-xl">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="mb-2 text-[13px] font-display font-medium leading-snug text-white transition-colors duration-300 group-hover:text-brand-cyan min-[390px]:text-sm sm:mb-3 sm:text-base md:text-lg">
                    {service.title}
                  </h3>
                  <p className="text-[11px] font-light leading-relaxed text-brand-gray sm:text-xs md:text-sm">{service.desc}</p>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/5 bg-brand-black py-20 md:py-32">
        <div className="absolute inset-0 premium-grid-overlay opacity-25" />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-brand-cyan/10 blur-[130px]" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="USD Pricing"
            title="International pricing for serious global execution."
            copy="Transparent starting ranges for global clients, with custom quotes for advanced AI systems, complex ecommerce, SaaS products, and enterprise-grade platforms."
          />

          <StaggerContainer className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4">
            {pricingPackages.map((plan) => (
              <StaggerItem
                key={plan.name}
                className={`glass-card interactive-lift relative flex h-full min-w-0 flex-col rounded-xl p-4 min-[390px]:p-5 sm:rounded-2xl md:p-7 ${
                  plan.isRecommended ? 'border-brand-cyan/35 bg-brand-cyan/[0.035] shadow-[0_0_42px_rgba(6,182,212,0.12)]' : ''
                }`}
              >
                {plan.isRecommended && (
                  <span className="mb-4 inline-flex w-fit rounded-full border border-brand-cyan/25 bg-brand-cyan/10 px-2 py-1 text-[8px] font-mono uppercase leading-none tracking-[0.14em] text-brand-cyan sm:absolute sm:right-5 sm:top-5 sm:mb-0 sm:px-3 sm:text-[9px] sm:tracking-[0.16em]">
                    Recommended
                  </span>
                )}
                <div className="mb-5 md:mb-7">
                  <p className="mb-2 text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-brand-cyan min-[390px]:text-[10px] md:mb-3 md:tracking-[0.24em]">
                    {plan.name}
                  </p>
                  <div className="text-lg font-mono font-bold leading-tight tracking-tight text-white min-[390px]:text-xl md:text-3xl">
                    {plan.price}
                  </div>
                  <p className="mt-3 text-[11px] font-light leading-relaxed text-brand-gray md:mt-4 md:text-sm">
                    {plan.desc}
                  </p>
                </div>

                <ul className="mb-5 flex-1 space-y-2 md:mb-8 md:space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-[11px] leading-snug text-zinc-300 md:gap-3 md:text-xs md:leading-relaxed">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-cyan md:h-4 md:w-4" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={p('/contact')}
                  className={`${plan.isRecommended ? primaryCtaClass : outlineCtaClass} h-10 w-full px-2 text-[8px] font-mono font-bold uppercase tracking-[0.12em] min-[390px]:text-[9px] md:h-11 md:px-4 md:text-[10px] md:tracking-[0.16em]`}
                >
                  Request Quote
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <Reveal className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-md md:mt-14 md:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <span className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-brand-cyan">
                  International Payment Support
                </span>
                <p className="text-sm font-light leading-relaxed text-brand-gray md:text-base">
                  USD invoices for international businesses, premium global brands, remote-first teams, and worldwide digital solution engagements.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 min-[430px]:grid-cols-3 lg:flex lg:flex-wrap">
                {paymentMethods.map((method) => (
                  <span
                    key={method}
                    className={`flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-brand-black/50 px-2 py-2 text-center text-[9px] font-mono uppercase leading-snug tracking-[0.1em] text-zinc-300 min-[390px]:px-3 min-[390px]:text-[10px] lg:min-h-0 lg:tracking-[0.16em] ${method === 'International Bank Transfer' ? 'col-span-2 min-[430px]:col-span-1' : ''}`}
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="featured-projects" className="relative overflow-hidden border-y border-white/5 bg-brand-black py-20 md:py-32">
        <div className="absolute inset-0 premium-grid-overlay opacity-25" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Featured Projects"
            title="Proven project work with international delivery standards."
            copy="The same flagship Jawrah Pixel project set available across Sri Lanka, Pakistan, and international client pathways."
          />

          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <StaggerItem key={project.title} className="glass-card group overflow-hidden rounded-2xl">
                <div className="border-b border-white/5 bg-zinc-950/90 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/35" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/35" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500/35" />
                    </div>
                    <span className="truncate text-[9px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                      {project.type}
                    </span>
                  </div>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                  <img
                    src={project.image}
                    alt={`${project.title} interface preview`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top opacity-85 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full border border-brand-cyan/20 bg-brand-black/70 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.18em] text-brand-cyan backdrop-blur-md">
                    {project.signal}
                  </div>
                </div>
                <div className="p-6">
                  <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-brand-cyan">{project.type}</p>
                  <h3 className="mb-3 text-xl font-display font-medium text-white">{project.title}</h3>
                  <p className="mb-5 text-sm font-light leading-relaxed text-brand-gray">{project.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-zinc-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-navy/20 py-20 md:py-32">
        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Why Global Brands Choose Jawrah Pixel"
            title="Luxury polish with serious product engineering underneath."
            copy="The work is designed to look exceptional, load fast, convert cleanly, and remain useful long after launch."
          />

          <StaggerContainer className="grid grid-cols-2 gap-3 min-[430px]:grid-cols-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {reasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <StaggerItem key={reason.title} className="interactive-lift min-w-0 rounded-xl border border-white/10 bg-white/[0.025] p-4 hover:border-brand-cyan/25 sm:rounded-2xl sm:p-5">
                  <Icon className="mb-4 h-5 w-5 text-brand-cyan sm:mb-5 sm:h-6 sm:w-6" />
                  <h3 className="mb-2 text-[13px] font-display font-medium leading-snug text-white min-[390px]:text-sm sm:text-base">{reason.title}</h3>
                  <p className="text-[11px] font-light leading-relaxed text-brand-gray sm:text-xs md:text-sm">{reason.desc}</p>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/5 bg-brand-black py-20 md:py-32">
        <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-brand-cyan/10 blur-[120px]" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Process"
            title="A calm, structured path from vision to launch."
            copy="Six clear phases keep the collaboration premium, transparent, and focused on measurable outcomes."
          />

          <div className="relative">
            <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-brand-cyan/40 to-transparent md:left-1/2 md:block" />
            <StaggerContainer className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-8">
              {process.map((item, idx) => (
                <StaggerItem key={item.step} className={`relative grid grid-cols-1 items-center gap-5 md:grid-cols-2 ${idx % 2 === 0 ? '' : 'md:[&>div:first-child]:order-2'}`}>
                  <div className={idx % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}>
                    <div className="glass-card interactive-lift rounded-xl p-4 min-[390px]:p-5 sm:rounded-2xl md:p-8">
                      <span className="mb-2 block text-xs font-mono font-bold text-brand-cyan md:mb-4 md:text-sm">{item.step}</span>
                      <h3 className="mb-2 text-base font-display font-medium leading-tight text-white min-[390px]:text-lg md:mb-3 md:text-2xl">{item.title}</h3>
                      <p className="text-[11px] font-light leading-relaxed text-brand-gray md:text-base">{item.desc}</p>
                    </div>
                  </div>
                  <div className={`hidden md:flex ${idx % 2 === 0 ? 'justify-start pl-16' : 'justify-end pr-16'}`}>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-cyan/25 bg-brand-cyan/10 text-brand-cyan shadow-[0_0_32px_rgba(6,182,212,0.18)]">
                      <Sparkles className="h-6 w-6" />
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-navy/30 py-20 md:py-32">
        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Testimonials"
            title="International teams trust the feeling and the follow-through."
            copy="Believable, high-signal collaboration for founders, ecommerce owners, SaaS teams, and luxury brands."
          />

          <StaggerContainer className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <StaggerItem key={testimonial.author} className="glass-card rounded-2xl p-6 md:p-8">
                <div className="mb-6 flex gap-1 text-brand-cyan">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mb-7 text-base font-light leading-relaxed text-zinc-200 md:text-lg">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <div>
                    <p className="font-display font-medium text-white">{testimonial.author}</p>
                    <p className="text-xs text-brand-gray">{testimonial.role}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-brand-cyan">
                    {testimonial.region}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/5 bg-brand-black py-20 md:py-32">
        <div className="absolute inset-0 premium-grid-overlay opacity-30" />
        <div className="container relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <span className="mb-4 block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-cyan">
              Global Reach
            </span>
            <h2 className="text-3xl font-display font-medium uppercase leading-[1.08] tracking-tight text-white sm:text-4xl md:text-6xl">
              Worldwide remote collaboration without the friction.
            </h2>
            <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-brand-gray md:text-lg">
              Jawrah Pixel serves clients internationally with flexible communication, remote-first workflows, structured handoffs, and a delivery rhythm designed for global businesses.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2">
              {['Worldwide remote collaboration', 'Serving clients internationally', 'Flexible communication', 'Remote-first workflow'].map((item) => (
                <div key={item} className="flex items-start gap-2 text-[11px] leading-snug text-zinc-300 min-[390px]:text-xs sm:items-center sm:gap-3 sm:text-sm">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-cyan sm:mt-0 sm:h-4 sm:w-4" />
                  {item}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative min-h-[420px]">
            <div className="absolute inset-0 rounded-full bg-brand-cyan/10 blur-[110px]" />
            <div className="relative mx-auto flex aspect-square max-w-[560px] items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.015] shadow-[inset_0_0_80px_rgba(6,182,212,0.08)] backdrop-blur-md">
              <div className="absolute inset-[12%] rounded-full border border-brand-cyan/15" />
              <div className="absolute inset-[24%] rounded-full border border-brand-blue/15" />
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand-cyan/25 to-transparent" />
              <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-brand-cyan/25 to-transparent" />
              <Globe2 className="h-28 w-28 text-brand-cyan/60 md:h-36 md:w-36" />
              {globalNodes.map((node, idx) => {
                const positions = [
                  'left-[18%] top-[26%]',
                  'right-[18%] top-[30%]',
                  'left-[46%] top-[13%]',
                  'right-[24%] bottom-[24%]',
                  'left-[20%] bottom-[24%]',
                  'left-[48%] bottom-[13%]',
                ];
                return (
                  <motion.div
                    key={node}
                    className={`absolute ${positions[idx]} flex items-center gap-2`}
                    animate={{ opacity: [0.55, 1, 0.55], scale: [0.98, 1.04, 0.98] }}
                    transition={{ duration: 3.6 + idx * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-cyan shadow-[0_0_16px_rgba(6,182,212,0.9)]" />
                    <span className="hidden rounded-full border border-white/10 bg-brand-black/70 px-2 py-1 text-[9px] font-mono uppercase tracking-[0.16em] text-zinc-300 backdrop-blur-md sm:inline">
                      {node}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-black py-20 md:py-32">
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-brand-blue/12 to-transparent" />
        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center md:px-8">
          <Reveal>
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-cyan/20 bg-brand-cyan/10 text-brand-cyan shadow-[0_0_45px_rgba(6,182,212,0.18)]">
              <Building2 className="h-7 w-7" />
            </div>
            <h2 className="text-4xl font-display font-medium uppercase leading-[1.05] tracking-tight text-white sm:text-5xl md:text-7xl">
              Let's Build Something Exceptional.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-relaxed text-brand-gray md:text-lg">
              Bring us the ambition. We will shape the strategy, interface, system, and launch experience with the polish a global brand deserves.
            </p>
            <div className="mt-9 grid grid-cols-1 gap-3 sm:flex sm:justify-center">
              <Link
                to={p('/contact')}
                className={`${primaryCtaClass} h-13 w-full px-6 text-[10px] font-mono font-bold uppercase tracking-[0.16em] shadow-[0_0_42px_rgba(59,130,246,0.34)] sm:w-auto md:h-14 md:px-9 md:text-xs`}
              >
                Start Your Project
                <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
              <a
                href={config.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className={`${outlineCtaClass} h-13 w-full border-white/20 bg-white/5 px-6 text-[10px] font-mono font-bold uppercase tracking-[0.16em] sm:w-auto md:h-14 md:px-9 md:text-xs`}
              >
                Schedule a Call
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
