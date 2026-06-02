import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '@/components/layout/Logo';

export function CinematicLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Phase 5: Hold for 1.5 seconds after all elements are visible
    // Total sequence timing: 
    // 0s: Logo starts (1s)
    // 0.4s: Blue light starts (1s)
    // 0.6s: Text fades up (1s)
    // 0.8s: Tagline appears (1s)
    // 1.8s: Sequence complete -> Hold 1.5s
    // 3.3s: Start fade out (1s)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center overflow-hidden"
        >
          {/* Background Atmosphere */}
          <div className="absolute inset-0 z-0">
            {/* Phase 2: Soft blue ambient light behind logo */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full"
            />
            {/* Subtle Texture/Noise */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none noise-overlay" />
            
            {/* Subtle Digital Energy Particles (Low Opacity) */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0,
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100 
                }}
                animate={{ 
                  opacity: [0, 0.08, 0],
                  x: [0, Math.random() * 60 - 30],
                  y: [0, Math.random() * 60 - 30]
                }}
                transition={{ 
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-brand-blue rounded-full blur-[0.5px]"
              />
            ))}
          </div>

          {/* Center Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Phase 1: Logo fades in */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10"
            >
              <Logo size="lg" className="opacity-90 brightness-110 drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]" />
            </motion.div>

            {/* Phase 3: JAWRAH PIXEL text fades upward */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5"
            >
              <h1 className="text-white text-xs md:text-sm font-mono font-bold uppercase tracking-[0.8em] md:tracking-[1em]">
                Jawrah Pixel
              </h1>
            </motion.div>

            {/* Phase 4: Tagline appears */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            >
              <p className="text-[10px] md:text-[11px] text-white font-light uppercase tracking-[0.4em]">
                Architecting Digital Monopolies
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
