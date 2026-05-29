import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Globe, Layers, ArrowRightLeft } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { persistRegion } from '@/lib/region';
import { REGION_OPTIONS } from '@/data/regions';
import type { RegionCode } from '@/types';

export default function CountrySelection() {
  const handleSelectRegion = (region: RegionCode) => {
    persistRegion(region);
  };

  const getRegionStyles = (region: RegionCode) => {
    if (region === 'pk') {
      return {
        glow: 'bg-brand-cyan/10 group-hover:bg-brand-cyan/20',
        border: 'group-hover:border-brand-cyan/40',
        badge: 'bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan group-hover:bg-brand-cyan group-hover:text-brand-black shadow-[0_0_20px_rgba(6,182,212,0.1)]',
      };
    }

    if (region === 'int') {
      return {
        glow: 'bg-white/10 group-hover:bg-white/15',
        border: 'group-hover:border-white/25',
        badge: 'bg-white/10 border-white/20 text-white group-hover:bg-white group-hover:text-brand-black shadow-[0_0_20px_rgba(255,255,255,0.08)]',
      };
    }

    return {
      glow: 'bg-brand-blue/10 group-hover:bg-brand-blue/20',
      border: 'group-hover:border-brand-blue/40',
      badge: 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue group-hover:bg-brand-blue group-hover:text-white shadow-[0_0_20px_rgba(30,144,255,0.1)]',
    };
  };

  return (
    <div className="min-h-screen bg-brand-black text-white relative flex flex-col justify-between overflow-hidden font-sans">
      {/* Background Ambience with Electric Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Bar with Brand Icon */}
      <header className="container mx-auto px-6 py-8 relative z-10 flex justify-center md:justify-start">
        <Logo variant="full" size="md" />
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 py-12 flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="max-w-4xl w-full text-center mb-10 md:mb-12">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-brand-cyan/20 bg-slate-900/50 backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
            <span className="text-brand-cyan text-[10px] md:text-xs font-semibold tracking-widest uppercase">
              Global Standards, Local Edge
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-display font-light text-white tracking-tight leading-tight mb-4 md:mb-6"
          >
            Choose Your <span className="font-serif italic text-brand-cyan text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Region</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-brand-gray text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Jawrah Pixel creates premium websites, ecommerce platforms, branding systems, SEO strategies, dashboards, and digital experiences for ambitious businesses.
          </motion.p>
        </div>

        {/* Region Cards */}
        <div className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-4 md:gap-8 max-w-4xl w-full px-4">
          {REGION_OPTIONS.map((region) => {
            const styles = getRegionStyles(region.id);

            return (
              <Link
                key={region.id}
                to={region.path}
                onClick={() => handleSelectRegion(region.id)}
                className="group relative flex flex-col items-center"
              >
                <div className={`absolute inset-0 rounded-2xl blur-2xl transition-all duration-500 ${styles.glow}`} />
                <div className={`relative w-full min-h-[164px] glass-card border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-500 group-hover:translate-y-[-4px] sm:min-h-[180px] md:h-48 ${styles.border}`}>
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border flex items-center justify-center font-display font-bold text-xl md:text-2xl transition-all duration-500 ${styles.badge}`}>
                    {region.shortLabel}
                  </div>
                  <span className="text-white text-[10px] md:text-sm font-display font-medium tracking-[0.18em] md:tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity text-center px-2">
                    {region.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Decorative footer line */}
      <footer className="container mx-auto px-6 py-8 relative z-10 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-brand-gray text-xs md:text-sm">
          Jawrah Pixel — Digital elegance for ambitious brands.
        </p>
        <p className="text-brand-gray text-xs">
          © {new Date().getFullYear()} Jawrah Pixel. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
