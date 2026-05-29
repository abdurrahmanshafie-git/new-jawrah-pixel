import { motion } from 'motion/react';
import { ArrowUpRight, Star, Zap, Eye, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/layout/SEO';
import { useRegion } from '@/hooks/useRegion';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';

export default function CaseStudies() {
  const { config, cases, p, isInternational } = useRegion();
  const seoTitle = isInternational ? 'Global Flagship Case Studies' : `Flagship Case Studies | ${config.countryName}`;
  const seoDescription = isInternational
    ? "Explore Jawrah Pixel's premium global portfolio of USD-scoped websites, luxury ecommerce, AI platforms, SaaS interfaces, and brand systems."
    : `Explore Jawrah Pixel's elite portfolio of premium web applications, luxury e-commerce boutiques, and bespoke operations dashboards in ${config.countryName}.`;
  const headlineRegion = isInternational ? 'global brands' : config.countryName;
  const introCopy = isInternational
    ? 'Discover scalable systems, premium digital products, and high-converting luxury ecommerce experiences engineered for global businesses, SaaS teams, AI companies, and international brands.'
    : `Discover our scalable systems, premium digital products, and high-converting luxury e-commerce boutiques. Engineered for exponential growth and maximum authority in ${config.countryName}.`;

  return (
    <div className="bg-brand-black text-white relative min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 font-sans overflow-hidden">
      <SEO 
        title={seoTitle}
        description={seoDescription}
      />

      {/* Radial Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        
        {/* HEADER SECTION */}
        <Reveal className="text-center max-w-3xl mx-auto mb-12 sm:mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex gap-2 items-center px-3 py-1.5 border border-brand-cyan/20 rounded-full bg-slate-900/40 text-brand-cyan text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] mb-4 sm:mb-6"
          >
            <Zap size={10} className="fill-brand-cyan animate-pulse sm:w-3 sm:h-3" /> Agency Transformations
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-display font-medium text-white tracking-tight leading-[1.1] mb-4 sm:mb-6 uppercase"
          >
            Elite Portfolio <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue drop-shadow-[0_0_12px_rgba(34,211,238,0.2)]">for {headlineRegion}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-brand-gray text-sm sm:text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            {introCopy}
          </motion.p>
        </Reveal>

        {/* PROJECTS GRID */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 max-w-6xl mx-auto mb-20">
          {cases.map((project) => (
            <StaggerItem
              key={project.slug}
              className="group flex flex-col justify-between"
            >
              <Link to={p(`/case-studies/${project.slug}`)} className="block">
                
                {/* Visual Stage Card with Gradient Backplane */}
                <div className={`glass-card rounded-2xl aspect-video mb-6 relative overflow-hidden flex items-center justify-center bg-gradient-to-br ${project.color} group-hover:border-brand-cyan/40 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)]`}>
                  
                  {project.thumbnail ? (
                    <motion.img 
                      initial={{ scale: 1.1, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      src={project.thumbnail} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <>
                      {/* Glowing core orb */}
                      <div className="w-28 h-28 bg-brand-blue/10 group-hover:bg-brand-cyan/20 rounded-full blur-2xl absolute transition-all duration-500"></div>
                      
                      {/* Huge elegant stylized single letter */}
                      <div className="text-white/10 group-hover:text-brand-cyan/20 font-display font-semibold text-7xl md:text-8xl group-hover:scale-110 transition-transform duration-500 cursor-pointer pr-1">
                        {project.char}
                      </div>
                    </>
                  )}

                  {/* Top WebVitals Strip */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-brand-black/80 border border-white/5 rounded-md text-[10px] font-mono text-[#22c55e]">
                      <Zap size={10} className="fill-[#22c55e]" /> Perf: {project.perf}
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-brand-black/80 border border-white/5 rounded-md text-[10px] font-mono text-brand-cyan">
                      <Eye size={10} className="fill-brand-cyan/20" /> SEO: {project.seo}
                    </span>
                  </div>

                  {/* Direct Link Arrow Indicator */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-slate-900/80 border border-white/10 flex items-center justify-center text-brand-gray group-hover:text-brand-cyan group-hover:border-brand-cyan/30 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300">
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                {/* Text Metadata */}
                <div>
                  <span className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border mb-3 inline-block ${project.badgeColor}`}>
                    {project.category}
                  </span>
                  
                  <h3 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-white tracking-tight leading-tight mb-2 group-hover:text-brand-cyan transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-brand-gray text-[11px] sm:text-xs font-light leading-relaxed mb-4 max-w-lg">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 bg-white/[0.03] text-brand-silver rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Global CTA */}
        <Reveal className="mt-20 sm:mt-32 max-w-5xl mx-auto glass-card p-8 sm:p-10 md:p-12 rounded-3xl border border-white/5 relative bg-gradient-to-tr from-brand-blue/[0.02] to-transparent text-center flex flex-col items-center">
          <div className="absolute top-0 right-10 -translate-y-12 w-40 h-40 bg-brand-cyan/5 rounded-full blur-2xl"></div>
          <p className="text-brand-cyan text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] mb-4">Have an ambitious project concept?</p>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-display font-semibold tracking-tight text-white max-w-xl mb-4 sm:mb-6 uppercase">Let's craft the next digital benchmark together</h2>
          <p className="text-brand-gray text-[11px] sm:text-xs md:text-sm font-light max-w-md mx-auto mb-8 leading-relaxed">
            From luxury high-ticket boutiques to custom administrative backplanes. Reach out now to initialize your complimentary strategy briefing.
          </p>
          <Link to={p('/contact')}>
            <Button className="px-8 sm:px-10 h-11 sm:h-12 uppercase tracking-widest text-[10px] sm:text-xs font-mono font-bold luxury-glow">
              Get Started
            </Button>
          </Link>
        </Reveal>
        
      </div>
    </div>
  );
}
