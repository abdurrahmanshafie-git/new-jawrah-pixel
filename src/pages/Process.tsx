import React, { useState } from 'react';
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
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import { toAbsoluteUrl } from '@/lib/env';

export default function Process() {
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { config, faqs, p, isInternational } = useRegion();
  const canonicalPath = location.pathname === '/faq' ? '/faq' : p('/process');
  const seoTitle = isInternational ? 'Global Agency Workflow & USD Retainers' : `Agency Workflow & Trust Blueprints | ${config.countryName}`;
  const seoDescription = isInternational
    ? "Learn about Jawrah Pixel's remote-first global development process, USD monthly retainers, international payment support, and performance guarantees for premium global brands."
    : `Learn about Jawrah Pixel's elite development process, active monthly retainers, responsive ticketing FAQs, and performance guarantees for ${config.countryName} brands.`;

  const steps = [
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
    <div className="bg-brand-black text-white relative min-h-screen pt-32 pb-24 font-sans overflow-hidden">
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
            className="inline-flex gap-3 items-center px-6 py-2 border border-white/5 rounded-none bg-white/[0.03] text-brand-blue text-[10px] font-mono uppercase tracking-[0.4em] mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" /> Methodology
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl lg:text-8xl font-display font-medium uppercase mb-10 tracking-tight leading-[0.95]"
          >
            Product <br /> <span className="premium-text-gradient italic">Blueprint</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            Explore our world-class onboarding timeline, engineered for complete architectural transparency from design lock-in to final schema deploy.
          </motion.p>
        </Reveal>

        <div className="md:hidden max-w-6xl mx-auto mb-24">
          <StaggerContainer className="grid grid-cols-2 gap-4">
            {steps.map((step) => (
              <StaggerItem
                key={step.num}
                className="h-full p-6 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-700 flex flex-col"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold">{step.timeline}</span>
                  <span className="w-9 h-9 border border-brand-blue/30 flex items-center justify-center shrink-0 text-brand-blue font-mono text-sm">
                    {step.num}
                  </span>
                </div>
                <h4 className="text-sm font-display font-medium text-white uppercase tracking-tight leading-snug mb-3">
                  {step.title}
                </h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-light mb-5 line-clamp-4">
                  {step.desc}
                </p>
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                  <Check size={12} className="text-brand-blue" /> {step.delivery}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        <div className="hidden md:block max-w-6xl mx-auto mb-24 md:mb-48 relative">
          <div className="absolute left-[24px] md:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-brand-blue via-brand-blue/20 to-transparent pointer-events-none"></div>

          <div className="space-y-20 md:space-y-32">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div 
                  key={step.num}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "flex items-start md:items-center gap-10 md:gap-20 relative",
                    isEven ? "md:flex-row-reverse" : "md:flex-row"
                  )}
                >
                  <div className="w-full md:w-1/2 hidden md:block">
                    <div className={cn(
                      "group p-12 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-700",
                      isEven ? "text-right" : "text-left"
                    )}>
                      <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold">{step.timeline}</span>
                      <h4 className="text-2xl font-display font-medium text-white uppercase mt-4 mb-6 tracking-tight group-hover:text-brand-blue transition-colors">{step.title}</h4>
                      <p className="text-sm text-zinc-500 leading-relaxed font-light group-hover:text-zinc-300 transition-colors duration-500">{step.desc}</p>
                      <div className={cn(
                        "pt-6 border-t border-white/5 mt-8 flex items-center gap-3 text-[10px] font-mono text-zinc-600 uppercase tracking-widest",
                        isEven ? "justify-end" : "justify-start"
                      )}>
                        <Check size={14} className="text-brand-blue" /> {step.delivery}
                      </div>
                    </div>
                  </div>

                  <div className="w-12 h-12 md:w-24 md:h-24 bg-brand-black border border-brand-blue/30 flex items-center justify-center shrink-0 z-10 relative">
                    <span className="text-lg md:text-2xl font-display font-medium text-brand-blue font-mono">{step.num}</span>
                    <div className="absolute -inset-2 border border-white/5 animate-spin-slow"></div>
                  </div>

                  <div className="w-full md:w-1/2">
                    <div className={cn(
                      "group p-10 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-700",
                      isEven ? "md:hidden" : "text-left"
                    )}>
                      <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold">{step.timeline}</span>
                      <h4 className="text-xl font-display font-medium text-white uppercase mt-4 mb-4 tracking-tight group-hover:text-brand-blue transition-colors">{step.title}</h4>
                      <p className="text-sm text-zinc-500 leading-relaxed font-light group-hover:text-zinc-300 transition-colors duration-500">{step.desc}</p>
                      <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-start gap-3 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                        <Check size={14} className="text-brand-blue" /> {step.delivery}
                      </div>
                    </div>
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
              <Reveal key={i} delay={i * 0.1} className="group p-6 md:p-12 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-700 text-center h-full">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500">
                  <item.icon size={18} className="md:hidden" />
                  <item.icon size={24} className="hidden md:block" />
                </div>
                <h4 className="text-sm font-display font-medium uppercase tracking-[0.2em] text-white mb-4">{item.title}</h4>
                <p className="text-[11px] md:text-sm text-zinc-500 leading-relaxed font-light group-hover:text-zinc-300 transition-colors duration-500">
                  {item.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mb-24 md:mb-48">
          <Reveal className="text-center mb-24 md:mb-32">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Operations</span>
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight text-white mb-8">Technical Care</h2>
            <p className="text-zinc-500 text-lg font-light max-w-2xl mx-auto leading-relaxed">
              Ongoing performance audits, database security integrations, and small changes allocated monthly.
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto items-stretch">
            {plans.map((plan) => (
              <StaggerItem
                key={plan.name}
                className={cn(
                  "relative p-12 bg-white/[0.02] border border-white/5 flex flex-col transition-all duration-700",
                  plan.isRecommended 
                    ? "bg-white/[0.04] border-brand-blue/30 shadow-2xl shadow-brand-blue/5" 
                    : "hover:bg-white/[0.03]"
                )}
              >
                {plan.isRecommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-[10px] font-bold px-6 py-2 tracking-[0.2em] uppercase">
                    Recommended
                  </div>
                )}
                <div className="mb-12">
                  <h3 className="text-xl font-display font-medium text-white mb-6 uppercase tracking-[0.2em]">{plan.name}</h3>
                  <div className="flex flex-col gap-2">
                    <span className="text-4xl font-display font-medium text-white tracking-tighter">{plan.price}</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-6 mb-16 flex-1">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex gap-4 text-sm text-zinc-400 items-start leading-relaxed">
                      <Zap className={cn("w-4 h-4 shrink-0 mt-0.5", plan.isRecommended ? "text-brand-blue" : "text-zinc-600")} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-8 border-t border-white/5">
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
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight text-white mb-8">Common Questions</h2>
          </Reveal>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="border border-white/5 bg-white/[0.02] overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-6 md:p-8 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="text-sm md:text-lg font-display font-medium text-white uppercase tracking-tight">{faq.q}</span>
                    <ChevronDown className={cn("w-5 h-5 text-zinc-500 transition-transform duration-500", openFaq === i && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-8 pb-8 text-sm md:text-base text-zinc-500 font-light leading-relaxed">
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
          <div className="relative p-16 md:p-24 bg-white/[0.02] border border-white/5 text-center flex flex-col items-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-8 relative z-10">Initiate Project</span>
            <h2 className="text-3xl md:text-6xl font-display font-medium tracking-tight text-white max-w-3xl mb-10 uppercase leading-[1.1] relative z-10">
              Transform your digital <span className="premium-text-gradient italic">authority</span>.
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
