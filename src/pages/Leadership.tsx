import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useRegion } from '@/hooks/useRegion';
import { useRegionalSeo } from '@/hooks/useRegionalSeo';
import { getCanonicalUrl } from '@/lib/seo/pageSeo';
import { SEO } from '@/components/layout/SEO';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { Globe, Cpu, ShieldCheck, Zap, Layout, Sparkles, ArrowRight, Linkedin, User, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export default function Leadership() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { config, p, currentRegion } = useRegion();
  const seo = useRegionalSeo('leadership');

  return (
    <div 
      className="min-h-screen overflow-hidden transition-colors duration-500" 
      style={{ backgroundColor: 'var(--background)' }}
    >
      <SEO 
        title={seo.title}
        description={seo.description}
        canonicalUrl={getCanonicalUrl(seo.path)}
        keywords={seo.keywords}
        region={currentRegion}
      />

      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[10%] right-[10%] cinematic-light animate-pulse-slow opacity-30" />
          <div className="absolute bottom-[20%] left-[10%] cinematic-light animate-glow opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' }} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 flex items-center min-h-[60svh]">
        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div 
                className="inline-flex items-center gap-3 mb-8 md:mb-10 px-6 py-2 border rounded-none text-brand-blue text-[10px] font-mono uppercase tracking-[0.4em]"
                style={{ 
                  borderColor: 'var(--border)', 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' 
                }}
              >
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                The Team Behind the Vision
              </div>
            </Reveal>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-medium tracking-tight leading-[1.1] mb-10 uppercase overflow-visible"
              style={{ color: 'var(--text-primary)' }}
            >
              Leadership Behind <span className="premium-text-gradient italic inline-block px-2 py-1">JawrahPixel</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[15px] md:text-xl max-w-2xl mx-auto leading-relaxed font-light"
              style={{ color: 'var(--text-secondary)' }}
            >
              Building a premium digital agency ecosystem across Sri Lanka, Pakistan, and global markets.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 md:py-32 relative border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <Reveal className="max-w-4xl mx-auto">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Our Mission</span>
            <h2 
              className="text-3xl md:text-5xl font-display font-medium uppercase tracking-tight leading-[1.1] mb-8 overflow-visible" 
              style={{ color: 'var(--text-primary)' }}
            >
              Building Digital Infrastructure for Ambitious Brands
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              <div>
                <p className="text-lg font-light leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                  JawrahPixel exists to bridge the gap between technical excellence and premium brand experience. We build digital systems that don't just function—they scale.
                </p>
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Our focus: performance-first engineering, conversion-optimized design, and scalable architecture that grows with our clients.
                </p>
              </div>
              <div>
                <p className="text-lg font-light leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Operating across Sri Lanka, Pakistan, and global markets, we bring a unique perspective: local execution with international standards.
                </p>
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  The problem we solve: businesses struggling to find partners who understand both technical depth and premium brand positioning.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 md:py-32 relative border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <Reveal className="mb-12 md:mb-16 text-center">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Founder & Creative Director</span>
          </Reveal>

          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
            <Reveal className="lg:col-span-5">
              <div className="sticky lg:top-32">
                <div 
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full border overflow-hidden group transition-all duration-700 mb-8"
                  style={{ 
                    borderColor: 'var(--border)', 
                    backgroundColor: 'var(--card-background)' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--card-background)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <img 
                    src="/assets/founder-image.png" 
                    alt="Abdurrahman Shafie" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-display font-medium uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Abdurrahman Shafie
                  </h3>
                  <p className="text-brand-blue text-[13px] font-mono uppercase tracking-[0.3em]">
                    Founder & Creative Director
                  </p>
                </div>

                <a 
                  href={config.linkedinFounderLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 mt-8 px-6 py-3 border text-sm font-mono uppercase tracking-[0.2em] transition-all duration-700 group"
                  style={{ 
                    borderColor: 'var(--border)', 
                    backgroundColor: 'var(--card-background)',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#06b6d4';
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(6, 182, 212, 0.05)' : 'rgba(6, 182, 212, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.backgroundColor = 'var(--card-background)';
                  }}
                >
                  <Linkedin className="w-4 h-4" />
                  <span>Connect on LinkedIn</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-500" />
                </a>
              </div>
            </Reveal>

            <div className="lg:col-span-7 space-y-10">
              <Reveal>
                <h4 className="text-[11px] font-mono text-brand-blue uppercase tracking-[0.3em] font-bold mb-4">
                  Leadership Philosophy
                </h4>
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Build systems that compound. Every project should create value that extends beyond delivery—whether through technical architecture, SEO equity, or operational efficiency.
                </p>
              </Reveal>

              <Reveal>
                <h4 className="text-[11px] font-mono text-brand-blue uppercase tracking-[0.3em] font-bold mb-4">
                  Vision
                </h4>
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  To establish JawrahPixel as the benchmark for premium digital execution in emerging markets. We're building not just an agency, but an ecosystem of talent, technology, and trust.
                </p>
              </Reveal>

              <Reveal>
                <h4 className="text-[11px] font-mono text-brand-blue uppercase tracking-[0.3em] font-bold mb-4">
                  Role & Contribution
                </h4>
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Oversees creative direction, technical architecture, and strategic growth. Combines full-stack development expertise with SEO strategy to deliver systems that rank, convert, and scale.
                </p>
              </Reveal>

              <Reveal>
                <h4 className="text-[11px] font-mono text-brand-blue uppercase tracking-[0.3em] font-bold mb-4">
                  Core Strengths
                </h4>
                <ul className="space-y-3">
                  {['Technical architecture & systems thinking', 'SEO strategy & organic growth', 'Premium brand positioning', 'Multi-region operational strategy'].map((strength, i) => (
                    <li key={i} className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                      <CheckCircle className="w-4 h-4 text-brand-blue shrink-0" />
                      <span className="font-light">{strength}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Co-Founder Section */}
      <section className="py-20 md:py-32 relative border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <Reveal className="mb-12 md:mb-16 text-center">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Co-Founder & Operations</span>
          </Reveal>

          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
              <Reveal>
                <h4 className="text-[11px] font-mono text-brand-blue uppercase tracking-[0.3em] font-bold mb-4">
                  Leadership Philosophy
                </h4>
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Operations should be invisible when they work, foundational when they matter. Building systems that enable creativity, not constrain it.
                </p>
              </Reveal>

              <Reveal>
                <h4 className="text-[11px] font-mono text-brand-blue uppercase tracking-[0.3em] font-bold mb-4">
                  Vision
                </h4>
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  To create an environment where exceptional talent can do their best work. Scaling requires structure—but structure should serve creativity, not stifle it.
                </p>
              </Reveal>

              <Reveal>
                <h4 className="text-[11px] font-mono text-brand-blue uppercase tracking-[0.3em] font-bold mb-4">
                  Role & Contribution
                </h4>
                <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Leads operations, client experience, and team development. Ensures every project delivers on the JawrahPixel standard—on time, on quality, on strategy.
                </p>
              </Reveal>

              <Reveal>
                <h4 className="text-[11px] font-mono text-brand-blue uppercase tracking-[0.3em] font-bold mb-4">
                  Core Strengths
                </h4>
                <ul className="space-y-3">
                  {['Operations & process design', 'Client relationship management', 'Team development & culture', 'Quality assurance frameworks'].map((strength, i) => (
                    <li key={i} className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                      <CheckCircle className="w-4 h-4 text-brand-blue shrink-0" />
                      <span className="font-light">{strength}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal className="lg:col-span-5 order-1 lg:order-2">
              <div className="sticky lg:top-32">
                <div 
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full border flex items-center justify-center text-brand-blue group transition-all duration-700 mb-8"
                  style={{ 
                    borderColor: 'var(--border)', 
                    backgroundColor: 'var(--card-background)' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--card-background)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <User className="w-20 h-20 md:w-28 md:h-28 group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-display font-medium uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Jaweria Hafeez
                  </h3>
                  <p className="text-brand-blue text-[13px] font-mono uppercase tracking-[0.3em]">
                    Co-Founder & Operations Director
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Company Philosophy Section */}
      <section className="py-20 md:py-32 relative border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <Reveal className="text-center mb-16 md:mb-24">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Our Principles</span>
            <h2 className="text-3xl md:text-5xl font-display font-medium uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>
              How We Build
            </h2>
          </Reveal>

          <StaggerContainer className="grid md:grid-cols-2 gap-6 md:gap-8">
            {[
              { icon: Sparkles, title: 'Design Thinking', desc: 'Every solution starts with understanding the problem. We design for real users, real business objectives, and real outcomes.' },
              { icon: Zap, title: 'Performance Mindset', desc: 'Speed is a feature. Performance affects SEO, conversion, and user trust. We optimize from the first line of code.' },
              { icon: ShieldCheck, title: 'Client-First Approach', desc: 'We succeed when our clients succeed. Our incentives are aligned: we focus on outcomes, not deliverables.' },
              { icon: Cpu, title: 'Engineering Excellence', desc: 'We build for the long term. Clean code, scalable architecture, and technical debt prevention aren\'t optional—they\'re foundational.' }
            ].map((item, idx) => (
              <StaggerItem 
                key={idx} 
                className="group p-8 md:p-12 border transition-all duration-700" 
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card-background)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--card-background)';
                }}
              >
                <div className="w-10 h-10 flex items-center justify-center text-brand-blue mb-6">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-display font-medium uppercase mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.desc}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Global Vision Section */}
      <section className="py-20 md:py-32 relative border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <Reveal className="mb-16 md:mb-20">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Global Presence</span>
            <h2 className="text-3xl md:text-5xl font-display font-medium uppercase tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
              Built Across Markets
            </h2>
            <p className="text-xl font-light max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              A multi-region digital agency with deep roots in Sri Lanka and Pakistan, serving clients worldwide.
            </p>
          </Reveal>

          <StaggerContainer className="grid md:grid-cols-4 gap-6 md:gap-8">
            {[
              { country: 'Sri Lanka', currency: 'LKR Operations', desc: 'Luxury retail, hospitality, and corporate transformation with Sri Lanka-specific expertise.' },
              { country: 'Pakistan', currency: 'PKR Operations', desc: 'High-performance commerce and technical systems for the growing digital economy.' },
              { country: 'UK/EU', currency: 'GBP Operations', desc: 'Premium digital solutions tailored for UK and European businesses with local expertise.' },
              { country: 'Global', currency: 'USD Operations', desc: 'Serving ambitious brands in North America, Europe, and the Middle East with remote-first excellence.' }
            ].map((item, idx) => (
              <StaggerItem 
                key={idx} 
                className="group p-8 md:p-10 border transition-all duration-700" 
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card-background)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--card-background)';
                }}
              >
                <h3 className="text-lg font-display font-medium uppercase mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {item.country}
                </h3>
                <p className="text-brand-blue text-[11px] font-mono uppercase tracking-[0.3em] mb-4">
                  {item.currency}
                </p>
                <p className="font-light leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {item.desc}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-20 md:py-32 relative border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        <Reveal className="container mx-auto px-5 sm:px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-8">
              Let's Build Together
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium uppercase tracking-tight mb-8 leading-[1.1]" style={{ color: 'var(--text-primary)' }}>
              Ready to Build Your <span className="premium-text-gradient italic inline-block px-2">Digital Legacy</span>?
            </h2>
            <p className="text-lg font-light mb-12 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Work with a team that combines technical excellence, premium brand strategy, and multi-region expertise.
            </p>
            <Link to={p('/contact')}>
              <Button size="lg" className="min-w-full sm:min-w-[280px]">
                Start a Project
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
