import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { fetchBlogPosts, BlogPost } from '@/lib/supabase/blog-api';
import { getFallbackBlogPosts } from '@/data/blogPosts';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/env';
import { useTheme } from '@/contexts/ThemeContext';

export default function Blog() {
  const { config, isInternational, currentRegion, p } = useRegion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const seoTitle = isInternational ? 'Global Insights & News' : `Insights & News | ${config.countryName}`;
  const seoDescription = isInternational
    ? 'The Jawrah Pixel blog: global thoughts on luxury design, SaaS interfaces, AI systems, ecommerce, and high-performance digital engineering.'
    : `The Jawrah Pixel blog: thoughts on luxury design, high-performance tech, and digital engineering in ${config.countryName}.`;

  useEffect(() => {
    fetchBlogPosts(currentRegion).then(({ data }) => {
      setPosts(data?.length ? data : getFallbackBlogPosts(currentRegion));
      setLoading(false);
    }).catch(() => {
      setPosts(getFallbackBlogPosts(currentRegion));
      setLoading(false);
    });
  }, [currentRegion]);

  return (
    <div className="theme-bg min-h-screen pt-32 pb-24 theme-text-primary overflow-hidden relative transition-colors duration-300">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={toAbsoluteUrl(p('/blog'))}
        keywords={['Jawrah Pixel blog', 'web design insights', 'technical SEO blog', `${config.countryName} digital strategy`]}
        schemaType="BlogPosting"
        schemaData={{
          "@type": "Blog",
          "name": seoTitle,
          "description": seoDescription,
          "publisher": {
            "@id": "https://jawrahpixel.com/#organization"
          }
        }}
      />

      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 premium-grid-overlay opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[10%] right-[10%] cinematic-light animate-pulse-slow opacity-30" />
          <div 
            className="absolute bottom-[20%] left-[10%] cinematic-light animate-glow opacity-20" 
            style={{ 
              background: isDark 
                ? 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' 
                : 'radial-gradient(circle at center, rgba(59, 130, 246, 0.08), transparent 70%)' 
            }} 
          />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <Reveal className="text-center max-w-4xl mx-auto mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex gap-3 items-center px-6 py-2 border theme-border rounded-none theme-bg-tertiary text-brand-blue text-[10px] font-mono uppercase tracking-[0.4em] mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" /> Digital Intelligence
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl lg:text-8xl font-display font-medium uppercase tracking-tight leading-[0.95] mb-10 theme-text-primary"
          >
            Thinking in <br /> <span className="premium-text-gradient italic">Pixels</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="theme-text-muted text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto"
          >
            Insights on the future of digital luxury, global SaaS interfaces, AI systems, and high-performance engineering.
          </motion.p>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-8">
                <div className="aspect-[16/10] theme-bg-tertiary border theme-border" />
                <div className="space-y-4">
                  <div className="h-2 theme-bg-tertiary w-1/3" />
                  <div className="h-8 theme-bg-tertiary w-full" />
                  <div className="h-4 theme-bg-tertiary w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <StaggerItem key={post.id} className="group flex flex-col theme-card border theme-border p-6 rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
                <Link to={p(`/blog/${post.slug}`)} className="block relative aspect-[16/10] overflow-hidden rounded-xl border theme-border mb-6 bg-black/10">
                  <img 
                    src={post.featured_image} 
                    alt={post.title} 
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                  />
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: isDark
                        ? 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%)'
                        : 'linear-gradient(to top, rgba(15,23,42,0.4), transparent 60%)'
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/70 backdrop-blur-xl border border-white/15 text-[9px] font-mono uppercase tracking-widest text-white rounded">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-[10px] font-mono theme-text-caption uppercase tracking-widest mb-3">
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-brand-blue" /> {new Date(post.published_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><User size={12} className="text-brand-blue" /> {post.author_name}</span>
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-display font-medium theme-text-primary uppercase tracking-tight group-hover:text-brand-blue transition-colors duration-300 mb-3">
                      {post.title}
                    </h3>
                    
                    <p className="theme-text-muted text-sm font-light leading-relaxed line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t theme-border">
                    <Link 
                      to={p(`/blog/${post.slug}`)}
                      className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-brand-blue hover:text-brand-cyan transition-colors group/link"
                    >
                      <span>Explore Insights</span>
                      <ArrowRight size={13} className="group-hover/link:translate-x-1.5 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-32 border theme-border theme-card rounded-2xl">
            <p className="theme-text-muted font-light uppercase tracking-widest text-sm">No insights published for this region yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
