import { supabase } from './client';
import type { RegionCode } from '@/types';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  author_name: string;
  author_role: string;
  published_at: string;
  meta_title?: string;
  meta_description?: string;
  region: RegionCode | 'global';
  tags: string[];
}

/**
 * Fetch all blog posts for a region or global
 */
export async function fetchBlogPosts(region?: RegionCode) {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (region) {
    query = query.or(`region.eq.${region},region.eq.global`);
  }

  const { data, error } = await query;
  return { data: data as BlogPost[], error };
}

/**
 * Fetch a single blog post by slug
 */
export async function fetchBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  return { data: data as BlogPost, error };
}

/**
 * Fetch related posts
 */
export async function fetchRelatedPosts(category: string, currentId: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('title, slug, featured_image, published_at')
    .eq('category', category)
    .neq('id', currentId)
    .limit(3);
  
  return { data, error };
}
