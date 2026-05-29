import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  Layers, 
  MessageSquare, 
  ArrowUpRight, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  HelpCircle as FaqIcon,
  Phone,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/layout/SEO';
import { useRegion } from '@/hooks/useRegion';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';

// Interactive FAQ Type
interface FaqItem {
  q: string;
  a: string;
}

export default function Process() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { config, faqs, p, isInternational } = useRegion();
  const seoTitle = isInternational ? 'Global Agency Workflow & USD Retainers' : `Agency Workflow & Trust Blueprints | ${config.countryName}`;
  const seoDescription = isInternational
    ? "Learn about Jawrah Pixel's remote-first global development process, USD monthly retainers, international payment support, and performance guarantees for premium global brands."
    : `Learn about Jawrah Pixel's elite development process, active monthly retainers, responsive ticketing FAQs, and performance guarantees for ${config.countryName} brands.`;
  const whatsappLabel = isInternational ? 'WhatsApp Global' : `WhatsApp ${config.countryName}`;

  const steps = [
    { 
      num: '01', 
      title: 'Discovery & Strategy', 
      desc: 'Elite strategic briefing, target positioning analysis, systems discovery, and structural project scope alignment. We formulate the core conceptual boundaries and conversion targets of your digital system.', 
      delivery: 'Technical Specification Document, Information Architecture, Interactive Blueprint Charter', 
      timeline: 'Week 1' 
    },
    { 
      num: '02', 
      title: 'UI/UX Planning', 
      desc: 'Deep customer persona mapping, rapid visual wireframing sprints, and frictionless mobile/desktop page path layouts designed around user psychology and speed.', 
      delivery: 'User Experience Wireframes, Layout Wiremaps & Gesture Flowcharts', 
      timeline: 'Week 2' 
    },
    { 
      num: '03', 
      title: 'Premium Design', 
      desc: 'Crafting customized high-fidelity visual interfaces with editorial typography pairings, high-impact branding schemes, and beautiful geometric ratios. Absolutely no templates.', 
      delivery: 'Signature UI Design System, Asset Delivery Library & Interactive High-Fidelity Prototypes', 
      timeline: 'Week 3-4' 
    },
    { 
      num: '04', 
      title: 'Development & Backend', 
      desc: 'Clean componentized frontend construction in TypeScript and custom Vite engines, paired with robust relational PostgreSQL schema design and granular row level security on Supabase.', 
      delivery: 'Next-Gen Component Codebase, Secure Server Schema & Verification Sandbox', 
      timeline: 'Week 5-7' 
    },
    { 
      num: '05', 
      title: 'Testing & Optimization', 
      desc: 'Strict performance testing targeting 98%+ Lighthouse scores, comprehensive asset loading optimizations, edge CDN integration, and security checks.', 
      delivery: 'Web Vitals Performance Audit, CDN Edge Routing Setup & SSL Verification', 
      timeline: 'Week 8' 
    },
    { 
      num: '06', 
      title: 'Launch & Support', 
      desc: 'Seamless migration of all system parts to global production CDN nodes, complete code directories ownership handover, and custom priority technical SLA care plans.', 
      delivery: 'Global Live Launch, Source Directories Handover & Retainer Monitoring Monitoring', 
      timeline: 'Week 9-10' 
    }
  ];

  const plans = [
    {
      name: "Strategic Care Plan",
      price: config.id === 'int' ? "$500+" : config.id === 'lk' ? "LKR 75,000" : "PKR 75,000",
      period: "Monthly retainer",
      desc: "Perfect for corporate publications, advisory channels, and blogs requiring security updates.",
      hours: "4 Engineering Hours / mo",
      features: [
        "Monthly Supabase security audits",
        "Weekly offsite backplane backups",
        "24-Hour SLA Support Ticket response",
        "Monthly content/editorial changes",
        "Minor CSS & Layout adjustments"
      ],
      badge: "Core Maintenance",
      glow: "border-white/5",
      buttonVar: "outline" as const
    },
    {
      name: "Enterprise Scaler Node",
      price: config.id === 'int' ? "$1,500+" : config.id === 'lk' ? "LKR 165,000" : "PKR 165,000",
      period: "Monthly retainer",
      desc: "Architected for high-frequency jewellery boutiques, spatial showrooms, and custom databases.",
      hours: "12 Engineering Hours / mo",
      features: [
        "Continuous API integrations audit",
        "Bi-weekly performance optimizing checks",
        "6-Hour Priority SLA direct hotline",
        "Live error-monitoring (Sentry) integrations",
        config.id === 'int' ? "Visa and Mastercard payment rail validations" : "Stripe payment hooks validations",
        "SEO trends monitoring & indexing push"
      ],
      badge: "Most Popular",
      glow: "border-brand-cyan/35 shadow-[0_0_20px_rgba(34,211,238,0.15)] bg-brand-cyan/[0.02]",
      buttonVar: "primary" as const
    }
  ];

  return (
    <div className="bg-brand-black text-white relative min-h-screen pt-32 pb-24 font-sans overflow-hidden">
      <SEO 
        title={seoTitle}
        description={seoDescription}
      />

      {/* Background Ambitions */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        
        {/* HEADER */}
        <Reveal className="text-center max-w-3xl mx-auto mb-16 md:mb-28">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-4 md:mb-6 animate-pulse"
          >
            <Clock size={10} className="sm:w-3 sm:h-3" /> Refined Workflow Mechanics
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-6xl font-display font-semibold uppercase mb-4 md:mb-6 tracking-tight leading-[1.1]"
          >
            Product <span className="text-brand-cyan drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">Blueprint</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-gray text-xs sm:text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed px-4 sm:px-0"
          >
            Explore our world-class onboarding timeline, engineered for complete architectural transparency from design lock-in to final schema deploy.
          </motion.p>
        </Reveal>

        {/* TIMELINE STEPS SECTIONS */}
        <div className="max-w-5xl mx-auto mb-32 relative">
          
          {/* Central Vertical Connector Line */}
          <div className="absolute left-[24px] md:left-1/2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-brand-cyan/40 via-brand-blue/20 to-transparent pointer-events-none"></div>

          <div className="space-y-12 md:space-y-20">
            {steps.map((step, i) => {
              const rotateDir = i % 2 === 0 ? "md:text-right md:flex-row-reverse" : "md:text-left md:flex-row";
              return (
                <motion.div 
                  key={step.num}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`flex items-start md:items-center gap-6 md:gap-14 ${rotateDir} relative`}
                >
                  
                  {/* Left Column (Desktop only) */}
                  <div className="w-full md:w-1/2 hidden md:block">
                    {i % 2 === 0 ? (
                      <div className="glass-card p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-brand-cyan/20 transition-all duration-500 group">
                        <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.3em] font-bold">{step.timeline}</span>
                        <h4 className="text-xl font-display font-bold text-white uppercase mt-2 mb-3 tracking-tight group-hover:text-brand-cyan transition-colors">{step.title}</h4>
                        <p className="text-sm text-brand-gray leading-relaxed font-light">{step.desc}</p>
                        <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-end gap-2 text-[10px] font-mono text-brand-silver uppercase tracking-widest">
                          <Check size={12} className="text-brand-cyan" /> {step.delivery}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Central Node Dot Marker */}
                  <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-brand-cyan/30 bg-brand-black flex items-center justify-center shrink-0 z-10 shadow-[0_0_20px_rgba(34,211,238,0.15)] relative mt-1 md:mt-0">
                    <span className="text-sm md:text-xl font-display font-bold text-brand-cyan font-mono">{step.num}</span>
                    <div className="absolute inset-1.5 md:inset-2 border border-white/10 rounded-full animate-spin-slow"></div>
                  </div>

                  {/* Right Column (Mobile views + Desktop odd) */}
                  <div className="w-full md:w-1/2">
                    <div className={cn(
                      "glass-card p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-brand-cyan/20 transition-all duration-500 group",
                      i % 2 === 0 ? "md:hidden" : ""
                    )}>
                      <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.3em] font-bold">{step.timeline}</span>
                      <h4 className="text-lg sm:text-xl font-display font-bold text-white uppercase mt-2 mb-3 tracking-tight group-hover:text-brand-cyan transition-colors">{step.title}</h4>
                      <p className="text-[13px] sm:text-sm text-brand-gray leading-relaxed font-light">{step.desc}</p>
                      <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-start gap-2 text-[10px] font-mono text-brand-silver uppercase tracking-widest">
                        <Check className="w-3 h-3 text-brand-cyan" /> {step.delivery}
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

        {/* TRUST ACCREDITATION GUARANTEES */}
        <Reveal className="p-8 md:p-16 rounded-3xl border border-white/5 bg-white/[0.01] max-w-5xl mx-auto mb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-cyan/5 rounded-full blur-3xl"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12 text-center sm:text-left">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mx-auto sm:mx-0 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                <ShieldCheck className="w-6 h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
              </div>
              <h4 className="text-xs md:text-sm font-display font-bold uppercase tracking-[0.2em] text-white">Contractual IP</h4>
              <p className="text-[13px] text-brand-gray leading-relaxed font-light">
                Complete codebase copyright handover. Zero proprietary vendor locks.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mx-auto sm:mx-0 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                <Clock className="w-6 h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
              </div>
              <h4 className="text-xs md:text-sm font-display font-bold uppercase tracking-[0.2em] text-white">Rapid Deployment</h4>
              <p className="text-[13px] text-brand-gray leading-relaxed font-light">
                Agile sprints focused on time-to-market without compromising precision.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mx-auto sm:mx-0 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                <Award className="w-6 h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
              </div>
              <h4 className="text-xs md:text-sm font-display font-bold uppercase tracking-[0.2em] text-white">Elite Standards</h4>
              <p className="text-[13px] text-brand-gray leading-relaxed font-light">
                98+ Lighthouse scores, WCAG compliance, and enterprise-grade security.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mx-auto sm:mx-0 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                <Phone className="w-6 h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
              </div>
              <h4 className="text-[8px] sm:text-[10px] md:text-sm font-mono uppercase tracking-widest text-white font-semibold">24-Hr SLA Commitment</h4>
              <p className="text-[7.5px] sm:text-[9px] md:text-xs text-brand-gray leading-relaxed font-light">
                Premium Ticketing Response guarantee. Account Managers accessible via WhatsApp and email workspace.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mx-auto md:mx-0">
                <Award className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
              </div>
              <h4 className="text-[8px] sm:text-[10px] md:text-sm font-mono uppercase tracking-widest text-white font-semibold">Core Web Vitals Checked</h4>
              <p className="text-[7.5px] sm:text-[9px] md:text-xs text-brand-gray leading-relaxed font-light">
                We design with real system optimizations achieving near-perfect Lighthouse Speed & SEO metrics.
              </p>
            </div>
          </div>
        </Reveal>

        {/* SYSTEM CARE MONTHLY PLANS */}
        <div className="max-w-4xl mx-auto mb-32 space-y-12">
          <Reveal className="text-center space-y-4">
            <span className="px-2.5 py-0.5 rounded bg-brand-blue/15 border border-brand-blue/25 text-brand-blue text-[10px] font-mono uppercase tracking-widest">
              MONTHLY RETAINER CARE OPTIONS
            </span>
            <h2 className="text-2xl md:text-4xl font-display font-semibold uppercase text-white">
              Technical Care Blueprints
            </h2>
            <p className="text-xs md:text-sm text-brand-gray max-w-md mx-auto font-light leading-relaxed">
              Ongoing performance audits, database security integrations, and small changes allocated monthly.
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-8">
            {plans.map((plan) => (
              <StaggerItem key={plan.name} className={`glass-card p-4 sm:p-6 md:p-8 rounded-2xl border flex flex-col justify-between ${plan.glow}`}>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="text-[8px] sm:text-[9px] font-mono text-brand-cyan uppercase tracking-widest bg-brand-cyan/10 px-2 sm:px-2.5 py-0.5 rounded border border-brand-cyan/15">
                      {plan.badge}
                    </span>
                    <span className="text-[9px] sm:text-xs font-mono text-brand-silver font-semibold">{plan.hours}</span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-xl font-display font-medium text-white uppercase">{plan.name}</h3>
                    <p className="text-[9px] sm:text-xs text-brand-gray mt-0.5 sm:mt-1 font-light leading-relaxed min-h-[40px]">{plan.desc}</p>
                  </div>

                  <div className="py-2 flex items-baseline gap-1 sm:gap-1.5 border-y border-white/5">
                    <span className="text-sm sm:text-2xl font-mono font-bold text-white tracking-tight">{plan.price}</span>
                    <span className="text-[8px] sm:text-xs font-mono text-brand-gray">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-1.5 sm:space-y-2 text-[9px] sm:text-xs text-brand-silver font-light">
                    {plan.features.map((fIdx) => (
                      <li key={fIdx} className="flex items-start sm:items-center gap-1.5 sm:gap-2">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-brand-cyan shrink-0 mt-0.5 sm:mt-0" />
                        <span>{fIdx}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/5">
                  <Link to={p('/contact')}>
                    <Button variant={plan.buttonVar} className="w-full text-[9px] sm:text-xs font-mono uppercase tracking-widest h-9 sm:h-10 font-semibold select-none">
                      Active This Node
                    </Button>
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* AGENCY ACCORDION FAQS */}
        <div className="max-w-3xl mx-auto mb-28 space-y-10">
          <Reveal className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-display font-semibold uppercase text-white tracking-tight flex items-center justify-center gap-2">
              <FaqIcon size={22} className="text-brand-cyan" /> Frequently Asked Inquiries
            </h2>
            <p className="text-xs text-brand-gray font-light">
              General technical queries concerning workspace deliverables.
            </p>
          </Reveal>

          <StaggerContainer className="space-y-3.5">
            {faqs.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <StaggerItem
                  key={fIdx} 
                  className="glass-card rounded-2xl border-white/5 bg-white/[0.005] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                    className="w-full p-4.5 md:p-6 text-left flex justify-between items-center gap-4 hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <span className="text-xs md:text-sm font-semibold text-white uppercase tracking-wider">{faq.q}</span>
                    <ChevronDown size={14} className={`text-brand-cyan transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="p-4.5 md:p-6 pt-0 border-t border-white/5 text-xs text-brand-gray leading-relaxed font-light">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* BOTTOM METRICS INITIATION */}
        <Reveal className="text-center pt-12 border-t border-white/5">
          <h3 className="text-2xl font-display font-medium text-white uppercase mb-4">Launch Live Blueprints</h3>
          <p className="text-xs text-brand-gray max-w-sm mx-auto mb-8 font-light">
            Have custom requirements outside routine retainers? Let's initialize a dedicated strategy scoping call.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to={p('/contact')}>
              <Button size="lg" className="px-10 uppercase tracking-widest text-xs font-bold luxury-glow">
                Book Calendar Briefing
              </Button>
            </Link>
            <a href={config.whatsappLink} target="_blank" rel="noreferrer">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 border border-white/5 hover:border-[#22c55e]/30 bg-white/5 text-[#22c55e] rounded-xl text-xs font-mono uppercase tracking-widest font-bold transition-all">
                <Phone size={14} className="fill-[#22c55e]/20" /> {whatsappLabel}
              </span>
            </a>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
