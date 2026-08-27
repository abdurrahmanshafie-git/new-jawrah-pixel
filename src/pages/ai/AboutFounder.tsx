import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { Reveal } from '@/components/ui/Reveal';
import { toAbsoluteUrl } from '@/lib/env';
import { Award, Code, Lightbulb, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AboutFounder() {
  const { p } = useRegion();

  return (
    <div className="bg-brand-black min-h-screen pt-32 pb-24 text-white">
      <SEO 
        title="About the Founder | The Vision Behind Jawrah Pixel"
        description="Learn about the technical vision and leadership behind Jawrah Pixel. Engineering digital excellence for global brands."
        canonicalUrl={toAbsoluteUrl(p('/about-founder'))}
        schemaData={[
          {
            '@type': 'ProfilePage',
            name: 'Founder of Jawrah Pixel',
            mainEntity: { '@id': 'https://jawrahpixel.com/#founder' },
          },
          {
            '@type': 'Person',
            '@id': 'https://jawrahpixel.com/#founder',
            name: 'Abdurrahman Shafie',
            jobTitle: 'Founder & Creative Director',
            worksFor: { '@id': 'https://jawrahpixel.com/#organization' },
            url: toAbsoluteUrl(p('/about-founder')),
            sameAs: 'https://www.linkedin.com/in/abdurrahman-shafie-5a16923a3/',
          },
        ]}
      />

      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Reveal>
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-mono uppercase tracking-widest">
            Leadership & Vision
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-medium mb-8 uppercase tracking-tight">
            The <span className="text-brand-cyan italic">Founders</span>
          </h1>
        </Reveal>

        <div className="space-y-12 text-brand-gray text-lg font-light leading-relaxed">
          <Reveal delay={0.1}>
            <div className="flex flex-col md:flex-row gap-12 items-center mb-12">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-brand-cyan to-brand-blue p-1 shrink-0">
                <div className="w-full h-full rounded-full bg-brand-black flex items-center justify-center overflow-hidden">
                  <span className="text-4xl font-display text-brand-cyan font-bold tracking-tighter">AS & JH</span>
                </div>
              </div>
              <div>
                <p>
                  Jawrah Pixel was founded by <strong>Abdurrahman Shafie</strong> and Co-Founded by <strong>Jaweriya Hafeez</strong>.
                </p>
                <p className="mt-4">
                  Built on a vision of combining luxury aesthetics with modern technology, Jawrah Pixel was created to help ambitious businesses establish strong digital authority through world-class websites, e-commerce platforms, automation systems, and strategic digital infrastructure.
                </p>
                <p className="mt-4">
                  Every project is guided by the same principles that shaped the company from day one: precision, transparency, innovation, and measurable business growth.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-6">The Philosophy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex gap-4 items-center text-white">
                  <Code className="w-5 h-5 text-brand-cyan" />
                  <h4 className="font-display font-bold uppercase text-xs tracking-widest">Technical Precision</h4>
                </div>
                <p className="text-sm">Clean, scalable code is the foundation of every brand legacy.</p>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 items-center text-white">
                  <Lightbulb className="w-5 h-5 text-brand-cyan" />
                  <h4 className="font-display font-bold uppercase text-xs tracking-widest">Strategic Design</h4>
                </div>
                <p className="text-sm">Design must serve a business objective, not just look pretty.</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-6">Commitment to Innovation</h2>
            <p>
              Under the leadership of our core architects, Jawrah Pixel continues to push the boundaries of 
              what is possible in web technology. From early adoption of headless architectures to 
              integrating sophisticated AI systems, we ensure our clients are always ahead of the curve.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div>
                <h3 className="text-white font-display font-bold uppercase text-sm mb-2 tracking-widest">Join the Circle</h3>
                <p className="text-xs">Partner with an agency that understands the value of your legacy.</p>
              </div>
              <Button className="luxury-glow uppercase tracking-widest text-[10px] font-mono">
                Start a Conversation
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
