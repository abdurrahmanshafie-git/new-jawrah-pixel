import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';

export default function Privacy() {
  const { config, isInternational } = useRegion();
  const seoTitle = isInternational ? 'Global Privacy Policy' : `Privacy Policy | ${config.countryName}`;
  const seoDescription = isInternational
    ? 'Privacy standards and data protection policies for international Jawrah Pixel clients and remote-first global projects.'
    : `Privacy standards and data protection policies for Jawrah Pixel clients in ${config.countryName}.`;

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
            Privacy <span className="text-brand-cyan">Policy</span>
          </motion.h1>
          
          <div className="prose prose-invert max-w-none text-brand-gray space-y-6 text-sm md:text-base leading-relaxed">
            <p>
              At Jawrah Pixel, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you interact with our services.
              For international clients, this includes remote-first project communication, global inquiry details, USD proposal information, and secure collaboration records.
            </p>
            
            <h2 className="text-xl text-white font-display mt-8 mb-4 uppercase tracking-wider">01. Information Collection</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, request a quote, or communicate with our team. This may include your name, email address, phone number, and project details.
            </p>
            
            <h2 className="text-xl text-white font-display mt-8 mb-4 uppercase tracking-wider">02. Use of Information</h2>
            <p>
              We use the collected information to provide, maintain, and improve our services, communicate with you, and personalize your experience. We do not sell your personal information to third parties.
            </p>
            
            <h2 className="text-xl text-white font-display mt-8 mb-4 uppercase tracking-wider">03. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. Our infrastructure utilizes secure cloud providers and encrypted communication channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
