import { supabase, isSupabaseConfigured } from './client';
import type { Insert, Row, Update } from './database.types';
import { sendLeadEmailNotification, type LeadEmailPayload } from '@/lib/email/leadEmails';
import { getReferralSource, getStoredReferral } from '@/lib/referral';
import {
  findFirstSupabaseQueryError,
  logSupabaseQuery,
  withSupabaseQueryContext,
} from './query-debug';

export type ProfileRole = Row<'profiles'>['role'];

function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are not configured for this deployment.');
  }
}

function createClientUuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function finalizeLeadEmail(payload: LeadEmailPayload, submissionId?: string | null): LeadEmailPayload {
  const requirements =
    payload.requirements ??
    ([payload.goals, payload.message, payload.notes].filter(Boolean).join('\n\n') || null);

  return {
    ...payload,
    submissionId: payload.submissionId ?? submissionId ?? null,
    platform: payload.platform ?? 'Jawrah Pixel Web',
    requirements,
    submissionTime: payload.submissionTime ?? new Date().toISOString(),
  };
}

async function notifyLeadEmail(payload: LeadEmailPayload, submissionId?: string | null) {
  try {
    const result = await sendLeadEmailNotification(finalizeLeadEmail(payload, submissionId));
    if (result.ok) {
      console.log('LEAD EMAIL SUCCESS');
      return;
    }

    console.error('[Email] Lead was saved, but notification email failed:', result.reason);
  } catch (error) {
    console.error('CONTACT FLOW ERROR:', error);
    console.error('[Email] Lead was saved, but notification email threw:', error);
  }
}

function inferInquiryFormType(payload: Insert<'inquiries'>): string {
  if (payload.service_interested === 'Agent Application') return 'Agent Application';
  if (payload.inquiry_type === 'project') return 'Project Brief Form';
  if (payload.inquiry_type === 'collaboration') return 'Agent Application';
  return 'Contact Form';
}

function inquiryToLeadEmail(payload: Insert<'inquiries'>): LeadEmailPayload {
  return {
    name: payload.full_name,
    email: payload.email,
    whatsapp: payload.whatsapp,
    country: payload.country,
    region: payload.region,
    service: payload.service_interested,
    budget: payload.budget_range,
    message: payload.message,
    notes: payload.notes,
    source: payload.source_page,
    formType: inferInquiryFormType(payload),
  };
}

function bookingToLeadEmail(payload: Insert<'bookings'>): LeadEmailPayload {
  return {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    whatsapp: payload.whatsapp,
    country: payload.country,
    region: payload.region,
    service: payload.project_type,
    timeline: [payload.preferred_date, payload.preferred_time].filter(Boolean).join(' '),
    message: payload.message,
    source: payload.region,
    formType: 'Strategy Call Booking',
  };
}

function chatbotToLeadEmail(payload: Insert<'chatbot_leads'>): LeadEmailPayload {
  return {
    name: payload.name,
    whatsapp: payload.whatsapp,
    country: payload.country,
    service: payload.project_type,
    budget: payload.budget_range,
    message: payload.message,
    notes: payload.business_type ? `Business Type: ${payload.business_type}` : undefined,
    source: 'JawrahBot',
    formType: 'Chatbot Lead Capture',
  };
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

async function attachStoredReferralToInquiry(inquiryId: string) {
  const stored = getStoredReferral();
  if (!stored?.agentCode) return;

  const { data } = await supabase.rpc('resolve_agent_referral', { p_code: stored.agentCode });
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.agent_id) return;

  await supabase
    .from('inquiries')
    .update({
      agent_code: row.agent_code,
      agent_id: row.agent_id,
      referral_source: getReferralSource() || stored.landingPath || 'referral',
    })
    .eq('id', inquiryId);
}

export async function submitInquiry(payload: Insert<'inquiries'>, leadEmail?: LeadEmailPayload) {
  ensureConfigured();

  const inquiryId = payload.id ?? createClientUuid();
  const result = await supabase.from('inquiries').insert({ ...payload, id: inquiryId });
  if (!result.error) {
    console.log('INQUIRY INSERT SUCCESS');
    void attachStoredReferralToInquiry(inquiryId);
    void notifyLeadEmail(leadEmail ?? inquiryToLeadEmail(payload), inquiryId);
    return { ...result, data: { id: inquiryId }, error: null };
  }

  return result;
}

export async function submitBooking(payload: Insert<'bookings'>, leadEmail?: LeadEmailPayload) {
  ensureConfigured();

  const result = await supabase.from('bookings').insert(payload).select('id').single();
  if (!result.error) {
    await notifyLeadEmail(leadEmail ?? bookingToLeadEmail(payload), result.data?.id);
  }

  return result;
}

export async function submitChatbotLead(
  payload: Insert<'chatbot_leads'>,
  leadEmail?: LeadEmailPayload,
  captchaToken?: string | null,
) {
  ensureConfigured();

  const result = await supabase.from('chatbot_leads').insert(payload).select('id').single();
  if (!result.error) {
    const finalLeadEmail = leadEmail ?? chatbotToLeadEmail(payload);
    if (captchaToken) finalLeadEmail.captcha_token = captchaToken;
    await notifyLeadEmail(finalLeadEmail, result.data?.id);
  }

  return result;
}

export async function fetchAdminLeads() {
  ensureConfigured();
  return logSupabaseQuery(
    'dashboard_service.inquiries',
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
  );
}

export async function fetchChatbotLeads() {
  ensureConfigured();
  return logSupabaseQuery(
    'dashboard_service.chatbot_leads',
    supabase.from('chatbot_leads').select('*').order('created_at', { ascending: false }),
  );
}

export async function updateLeadStatus(id: string, status: Row<'inquiries'>['status']) {
  ensureConfigured();
  return supabase.from('inquiries').update({ status }).eq('id', id);
}

export async function updateChatbotLeadStatus(id: string, status: Row<'chatbot_leads'>['status']) {
  ensureConfigured();
  return supabase.from('chatbot_leads').update({ status }).eq('id', id);
}

export async function fetchAdminInvoices() {
  ensureConfigured();
  return logSupabaseQuery(
    'dashboard_service.invoices',
    supabase
      .from('invoices')
      .select('*, client:profiles(full_name, email), project:projects(title)')
      .order('created_at', { ascending: false }),
  );
}

export async function updateInvoice(id: string, payload: Update<'invoices'>) {
  ensureConfigured();
  
  const updatePayload: Update<'invoices'> = { ...payload };
  
  if (payload.amount !== undefined) {
    const safeAmount = Math.max(0, Number(payload.amount) || 0);
    updatePayload.amount = Math.min(safeAmount, 9999999999.99);
  }

  const { data, error } = await supabase.from('invoices').update(updatePayload).eq('id', id).select('id').single();

  if (error) {
    console.error('[Supabase] Failed to update invoice:', {
      error,
      id,
      payload: updatePayload
    });
  }

  return { data, error };
}

export type DepositInvoiceInput = {
  client_id?: string | null;
  guest_email?: string | null;
  guest_name?: string | null;
  project_id?: string | null;
  invoice_number: string;
  title: string;
  amount: number;
  currency: string;
  status?: Insert<'invoices'>['status'];
  payment_status?: Insert<'invoices'>['payment_status'];
  payment_method?: Insert<'invoices'>['payment_method'];
  transaction_id?: string | null;
  due_date?: string | null;
  project_value?: number;
  deposit_percentage?: number;
  deposit_amount?: number;
  remaining_balance?: number;
  amount_due_now?: number;
  current_milestone?: string;
  region?: Insert<'invoices'>['region'];
  milestones?: Array<{
    milestone_key: string;
    label: string;
    percentage: number;
    amount: number;
    sort_order: number;
  }>;
};

export async function createDepositInvoice(payload: DepositInvoiceInput) {
  ensureConfigured();

  if (!payload.client_id && !payload.guest_email) {
    throw new Error('A client account or guest email is required to create an invoice.');
  }

  // Sanitize amount to prevent numeric field overflow or NaN errors
  const safeAmount = Math.max(0, Number(payload.amount) || 0);
  
  // Ensure amount doesn't exceed 10 billion (max for numeric(12,2))
  const cappedAmount = Math.min(safeAmount, 9999999999.99);

  const insertPayload = {
    client_id: payload.client_id ?? null,
    guest_email: payload.guest_email ?? null,
    guest_name: payload.guest_name ?? null,
    project_id: payload.project_id ?? null,
    invoice_number: payload.invoice_number,
    title: payload.title,
    amount: Math.min(payload.amount_due_now ?? cappedAmount, 9999999999.99),
    currency: payload.currency,
    status: payload.status ?? 'pending',
    payment_status: payload.payment_status ?? 'pending',
    payment_method: payload.payment_method ?? null,
    transaction_id: payload.transaction_id ?? null,
    due_date: payload.due_date ?? null,
    project_value: payload.project_value ?? cappedAmount,
    deposit_percentage: payload.deposit_percentage ?? 10,
    deposit_amount: payload.deposit_amount ?? null,
    remaining_balance: payload.remaining_balance ?? null,
    amount_due_now: payload.amount_due_now ?? cappedAmount,
    current_milestone: payload.current_milestone ?? 'deposit',
    region: payload.region ?? null,
  };

  const { data, error } = await supabase
    .from('invoices')
    .insert(insertPayload)
    .select('id, invoice_number')
    .single();

  if (!error && data?.id && payload.milestones?.length) {
    await supabase.from('invoice_billing_milestones').insert(
      payload.milestones.map((m) => ({
        invoice_id: data.id,
        milestone_key: m.milestone_key,
        label: m.label,
        percentage: m.percentage,
        amount: m.amount,
        status: 'pending',
        sort_order: m.sort_order,
      })),
    );
  }

  if (error) {
    console.error('[Supabase] Failed to create invoice:', {
      error,
      payload: insertPayload,
      originalAmount: payload.amount
    });
  }

  return { data, error };
}

export async function fetchDashboardAnalytics() {
  ensureConfigured();

  const [leads, bookings, projects, invoices] = await Promise.all([
    logSupabaseQuery('dashboard_analytics.inquiries', supabase.from('inquiries').select('status, created_at')),
    logSupabaseQuery('dashboard_analytics.bookings', supabase.from('bookings').select('id', { count: 'exact', head: true })),
    logSupabaseQuery('dashboard_analytics.projects', supabase.from('projects').select('status, price')),
    logSupabaseQuery('dashboard_analytics.invoices', supabase.from('invoices').select('status, payment_status, amount')),
  ]);

  const firstError = findFirstSupabaseQueryError([
    { table: 'dashboard_analytics.inquiries', error: leads.error },
    { table: 'dashboard_analytics.bookings', error: bookings.error },
    { table: 'dashboard_analytics.projects', error: projects.error },
    { table: 'dashboard_analytics.invoices', error: invoices.error },
  ]);

  if (firstError?.error) throw withSupabaseQueryContext(firstError.table, firstError.error);

  const totalLeads = leads.data?.length || 0;
  const newInquiries = leads.data?.filter((l) => l.status === 'new').length || 0;
  const activeProjects = projects.data?.filter((p) => !['lead', 'completed'].includes(p.status)).length || 0;
  const completedProjects = projects.data?.filter((p) => p.status === 'completed').length || 0;

  const totalRevenue = projects.data?.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) || 0;
  const paidInvoices =
    invoices.data?.filter((inv) => inv.status === 'paid' || inv.payment_status === 'paid').length || 0;

  return {
    totalLeads,
    newInquiries,
    activeProjects,
    completedProjects,
    totalRevenue,
    paidInvoices,
    totalBookings: bookings.count || 0,
    leadsByStatus: leads.data?.reduce((acc: Record<string, number>, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {}),
    rawProjects: projects.data,
  };
}

export async function createProject(payload: Insert<'projects'>) {
  ensureConfigured();
  
  // Sanitize price to prevent numeric field overflow
  const safePrice = Math.max(0, Number(payload.price) || 0);
  const cappedPrice = Math.min(safePrice, 9999999999.99);

  const insertPayload = {
    ...payload,
    price: cappedPrice
  };

  const { data, error } = await supabase.from('projects').insert(insertPayload).select('id').single();

  if (error) {
    console.error('[Supabase] Failed to create project:', {
      error,
      payload: insertPayload,
      originalPrice: payload.price
    });
  }

  return { data, error };
}

export async function fetchProjects() {
  ensureConfigured();
  return logSupabaseQuery(
    'dashboard_service.projects',
    supabase
      .from('projects')
      .select('*, client:profiles!projects_client_id_fkey(*)')
      .order('created_at', { ascending: false }),
  );
}

export async function updateProject(id: string, payload: Update<'projects'>) {
  ensureConfigured();
  
  const updatePayload: Update<'projects'> = { ...payload };
  
  if (payload.price !== undefined) {
    const safePrice = Math.max(0, Number(payload.price) || 0);
    updatePayload.price = Math.min(safePrice, 9999999999.99);
  }

  const { data, error } = await supabase.from('projects').update(updatePayload).eq('id', id).select('id').single();

  if (error) {
    console.error('[Supabase] Failed to update project:', {
      error,
      id,
      payload: updatePayload
    });
  }

  return { data, error };
}

export async function fetchClients() {
  ensureConfigured();
  return logSupabaseQuery(
    'dashboard_service.profiles',
    supabase.from('profiles').select('*').eq('role', 'client').order('created_at', { ascending: false }),
  );
}

export async function fetchAdminWorkspace() {
  ensureConfigured();

  const [projects, inquiries, bookings, testimonials, blogPosts, subscribers, invoices, chatbotLeads] =
    await Promise.all([
      logSupabaseQuery('admin_workspace.projects', supabase.from('projects').select('*').order('created_at', { ascending: false })),
      logSupabaseQuery('admin_workspace.inquiries', supabase.from('inquiries').select('*').order('created_at', { ascending: false })),
      logSupabaseQuery('admin_workspace.bookings', supabase.from('bookings').select('*').order('created_at', { ascending: false })),
      logSupabaseQuery('admin_workspace.testimonials', supabase.from('testimonials').select('*').order('created_at', { ascending: false })),
      logSupabaseQuery('admin_workspace.blog_posts', supabase.from('blog_posts').select('*').order('created_at', { ascending: false })),
      logSupabaseQuery(
        'admin_workspace.newsletter_subscribers',
        supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
      ),
      logSupabaseQuery(
        'admin_workspace.invoices',
        supabase
          .from('invoices')
          .select('*, client:profiles(full_name, email)')
          .order('created_at', { ascending: false }),
      ),
      logSupabaseQuery(
        'admin_workspace.chatbot_leads',
        supabase.from('chatbot_leads').select('*').order('created_at', { ascending: false }),
      ),
    ]);

  const firstError = findFirstSupabaseQueryError([
    { table: 'admin_workspace.projects', error: projects.error },
    { table: 'admin_workspace.inquiries', error: inquiries.error },
    { table: 'admin_workspace.bookings', error: bookings.error },
    { table: 'admin_workspace.testimonials', error: testimonials.error },
    { table: 'admin_workspace.blog_posts', error: blogPosts.error },
    { table: 'admin_workspace.newsletter_subscribers', error: subscribers.error },
    { table: 'admin_workspace.invoices', error: invoices.error },
    { table: 'admin_workspace.chatbot_leads', error: chatbotLeads.error },
  ]);

  if (firstError?.error) throw withSupabaseQueryContext(firstError.table, firstError.error);

  return { projects, inquiries, bookings, testimonials, blogPosts, subscribers, invoices, chatbotLeads };
}

export async function fetchClientWorkspace(userId: string) {
  ensureConfigured();

  const [projects, bookings, revisionRequests, supportTickets, invoices, files, notifications] = await Promise.all([
    logSupabaseQuery(
      'client_workspace.projects',
      supabase.from('projects').select('*').eq('client_id', userId).order('updated_at', { ascending: false }),
    ),
    logSupabaseQuery(
      'client_workspace.bookings',
      supabase.from('bookings').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ),
    logSupabaseQuery(
      'client_workspace.revision_requests',
      supabase.from('revision_requests').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
    ),
    logSupabaseQuery(
      'client_workspace.support_tickets',
      supabase.from('support_tickets').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
    ),
    logSupabaseQuery(
      'client_workspace.invoices',
      supabase.from('invoices').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
    ),
    logSupabaseQuery(
      'client_workspace.project_files',
      supabase.from('project_files').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
    ),
    logSupabaseQuery(
      'client_workspace.notifications',
      supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ),
  ]);

  const firstError = findFirstSupabaseQueryError([
    { table: 'client_workspace.projects', error: projects.error },
    { table: 'client_workspace.bookings', error: bookings.error },
    { table: 'client_workspace.revision_requests', error: revisionRequests.error },
    { table: 'client_workspace.support_tickets', error: supportTickets.error },
    { table: 'client_workspace.invoices', error: invoices.error },
    { table: 'client_workspace.project_files', error: files.error },
    { table: 'client_workspace.notifications', error: notifications.error },
  ]);

  if (firstError?.error) throw withSupabaseQueryContext(firstError.table, firstError.error);

  const projectIds = projects.data?.map((project) => project.id) ?? [];
  const milestones = projectIds.length
    ? await logSupabaseQuery(
        'client_workspace.project_milestones',
        supabase
          .from('project_milestones')
          .select('*')
          .in('project_id', projectIds)
          .order('sort_order', { ascending: true }),
      )
    : { data: [], error: null };

  if (milestones.error) throw withSupabaseQueryContext('client_workspace.project_milestones', milestones.error);

  return { projects, bookings, revisionRequests, supportTickets, invoices, files, notifications, milestones };
}

export async function submitRevisionRequest(payload: Insert<'revision_requests'>) {
  ensureConfigured();
  return supabase.from('revision_requests').insert(payload).select('id').single();
}

export async function submitSupportTicket(payload: Insert<'support_tickets'>) {
  ensureConfigured();
  return supabase.from('support_tickets').insert(payload).select('id').single();
}

export async function recordAuditEvent(payload: Insert<'audit_events'>) {
  ensureConfigured();
  return supabase.from('audit_events').insert(payload);
}

export async function createNotification(payload: Insert<'notifications'>) {
  ensureConfigured();
  return supabase.from('notifications').insert(payload);
}

export async function fetchAdminSupportTickets() {
  ensureConfigured();
  return logSupabaseQuery(
    'dashboard_service.support_tickets',
    supabase
      .from('support_tickets')
      .select('*, client:profiles(full_name, email)')
      .order('created_at', { ascending: false }),
  );
}

export async function updateRow<T extends 'inquiries' | 'bookings' | 'projects' | 'testimonials' | 'blog_posts'>(
  table: T,
  id: string,
  payload: Update<T>,
) {
  ensureConfigured();

  return supabase.from(table).update(payload as never).eq('id', id).select('id').single();
}
