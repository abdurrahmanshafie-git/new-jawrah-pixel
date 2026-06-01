import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { fetchBlogPosts, BlogPost } from '@/lib/supabase/blog-api';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
      if (data) setPosts(data);
      setLoading(false);
    });
  }, [currentRegion]);

  return (
    <div className="bg-brand-black min-h-screen pt-32 pb-24 text-white">
      <SEO 
        title={seoTitle}
        description={seoDescription}
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

      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-mono uppercase tracking-widest">
              Digital Intelligence
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight mb-6">
              Thinking in <span className="text-brand-cyan italic">Pixels</span>
            </h1>
            <p className="text-brand-gray text-base md:text-lg font-light leading-relaxed">
              Insights on the future of digital luxury, global SaaS interfaces, AI systems, e-commerce, and performance engineering.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-white/5 rounded-2xl mb-4"></div>
                <div className="h-4 bg-white/5 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-white/5 rounded w-full mb-4"></div>
                <div className="h-4 bg-white/5 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <StaggerItem key={post.id}>
                <Link to={p(`/blog/${post.slug}`)} className="group block h-full">
                  <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col border border-white/5 group-hover:border-brand-cyan/30 transition-all duration-500">
                    <div className="aspect-video overflow-hidden relative">
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-brand-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono uppercase tracking-widest text-brand-cyan">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-[10px] font-mono text-brand-gray mb-4">
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(post.published_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><User size={12} /> {post.author_name}</span>
                      </div>
                      <h3 className="text-xl font-display font-bold uppercase tracking-tight text-white mb-4 group-hover:text-brand-cyan transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-brand-gray text-xs font-light leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-cyan group-hover:gap-4 transition-all">
                        Read Insights <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
            <p className="text-brand-gray font-light">No insights published yet for this region.</p>
          </div>
        )}
      </div>
    </div>
  );
}
