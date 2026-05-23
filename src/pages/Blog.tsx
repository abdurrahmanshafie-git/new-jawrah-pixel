import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';

export default function Blog() {
  const { config } = useRegion();

  return (
    <div className="pt-32 pb-24 min-h-[81vh]">
      <SEO 
        title={`Insights & News | ${config.countryName}`}
        description={`The Jawrah Pixel blog: thoughts on luxury design, high-performance tech, and digital engineering in ${config.countryName}.`}
      />
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-5xl font-display font-medium text-white mb-6">
            Our <span className="text-brand-cyan">Blog</span>
          </h1>
          <p className="text-brand-gray text-base md:text-lg mb-12">
            Insights on the future of digital luxury and performance engineering.
          </p>
          
          <div className="p-12 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm">
            <div className="text-brand-cyan font-mono text-xs uppercase tracking-widest mb-4">Coming Soon</div>
            <h2 className="text-xl md:text-2xl text-white font-display mb-4">Thinking in Pixels</h2>
            <p className="text-brand-gray text-sm md:text-base leading-relaxed">
              We are currently curating high-value insights for our clients and the design community. 
              The Jawrah Pixel blog will launch soon with deep dives into React architectures and luxury branding strategy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
