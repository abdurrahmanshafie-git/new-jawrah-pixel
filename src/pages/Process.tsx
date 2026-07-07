import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  Check, 
  ChevronDown, 
  HelpCircle as FaqIcon,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link, useLocation } from 'react-router-dom';
import { SEO } from '@/components/layout/SEO';
import { useRegion } from '@/hooks/useRegion';
import { useTheme } from '@/contexts/ThemeContext';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import { toAbsoluteUrl } from '@/lib/env';

type ProcessStep = {
  num: string;
  title: string;
  desc: string;
  delivery: string;
  timeline: string;
};

function ProcessStepCard({ step, align = 'left' }: { step: ProcessStep; align?: 'left' | 'right' }) {
  const alignToCenter = align === 'right';
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        "group w-full border p-6 transition-all duration-500 hover:border-brand-blue/25 md:p-8",
        alignToCenter ? "md:text-right" : "md:text-left"
      )}
      style={{ 
        borderColor: 'var(--border)', 
        backgroundColor: 'var(--card-background)' 
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--card-background)';
      }}
    >
      <div
        className={cn(
          "mb-5 flex flex-wrap items-center gap-3",
          alignToCenter ? "md:justify-end" : "md:justify-start"
        )}
      >
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-brand-blue/35 bg-brand-blue/10 font-mono text-sm font-semibold text-brand-blue md:hidden">
          {step.num}
        </span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-brand-blue">
          {step.timeline}
        </span>
      </div>

      <h4 className="mb-4 text-xl font-display font-medium uppercase tracking-tight transition-colors group-hover:text-brand-blue md:text-2xl">
        {step.title}
      </h4>
      <p className="text-sm font-light leading-relaxed transition-colors duration-500" style={{ color: 'var(--text-secondary)' }}>
        {step.desc}
      </p>

      <div
        className={cn(
          "mt-7 flex items-center gap-3 border-t pt-5 font-mono text-[10px] uppercase tracking-[0.22em]",
          alignToCenter ? "md:justify-end" : "md:justify-start"
        )}
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        <Check size={14} className="shrink-0 text-brand-blue" />
        <span className="min-w-0 break-words leading-relaxed">{step.delivery}</span>
      </div>
    </div>
  );
}

export default function Process() {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { config, faqs, p, isInternational } = useRegion();
  const canonicalPath = location.pathname === '/faq' ? '/faq' : p('/process');
  const seoTitle = isInternational ? 'Global Agency Workflow & USD Retainers' : `Agency Workflow & Trust Blueprints | ${config.countryName}`;
  const seoDescription = isInternational
    ? "Learn about Jawrah Pixel's remote-first global development process, USD monthly retainers, international payment support, and performance guarantees for premium global brands."
    : `Learn about Jawrah Pixel's elite development process, active monthly retainers, responsive ticketing FAQs, and performance guarantees for ${config.countryName} brands.`;

  const steps: ProcessStep[] = [
    { 
      num: '01', 
      title: 'Discovery & Strategy', 
      desc: 'Elite strategic briefing, target positioning analysis, systems discovery, and structural project scope alignment.', 
      delivery: 'Technical Specification Document', 
      timeline: 'Week 1' 
    },
    { 
      num: '02', 
      title: 'UI/UX Planning', 
      desc: 'Deep customer persona mapping, rapid visual wireframing sprints, and frictionless mobile/desktop page path layouts.', 
      delivery: 'User Experience Wireframes', 
      timeline: 'Week 2' 
    },
    { 
      num: '03', 
      title: 'Premium Design', 
      desc: 'Crafting customized high-fidelity visual interfaces with editorial typography pairings and high-impact branding.', 
      delivery: 'Interactive Prototypes', 
      timeline: 'Week 3-4' 
    },
    { 
      num: '04', 
      title: 'Development', 
      desc: 'Clean componentized frontend construction in TypeScript and custom Vite engines, with robust relational schema design.', 
      delivery: 'Secure Server Schema', 
      timeline: 'Week 5-7' 
    },
    { 
      num: '05', 
      title: 'Optimization', 
      desc: 'Strict performance testing targeting 98%+ Lighthouse scores, asset loading optimizations, and security checks.', 
      delivery: 'Performance Audit', 
      timeline: 'Week 8' 
    },
    { 
      num: '06', 
      title: 'Launch', 
      desc: 'Seamless migration of all system parts to global production CDN nodes and complete code handover.', 
      delivery: 'Global Live Launch', 
      timeline: 'Week 9-10' 
    }
  ];

  const plans = [
    {
      name: "Strategic Care",
      price: config.id === 'int' ? "$500+" : config.id === 'lk' ? "LKR 75,000" : "PKR 75,000",
      period: "Monthly retainer",
      desc: "Perfect for corporate publications and advisory channels requiring security updates.",
      features: [
        "Monthly security audits",
        "Weekly offsite backups",
        "24-Hour SLA Support",
        "Monthly content changes",
        "Minor layout adjustments"
      ],
      isRecommended: false
    },
    {
      name: "Enterprise Scaler",
      price: config.id === 'int' ? "$1,500+" : config.id === 'lk' ? "LKR 165,000" : "PKR 165,000",
      period: "Monthly retainer",
      desc: "Architected for high-frequency jewellery boutiques and spatial showrooms.",
      features: [
        "Continuous API audits",
        "Bi-weekly performance checks",
        "6-Hour Priority SLA",
        "Live error-monitoring",
        "Payment rail validations",
        "SEO indexing push"
      ],
      isRecommended: true
    }
  ];

  return (
    <div 
      className="relative min-h-screen pt-32 pb-24 font-sans overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
    >
      <SEO 
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={toAbsoluteUrl(canonicalPath)}
      />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[10%] right-[10%] cinematic-light animate-pulse-slow opacity-30" />
          <div className="absolute bottom-[20%] left-[10%] cinematic-light animate-glow opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' }} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal className="text-center max-w-4xl mx-auto mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex gap-3 items-center px-6 py-2 border rounded-none bg-white/[0.03] text-brand-blue text-[10px] font-mono uppercase tracking-[0.4em] mb-10"
            style={{ 
              borderColor: 'var(--border)', 
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' 
            }}
          >
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" /> Methodology
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl lg:text-8xl font-display font-medium uppercase mb-10 tracking-tight leading-[1.1] overflow-visible"
          >
            Product <br /> <span className="premium-text-gradient italic inline-block px-2 py-1 overflow-visible">Blueprint</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Explore our world-class onboarding timeline, engineered for complete architectural transparency from design lock-in to final schema deploy.
          </motion.p>
        </Reveal>

        <div className="relative mx-auto mb-24 max-w-6xl md:mb-48">
          <div className="pointer-events-none absolute bottom-8 left-1/2 top-8 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand-blue/35 to-transparent md:block" />

          <div className="space-y-6 md:space-y-10">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div 
                  key={step.num}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative md:grid md:grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1fr)] md:items-center md:gap-6"
                >
                  <div
                    className={cn(
                      "w-full",
                      isLeft ? "md:col-start-1" : "md:col-start-3 md:row-start-1"
                    )}
                  >
                    <ProcessStepCard step={step} align={isLeft ? 'right' : 'left'} />
                  </div>

                  <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-brand-blue/35 bg-brand-black shadow-[0_0_0_8px_rgba(3,7,18,0.95)] md:flex">
                    <span className="font-mono text-lg font-semibold text-brand-blue">{step.num}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <section className="mb-24 md:mb-48">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
            {[
              {
                icon: ShieldCheck,
                title: 'Contractual IP',
                desc: 'Complete codebase copyright handover. Zero proprietary vendor locks.'
              },
              {
                icon: Clock,
                title: 'Rapid Deployment',
                desc: 'Agile sprints focused on time-to-market without compromising precision.'
              },
              {
                icon: Award,
                title: 'Quality Assurance',
                desc: 'Rigorous performance benchmarks and security auditing on every build.'
              }
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1} className="group p-6 md:p-12 border transition-all duration-700 text-center h-full" style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'; }}>
                <div className="w-10 h-10 md:w-16 md:h-16 bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500">
                  <item.icon size={18} className="md:hidden" />
                  <item.icon size={24} className="hidden md:block" />
                </div>
                <h4 className="text-sm font-display font-medium uppercase tracking-[0.2em] mb-4">{item.title}</h4>
                <p className="text-[11px] md:text-sm leading-relaxed font-light transition-colors duration-500" style={{ color: 'var(--text-secondary)' }}>
                  {item.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mb-24 md:mb-48">
          <Reveal className="text-center mb-24 md:mb-32">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Operations</span>
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight mb-8">Technical Care</h2>
            <p className="text-lg font-light max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Ongoing performance audits, database security integrations, and small changes allocated monthly.
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto items-stretch">
            {plans.map((plan) => (
              <StaggerItem
                key={plan.name}
                className={cn(
                  "relative p-12 border flex flex-col transition-all duration-700",
                  plan.isRecommended 
                    ? "border-brand-blue/30 shadow-2xl shadow-brand-blue/5" 
                    : "hover:bg-white/[0.03]"
                )}
                style={{ 
                  borderColor: plan.isRecommended ? undefined : 'var(--border)', 
                  backgroundColor: plan.isRecommended ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(251,191,36,0.05)') : (isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0,0,0,0.02)') 
                }}
              >
                {plan.isRecommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-[10px] font-bold px-6 py-2 tracking-[0.2em] uppercase">
                    Recommended
                  </div>
                )}
                <div className="mb-12">
                  <h3 className="text-xl font-display font-medium mb-6 uppercase tracking-[0.2em]">{plan.name}</h3>
                  <div className="flex flex-col gap-2">
                    <span className="text-4xl font-display font-medium tracking-tighter">{plan.price}</span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-6 mb-16 flex-1">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex gap-4 text-sm items-start leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <Zap className={cn("w-4 h-4 shrink-0 mt-0.5", plan.isRecommended ? "text-brand-blue" : "text-zinc-600")} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                  <Link to={p('/contact')}>
                    <Button variant={plan.isRecommended ? 'primary' : 'outline'} className="w-full h-14">
                      Activate Care Plan
                    </Button>
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        <section className="mb-24 md:mb-32">
          <Reveal className="text-center mb-16 md:mb-24">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Inquiries</span>
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight mb-8">Common Questions</h2>
          </Reveal>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="border overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0,0,0,0.02)' }}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-6 md:p-8 flex items-center justify-between text-left transition-colors hover:bg-white/[0.03]"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span className="text-sm md:text-lg font-display font-medium uppercase tracking-tight">{faq.q}</span>
                    <ChevronDown className={cn("w-5 h-5 transition-transform duration-500", openFaq === i && "rotate-180")} style={{ color: 'var(--text-secondary)' }} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-8 pb-8 text-sm md:text-base font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className="mt-32 md:mt-48 pb-20">
          <div className="relative p-16 md:p-24 border text-center flex flex-col items-center overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0,0,0,0.02)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-8 relative z-10">Initiate Project</span>
            <h2 className="text-3xl md:text-6xl font-display font-medium tracking-tight max-w-3xl mb-10 uppercase leading-[1.1] relative z-10 overflow-visible">
              Transform your digital <span className="premium-text-gradient italic inline-block px-2 py-1 overflow-visible">authority</span>.
            </h2>
            <Link to={p('/contact')} className="relative z-10">
              <Button size="lg" className="min-w-[280px]">
                Start Blueprint
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
