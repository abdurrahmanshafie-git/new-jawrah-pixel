import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { fetchBlogPostBySlug, BlogPost, fetchRelatedPosts } from '@/lib/supabase/blog-api';
import { getFallbackBlogPost, getFallbackRelatedPosts } from '@/data/blogPosts';
import { Reveal } from '@/components/ui/Reveal';
import { Calendar, User, ArrowLeft, Tag, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toAbsoluteUrl } from '@/lib/env';
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo/schema';

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

  if (loading) return <div className="pt-40 text-center min-h-screen bg-brand-black text-white">Loading insights...</div>;
  if (!post) return <div className="pt-40 text-center min-h-screen bg-brand-black text-white">Insight not found.</div>;

  return (
    <div className="bg-brand-black min-h-screen pt-32 pb-24 text-white">
      <SEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        canonicalUrl={toAbsoluteUrl(p(`/blog/${post.slug}`))}
        ogType="article"
        ogImage={post.featured_image}
        keywords={post.tags}
        schemaData={[
          buildArticleSchema({
            headline: post.title,
            description: post.meta_description || post.excerpt,
            image: post.featured_image,
            datePublished: post.published_at,
            authorName: post.author_name,
            url: toAbsoluteUrl(p(`/blog/${post.slug}`)),
          }),
          buildBreadcrumbSchema([
            { name: 'Home', url: toAbsoluteUrl(`/${currentRegion}`) },
            { name: 'Blog', url: toAbsoluteUrl(p('/blog')) },
            { name: post.title, url: toAbsoluteUrl(p(`/blog/${post.slug}`)) },
          ]),
        ]}
      />

      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Reveal>
          <Link 
            to={p('/blog')} 
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-brand-gray hover:text-brand-cyan transition-colors mb-8"
          >
            <ArrowLeft size={12} /> Back to Insights
          </Link>
          
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-brand-cyan uppercase tracking-widest mb-6">
              <span className="px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20">{post.category}</span>
              <span className="flex items-center gap-1.5 text-brand-gray"><Calendar size={12} /> {new Date(post.published_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5 text-brand-gray"><Clock size={12} /> 6 min read</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight leading-[1.1] mb-8">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit">
              <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan font-display text-xs">
                {post.author_name.charAt(0)}
              </div>
              <div>
                <div className="text-white font-display font-bold uppercase text-[10px] tracking-widest">{post.author_name}</div>
                <div className="text-brand-gray text-[9px] font-mono uppercase">{post.author_role}</div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-white/10">
            <img src={post.featured_image} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <article className="prose prose-invert prose-brand max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </Reveal>

        {/* Footer of the article */}
        <div className="mt-20 pt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-8">
          <div className="flex gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-brand-gray">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gray">Share Insight</span>
            <button className="p-2 rounded-full bg-white/5 hover:bg-brand-cyan/20 hover:text-brand-cyan transition-all">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-32">
            <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-white mb-12">Related <span className="text-brand-cyan italic">Insights</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map(item => (
                <Link key={item.slug} to={p(`/blog/${item.slug}`)} className="group block">
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-white/5">
                    <img src={item.featured_image} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <h4 className="text-sm font-display font-bold uppercase tracking-wide text-white group-hover:text-brand-cyan transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
