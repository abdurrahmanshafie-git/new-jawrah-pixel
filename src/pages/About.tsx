import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useRegion } from '@/hooks/useRegion';
import { useRegionalSeo } from '@/hooks/useRegionalSeo';
import { getCanonicalUrl } from '@/lib/seo/pageSeo';
import { SEO } from '@/components/layout/SEO';
import { Logo } from '@/components/layout/Logo';
import { StaggerContainer, StaggerItem } from '@/components/ui/Reveal';

export default function About() {
  const { config, p, isInternational } = useRegion();
  const seo = useRegionalSeo('about');
  const aboutCopy = isInternational
    ? "Jawrah Pixel is a premium remote-first digital agency serving international businesses, SaaS companies, luxury brands, ecommerce teams, creators, and AI startups worldwide. We partner with ambitious global clients to build websites, commerce platforms, brand systems, and operational products that feel expensive, load fast, and scale with confidence."
    : `Jawrah Pixel is a premium web design and custom development agency serving ${config.countryName} with physical pipelines in ${config.locations.join(', ')}. We partner with luxury brands, corporates, and startups to build websites, e-commerce stores, and operational systems that look magnificent and perform at scale.`;

  return (
    <div className="pt-32 pb-24 min-h-[81vh] flex items-center">
      <SEO 
        title={seo.title}
        description={seo.description}
        canonicalUrl={getCanonicalUrl(seo.path)}
      />
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex justify-center"
          >
            <Logo size="lg" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-6xl font-display font-bold mb-4 md:mb-6 leading-tight"
          >
            Digital elegance for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">ambitious brands</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-gray text-sm sm:text-lg mb-8 md:mb-10 leading-relaxed font-light"
          >
            {aboutCopy}
            <br/><br/>
            Our technology stack leverages Vite, React, Supabase, Tailwind CSS, and edge CDN architectures to deliver 
            world-class speed, security, and uptime.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to={p('/contact')}>
              <Button className="px-10 h-12 md:h-14 uppercase tracking-widest text-[10px] sm:text-xs font-bold luxury-glow">Work With Us</Button>
            </Link>
          </motion.div>

          {/* Core Values Section for Mobile optimization */}
          <StaggerContainer className="grid grid-cols-3 gap-3 mt-24 pt-12 border-t border-white/5">
            {[
              { label: 'Precision', icon: '01' },
              { label: 'Elegance', icon: '02' },
              { label: 'Performance', icon: '03' }
            ].map((value) => (
              <StaggerItem key={value.label} className="text-center group">
                <div className="text-[10px] font-mono text-brand-cyan mb-1 opacity-50 group-hover:opacity-100 transition-opacity">
                  {value.icon}
                </div>
                <div className="text-[9px] sm:text-[11px] font-display uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                  {value.label}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </div>
  );
}
