import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { SEO } from '@/components/layout/SEO';
import { getSavedRegion, persistRegion, regionPath } from '@/lib/region';
import { REGION_OPTIONS } from '@/data/regions';
import type { RegionCode } from '@/types';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export default function CountrySelection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | null>(null);

  const handleSelectRegion = (region: RegionCode) => {
    setSelectedRegion(region);
    persistRegion(region);
  };

  const requestedPath = (location.state as { from?: string } | null)?.from;

  const getRegionStyles = (region: RegionCode) => {
    if (region === 'pk') {
      return {
        accent: 'text-brand-cyan',
        glow: 'from-brand-cyan/20 to-transparent',
        accentColor: 'rgba(34, 211, 238, 0.45)',
        pillClass: isDark ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200' : 'border-cyan-500/15 bg-cyan-500/10 text-cyan-700',
      };
    }

    if (region === 'int') {
      return {
        // Use white accent in dark mode, but a dark slate color in light mode
        accent: isDark ? 'text-white' : 'text-slate-800',
        glow: isDark ? 'from-white/10 to-transparent' : 'from-slate-200 to-transparent',
        accentColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(2, 6, 23, 0.06)',
        pillClass: isDark ? 'border-white/15 bg-white/10 text-white/70' : 'border-slate-300/70 bg-slate-100 text-slate-700',
      };
    }

    if (region === 'uk') {
      return {
        accent: 'text-brand-purple',
        glow: 'from-brand-purple/20 to-transparent',
        accentColor: 'rgba(168, 85, 247, 0.4)',
        pillClass: isDark ? 'border-purple-400/20 bg-purple-400/10 text-purple-200' : 'border-purple-500/15 bg-purple-500/10 text-purple-700',
      };
    }

    return {
      accent: 'text-brand-blue',
      glow: 'from-brand-blue/20 to-transparent',
      accentColor: 'rgba(59, 130, 246, 0.4)',
      pillClass: isDark ? 'border-blue-400/20 bg-blue-400/10 text-blue-200' : 'border-blue-500/15 bg-blue-500/10 text-blue-700',
    };
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden font-sans" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <SEO
        title="Jawrah Pixel | Premium Web Design, SEO & Ecommerce Agency"
        description="Choose your Jawrah Pixel region for premium web design, ecommerce development, branding, SEO, and digital systems in Sri Lanka, Pakistan, or international markets."
        canonicalUrl="https://jawrahpixel.com/"
        keywords={['Jawrah Pixel', 'web design agency', 'digital agency Sri Lanka', 'digital agency Pakistan', 'international digital agency']}
      />

      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[10%] left-[10%] cinematic-light animate-pulse-slow opacity-30" />
          <div className="absolute bottom-[20%] left-[10%] cinematic-light animate-glow opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' }} />
        </div>
      </div>

      <header className="container mx-auto px-6 py-12 relative z-10">
        <div className="relative">
          <div className="flex items-center justify-center">
            <Logo size="lg" className="scale-110 md:scale-125" />
          </div>
          <div className="absolute top-6 right-6">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="max-w-4xl w-full text-center mb-10 sm:mb-14 md:mb-18">
          <Reveal>
            <div className="inline-flex items-center gap-3 mb-10 px-6 py-2 border rounded-none text-[10px] font-mono uppercase tracking-[0.4em]" style={{ 
              borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
              color: 'var(--color-accent-brand)'
            }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-accent-brand)' }} />
              Global Standards, Local Edge
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-medium tracking-tight leading-[1.1] mb-6 sm:mb-8 uppercase overflow-visible" style={{ color: 'var(--color-text-primary)' }}>
              Choose Your <br /> <span className="premium-text-gradient italic inline-block px-2 py-1 overflow-visible">Region</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light" style={{ color: 'var(--color-text-secondary)' }}>
              Jawrah Pixel architects premium digital monopolies for ambitious businesses across the globe.
            </p>
          </Reveal>
        </div>

        <StaggerContainer className="grid w-full max-w-6xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {REGION_OPTIONS.map((region) => {
            const styles = getRegionStyles(region.id);
            const isActive = selectedRegion === region.id;

            return (
              <StaggerItem
                key={region.id}
                className="group relative"
              >
                <Link
                  to={regionPath(region.id, '/')}
                  onClick={() => handleSelectRegion(region.id)}
                  className={cn(
                    'relative flex h-full min-h-[180px] flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border p-4 text-center transition-all duration-500 ease-out will-change-transform sm:min-h-[200px] sm:p-5 lg:p-6',
                    'hover:-translate-y-1',
                    isDark
                      ? 'border-white/10 bg-white/[0.03] shadow-[0_12px_35px_rgba(0,0,0,0.22)] hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
                      : 'border-black/[0.06] bg-white/90 shadow-[0_12px_35px_rgba(15,23,42,0.06)] hover:bg-white hover:shadow-[0_20px_60px_rgba(15,23,42,0.1)]',
                    isActive && 'ring-1'
                  )}
                  style={isActive ? {
                    borderColor: styles.accentColor,
                    boxShadow: isDark
                      ? `0 0 0 1px ${styles.accentColor} inset, 0 24px 70px rgba(0, 0, 0, 0.32)`
                      : `0 0 0 1px ${styles.accentColor} inset, 0 24px 70px rgba(15, 23, 42, 0.1)`,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 1)'
                  } : undefined}
                >
                  <div className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t ${styles.glow} opacity-0 transition-opacity duration-700 group-hover:opacity-100`} />
                  <div className="absolute inset-x-4 top-4 h-px rounded-full bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-70" />

                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className={cn(
                      'text-4xl font-display font-medium transition-all duration-500 group-hover:scale-105 sm:text-5xl',
                      styles.accent
                    )}>
                      {region.shortLabel}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono font-semibold uppercase tracking-[0.35em]" style={{
                        color: isDark ? 'rgba(255, 255, 255, 0.62)' : 'rgba(0, 0, 0, 0.62)'
                      }}>
                        {region.label}
                      </h3>
                      <div className={cn('mx-auto inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.28em]', styles.pillClass)}>
                        {region.caption}
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </main>

      <footer className="container mx-auto px-6 py-12 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}>
        <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}>
          Jawrah Pixel &copy; {new Date().getFullYear()}. Digital excellence.
        </p>
        <div className="flex items-center gap-8">
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}>Architecting digital monopolies</span>
        </div>
      </footer>
    </div>
  );
}
