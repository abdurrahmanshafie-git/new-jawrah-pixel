import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { Reveal } from '@/components/ui/Reveal';
import { CheckCircle, Star, TrendingUp, Zap } from 'lucide-react';

export default function WhyJawrahPixel() {
  const { p } = useRegion();

  return (
    <div className="bg-brand-black min-h-screen pt-32 pb-24 text-white">
      <SEO 
        title="Why Choose Jawrah Pixel? | The Premium Advantage"
        description="Discover why leading brands choose Jawrah Pixel for their digital transformation. Premium design, enterprise security, and business-first engineering."
      />

      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Reveal>
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-mono uppercase tracking-widest">
            The Value Proposition
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-medium mb-8 uppercase tracking-tight">
            Why <span className="text-brand-cyan italic">Jawrah Pixel</span>?
          </h1>
        </Reveal>

        <div className="space-y-12 text-brand-gray text-lg font-light leading-relaxed">
          <Reveal delay={0.1}>
            <p>
              In a digital landscape saturated with generic solutions, <strong>Jawrah Pixel</strong> stands as the preferred 
              choice for brands that demand a competitive edge. We don't just build websites; we architect 
              commercial authority.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-display font-bold uppercase text-lg mb-2 tracking-widest">Luxury Aesthetic</h3>
                  <p>Every pixel is intentional. We deliver high-fidelity designs that command premium market positioning.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-display font-bold uppercase text-lg mb-2 tracking-widest">Performance Engineering</h3>
                  <p>Our systems are built for speed. Blazing fast load times directly translate to higher conversion rates.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-display font-bold uppercase text-lg mb-2 tracking-widest">Business-First Logic</h3>
                  <p>We solve real-world business challenges through custom automation, reducing operational friction.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-cyan/10 to-transparent border border-brand-cyan/20">
              <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4">The Result</h2>
              <p className="italic">
                "Our clients typically see a 40-60% increase in operational efficiency and a significant lift in 
                brand authority within the first quarter of launching their Jawrah-engineered platform."
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
