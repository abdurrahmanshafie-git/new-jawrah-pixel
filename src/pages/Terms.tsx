import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';

export default function Terms() {
  const { config, isInternational } = useRegion();
  const seoTitle = isInternational ? 'Global Terms of Service' : `Terms of Service | ${config.countryName}`;
  const seoDescription = isInternational
    ? 'Standard terms of service and agreement guidelines for international Jawrah Pixel clients, USD projects, and remote-first collaborations.'
    : `Standard terms of service and agreement guidelines for Jawrah Pixel clients in ${config.countryName}.`;

  return (
    <div className="pt-32 pb-24 min-h-[81vh]">
      <SEO 
        title={seoTitle}
        description={seoDescription}
      />
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-display font-medium text-white mb-8"
          >
            Terms of <span className="text-brand-cyan">Service</span>
          </motion.h1>
          
          <div className="prose prose-invert max-w-none text-brand-gray space-y-6 text-sm md:text-base leading-relaxed">
            <p>
              By accessing or using the Jawrah Pixel platform and services, you agree to comply with and be bound by the following terms and conditions.
              International projects are scoped through USD proposals, remote-first collaboration, and globally supported payment methods where applicable.
            </p>
            
            <h2 className="text-xl text-white font-display mt-8 mb-4 uppercase tracking-wider">01. Service Agreement</h2>
            <p>
              Jawrah Pixel provides digital design and development services. Specific project terms, timelines, and deliverables are outlined in individual project proposals and contracts signed by both parties.
            </p>
            
            <h2 className="text-xl text-white font-display mt-8 mb-4 uppercase tracking-wider">02. Intellectual Property</h2>
            <p>
              Upon full payment for services rendered, ownership of final deliverables (such as website code and design assets) is transferred to the client, unless otherwise specified in the project contract.
            </p>
            
            <h2 className="text-xl text-white font-display mt-8 mb-4 uppercase tracking-wider">03. Limitation of Liability</h2>
            <p>
              Jawrah Pixel shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our services or any performance issues beyond our reasonable control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
