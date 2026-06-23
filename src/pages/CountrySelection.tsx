import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Globe, Layers, ArrowRightLeft } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { SEO } from '@/components/layout/SEO';
import { persistRegion } from '@/lib/region';
import { REGION_OPTIONS } from '@/data/regions';
import type { RegionCode } from '@/types';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

export default function CountrySelection() {
  const handleSelectRegion = (region: RegionCode) => {
    persistRegion(region);
  };

  const getRegionStyles = (region: RegionCode) => {
    if (region === 'pk') {
      return {
        accent: 'text-brand-cyan',
        glow: 'from-brand-cyan/20 to-transparent',
      };
    }

    if (region === 'int') {
      return {
        accent: 'text-white',
        glow: 'from-white/10 to-transparent',
      };
    }

    if (region === 'uk') {
      return {
        accent: 'text-brand-purple' || 'text-brand-blue',
        glow: 'from-brand-purple/20 to-transparent' || 'from-brand-blue/20 to-transparent',
      };
    }

    return {
      accent: 'text-brand-blue',
      glow: 'from-brand-blue/20 to-transparent',
    };
  };

  return (
    <div className="min-h-screen bg-brand-black text-white relative flex flex-col justify-between overflow-hidden font-sans">
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

      <header className="container mx-auto px-6 py-12 relative z-10 flex justify-center">
        <Logo size="lg" className="scale-110 md:scale-125" />
      </header>

      <main className="container mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="max-w-4xl w-full text-center mb-16 md:mb-24">
          <Reveal>
            <div className="inline-flex items-center gap-3 mb-10 px-6 py-2 border border-white/5 rounded-none bg-white/[0.03] text-brand-blue text-[10px] font-mono uppercase tracking-[0.4em]">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              Global Standards, Local Edge
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-medium text-white tracking-tight leading-[1.1] mb-10 uppercase overflow-visible">
              Choose Your <br /> <span className="premium-text-gradient italic inline-block px-2 py-1 overflow-visible">Region</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-light">
              Jawrah Pixel architects premium digital monopolies for ambitious businesses across the globe.
            </p>
          </Reveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full">
          {REGION_OPTIONS.map((region) => {
            const styles = getRegionStyles(region.id);

            return (
              <StaggerItem
                key={region.id}
                className="group relative"
              >
                <Link
                  to={region.path}
                  onClick={() => handleSelectRegion(region.id)}
                  className="block p-12 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-700 text-center relative overflow-hidden h-full flex flex-col items-center justify-center"
                >
                  <div className={`absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t ${styles.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  
                  <div className={cn(
                    "text-5xl md:text-6xl font-display font-medium mb-8 transition-all duration-700 group-hover:scale-110",
                    styles.accent
                  )}>
                    {region.shortLabel}
                  </div>
                  
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-zinc-500 group-hover:text-white transition-colors duration-500">
                    {region.label}
                  </h3>
                  
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </main>

      <footer className="container mx-auto px-6 py-12 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          Jawrah Pixel &copy; {new Date().getFullYear()}. Digital excellence.
        </p>
        <div className="flex items-center gap-8">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Architecting digital monopolies</span>
        </div>
      </footer>
    </div>
  );
}
