import { supabase } from './client';
import type { RegionCode } from '@/types';

export interface Testimonial {
  id: string;
  client_name: string;
  company_name: string;
  rating: number;
  review: string;
  region: RegionCode | 'global';
  featured: boolean;
  avatar_url?: string;
  created_at: string;
}

/**
 * Fetch featured testimonials for a specific region or global
 */
export async function fetchTestimonials(region?: RegionCode) {
  let query = supabase
    .from('testimonials')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (region) {
    query = query.or(`region.eq.${region},region.eq.global`);
  }

  const { data, error } = await query;
  return { data: data as Testimonial[], error };
}

/**
 * Admin: Add a new testimonial
 */
export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('testimonials')
    .insert([testimonial])
    .select();
  return { data, error };
}

/**
 * Admin: Delete a testimonial
 */
export async function deleteTestimonial(id: string) {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);
  return { error };
}
