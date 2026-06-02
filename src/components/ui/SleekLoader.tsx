import React from 'react';
import { motion } from 'motion/react';

export function SleekLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh] w-full bg-brand-black/20 backdrop-blur-sm">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Minimal Luxury Pulse */}
        <motion.div 
          className="absolute inset-0 rounded-full border border-white/5"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]" />
      </div>
    </div>
  );
}
