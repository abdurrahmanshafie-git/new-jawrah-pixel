import { motion } from 'motion/react';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { Star, CheckCircle2, Globe, Zap, Users, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchTestimonials, Testimonial } from '@/lib/supabase/testimonials-api';
import { useRegion } from '@/hooks/useRegion';
import { useTheme } from '@/contexts/ThemeContext';

export function TrustSection() {
  const { currentRegion } = useRegion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials(currentRegion).then(({ data }) => {
      if (data) setTestimonials(data);
    });
  }, [currentRegion]);

  const stats = [
    { label: 'Projects Completed', value: '150+', icon: <Zap className="w-5 h-5" /> },
    { label: 'Client Satisfaction', value: '99%', icon: <Star className="w-5 h-5" /> },
    { label: 'Countries Served', value: '12+', icon: <Globe className="w-5 h-5" /> },
    { label: 'Avg. Delivery', value: '6 wks', icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <section className="py-16 md:py-24 theme-bg overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-medium uppercase tracking-tight theme-text-primary mb-4">
              Trusted by <span className="text-brand-cyan italic">Global Leaders</span>
            </h2>
            <p className="theme-text-muted text-sm md:text-lg font-light max-w-2xl mx-auto">
              We engineer digital authority for ambitious brands across the globe.
            </p>
          </div>
        </Reveal>

        {/* Business Stats */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-24">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="h-full p-5 sm:p-6 rounded-2xl theme-card border theme-border text-center group hover:border-brand-cyan/30 transition-all duration-500">
                <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-display font-bold theme-text-primary mb-1">{stat.value}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest theme-text-caption">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <>
            <div className="md:hidden -mx-5 px-5 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory">
              <div className="flex gap-4 w-max pb-2">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="w-[80vw] max-w-[340px] snap-center h-full p-6 rounded-3xl theme-card border theme-border relative flex flex-col justify-between"
                  >
                    <div className="mb-6">
                      <div className="flex gap-1 mb-4">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-brand-cyan text-brand-cyan" />
                        ))}
                      </div>
                      <p className="theme-text-muted text-sm font-light italic leading-relaxed line-clamp-5">
                        "{t.review}"
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-6 border-t theme-border">
                      <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan font-display text-xs shrink-0">
                        {t.avatar_url ? (
                          <img src={t.avatar_url} alt={t.client_name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          t.client_name.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="theme-text-primary font-display font-bold uppercase text-[10px] tracking-widest truncate">{t.client_name}</div>
                        <div className="theme-text-caption text-[9px] font-mono uppercase truncate">{t.company_name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <StaggerContainer className="hidden md:grid grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <StaggerItem key={t.id}>
                  <div className="h-full p-8 rounded-3xl theme-card border theme-border relative flex flex-col justify-between group hover:theme-bg-tertiary transition-all">
                    <div className="mb-6">
                      <div className="flex gap-1 mb-4">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-brand-cyan text-brand-cyan" />
                        ))}
                      </div>
                      <p className="theme-text-muted text-sm font-light italic leading-relaxed">
                        "{t.review}"
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-6 border-t theme-border">
                      <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan font-display text-xs">
                        {t.avatar_url ? (
                          <img src={t.avatar_url} alt={t.client_name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          t.client_name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="theme-text-primary font-display font-bold uppercase text-[10px] tracking-widest">{t.client_name}</div>
                        <div className="theme-text-caption text-[9px] font-mono uppercase">{t.company_name}</div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </>
        )}
      </div>
    </section>
  );
}
