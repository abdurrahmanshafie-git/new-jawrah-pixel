import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Globe, Layers, ArrowRightLeft } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

export default function CountrySelection() {
  const navigate = useNavigate();

  useEffect(() => {
    const savedRegion = localStorage.getItem('jawrah_region');
    if (savedRegion === 'lk' || savedRegion === 'pk') {
      navigate(`/${savedRegion}`);
    }
  }, [navigate]);

  const handleSelectRegion = (region: 'lk' | 'pk') => {
    localStorage.setItem('jawrah_region', region);
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
        <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-2xl w-full px-4">
          {/* Card 1: Sri Lanka */}
          <Link 
            to="/lk" 
            onClick={() => handleSelectRegion('lk')}
            className="group relative flex flex-col items-center"
          >
            <div className="absolute inset-0 bg-brand-blue/10 rounded-2xl blur-2xl group-hover:bg-brand-blue/20 transition-all duration-500" />
            <div className="relative w-full aspect-square md:aspect-auto md:h-48 glass-card border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-500 group-hover:border-brand-blue/40 group-hover:translate-y-[-4px]">
              <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue font-display font-bold text-2xl group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(30,144,255,0.1)]">
                LK
              </div>
              <span className="text-white text-xs md:text-sm font-display font-medium tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">Sri Lanka</span>
            </div>
          </Link>

          {/* Card 2: Pakistan */}
          <Link 
            to="/pk" 
            onClick={() => handleSelectRegion('pk')}
            className="group relative flex flex-col items-center"
          >
            <div className="absolute inset-0 bg-brand-cyan/10 rounded-2xl blur-2xl group-hover:bg-brand-cyan/20 transition-all duration-500" />
            <div className="relative w-full aspect-square md:aspect-auto md:h-48 glass-card border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-500 group-hover:border-brand-cyan/40 group-hover:translate-y-[-4px]">
              <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan font-display font-bold text-2xl group-hover:bg-brand-cyan group-hover:text-brand-black transition-all duration-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                PK
              </div>
              <span className="text-white text-xs md:text-sm font-display font-medium tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">Pakistan</span>
            </div>
          </Link>
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
