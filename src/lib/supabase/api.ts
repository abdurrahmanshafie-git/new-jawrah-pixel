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
    .select('role, region')
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

export async function fetchAdminLeads() {
  ensureConfigured();
  return supabase.from('inquiries').select('*').order('created_at', { ascending: false });
}

export async function updateLeadStatus(id: string, status: Row<'inquiries'>['status']) {
  ensureConfigured();
  return supabase.from('inquiries').update({ status }).eq('id', id);
}

export async function fetchDashboardAnalytics() {
  ensureConfigured();
  
  const [leads, inquiries, bookings, projects] = await Promise.all([
    supabase.from('inquiries').select('status, created_at'),
    supabase.from('inquiries').select('id', { count: 'exact' }),
    supabase.from('bookings').select('id', { count: 'exact' }),
    supabase.from('projects').select('status, price'),
  ]);

  const totalLeads = leads.data?.length || 0;
  const newInquiries = leads.data?.filter(l => l.status === 'new').length || 0;
  const activeProjects = projects.data?.filter(p => p.status === 'project active').length || 0;
  const completedProjects = projects.data?.filter(p => p.status === 'delivered').length || 0;
  
  const totalRevenue = projects.data?.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) || 0;

  return {
    totalLeads,
    newInquiries,
    activeProjects,
    completedProjects,
    totalRevenue,
    leadsByStatus: leads.data?.reduce((acc: any, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {}),
    rawProjects: projects.data
  };
}

export async function createProject(payload: Insert<'projects'>) {
  ensureConfigured();
  return supabase.from('projects').insert(payload).select('id').single();
}

export async function fetchProjects() {
  ensureConfigured();
  return supabase.from('projects').select('*, client:profiles(*)').order('created_at', { ascending: false });
}

export async function updateProject(id: string, payload: Update<'projects'>) {
  ensureConfigured();
  return supabase.from('projects').update(payload).eq('id', id);
}

export async function fetchClients() {
  ensureConfigured();
  return supabase.from('profiles').select('*').eq('role', 'client').order('created_at', { ascending: false });
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

  const [projects, bookings, revisionRequests, supportTickets, invoices, files, notifications] = await Promise.all([
    supabase.from('projects').select('*').eq('client_id', userId).order('updated_at', { ascending: false }),
    supabase.from('bookings').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('revision_requests').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
    supabase.from('support_tickets').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
    supabase.from('invoices').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
    supabase.from('project_files').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
    supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
  ]);

  const projectIds = projects.data?.map((project) => project.id) ?? [];
  const milestones = projectIds.length
    ? await supabase
        .from('project_milestones')
        .select('*')
        .in('project_id', projectIds)
        .order('sort_order', { ascending: true })
    : { data: [], error: null };

  return { projects, bookings, revisionRequests, supportTickets, invoices, files, notifications, milestones };
}

export async function updateRow<T extends 'inquiries' | 'bookings' | 'projects' | 'testimonials' | 'blog_posts'>(
  table: T,
  id: string,
  payload: Update<T>,
) {
  ensureConfigured();

  return supabase.from(table).update(payload as never).eq('id', id).select('id').single();
}
