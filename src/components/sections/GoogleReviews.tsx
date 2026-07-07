import { motion } from 'motion/react';
import { Reveal } from '@/components/ui/Reveal';
import { Star, ExternalLink, Quote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';

const GOOGLE_REVIEW_URL = "https://g.page/r/Cf1UjMHotQuaEAI/review";

const REAL_REVIEW = {
  author: "Zenvor",
  rating: 5,
  text: "Working with Jawrah Pixel has been an excellent experience. From design to development, their attention to detail, creativity, and technical expertise truly stand out. They deliver modern, fast, and visually stunning websites that not only look premium but also perform really well. The team is highly professional, responsive, and focused on delivering real results. I highly recommend Jawrah Pixel for anyone looking to build a strong online presence.",
  date: "2 days ago"
};

export function GoogleReviews() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className="py-20 md:py-32 relative overflow-hidden theme-bg border-t theme-border">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: isDark ? 'rgba(6,182,212,0.05)' : 'rgba(16,185,129,0.05)' }}
        />
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* CTA Content */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-mono uppercase tracking-[0.2em] mb-8">
                <Star size={12} className="fill-brand-cyan" />
                <span>Google Reviews</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight theme-text-primary mb-6 leading-[1.1] overflow-visible">
                Share Your <br />
                <span className="premium-text-gradient italic text-brand-cyan inline-block px-2 py-1 overflow-visible">Experience</span>
              </h2>
              
              <p className="theme-text-muted text-lg font-light leading-relaxed mb-10 max-w-md">
                Your feedback helps us improve and helps other clients discover the Jawrah Pixel standard of digital excellence.
              </p>
              
              <a 
                href={GOOGLE_REVIEW_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button size="lg" className="group h-14 px-10">
                  Leave a Google Review
                  <ExternalLink className="ml-3 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </a>
            </Reveal>
          </div>

          {/* Real Review */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="p-8 theme-card border theme-border hover:border-brand-cyan/20 transition-all duration-500 group relative">
                <Quote 
                  className="absolute top-6 right-8 w-12 h-12 transition-colors"
                  style={{ color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(6,182,212,0.1)'; }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)';
                  }}
                />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(REAL_REVIEW.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-brand-cyan text-brand-cyan" />
                  ))}
                </div>
                
                <p className="theme-text-muted text-sm leading-relaxed font-light italic mb-8 relative z-10">
                  "{REAL_REVIEW.text}"
                </p>
                
                <div className="flex items-center gap-4 pt-6 border-t theme-border">
                  <div className="w-10 h-10 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan font-display text-xs font-bold">
                    Z
                  </div>
                  <div>
                    <div className="theme-text-primary font-display font-bold uppercase text-[10px] tracking-widest">
                      {REAL_REVIEW.author}
                    </div>
                    <div className="theme-text-caption text-[9px] font-mono uppercase">
                      {REAL_REVIEW.date}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}