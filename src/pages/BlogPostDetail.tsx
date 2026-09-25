import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { fetchBlogPostBySlug, BlogPost, fetchRelatedPosts } from '@/lib/supabase/blog-api';
import { getFallbackBlogPost, getFallbackRelatedPosts } from '@/data/blogPosts';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { Calendar, User, ArrowLeft, Tag, Clock, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toAbsoluteUrl } from '@/lib/env';
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo/schema';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { p, currentRegion } = useRegion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetchBlogPostBySlug(slug).then(({ data }) => {
        const resolvedPost = data || getFallbackBlogPost(slug);
        if (resolvedPost) {
          setPost(resolvedPost);
          fetchRelatedPosts(resolvedPost.category, resolvedPost.id).then(({ data: relatedData }) => {
            setRelated(relatedData?.length ? relatedData : getFallbackRelatedPosts(resolvedPost.category, resolvedPost.id));
          }).catch(() => {
            setRelated(getFallbackRelatedPosts(resolvedPost.category, resolvedPost.id));
          });
        }
        setLoading(false);
      }).catch(() => {
        const fallback = getFallbackBlogPost(slug);
        if (fallback) {
          setPost(fallback);
          setRelated(getFallbackRelatedPosts(fallback.category, fallback.id));
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) return <div className="pt-40 text-center min-h-screen theme-bg theme-text-muted font-mono uppercase tracking-widest animate-pulse">Analyzing insights...</div>;
  if (!post) return <div className="pt-40 text-center min-h-screen theme-bg theme-text-primary">Insight not found.</div>;

  return (
    <div className="theme-bg min-h-screen pt-32 pb-24 theme-text-primary overflow-hidden relative transition-colors duration-300">
      <SEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        canonicalUrl={toAbsoluteUrl(p(`/blog/${post.slug}`))}
        ogType="article"
        ogImage={post.featured_image}
        keywords={post.tags}
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

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        {/* HEADER BAR */}
        <div className="mb-20 flex items-center justify-between border-b theme-border pb-6">
          <Link 
            to={p('/blog')} 
            className="group flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.3em] theme-text-muted hover:theme-text-primary transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1.5 transition-transform" />
            Back to Insights
          </Link>
          <div className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            Technical Perspective
          </div>
        </div>

        <Reveal>
          <div className="mb-14">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] font-mono theme-text-caption uppercase tracking-widest mb-8">
              <span className="text-brand-blue font-bold tracking-[0.3em]">{post.category}</span>
              <span className="w-1 h-1 rounded-full bg-slate-500/30" />
              <span className="flex items-center gap-1.5"><Calendar size={12} className="text-brand-blue" /> {new Date(post.published_at).toLocaleDateString()}</span>
              <span className="w-1 h-1 rounded-full bg-slate-500/30" />
              <span className="flex items-center gap-1.5"><Clock size={12} className="text-brand-blue" /> 6 min read</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium uppercase tracking-tight leading-[0.98] mb-10 theme-text-primary">
              {post.title}
            </h1>

            <div className="flex items-center gap-5 p-5 theme-bg-tertiary border theme-border rounded-xl w-fit group">
              <div className="w-11 h-11 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue font-display font-bold text-base group-hover:scale-105 transition-transform">
                {post.author_name.charAt(0)}
              </div>
              <div>
                <div className="theme-text-primary font-display font-bold uppercase text-[11px] tracking-[0.2em]">{post.author_name}</div>
                <div className="theme-text-caption text-[10px] font-mono uppercase tracking-wider">{post.author_role}</div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="aspect-[21/9] rounded-2xl border theme-border overflow-hidden mb-20 bg-black/5 shadow-2xl">
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" 
            />
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <article className={cn(
            "prose max-w-none prose-lg leading-relaxed mb-24",
            isDark 
              ? "prose-invert prose-p:text-zinc-300 prose-headings:text-white prose-strong:text-white" 
              : "prose-slate prose-p:text-slate-700 prose-headings:text-slate-900 prose-strong:text-slate-900"
          )}>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </Reveal>

        {/* ARTICLE FOOTER */}
        <div className="mt-20 pt-10 border-t theme-border flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-wrap gap-2.5">
            {post.tags.map(tag => (
              <span key={tag} className="px-3.5 py-1.5 border theme-border theme-bg-tertiary text-[10px] font-mono uppercase tracking-wider theme-text-secondary rounded">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] theme-text-caption font-bold">Share</span>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                }
              }}
              className="w-10 h-10 border theme-border theme-bg-tertiary rounded-lg flex items-center justify-center theme-text-muted hover:theme-text-primary hover:border-brand-blue/50 transition-all"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* RELATED INSIGHTS */}
        {related.length > 0 && (
          <div className="mt-32 pt-16 border-t theme-border">
            <Reveal className="mb-12">
              <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-4">Further Reading</span>
              <h3 className="text-3xl md:text-5xl font-display font-medium uppercase tracking-tight theme-text-primary">Related <span className="premium-text-gradient italic">Insights</span></h3>
            </Reveal>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map(item => (
                <StaggerItem key={item.slug} className="group theme-card border theme-border p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1">
                  <Link to={p(`/blog/${item.slug}`)} className="block space-y-4">
                    <div className="aspect-video rounded-xl border theme-border overflow-hidden bg-black/10">
                      <img 
                        src={item.featured_image} 
                        alt={item.title} 
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                      />
                    </div>
                    <h4 className="text-sm sm:text-base font-display font-medium uppercase tracking-wider theme-text-primary group-hover:text-brand-blue transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* NEWSLETTER CTA */}
        <Reveal className="mt-32 pb-16">
          <div className="relative p-12 sm:p-20 theme-card border theme-border rounded-3xl overflow-hidden text-center shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6 relative z-10">Intelligence Stream</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight theme-text-primary max-w-2xl mb-8 uppercase leading-[1.1] relative z-10 mx-auto">
              Stay at the edge of <span className="premium-text-gradient italic">digital architecture</span>.
            </h2>
            <Link to={p('/contact')} className="relative z-10 inline-block">
              <Button size="lg" className="min-w-[240px]">
                Request Briefing
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
