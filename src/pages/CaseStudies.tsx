import { motion } from 'motion/react';
import { ArrowUpRight, Star, Zap, Eye, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/layout/SEO';
import { useRegion } from '@/hooks/useRegion';
import { useTheme } from '@/contexts/ThemeContext';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { toAbsoluteUrl } from '@/lib/env';
import { cn } from '@/lib/utils';

export default function CaseStudies() {
  const { config, cases, p, isInternational } = useRegion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const seoTitle = isInternational ? 'Global Flagship Case Studies' : `Flagship Case Studies | ${config.countryName}`;
  const seoDescription = isInternational
    ? "Explore Jawrah Pixel's premium global portfolio of USD-scoped websites, luxury ecommerce, AI platforms, SaaS interfaces, and brand systems."
    : `Explore Jawrah Pixel's elite portfolio of premium web applications, luxury e-commerce boutiques, and bespoke operations dashboards in ${config.countryName}.`;
  const headlineRegion = isInternational ? 'global brands' : config.countryName;
  const introCopy = isInternational
    ? 'Discover scalable systems, premium digital products, and high-converting luxury ecommerce experiences engineered for global businesses, SaaS teams, AI companies, and international brands.'
    : `Discover our scalable systems, premium digital products, and high-converting luxury e-commerce boutiques. Engineered for exponential growth and maximum authority in ${config.countryName}.`;

  return (
    <div className="relative min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 font-sans overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={toAbsoluteUrl(p('/case-studies'))}
        keywords={[
          `case studies ${config.countryName}`,
          'Jawrah Pixel portfolio',
          'web design case studies',
          'ecommerce case studies',
        ]}
      />

      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        {isDark && <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div 
            className={`absolute top-[10%] left-[10%] ${isDark ? 'cinematic-light animate-pulse-slow' : ''} opacity-30 blur-[100px]`} 
            style={{ 
              background: isDark 
                ? 'radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)' 
                : 'radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%)' 
            }}
          />
          <div 
            className={`absolute bottom-[20%] right-[10%] ${isDark ? 'cinematic-light animate-glow' : ''} opacity-20 blur-[100px]`} 
            style={{ 
              background: isDark 
                ? 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' 
                : 'radial-gradient(circle at center, rgba(16,185,129,0.06), transparent 70%)' 
            }} 
          />
        </div>
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        
        {/* HEADER SECTION */}
        <Reveal className="text-center max-w-4xl mx-auto mb-16 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex gap-3 items-center px-6 py-2 rounded-none text-[10px] font-mono uppercase tracking-[0.4em] mb-8 md:mb-10"
            style={{
              borderColor: 'var(--border)',
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.02)',
              color: isDark ? 'var(--brand-blue)' : 'var(--accent)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: isDark ? 'var(--brand-blue)' : 'var(--accent)' }} /> Agency Transformations
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight leading-[1.1] mb-8 md:mb-10 uppercase overflow-visible"
            style={{ color: 'var(--text-primary)' }}
          >
            Elite <br /> <span className="premium-text-gradient italic inline-block px-2 py-1 overflow-visible">Portfolio</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {introCopy}
          </motion.p>
        </Reveal>

        {/* PROJECTS GRID */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-7xl mx-auto mb-24 md:mb-32">
          {cases.map((project) => (
            <StaggerItem
              key={project.slug}
              className="group flex flex-col"
            >
              <Link to={p(`/case-studies/${project.slug}`)} className="block relative h-[420px] sm:h-[450px] md:h-[500px] overflow-hidden mb-6 md:mb-8" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderWidth: '1px', borderStyle: 'solid' }}>
                <div className="absolute inset-0 z-0">
                  {project.thumbnail ? (
                    <motion.img 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={project.thumbnail} 
                      alt={project.title}
                      className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-60 transition-all duration-1000 ease-out"
                    />
                  ) : (
                    <div className={cn("w-full h-full bg-gradient-to-br flex items-center justify-center", project.color)}>
                      <span style={{ color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)' }} className="font-display font-medium text-9xl uppercase">{project.char}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 transition-colors duration-700" style={{
                    background: isDark 
                      ? 'linear-gradient(to top, #000000, rgba(0,0,0,0.8), rgba(0,0,0,0.2))' 
                      : 'linear-gradient(to top, var(--background), rgba(250,250,248,0.8), rgba(250,250,248,0.2))'
                  }} />
                </div>

                {/* Top WebVitals Strip */}
                <div className="absolute top-5 left-5 md:top-6 md:left-6 flex gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <span className="flex items-center gap-2 px-3 py-1 backdrop-blur-xl text-[9px] font-mono" style={{ 
                    backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)', 
                    borderColor: 'var(--border)', 
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: '#3b82f6' 
                  }}>
                    <Zap size={10} className="fill-[#3b82f6]" /> PERF: {project.perf}
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1 backdrop-blur-xl text-[9px] font-mono" style={{ 
                    backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)', 
                    borderColor: 'var(--border)', 
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: isDark ? 'var(--brand-blue)' : 'var(--accent)' 
                  }}>
                    <Eye size={10} style={{ fill: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)' }} /> SEO: {project.seo}
                  </span>
                </div>

                {/* Bottom Overlay - Improved Mobile Padding */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex items-end justify-between gap-4">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className={cn("text-[9px] font-mono uppercase tracking-[0.3em] mb-4 block", project.badgeColor.includes('text-') ? project.badgeColor : '')} style={{ color: isDark ? 'var(--brand-blue)' : 'var(--accent)' }}>
                      {project.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-display font-medium uppercase tracking-tight leading-tight transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {project.title}
                    </h3>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-none flex items-center justify-center transition-all duration-500" style={{
                    borderColor: 'var(--border)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: 'var(--text-primary)',
                    backgroundColor: isDark ? 'var(--brand-blue)' : 'var(--accent)'
                  }}>
                    <ArrowUpRight size={18} style={{ color: isDark ? '#000' : '#fff' }} />
                  </div>
                </div>
              </Link>

              <div className="px-0 md:px-2">
                <p className="text-sm font-light leading-relaxed mb-6 max-w-lg line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-1" style={{ borderColor: 'var(--border)', borderWidth: '1px', borderStyle: 'solid', color: 'var(--text-caption)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Global CTA */}
        <Reveal className="mt-20 md:mt-48 pb-16 md:pb-20">
          <div className="relative p-8 md:p-24 text-center flex flex-col items-center overflow-hidden" style={{ 
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.7)', 
            borderColor: 'var(--border)', 
            borderWidth: '1px',
            borderStyle: 'solid'
          }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" style={{ 
              background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)' 
            }} />
            
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold block mb-6 md:mb-8 relative z-10" style={{ color: isDark ? 'var(--brand-blue)' : 'var(--accent)' }}>
              Initiate Transformation
            </span>
            <h2 className="text-2xl md:text-6xl font-display font-medium tracking-tight max-w-3xl mb-8 md:mb-10 uppercase leading-[1.1] relative z-10 overflow-visible" style={{ color: 'var(--text-primary)' }}>
              Ready to architect the <span className="premium-text-gradient italic inline-block px-2 py-1 overflow-visible">future</span> of your brand?
            </h2>
            <p className="text-[15px] md:text-lg font-light max-w-xl mx-auto mb-10 md:mb-12 leading-relaxed relative z-10" style={{ color: 'var(--text-muted)' }}>
              We are currently accepting high-impact project concepts for the next quarter. Reach out now to secure your strategic briefing.
            </p>
            <Link to={p('/contact')} className="relative z-10">
              <Button size="lg" className="w-full sm:min-w-[280px]">
                Start Briefing
              </Button>
            </Link>
          </div>
        </Reveal>
        
      </div>
    </div>
  );
}
