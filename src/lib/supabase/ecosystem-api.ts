import { supabase, isSupabaseConfigured } from './client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Insert, Row, Update } from './database.types';
import { projectProgressFromStatus } from '@/lib/platform/ecosystem';
import { sendLeadEmailNotification, type LeadEmailPayload } from '@/lib/email/leadEmails';

function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are not configured for this deployment.');
  }
}

function proposalNumber(): string {
  return `JP-PROP-${Date.now().toString().slice(-8)}`;
}

function invoiceNumber(): string {
  return `JP-INV-${Date.now().toString().slice(-8)}`;
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export async function fetchBusinessAnalytics() {
  ensureConfigured();

  const [leads, clients, projects, invoices, proposals, applications] = await Promise.all([
    supabase.from('inquiries').select('status, region, service_interested, created_at'),
    supabase.from('profiles').select('id, region, created_at').eq('role', 'client'),
    supabase.from('projects').select('status, region, service_type, price, created_at'),
    supabase.from('invoices').select('status, payment_status, amount, currency, created_at'),
    supabase.from('proposals').select('status, region, pricing, currency, created_at'),
    supabase.from('agent_applications').select('status, region, created_at'),
  ]);

  const leadRows = leads.data ?? [];
  const clientRows = clients.data ?? [];
  const projectRows = projects.data ?? [];
  const invoiceRows = invoices.data ?? [];

  const totalLeads = leadRows.length;
  const totalClients = clientRows.length;
  const totalProjects = projectRows.length;
  const wonLeads = leadRows.filter((l) => l.status === 'won').length;
  const conversionRate = totalLeads ? Math.round((wonLeads / totalLeads) * 100) : 0;

  const paidRevenue = invoiceRows
    .filter((inv) => inv.status === 'paid' || inv.payment_status === 'paid')
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

  const contractedRevenue = projectRows.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  const regionBreakdown = ['lk', 'pk', 'int'].map((region) => ({
    region,
    leads: leadRows.filter((l) => l.region === region).length,
    clients: clientRows.filter((c) => c.region === region).length,
    projects: projectRows.filter((p) => p.region === region).length,
  }));

  const leadSources = leadRows.reduce<Record<string, number>>((acc, lead) => {
    const key = lead.service_interested || 'General';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const projectTypes = projectRows.reduce<Record<string, number>>((acc, project) => {
    const key = project.service_type || 'Custom';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const monthlyGrowth = clientRows.reduce<Record<string, number>>((acc, client) => {
    const month = client.created_at.slice(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  return {
    totalLeads,
    totalClients,
    totalProjects,
    conversionRate,
    paidRevenue,
    contractedRevenue,
    regionBreakdown,
    leadSources,
    projectTypes,
    monthlyGrowth,
    leadsByStatus: leadRows.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {}),
    activeProjects: projectRows.filter((p) => !['lead', 'completed'].includes(p.status)).length,
    completedProjects: projectRows.filter((p) => p.status === 'completed').length,
    pendingApplications: (applications.data ?? []).filter((a) => a.status === 'pending').length,
    rawProjects: projectRows,
  };
}

// ---------------------------------------------------------------------------
// Project tracking
// ---------------------------------------------------------------------------

export async function createProjectUpdate(payload: Insert<'project_updates'>) {
  ensureConfigured();
  const result = await supabase.from('project_updates').insert(payload).select('*').single();

  if (!result.error && payload.project_id) {
    await supabase
      .from('projects')
      .update({
        status: payload.status,
        progress: payload.progress ?? projectProgressFromStatus(payload.status),
        estimated_completion: payload.estimated_completion ?? undefined,
        assigned_to: payload.assigned_to ?? undefined,
      })
      .eq('id', payload.project_id);

    const project = await supabase.from('projects').select('client_id, title').eq('id', payload.project_id).single();
    if (project.data?.client_id) {
      await notifyUser(
        project.data.client_id,
        'Project Update',
        `${project.data.title}: ${payload.title}`,
      );
    }
  }

  return result;
}

export async function fetchProjectUpdates(projectId: string) {
  ensureConfigured();
  return supabase
    .from('project_updates')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
}

export async function fetchClientProjectUpdates(clientId: string) {
  ensureConfigured();
  const projects = await supabase.from('projects').select('id').eq('client_id', clientId);
  const ids = projects.data?.map((p) => p.id) ?? [];
  if (!ids.length) return { data: [], error: null };

  return supabase
    .from('project_updates')
    .select('*, project:projects(title)')
    .in('project_id', ids)
    .order('created_at', { ascending: false })
    .limit(20);
}

// ---------------------------------------------------------------------------
// CRM
// ---------------------------------------------------------------------------

export async function updateCrmLead(id: string, payload: Update<'inquiries'>) {
  ensureConfigured();
  return supabase.from('inquiries').update(payload).eq('id', id).select('*').single();
}

export async function fetchCrmLeadDetail(id: string) {
  ensureConfigured();
  return supabase
    .from('inquiries')
    .select('*')
    .eq('id', id)
    .single();
}

export async function fetchClientCrmHistory(email: string) {
  ensureConfigured();
  const [inquiries, bookings, projects, invoices, proposals] = await Promise.all([
    supabase.from('inquiries').select('*').eq('email', email).order('created_at', { ascending: false }),
    supabase.from('bookings').select('*').eq('email', email).order('created_at', { ascending: false }),
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase.from('invoices').select('*').order('created_at', { ascending: false }),
    supabase.from('proposals').select('*').order('created_at', { ascending: false }),
  ]);

  return { inquiries, bookings, projects, invoices, proposals };
}

// ---------------------------------------------------------------------------
// Proposals
// ---------------------------------------------------------------------------

export async function createProposal(payload: Omit<Insert<'proposals'>, 'proposal_number'>) {
  ensureConfigured();
  return supabase
    .from('proposals')
    .insert({ ...payload, proposal_number: proposalNumber() })
    .select('*')
    .single();
}

export async function fetchProposals() {
  ensureConfigured();
  return supabase
    .from('proposals')
    .select('*, client:profiles(full_name, email), project:projects(title)')
    .order('created_at', { ascending: false });
}

export async function fetchClientProposals(clientId: string) {
  ensureConfigured();
  return supabase
    .from('proposals')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
}

export async function updateProposal(id: string, payload: Update<'proposals'>) {
  ensureConfigured();
  return supabase.from('proposals').update(payload).eq('id', id).select('*').single();
}

export async function sendProposal(id: string, emailPayload?: LeadEmailPayload) {
  ensureConfigured();
  const result = await supabase
    .from('proposals')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, client:profiles(full_name, email)')
    .single();

  if (!result.error && emailPayload) {
    await sendLeadEmailNotification({
      ...emailPayload,
      formType: 'Proposal Sent',
    });
  }

  const clientId = (result.data as { client_id?: string | null })?.client_id;
  if (!result.error && clientId) {
    await notifyUser(clientId, 'Proposal Sent', 'A new proposal is ready for your review.');
  }

  return result;
}

export async function acceptProposal(id: string, clientId: string) {
  ensureConfigured();
  return supabase
    .from('proposals')
    .update({ status: 'accepted', accepted_at: new Date().toISOString(), viewed_at: new Date().toISOString() })
    .eq('id', id)
    .eq('client_id', clientId)
    .select('*')
    .single();
}

// ---------------------------------------------------------------------------
// Invoices (admin create)
// ---------------------------------------------------------------------------

export async function createAdminInvoice(payload: Omit<Insert<'invoices'>, 'invoice_number'>) {
  ensureConfigured();
  const result = await supabase
    .from('invoices')
    .insert({ ...payload, invoice_number: invoiceNumber() })
    .select('*')
    .single();

  if (!result.error && result.data?.client_id) {
    await notifyUser(
      result.data.client_id,
      'Invoice Created',
      `Invoice ${result.data.invoice_number} is ready to view.`,
    );
  }

  return result;
}

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

export async function fetchMessageThreads(clientId?: string) {
  ensureConfigured();
  let query = supabase
    .from('message_threads')
    .select('*, client:profiles(full_name, email), project:projects(title)')
    .order('updated_at', { ascending: false });

  if (clientId) query = query.eq('client_id', clientId);
  return query;
}

export async function fetchThreadMessages(threadId: string) {
  ensureConfigured();
  return supabase
    .from('messages')
    .select('*, sender:profiles(full_name, role)')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
}

export async function createMessageThread(payload: Insert<'message_threads'>, initialMessage: string, senderId: string) {
  ensureConfigured();
  const thread = await supabase.from('message_threads').insert(payload).select('*').single();
  if (thread.error || !thread.data) return thread;

  await supabase.from('messages').insert({
    thread_id: thread.data.id,
    sender_id: senderId,
    body: initialMessage,
  });

  await supabase
    .from('message_threads')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', thread.data.id);

  return thread;
}

export async function sendThreadMessage(threadId: string, senderId: string, body: string, attachmentPath?: string) {
  ensureConfigured();
  const result = await supabase
    .from('messages')
    .insert({
      thread_id: threadId,
      sender_id: senderId,
      body,
      attachment_path: attachmentPath ?? null,
    })
    .select('*')
    .single();

  if (!result.error) {
    await supabase
      .from('message_threads')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', threadId);

    const thread = await supabase.from('message_threads').select('client_id').eq('id', threadId).single();
    if (thread.data?.client_id && thread.data.client_id !== senderId) {
      await notifyUser(thread.data.client_id, 'Message Received', body.slice(0, 120));
    } else if (thread.data?.client_id === senderId) {
      const admins = await supabase.from('profiles').select('id').eq('role', 'admin');
      for (const admin of admins.data ?? []) {
        await notifyUser(admin.id, 'Message Received', body.slice(0, 120));
      }
    }
  }

  return result;
}

export async function markMessagesRead(threadId: string, readerId: string) {
  ensureConfigured();
  return supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('thread_id', threadId)
    .neq('sender_id', readerId)
    .is('read_at', null);
}

// ---------------------------------------------------------------------------
// Agent applications
// ---------------------------------------------------------------------------

export async function createAgentApplication(payload: Insert<'agent_applications'>) {
  ensureConfigured();
  return supabase.from('agent_applications').insert(payload).select('*').single();
}

export async function fetchAgentApplications() {
  ensureConfigured();
  return supabase.from('agent_applications').select('*').order('created_at', { ascending: false });
}

export async function updateAgentApplication(id: string, payload: Update<'agent_applications'>) {
  ensureConfigured();
  const result = await supabase.from('agent_applications').update(payload).eq('id', id).select('*').single();

  if (!result.error && result.data && payload.status) {
    const profile = await supabase
      .from('profiles')
      .select('id')
      .eq('email', result.data.applicant_email)
      .maybeSingle();

    if (profile.data?.id) {
      await notifyUser(
        profile.data.id,
        'Agent Status Updated',
        `Your application status is now: ${payload.status}.`,
      );
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------

const FILE_BUCKET = 'project-files';

export async function uploadProjectFile(params: {
  clientId: string;
  projectId?: string | null;
  file: File;
  category?: Row<'project_files'>['file_category'];
  uploadedBy: string;
}) {
  ensureConfigured();

  const safeName = params.file.name.replace(/[^\w.\-]+/g, '_');
  const storagePath = `${params.clientId}/${params.projectId ?? 'general'}/${Date.now()}-${safeName}`;

  const upload = await supabase.storage.from(FILE_BUCKET).upload(storagePath, params.file, {
    upsert: false,
    contentType: params.file.type || undefined,
  });

  if (upload.error) return { data: null, error: upload.error };

  const record = await supabase
    .from('project_files')
    .insert({
      client_id: params.clientId,
      project_id: params.projectId ?? null,
      file_name: params.file.name,
      storage_path: storagePath,
      mime_type: params.file.type || null,
      size_bytes: params.file.size,
      uploaded_by: params.uploadedBy,
      file_category: params.category ?? 'project',
    })
    .select('*')
    .single();

  if (!record.error) {
    await notifyUser(params.clientId, 'File Uploaded', `${params.file.name} was added to your workspace.`);
  }

  return record;
}

export async function getProjectFileUrl(storagePath: string, expiresIn = 3600) {
  ensureConfigured();
  return supabase.storage.from(FILE_BUCKET).createSignedUrl(storagePath, expiresIn);
}

export async function deleteProjectFile(fileId: string, storagePath: string) {
  ensureConfigured();
  await supabase.storage.from(FILE_BUCKET).remove([storagePath]);
  return supabase.from('project_files').delete().eq('id', fileId);
}

export function downloadInvoiceRecord(invoice: {
  invoice_number?: string;
  title?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  due_date?: string | null;
  created_at?: string;
}) {
  const lines = [
    'JAWRAH PIXEL — INVOICE',
    '========================',
    `Invoice Number: ${invoice.invoice_number || 'N/A'}`,
    `Issue Date: ${invoice.created_at?.split('T')[0] || 'N/A'}`,
    `Due Date: ${invoice.due_date || 'N/A'}`,
    `Status: ${invoice.status || 'pending'}`,
    `Amount: ${invoice.currency || 'LKR'} ${Number(invoice.amount || 0).toLocaleString()}`,
    `Service: ${invoice.title || 'Professional Services'}`,
    '',
    'Premium Digital Experiences',
    'jawrahpixel.com',
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${invoice.invoice_number || 'invoice'}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export async function fetchNotifications(userId: string) {
  ensureConfigured();
  return supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export async function markNotificationRead(id: string) {
  ensureConfigured();
  return supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
}

export async function markAllNotificationsRead(userId: string) {
  ensureConfigured();
  return supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null);
}

export async function notifyUser(userId: string, title: string, body?: string) {
  ensureConfigured();
  return supabase.from('notifications').insert({ user_id: userId, title, body: body ?? null });
}

export function subscribeToNotifications(userId: string, onChange: () => void): RealtimeChannel {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      () => onChange(),
    )
    .subscribe();
}

// ---------------------------------------------------------------------------
// Extended client workspace
// ---------------------------------------------------------------------------

export async function fetchExtendedClientWorkspace(userId: string) {
  ensureConfigured();

  const [base, proposals, threads, updates] = await Promise.all([
    import('./api').then((m) => m.fetchClientWorkspace(userId)),
    fetchClientProposals(userId),
    fetchMessageThreads(userId),
    fetchClientProjectUpdates(userId),
  ]);

  return {
    ...base,
    proposals,
    threads,
    updates,
  };
}

export async function updateSupportTicketStatus(id: string, status: Row<'support_tickets'>['status']) {
  ensureConfigured();
  return supabase.from('support_tickets').update({ status }).eq('id', id).select('*').single();
}

export async function updateRevisionStatus(id: string, status: Row<'revision_requests'>['status']) {
  ensureConfigured();
  return supabase.from('revision_requests').update({ status }).eq('id', id).select('*').single();
}

export async function createProjectMilestone(payload: Insert<'project_milestones'>) {
  ensureConfigured();
  return supabase.from('project_milestones').insert(payload).select('*').single();
}

export async function updateProjectMilestone(id: string, payload: Update<'project_milestones'>) {
  ensureConfigured();
  return supabase.from('project_milestones').update(payload).eq('id', id).select('*').single();
}

export async function deleteProjectMilestone(id: string) {
  ensureConfigured();
  return supabase.from('project_milestones').delete().eq('id', id);
}
