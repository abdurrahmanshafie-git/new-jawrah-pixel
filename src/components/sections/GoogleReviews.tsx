import { motion } from 'motion/react';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { Star, MessageSquare, ExternalLink, Quote } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Placeholder for Google Reviews data - can be connected to Google Places API later
const GOOGLE_REVIEWS = [
  {
    id: 1,
    author: "James Mitchell",
    rating: 5,
    text: "The team at Jawrah Pixel transformed our digital presence. Their attention to detail and technical expertise is unmatched. Highly recommend for enterprise-grade web solutions.",
    date: "2 months ago",
    initials: "JM"
  },
  {
    id: 2,
    author: "Sarah Chen",
    rating: 5,
    text: "Exceptional design and smooth project management. They delivered a high-converting ecommerce platform that exceeded our expectations.",
    date: "1 month ago",
    initials: "SC"
  },
  {
    id: 3,
    author: "Marcus Thorne",
    rating: 5,
    text: "Professional, innovative, and results-driven. Our website performance improved significantly after their technical audit and redesign.",
    date: "3 weeks ago",
    initials: "MT"
  }
];

// REPLACE THIS WITH YOUR ACTUAL GOOGLE REVIEW URL
const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID_HERE";

export function GoogleReviews() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-brand-black border-t border-white/5">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* CTA Content */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-mono uppercase tracking-[0.2em] mb-8">
                <Star size={12} className="fill-brand-cyan" />
                <span>Google Verified Reviews</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight text-white mb-6 leading-[0.95]">
                Share Your <br />
                <span className="premium-text-gradient italic text-brand-cyan">Experience</span>
              </h2>
              
              <p className="text-brand-gray text-lg font-light leading-relaxed mb-10 max-w-md">
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

          {/* Reviews Grid */}
          <div className="lg:col-span-7">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GOOGLE_REVIEWS.map((review, idx) => (
                <StaggerItem 
                  key={review.id}
                  className={idx === 2 ? "md:col-span-2" : ""}
                >
                  <div className="h-full p-8 bg-white/[0.02] border border-white/5 hover:border-brand-cyan/20 transition-all duration-500 group relative">
                    <Quote className="absolute top-6 right-8 w-12 h-12 text-white/5 group-hover:text-brand-cyan/10 transition-colors" />
                    
                    <div className="flex gap-1 mb-6">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-brand-cyan text-brand-cyan" />
                      ))}
                    </div>
                    
                    <p className="text-brand-gray text-sm leading-relaxed font-light italic mb-8 relative z-10">
                      "{review.text}"
                    </p>
                    
                    <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                      <div className="w-10 h-10 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan font-display text-xs font-bold">
                        {review.initials}
                      </div>
                      <div>
                        <div className="text-white font-display font-bold uppercase text-[10px] tracking-widest">
                          {review.author}
                        </div>
                        <div className="text-brand-gray text-[9px] font-mono uppercase">
                          {review.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
