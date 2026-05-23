import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRegion } from '@/hooks/useRegion';
import { getCaseStudyDetails, ALL_CASE_STUDIES } from '@/data/caseStudies';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Tv, 
  Smartphone, 
  Calendar, 
  Tags, 
  Briefcase, 
  CheckCircle, 
  Compass, 
  Zap, 
  TrendingUp, 
  Cpu, 
  Target, 
  Clock, 
  Star,
  Layers,
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/layout/SEO';

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeMedia, setActiveMedia] = useState<'desktop' | 'mobile'>('desktop');
  const { currentRegion, config, p } = useRegion();
  
  // Lookup case study data dynamically based on the active region configuration
  const project = slug ? getCaseStudyDetails(slug) : null;

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!project) {
    return (
      <div className="pt-40 pb-24 min-h-screen bg-brand-black text-white text-center flex flex-col items-center justify-center">
        <SEO 
          title="Project Not Found" 
          description="The requested case study was not found. Browse Jawrah Pixel's elite portfolio projects." 
        />
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-400 mb-6">
          <ChevronRight size={32} className="rotate-180" />
        </div>
        <h1 className="text-3xl font-display font-bold uppercase tracking-wide mb-4">Case Study Not Found</h1>
        <p className="text-brand-gray text-base max-w-md mb-8">
          The project slug "{slug}" doesn't match our active portfolio pipelines. Explore our full list of premium showpieces.
        </p>
        <Link to={p('/case-studies')}>
          <Button variant="outline" className="uppercase tracking-widest text-xs">
            Back to Case Studies
          </Button>
        </Link>
      </div>
    );
  }

  // Next project navigation
  const slugs = Object.keys(ALL_CASE_STUDIES);
  const currentIndex = slugs.indexOf(project.slug);
  const nextSlug = slugs[(currentIndex + 1) % slugs.length];
  const nextProject = ALL_CASE_STUDIES[nextSlug];

  return (
    <div className="bg-brand-black text-white relative min-h-screen pt-32 pb-24 font-sans overflow-hidden select-text">
      {/* Dynamic SEO setup */}
      <SEO 
        title={project.title} 
        description={project.metaDesc}
        schemaType="Project"
        schemaData={{
          'name': project.title,
          'description': project.overview,
          'category': project.category,
          'customer': {
            '@type': 'Organization',
            'name': project.client
          },
          'offers': {
            '@type': 'Offer',
            'price': project.budget.replace('LKR ', '').replace(/,/g, ''),
            'priceCurrency': 'LKR'
          }
        }}
      />

      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] left-10 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[110px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[130px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        
        {/* TOP BACK BAR & TITLE HEADER */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <Link 
            to={p('/case-studies')} 
            className="group inline-flex items-center gap-2 text-xs md:text-sm text-brand-gray hover:text-white transition-colors uppercase font-mono tracking-widest"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            Back to Case Studies
          </Link>
          <div className="text-xs font-mono text-brand-cyan tracking-[0.2em] uppercase font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
            Showcase Deep Dive
          </div>
        </div>

        {/* HERO HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-end mb-12 md:mb-24 pb-8 sm:pb-12 border-b border-white/10">
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan rounded-full">
              {project.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-semibold uppercase tracking-tight leading-[1.1] text-white">
              {project.title}
            </h1>
            <p className="text-brand-gray text-sm sm:text-base md:text-xl max-w-3xl leading-relaxed font-light mt-2 sm:mt-4">
              {project.overview}
            </p>
            
            {project.websiteUrl && (
              <div className="pt-4">
                <a 
                  href={project.websiteUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-brand-cyan/10 border border-brand-cyan/40 hover:border-brand-cyan/70 hover:bg-brand-cyan/20 text-white text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] rounded-full transition-all group/btn shadow-[0_0_30px_rgba(34,211,238,0.15)] relative overflow-hidden active:scale-95"
                >
                  <span className="absolute inset-0 bg-brand-cyan/5 animate-pulse pointer-events-none"></span>
                  <span className="relative flex items-center gap-2">
                    Visit Live Project <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </span>
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 text-[9px] sm:text-xs font-mono uppercase tracking-widest text-brand-silver">
              <div className="bg-white/[0.02] border border-white/5 p-3 sm:p-4 rounded-xl">
                <span className="text-[8px] sm:text-[10px] text-brand-gray block mb-0.5 sm:mb-1">CLIENT SYSTEM</span>
                <span className="font-semibold text-white block truncate">{project.client}</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 sm:p-4 rounded-xl">
                <span className="text-[8px] sm:text-[10px] text-brand-gray block mb-0.5 sm:mb-1">BUDGET FRAME</span>
                <span className="font-semibold text-brand-cyan block">{project.budget}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* VISUAL ARCHITECTURE SHOWCASE */}
        {(project.desktopImage || project.mobileImage) && (
          <div className="mb-20 md:mb-32">
            <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-8 sm:mb-12">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-brand-cyan tracking-[0.2em] uppercase font-bold block">Digital Craft / Visual Architecture</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium uppercase tracking-tight text-white">
                  Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">Visual Authority</span>
                </h2>
              </div>
              <p className="text-brand-gray text-xs sm:text-sm font-light max-w-sm md:text-right leading-relaxed">
                We focus on high-fidelity rendering, atmospheric lighting, and hardware-accelerated transitions that demand attention.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10">
              {/* Desktop Mockup */}
              {project.desktopImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="md:col-span-8 group"
                >
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-brand-navy/30 aspect-[16/10] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <img 
                      src={project.desktopImage} 
                      alt={`${project.title} Desktop Showcase`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 to-transparent pointer-events-none"></div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-brand-blue"></div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gray font-bold">Main Desktop Experience</span>
                  </div>
                </motion.div>
              )}

              {/* Mobile Mockup */}
              {project.mobileImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="md:col-span-4"
                >
                  <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-white/10 bg-brand-navy/30 aspect-[9/16] shadow-[0_30px_60px_rgba(0,0,0,0.6)] group">
                    <img 
                      src={project.mobileImage} 
                      alt={`${project.title} Mobile Showcase`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent pointer-events-none"></div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gray font-bold text-right">Mobile System View</span>
                    <div className="h-[1px] w-8 bg-brand-cyan"></div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* METRICS / STATS STRIP */}
        <div className="grid grid-cols-3 gap-2 md:gap-6 mb-16 md:mb-24">
          {project.results.map((res, idx) => (
            <div 
              key={idx} 
              className="p-3 sm:p-8 bg-gradient-to-br from-brand-navy/60 to-brand-black border border-white/10 rounded-xl sm:rounded-2xl relative overflow-hidden group hover:border-brand-cyan/20 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-12 h-12 sm:w-24 sm:h-24 bg-brand-cyan/[0.02] rounded-full blur-xl pointer-events-none"></div>
              <div className="text-[7px] sm:text-[10px] font-mono text-brand-gray uppercase tracking-widest mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                <TrendingUp className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-brand-cyan" />
                {res.metric}
              </div>
              <div className="text-xl sm:text-4xl md:text-5xl font-mono font-bold text-white tracking-tighter drop-shadow-[0_0_12px_rgba(34,211,238,0.2)] mb-1 sm:mb-2">
                {res.val}
              </div>
              <p className="text-[8px] sm:text-xs text-brand-silver leading-tight sm:leading-relaxed font-light">
                {res.desc}
              </p>
            </div>
          ))}
        </div>

        {/* LAYOUT BODY: CHALLENGE vs GOALS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 md:mb-28">
          
          {/* PROBLEM / CHALLENGE */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono text-brand-cyan tracking-[0.2em] uppercase font-bold block">01 / The Challenge</span>
            <h2 className="text-3xl font-display font-medium uppercase tracking-tight text-white">
              Identifying <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-500">Core Bottlenecks</span>
            </h2>
            <div className="space-y-4">
              {project.challenges.map((challenge, idx) => (
                <div key={idx} className="flex gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 font-mono text-xs">
                    !
                  </div>
                  <p className="text-xs md:text-sm text-brand-silver leading-relaxed font-light">
                    {challenge}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PROJECT GOALS */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono text-brand-cyan tracking-[0.2em] uppercase font-bold block">02 / Project Goals</span>
            <h2 className="text-3xl font-display font-medium uppercase tracking-tight text-white">
              Targeting <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Strategic Value</span>
            </h2>
            <div className="space-y-4">
              {project.goals.map((goal, idx) => (
                <div key={idx} className="flex gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0">
                    <Target size={14} />
                  </div>
                  <p className="text-xs md:text-sm text-brand-silver leading-relaxed font-light">
                    {goal}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CORE WEB VITALS CHART SCREEN */}
        <div className="py-12 px-8 bg-gradient-to-br from-brand-navy/60 to-brand-black border border-white/10 rounded-3xl mb-20 md:mb-28 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-cyan/[0.03] rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-[10px] font-mono uppercase tracking-widest">
                Lighthouse Audited
              </div>
              <h2 className="text-3xl font-display font-medium text-white uppercase tracking-tight">
                Core Web Vitals <br />
                <span className="text-brand-cyan">Performance</span>
              </h2>
              <p className="text-xs text-brand-gray leading-relaxed font-light">
                Meticulously compiled to achieve near-flawless speeds, strict search crawl rankings, and accessible interaction frameworks for every device screen.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { name: 'Performance', score: project.perfScores.perf },
                { name: 'SEO Indexing', score: project.perfScores.seo },
                { name: 'Accessibility', score: project.perfScores.access },
                { name: 'Best Practices', score: project.perfScores.best }
              ].map((score, sIdx) => (
                <div key={sIdx} className="flex flex-col items-center p-6 bg-brand-black/40 border border-white/5 rounded-2xl text-center">
                  <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                    {/* SVG Circular Progression */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle 
                        cx="48" 
                        cy="48" 
                        r="40" 
                        className="stroke-white/5 fill-none" 
                        strokeWidth="5"
                      />
                      <motion.circle 
                        cx="48" 
                        cy="48" 
                        r="40" 
                        className="stroke-brand-cyan fill-none drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                        strokeWidth="5"
                        strokeDasharray="251.2"
                        initial={{ strokeDashoffset: 251.2 }}
                        whileInView={{ strokeDashoffset: 251.2 - (251.2 * score.score) / 100 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * sIdx, duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <span className="text-2xl font-mono font-bold text-white pr-0.5">{score.score}</span>
                  </div>
                  <span className="text-xs text-brand-silver font-medium font-mono uppercase tracking-wider">{score.name}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* PROCESS TIMELINE SECTION */}
        <div className="py-16 md:py-24 border-t border-white/5 mb-20 md:mb-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono text-brand-cyan tracking-[0.2em] uppercase font-bold">Progress Flow</span>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white uppercase tracking-tight mt-2 mb-4">Implementation Path</h2>
            <p className="text-sm text-brand-gray font-light">
              How we carefully designed other projects from early concept schemas, design layouts, to rapid deployment nodes.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {project.processSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="p-4 sm:p-6 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-brand-cyan/15 hover:bg-white/[0.02] transition-all duration-300 relative group"
              >
                <span className="text-[8px] sm:text-xs text-brand-cyan font-mono block mb-1 uppercase tracking-widest">{step.phase}</span>
                <h3 className="text-[10px] sm:text-lg font-display font-medium text-white mb-1.5 sm:mb-2 uppercase tracking-wide group-hover:text-brand-cyan transition-colors">
                  {step.title}
                </h3>
                <p className="text-[8.5px] sm:text-xs text-brand-gray leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* INTERACTIVE MOCKUPS PLATFORM */}
        <div className="mb-20 md:mb-28">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <span className="text-[10px] font-mono text-brand-cyan tracking-[0.2em] uppercase font-bold block">03 / Multi-Device Layouts</span>
              <h2 className="text-3xl font-display font-medium uppercase tracking-tight text-white mt-1">
                Visual <span className="text-brand-cyan">Showcase Screens</span>
              </h2>
            </div>

            <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-lg self-start">
              <button
                onClick={() => setActiveMedia('desktop')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs uppercase font-mono tracking-wider transition-all cursor-pointer ${
                  activeMedia === 'desktop' ? 'bg-brand-cyan text-brand-black font-semibold' : 'text-brand-gray hover:text-white'
                }`}
              >
                <Tv size={14} /> Desktop Screen
              </button>
              <button
                onClick={() => setActiveMedia('mobile')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs uppercase font-mono tracking-wider transition-all cursor-pointer ${
                  activeMedia === 'mobile' ? 'bg-brand-cyan text-brand-black font-semibold' : 'text-brand-gray hover:text-white'
                }`}
              >
                <Smartphone size={14} /> Mobile Screen
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeMedia === 'desktop' ? (
              <motion.div
                key="desktop"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full bg-brand-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.05)]"
              >
                {/* Simulated browser header bar */}
                <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                  </div>
                  <div className="bg-black/40 text-[10px] text-brand-gray font-mono px-4 py-1 rounded-sm w-1/3 truncate text-center">
                    https://{project.slug}.jawrahpixel.com
                  </div>
                  <div className="w-12 h-1.5 bg-white/10 rounded-full"></div>
                </div>

                {/* Immersive Mock Desktop Content */}
                <div className="p-8 md:p-12 min-h-[350px] relative flex flex-col justify-between overflow-hidden relative">
                  <div className="absolute top-[20%] right-[10%] w-[250px] h-[250px] bg-brand-blue/10 rounded-full blur-[80px] pointer-events-none"></div>
                  
                  <div className="max-w-xl space-y-4">
                    <span className="text-[10px] font-mono text-brand-cyan tracking-widest block uppercase font-bold">Desktop System Model</span>
                    <h4 className="text-3xl font-display font-semibold text-white uppercase">Premium Front-view</h4>
                    <p className="text-xs text-brand-silver leading-relaxed font-light">
                      Visual geometry featuring dynamic micro-interactions, layout components, and customized animations engineered specifically to reflect client brand values.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-8 border-t border-white/5 relative z-10">
                    {project.desktopHighlights.map((hl, idx) => (
                      <div key={idx} className="p-4 bg-brand-black/60 border border-white/5 rounded-xl">
                        <h5 className="text-xs font-mono text-brand-cyan uppercase tracking-widest mb-1">{hl.title}</h5>
                        <p className="text-xs text-brand-gray font-light">{hl.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto bg-brand-black/60 border border-white/10 rounded-[3rem] overflow-hidden p-3.5 shadow-[0_0_50px_rgba(34,211,238,0.05)]"
              >
                {/* Inner mobile border */}
                <div className="border border-white/10 rounded-[2.5rem] overflow-hidden bg-brand-navy/60">
                  <div className="bg-black py-4 px-6 flex justify-between items-center border-b border-white/5 text-[10px] text-brand-gray font-mono">
                    <span>9:41</span>
                    <div className="w-16 h-4 bg-black rounded-full border border-white/5 absolute left-1/2 transform -translate-x-1/2 pointer-events-none flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white/20"></span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-1.5 bg-white/20 rounded-sm"></span>
                      <span className="w-3 h-1.5 bg-[#22c55e] rounded-sm"></span>
                    </div>
                  </div>

                  {/* Mobile mockup viewport contents */}
                  <div className="p-6 min-h-[420px] flex flex-col justify-between relative">
                    <div className="absolute top-[30%] left-[20%] w-[150px] h-[150px] bg-brand-cyan/10 rounded-full blur-[60px] pointer-events-none"></div>

                    <div className="space-y-4">
                      <span className="text-[9px] font-mono text-brand-cyan tracking-widest block uppercase font-bold">Mobile Touch Framework</span>
                      <h4 className="text-2xl font-display font-semibold text-white uppercase pr-4">Responsive Blueprint</h4>
                      <p className="text-[11px] text-brand-silver leading-relaxed font-light">
                        Engineered with touch targets minimum of 48px, compact layout margins, fluid flex arrays, and offline system caches.
                      </p>
                    </div>

                    <div className="space-y-3 mt-12 pt-4 border-t border-white/5 relative z-10">
                      {project.mobileHighlights.map((hl, idx) => (
                        <div key={idx} className="p-3 bg-brand-black/60 border border-white/5 rounded-lg">
                          <h5 className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest mb-0.5">{hl.title}</h5>
                          <p className="text-[10px] text-brand-gray font-light leading-snug">{hl.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SOLUTIONS SECTION */}
        <div className="py-16 md:py-24 border-t border-white/5 mb-20 md:mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-12 space-y-4 mb-4 text-center max-w-2xl mx-auto">
              <span className="text-[10px] font-mono text-brand-cyan tracking-[0.2em] uppercase font-bold block">04 / Technology Solution</span>
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white uppercase tracking-tight">
                Architectural <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Implementation</span>
              </h2>
              <p className="text-sm text-brand-gray font-light">
                Utilizing top modern libraries to deploy secure, scalable systems.
              </p>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block font-bold">Engineered Core Services</span>
              <div className="space-y-3">
                {project.solutions.map((sol, sIdx) => (
                  <div key={sIdx} className="p-4 bg-brand-black border border-white/5 hover:border-brand-cyan/20 rounded-xl flex items-start gap-4 transition-colors">
                    <div className="w-5 h-5 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center shrink-0 mt-0.5 font-semibold text-xs text-center pr-px">
                      ✓
                    </div>
                    <p className="text-xs md:text-sm text-brand-silver leading-relaxed font-light">
                      {sol}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block font-bold">Tech Stack Integration</span>
              <div className="flex flex-wrap gap-2.5">
                {project.technologies.map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="px-4 py-2 bg-brand-navy/60 border border-white/10 hover:border-brand-cyan/30 text-xs text-brand-silver font-mono rounded-lg flex items-center gap-2 transition-all cursor-default"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* LUXURY TESTIMONIAL COMPONENT */}
        <div className="py-16 md:py-20 border-t border-b border-white/5 mb-24 relative overflow-hidden">
          <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={18} className="fill-brand-cyan stroke-brand-cyan drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl font-serif text-brand-silver italic leading-relaxed max-w-3xl mx-auto">
              "{project.testimonial.quote}"
            </blockquote>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-bold tracking-tight text-sm flex items-center justify-center">
                {project.testimonial.avatar}
              </div>
              <div>
                <cite className="not-italic text-sm font-semibold text-white uppercase tracking-wider">{project.testimonial.author}</cite>
                <span className="text-xs text-brand-gray block mt-0.5">{project.testimonial.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* NEXT PROJECT INDICATOR PANEL */}
        <div className="mb-24 p-8 bg-gradient-to-r from-brand-navy/60 to-brand-black border border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:border-brand-cyan/20 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-brand-cyan/[0.02] rounded-full blur-[40px] pointer-events-none"></div>
          
          <div>
            <span className="text-[10px] font-mono text-brand-gray uppercase tracking-widest block mb-1">Up Next</span>
            <h3 className="text-2xl font-display font-medium text-white uppercase tracking-wide group-hover:text-brand-cyan transition-colors">
              {nextProject.title}
            </h3>
            <p className="text-xs text-brand-gray max-w-sm font-light leading-relaxed mt-1">
              {nextProject.category}
            </p>
          </div>

          <Link to={`/case-studies/${nextProject.slug}`}>
            <Button size="sm" className="uppercase font-mono tracking-widest text-[10px] luxury-glow cursor-pointer">
              Explore Project <ChevronRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>

        {/* IMMERSIVE CTA DISCOVERY CELL */}
        <div className="glass-card p-10 md:p-16 rounded-3xl text-center relative overflow-hidden border border-brand-cyan/30">
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-mono text-brand-cyan tracking-[0.2em] uppercase font-bold block">05 / Start Consultation</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-semibold uppercase leading-[1.2]">
              Let’s Engineer Your <br />
              <span className="text-brand-cyan drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]">Digital Flagship</span>
            </h2>
            <p className="text-[10px] sm:text-xs md:text-sm text-brand-silver leading-relaxed font-light max-w-md mx-auto">
              Explore your performance blueprint, system timeline, pricing, and launch secure client hubs supported directly by our regional partners.
            </p>

            <div className="pt-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 justify-center">
              <Link to={p('/contact')} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-11 sm:h-14 px-1 sm:px-8 uppercase tracking-widest sm:tracking-wider text-[8px] sm:text-xs font-semibold luxury-glow leading-tight py-1">
                  Book Strategy
                </Button>
              </Link>
              <a 
                href={config.whatsappLink}
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-full sm:w-auto inline-flex items-center justify-center h-11 sm:h-14 px-1 sm:px-8 border border-[#25D366]/30 bg-[#25D366]/5 hover:bg-[#25D366]/10 text-white rounded-none sm:rounded-sm font-medium tracking-widest sm:tracking-wider uppercase text-[8px] sm:text-xs transition-colors text-center leading-tight py-1"
              >
                Contact WhatsApp
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
