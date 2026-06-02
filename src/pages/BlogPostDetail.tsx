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

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { p, currentRegion } = useRegion();
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

  if (loading) return <div className="pt-40 text-center min-h-screen bg-brand-black text-zinc-500 font-mono uppercase tracking-widest animate-pulse">Analyzing insights...</div>;
  if (!post) return <div className="pt-40 text-center min-h-screen bg-brand-black text-white">Insight not found.</div>;

  return (
    <div className="bg-brand-black min-h-screen pt-32 pb-24 text-white overflow-hidden relative">
      <SEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        canonicalUrl={toAbsoluteUrl(p(`/blog/${post.slug}`))}
        ogType="article"
        ogImage={post.featured_image}
        keywords={post.tags}
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
        <div className="max-w-4xl mx-auto">
          
          {/* HEADER BAR */}
          <div className="mb-20 flex items-center justify-between">
            <Link 
              to={p('/blog')} 
              className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
              Back to Insights
            </Link>
            <div className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              Technical Perspective
            </div>
          </div>

          <Reveal>
            <div className="mb-16">
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-10">
                <span className="text-brand-blue font-bold tracking-[0.3em]">{post.category}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <span className="flex items-center gap-2"><Calendar size={12} className="text-brand-blue" /> {new Date(post.published_at).toLocaleDateString()}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <span className="flex items-center gap-2"><Clock size={12} className="text-brand-blue" /> 6 min read</span>
              </div>
              
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-medium uppercase tracking-tight leading-[0.95] mb-12">
                {post.title}
              </h1>

              <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 w-fit group">
                <div className="w-12 h-12 bg-brand-blue/10 flex items-center justify-center text-brand-blue font-display text-lg group-hover:scale-110 transition-transform duration-500">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-display font-bold uppercase text-[10px] tracking-[0.2em] mb-1">{post.author_name}</div>
                  <div className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest">{post.author_role}</div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="aspect-[21/9] bg-zinc-900 border border-white/5 overflow-hidden mb-24">
              <img 
                src={post.featured_image} 
                alt={post.title} 
                className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" 
              />
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <article className="prose prose-invert max-w-none prose-p:text-zinc-400 prose-p:text-lg prose-p:font-light prose-p:leading-relaxed prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-a:text-brand-blue prose-strong:text-white">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
          </Reveal>

          {/* ARTICLE FOOTER */}
          <div className="mt-32 pt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-12">
            <div className="flex flex-wrap gap-4">
              {post.tags.map(tag => (
                <span key={tag} className="px-4 py-1 border border-white/5 bg-white/[0.02] text-[9px] font-mono uppercase tracking-widest text-zinc-500">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-600 font-bold">Share Perspective</span>
              <button className="w-12 h-12 border border-white/5 bg-white/[0.02] flex items-center justify-center text-zinc-500 hover:text-white hover:border-white transition-all duration-500">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* RELATED INSIGHTS */}
          {related.length > 0 && (
            <div className="mt-48">
              <Reveal className="mb-16">
                <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Further Reading</span>
                <h3 className="text-3xl md:text-5xl font-display font-medium uppercase tracking-tight text-white">Related <span className="premium-text-gradient italic">Insights</span></h3>
              </Reveal>
              
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {related.map(item => (
                  <StaggerItem key={item.slug} className="group">
                    <Link to={p(`/blog/${item.slug}`)} className="block space-y-6">
                      <div className="aspect-video bg-zinc-900 border border-white/5 overflow-hidden">
                        <img 
                          src={item.featured_image} 
                          alt={item.title} 
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
                        />
                      </div>
                      <h4 className="text-sm font-display font-medium uppercase tracking-wider text-white group-hover:text-brand-blue transition-colors duration-500 line-clamp-2">
                        {item.title}
                      </h4>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}

          {/* NEWSLETTER CTA */}
          <Reveal className="mt-48 pb-20">
            <div className="relative p-16 md:p-24 bg-white/[0.02] border border-white/5 overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-8 relative z-10">Intelligence Stream</span>
              <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white max-w-2xl mb-10 uppercase leading-[1.1] relative z-10 mx-auto">
                Stay at the edge of <span className="premium-text-gradient italic">digital architecture</span>.
              </h2>
              <Link to={p('/contact')} className="relative z-10">
                <Button variant="outline" size="lg" className="min-w-[280px]">
                  Request Briefing
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
