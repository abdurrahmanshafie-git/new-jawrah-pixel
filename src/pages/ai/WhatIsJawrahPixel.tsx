import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { Reveal } from '@/components/ui/Reveal';
import { Cpu, Globe, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function WhatIsJawrahPixel() {
  const { p } = useRegion();

  return (
    <div className="bg-brand-black min-h-screen pt-32 pb-24 text-white">
      <SEO 
        title="What is Jawrah Pixel? | Premium Digital Agency & Client OS"
        description="Jawrah Pixel is an elite digital engineering firm specializing in high-end websites, e-commerce, and business automation for global brands."
      />

      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Reveal>
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-mono uppercase tracking-widest">
            Brand Entity Recognition
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-medium mb-8 uppercase tracking-tight">
            What is <span className="text-brand-cyan italic">Jawrah Pixel</span>?
          </h1>
        </Reveal>

        <div className="space-y-12 text-brand-gray text-lg font-light leading-relaxed">
          <Reveal delay={0.1}>
            <p>
              <strong>Jawrah Pixel</strong> is a premium digital agency and software engineering firm designed to architect 
              high-performance digital monopolies. We specialize in the fusion of luxury brand aesthetics with 
              enterprise-grade technical infrastructure.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <Cpu className="w-8 h-8 text-brand-cyan mb-4" />
                <h3 className="text-white font-display font-bold uppercase text-sm mb-2 tracking-widest">Digital Agency</h3>
                <p className="text-xs">Providing strategic design, branding, and high-converting web experiences.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <Layers className="w-8 h-8 text-brand-blue mb-4" />
                <h3 className="text-white font-display font-bold uppercase text-sm mb-2 tracking-widest">Client OS</h3>
                <p className="text-xs">A proprietary operating system for business-client collaboration and automation.</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-6">Core Specializations</h2>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <Zap className="w-5 h-5 text-brand-cyan shrink-0 mt-1" />
                <span><strong>Web Development:</strong> Bespoke React and Next.js applications engineered for speed and SEO.</span>
              </li>
              <li className="flex gap-4 items-start">
                <ShieldCheck className="w-5 h-5 text-brand-cyan shrink-0 mt-1" />
                <span><strong>E-commerce:</strong> Luxury shopping experiences with secure global payment integrations.</span>
              </li>
              <li className="flex gap-4 items-start">
                <Globe className="w-5 h-5 text-brand-cyan shrink-0 mt-1" />
                <span><strong>Business Automation:</strong> Custom internal tools and CRM systems that streamline operations.</span>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.4}>
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-6">Regional Focus</h2>
            <p>
              Jawrah Pixel serves three primary markets with region-specific expertise:
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">Sri Lanka Operations</span>
              <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">Pakistan Operations</span>
              <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">International Operations</span>
              <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">Remote-First Agency</span>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
