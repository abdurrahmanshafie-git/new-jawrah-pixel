import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Home, MessageSquare, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Magnetic from '@/components/ui/Magnetic';
import { Reveal } from '@/components/ui/Reveal';
import { useRegion } from '@/hooks/useRegion';

export default function NotFoundPage() {
  const { p } = useRegion();

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 premium-grid-overlay opacity-20" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <Reveal>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/[0.03] border border-white/5 mb-12 relative group">
            <div className="absolute inset-0 bg-brand-blue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ShieldAlert className="w-10 h-10 text-brand-blue relative z-10" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="text-[12vw] md:text-9xl font-display font-bold text-white leading-none tracking-tighter mb-8 uppercase">
            404
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <h2 className="text-2xl md:text-3xl font-display font-medium text-white uppercase tracking-tight mb-6">
            Architecture Not Found
          </h2>
          <p className="text-zinc-500 text-lg font-light leading-relaxed mb-12 max-w-lg mx-auto">
            The digital asset you are looking for has been moved, archived, or does not exist in our current infrastructure.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Magnetic strength={0.15}>
              <Link to={p('/')}>
                <Button size="lg" className="min-w-[200px] tracking-widest font-bold">
                  <Home className="mr-2 w-4 h-4" /> Return Home
                </Button>
              </Link>
            </Magnetic>
            
            <Magnetic strength={0.1}>
              <Link to={p('/contact')}>
                <Button variant="secondary" size="lg" className="min-w-[200px] tracking-widest font-bold">
                  <MessageSquare className="mr-2 w-4 h-4" /> Contact Support
                </Button>
              </Link>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <button 
            onClick={() => window.history.back()}
            className="mt-12 inline-flex items-center gap-2 text-[10px] font-mono text-zinc-500 hover:text-white uppercase tracking-[0.3em] transition-colors"
          >
            <ArrowLeft size={12} /> Go Back to Previous Layer
          </button>
        </Reveal>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-10 left-0 w-full px-10 flex justify-between items-center pointer-events-none opacity-30">
        <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Error_Code: 0x404_NULL_REF</div>
        <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Jawrah_Pixel_OS_v2.0</div>
      </div>
    </div>
  );
}
