import React from 'react';
import { motion } from 'motion/react';

export function SleekLoader() {
  return (
    <div className="flex items-center justify-center min-h-[65vh] w-full bg-brand-black text-white">
      <div className="flex flex-col items-center gap-5">
        {/* Cinematic Glowing Spinner */}
        <div className="relative w-14 h-14">
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-t-brand-blue border-r-transparent border-b-brand-cyan border-l-transparent shadow-[0_0_15px_rgba(30,144,255,0.4)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-4 rounded-full bg-brand-black border border-white/5 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-gray/80 animate-pulse">
          Loading Luxury Interface...
        </div>
      </div>
    </div>
  );
}
