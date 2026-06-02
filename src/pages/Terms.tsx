import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { Reveal } from '@/components/ui/Reveal';

export default function Terms() {
  const { config, isInternational } = useRegion();
  const seoTitle = isInternational ? 'Global Terms of Service' : `Terms of Service | ${config.countryName}`;
  const seoDescription = isInternational
    ? 'Standard terms of service and agreement guidelines for international Jawrah Pixel clients, USD projects, and remote-first collaborations.'
    : `Standard terms of service and agreement guidelines for Jawrah Pixel clients in ${config.countryName}.`;

  return (
    <div className="bg-brand-black min-h-screen pt-32 pb-24 text-white overflow-hidden relative">
      <SEO 
        title={seoTitle}
        description={seoDescription}
      />

      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[10%] right-[10%] cinematic-light animate-pulse-slow opacity-30" />
          <div className="absolute bottom-[20%] left-[10%] cinematic-light animate-glow opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' }} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-24">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Service Standards</span>
            <h1 className="text-4xl md:text-7xl font-display font-medium uppercase tracking-tight leading-[0.95] mb-10">
              Terms of <br /> <span className="premium-text-gradient italic">Service</span>
            </h1>
            <p className="text-lg text-zinc-500 font-light leading-relaxed max-w-2xl">
              By accessing or using the Jawrah Pixel platform and services, you agree to comply with and be bound by the following terms and conditions.
            </p>
          </Reveal>
          
          <div className="space-y-20">
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-mono text-brand-blue uppercase tracking-widest font-bold">01 / Agreement</span>
                </div>
                <div className="md:col-span-8 space-y-6">
                  <h2 className="text-xl text-white font-display uppercase tracking-wider">Service Agreement</h2>
                  <p className="text-zinc-500 font-light leading-relaxed">
                    Jawrah Pixel provides digital design and development services. Specific project terms, timelines, and deliverables are outlined in individual project proposals and contracts signed by both parties. International projects are scoped through USD proposals, remote-first collaboration, and globally supported payment methods where applicable.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-mono text-brand-blue uppercase tracking-widest font-bold">02 / Ownership</span>
                </div>
                <div className="md:col-span-8 space-y-6">
                  <h2 className="text-xl text-white font-display uppercase tracking-wider">Intellectual Property</h2>
                  <p className="text-zinc-500 font-light leading-relaxed">
                    Upon full payment for services rendered, ownership of final deliverables (such as website code and design assets) is transferred to the client, unless otherwise specified in the project contract. We maintain the right to showcase the work in our portfolio pipelines.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-mono text-brand-blue uppercase tracking-widest font-bold">03 / Liability</span>
                </div>
                <div className="md:col-span-8 space-y-6">
                  <h2 className="text-xl text-white font-display uppercase tracking-wider">Limitation of Liability</h2>
                  <p className="text-zinc-500 font-light leading-relaxed">
                    Jawrah Pixel shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our services or any performance issues beyond our reasonable control. We are not responsible for third-party service outages or data breaches outside our managed infrastructure.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
