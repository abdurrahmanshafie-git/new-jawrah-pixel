import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { Reveal } from '@/components/ui/Reveal';

export default function Privacy() {
  const { config, isInternational } = useRegion();
  const seoTitle = isInternational ? 'Global Privacy Policy' : `Privacy Policy | ${config.countryName}`;
  const seoDescription = isInternational
    ? 'Privacy standards and data protection policies for international Jawrah Pixel clients and remote-first global projects.'
    : `Privacy standards and data protection policies for Jawrah Pixel clients in ${config.countryName}.`;

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
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Legal Framework</span>
            <h1 className="text-4xl md:text-7xl font-display font-medium uppercase tracking-tight leading-[0.95] mb-10">
              Privacy <br /> <span className="premium-text-gradient italic">Policy</span>
            </h1>
            <p className="text-lg text-zinc-500 font-light leading-relaxed max-w-2xl">
              At Jawrah Pixel, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information when you interact with our services.
            </p>
          </Reveal>
          
          <div className="space-y-20">
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-mono text-brand-blue uppercase tracking-widest font-bold">01 / Collection</span>
                </div>
                <div className="md:col-span-8 space-y-6">
                  <h2 className="text-xl text-white font-display uppercase tracking-wider">Information Collection</h2>
                  <p className="text-zinc-500 font-light leading-relaxed">
                    We collect information that you provide directly to us, such as when you create an account, request a quote, or communicate with our team. This may include your name, email address, phone number, and project details. For international clients, this includes remote-first project communication, global inquiry details, and USD proposal information.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-mono text-brand-blue uppercase tracking-widest font-bold">02 / Usage</span>
                </div>
                <div className="md:col-span-8 space-y-6">
                  <h2 className="text-xl text-white font-display uppercase tracking-wider">Use of Information</h2>
                  <p className="text-zinc-500 font-light leading-relaxed">
                    We use the collected information to provide, maintain, and improve our services, communicate with you, and personalize your experience. We do not sell your personal information to third parties. All project-related data is handled within secure internal environments.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-mono text-brand-blue uppercase tracking-widest font-bold">03 / Protection</span>
                </div>
                <div className="md:col-span-8 space-y-6">
                  <h2 className="text-xl text-white font-display uppercase tracking-wider">Data Security</h2>
                  <p className="text-zinc-500 font-light leading-relaxed">
                    We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. Our infrastructure utilizes secure cloud providers and encrypted communication channels.
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
