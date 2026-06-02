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

export default function Blog() {
  const { config, isInternational, currentRegion, p } = useRegion();
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
    <div className="bg-brand-black min-h-screen pt-32 pb-24 text-white overflow-hidden relative">
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
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[10%] right-[10%] cinematic-light animate-pulse-slow opacity-30" />
          <div className="absolute bottom-[20%] left-[10%] cinematic-light animate-glow opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' }} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal className="text-center max-w-4xl mx-auto mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex gap-3 items-center px-6 py-2 border border-white/5 rounded-none bg-white/[0.03] text-brand-blue text-[10px] font-mono uppercase tracking-[0.4em] mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" /> Digital Intelligence
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl lg:text-8xl font-display font-medium uppercase tracking-tight leading-[0.95] mb-10"
          >
            Thinking in <br /> <span className="premium-text-gradient italic">Pixels</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto"
          >
            Insights on the future of digital luxury, global SaaS interfaces, AI systems, and high-performance engineering.
          </motion.p>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-8">
                <div className="aspect-[16/10] bg-white/[0.02] border border-white/5" />
                <div className="space-y-4">
                  <div className="h-2 bg-white/[0.02] w-1/3" />
                  <div className="h-8 bg-white/[0.02] w-full" />
                  <div className="h-4 bg-white/[0.02] w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <StaggerItem key={post.id} className="group flex flex-col">
                <Link to={p(`/blog/${post.slug}`)} className="block relative aspect-[16/10] overflow-hidden bg-zinc-900 border border-white/5 mb-8">
                  <img 
                    src={post.featured_image} 
                    alt={post.title} 
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 bg-brand-black/80 backdrop-blur-xl border border-white/10 text-[9px] font-mono uppercase tracking-widest text-brand-blue">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="px-2 space-y-6">
                  <div className="flex items-center gap-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Calendar size={12} className="text-brand-blue" /> {new Date(post.published_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><User size={12} className="text-brand-blue" /> {post.author_name}</span>
                  </div>
                  
                  <h3 className="text-2xl font-display font-medium text-white uppercase tracking-tight group-hover:text-brand-blue transition-colors duration-500">
                    {post.title}
                  </h3>
                  
                  <p className="text-zinc-500 text-sm font-light leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link 
                    to={p(`/blog/${post.slug}`)}
                    className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:text-brand-blue transition-all duration-500 group/link"
                  >
                    Explore Insights <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform duration-500" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-32 border border-white/5 bg-white/[0.01]">
            <p className="text-zinc-500 font-light uppercase tracking-widest text-sm">No insights published for this region yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
