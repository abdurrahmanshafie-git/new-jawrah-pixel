import { supabase, isSupabaseConfigured } from './client';
import type { Insert, Row, Update } from './database.types';

export type ProfileRole = Row<'profiles'>['role'];

function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are not configured for this deployment.');
  }
}

export async function getProfile(userId: string) {
  ensureConfigured();

  return supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
}

export async function getProfileRole(userId: string) {
  ensureConfigured();

  return supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
}

export async function submitInquiry(payload: Insert<'inquiries'>) {
  ensureConfigured();

  return supabase.from('inquiries').insert(payload).select('id').single();
}

export async function submitBooking(payload: Insert<'bookings'>) {
  ensureConfigured();

  return supabase.from('bookings').insert(payload).select('id').single();
}

export async function submitChatbotLead(payload: Insert<'chatbot_leads'>) {
  ensureConfigured();

  return supabase.from('chatbot_leads').insert(payload).select('id').single();
}

export async function fetchAdminWorkspace() {
  ensureConfigured();

  const [projects, inquiries, bookings, testimonials, blogPosts, subscribers] = await Promise.all([
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
    supabase.from('bookings').select('*').order('created_at', { ascending: false }),
    supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
    supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
    supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
  ]);

  return { projects, inquiries, bookings, testimonials, blogPosts, subscribers };
}

export async function fetchClientWorkspace(userId: string) {
  ensureConfigured();

  const [projects, bookings, revisionRequests, supportTickets] = await Promise.all([
    supabase.from('projects').select('*').eq('client_id', userId).order('updated_at', { ascending: false }),
    supabase.from('bookings').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('revision_requests').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
    supabase.from('support_tickets').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
  ]);

  return { projects, bookings, revisionRequests, supportTickets };
}

export async function updateRow<T extends 'inquiries' | 'bookings' | 'projects' | 'testimonials' | 'blog_posts'>(
  table: T,
  id: string,
  payload: Update<T>,
) {
  ensureConfigured();

  return supabase.from(table).update(payload as never).eq('id', id).select('id').single();
}
