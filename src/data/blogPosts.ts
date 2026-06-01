import type { BlogPost } from '@/lib/supabase/blog-api';

export const fallbackBlogPosts: BlogPost[] = [
  {
    id: 'seo-architecture-for-premium-websites',
    title: 'SEO Architecture for Premium Websites',
    slug: 'seo-architecture-for-premium-websites',
    excerpt:
      'How metadata, schema, internal links, performance, and service pages work together for premium digital brands.',
    featured_image: '/assets/hero_bg.png',
    category: 'Technical SEO',
    author_name: 'Jawrah Pixel Strategy Team',
    author_role: 'Technical SEO & Web Performance',
    published_at: '2026-06-01',
    meta_title: 'SEO Architecture for Premium Websites | Jawrah Pixel',
    meta_description:
      'A practical guide to technical SEO architecture for premium websites, service pages, structured data, internal links, and Core Web Vitals.',
    region: 'global',
    tags: ['SEO', 'Schema', 'Performance', 'Web Design'],
    content: `
      <p>Premium websites need more than visual polish. Search engines need a clear page hierarchy, stable URLs, descriptive metadata, crawlable internal links, and structured data that explains the brand, services, FAQs, and proof points.</p>
      <p>The best SEO architecture starts before content is written. Each service page should target a clear search intent, carry its own canonical URL, answer buyer objections, and connect to supporting case studies, pricing, process, contact, and blog pages.</p>
      <p>For modern React websites, technical SEO also depends on fast route loading, accessible headings, optimized media, and a metadata system that updates reliably as users move across regional routes.</p>
    `,
  },
  {
    id: 'regional-seo-for-sri-lanka-pakistan-global',
    title: 'Regional SEO for Sri Lanka, Pakistan, and Global Brands',
    slug: 'regional-seo-for-sri-lanka-pakistan-global',
    excerpt:
      'A multi-region SEO framework for serving Sri Lanka, Pakistan, and international buyers without creating thin duplicate pages.',
    featured_image: '/assets/logo.png',
    category: 'Regional SEO',
    author_name: 'Jawrah Pixel Strategy Team',
    author_role: 'Regional SEO Architecture',
    published_at: '2026-06-01',
    meta_title: 'Regional SEO for Sri Lanka, Pakistan, and Global Brands | Jawrah Pixel',
    meta_description:
      'Learn how hreflang, region-specific metadata, local service pages, and internal links support multi-region SEO.',
    region: 'global',
    tags: ['Regional SEO', 'Hreflang', 'Sri Lanka', 'Pakistan'],
    content: `
      <p>Multi-region SEO works when each region has genuine search value. Sri Lanka pages should speak to Sri Lankan buyer behavior, payment expectations, and local proof. Pakistan pages should reflect Pakistani ecommerce and mobile realities. International pages should explain remote-first delivery, USD pricing, and global standards.</p>
      <p>Hreflang helps search engines understand language and regional targeting, but it cannot fix thin pages. Strong regional SEO still needs unique metadata, service detail, FAQ content, internal links, and conversion paths that match the market.</p>
    `,
  },
  {
    id: 'core-web-vitals-for-agency-sites',
    title: 'Core Web Vitals for Agency Websites',
    slug: 'core-web-vitals-for-agency-sites',
    excerpt:
      'Why LCP, CLS, and INP matter for premium agency websites and how performance work supports trust, rankings, and conversion.',
    featured_image: '/assets/case-studies/jawrah-pixel/desktop.png',
    category: 'Performance',
    author_name: 'Jawrah Pixel Engineering Team',
    author_role: 'Web Performance',
    published_at: '2026-06-01',
    meta_title: 'Core Web Vitals for Agency Websites | Jawrah Pixel',
    meta_description:
      'A performance guide for agency websites covering LCP, CLS, INP, lazy loading, route splitting, and image optimization.',
    region: 'global',
    tags: ['Core Web Vitals', 'React', 'Vite', 'Performance'],
    content: `
      <p>Performance is part of brand perception. If a premium agency website feels slow, shifts during load, or delays interaction, the visual quality loses commercial force.</p>
      <p>React and Vite can support excellent Core Web Vitals when pages are split by route, large images are lazy-loaded, fonts are loaded carefully, and layout dimensions are stable before media arrives.</p>
      <p>Performance SEO is not a one-time checklist. It should be measured after launch, revisited when new pages are added, and protected during design iteration.</p>
    `,
  },
];

export function getFallbackBlogPosts(region?: string) {
  if (!region) return fallbackBlogPosts;
  return fallbackBlogPosts.filter((post) => post.region === 'global' || post.region === region);
}

export function getFallbackBlogPost(slug?: string) {
  if (!slug) return null;
  return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
}

export function getFallbackRelatedPosts(category: string, currentId: string) {
  return fallbackBlogPosts
    .filter((post) => post.category === category && post.id !== currentId)
    .slice(0, 3)
    .map((post) => ({
      title: post.title,
      slug: post.slug,
      featured_image: post.featured_image,
      published_at: post.published_at,
    }));
}
