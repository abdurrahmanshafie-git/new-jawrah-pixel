import { motion } from 'motion/react';

export function LuxuryHeroSection() {
  return (
    <section className="relative bg-brand-black py-20 md:py-40 overflow-visible">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 premium-grid-overlay opacity-15"></div>
      <div className="absolute top-1/2 left-0 w-1/2 h-96 bg-brand-cyan/5 blur-[120px] -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-1/2 h-96 bg-brand-blue/5 blur-[120px] -translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="space-y-8 md:space-y-12">
          {/* Small Eyebrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-brand-cyan"></div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.45em] text-zinc-500">
              DIGITAL EXCELLENCE
            </span>
          </motion.div>

          {/* Main Oversized Headline */}
          <div className="relative overflow-visible py-8 md:py-12">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[clamp(3rem,12vw,10rem)] font-display font-medium uppercase leading-[0.85] tracking-tight text-white"
            >
              ARCHITECTING<br/>
              <span className="inline-block italic skew-x-[-12deg] scale-110 text-brand-cyan relative px-4 py-2 overflow-visible">
                FUTURE
              </span>
              <br/>
              SYSTEMS
            </motion.h1>
          </div>

          {/* Editorial Body Copy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-[1.2fr,1fr] gap-12 items-end"
          >
            <div>
              <p className="text-[clamp(1rem,3vw,1.5rem)] text-zinc-500 font-light leading-relaxed">
                We design and engineer digital experiences that define new standards. 
                Luxury aesthetics meet uncompromising performance.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
                <div className="h-px w-12 bg-white/20"></div>
                <span>EST. 2022</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-3xl font-mono text-white">99</span>
                  <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600 mt-1">PERFORMANCE</p>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-mono text-white">12</span>
                  <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600 mt-1">MARKETS</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
