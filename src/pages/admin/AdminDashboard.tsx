import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { fetchBusinessAnalytics } from '@/lib/supabase/ecosystem-api';
import { getSupabaseErrorMessage, logSupabaseQuery, logSupabaseTask } from '@/lib/supabase/query-debug';
import { AdminAnalyticsExtras, AdminEcosystemPanels } from '@/components/ecosystem/AdminEcosystemPanels';
import { BotAnalyticsDashboard } from '@/components/ecosystem/BotAnalytics';
import { BotTrainingCenter } from '@/components/ecosystem/BotTrainingCenter';
import { ADMIN_AGENT_WORKSPACE_TABS, AdminAgentNetworkPanel } from '@/components/ecosystem/AdminAgentNetworkPanel';
import { AdminInvoiceCreatePanel } from '@/components/ecosystem/AdminInvoiceCreatePanel';
import { BillingPdfActions } from '@/components/billing/BillingPdfActions';
import {
  adminApproveManualPayment,
  adminRejectManualPayment,
  adminRequestUpdatedReceipt,
  completeInvoicePayment,
  fetchPaymentVerificationQueue,
  getPaymentProofSignedUrl,
} from '@/lib/supabase/billing-api';
import { adminFetchAgents } from '@/lib/supabase/agent-api';
import { formatCurrencyAmount } from '@/lib/billing/format';
import { paymentStatusLabel } from '@/lib/billing/calculations';
import { CRM_PIPELINE, PROJECT_LIFECYCLE } from '@/lib/platform/ecosystem';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Activity, 
  Users, 
  FileText, 
  Calendar, 
  Loader, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  ChevronRight, 
  Settings,
  MessageSquare,
  DollarSign,
  Briefcase,
  ShieldAlert,
  X,
  BrainCircuit,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { SEO } from '@/components/layout/SEO';
import { useRegion } from '@/hooks/useRegion';
import { REGION_OPTIONS } from '@/data/regions';
import type { RegionCode } from '@/types';

// Reusable Toast feedback type
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

type AdminWorkspace = 'client' | 'agent';

interface AgentWorkspaceData {
  agents: any[];
  leads: any[];
  commissions: any[];
  payouts: any[];
  referrals: any[];
  tierHistory: any[];
}

const emptyAgentWorkspace: AgentWorkspaceData = {
  agents: [],
  leads: [],
  commissions: [],
  payouts: [],
  referrals: [],
  tierHistory: [],
};

const CLIENT_DEFAULT_TAB = 'analytics';
const AGENT_DEFAULT_TAB = ADMIN_AGENT_WORKSPACE_TABS[0];
const CLIENT_TAB_IDS = [
  'analytics',
  'crm',
  'clients',
  'leads',
  'projects',
  'proposals',
  'invoices',
  'files',
  'messages',
  'notifications',
  'bot_training',
  'bot_analytics',
  'settings',
] as const;
const ADMIN_WORKSPACE_STORAGE_KEY = 'jawrah.admin.workspace';
const ADMIN_CLIENT_TAB_STORAGE_KEY = 'jawrah.admin.clientOperationsTab';
const ADMIN_AGENT_TAB_STORAGE_KEY = 'jawrah.admin.agentNetworkTab';
const ADMIN_TAB_PATHS: Record<string, string> = {
  analytics: '/admin',
  clients: '/admin/clients',
  projects: '/admin/projects',
  proposals: '/admin/proposals',
  invoices: '/admin/invoices',
  files: '/admin/files',
  messages: '/admin/messages',
  notifications: '/admin/notifications',
  settings: '/admin/settings',
};

function formatFileSize(size?: number | string | null) {
  const bytes = Number(size || 0);
  if (!bytes) return 'Size unavailable';
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString()} KB`;
}

function storageAvailable() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function isClientTab(tab: string | null): tab is typeof CLIENT_TAB_IDS[number] {
  return Boolean(tab && CLIENT_TAB_IDS.includes(tab as typeof CLIENT_TAB_IDS[number]));
}

function isAgentTab(tab: string | null): tab is typeof ADMIN_AGENT_WORKSPACE_TABS[number] {
  return Boolean(tab && ADMIN_AGENT_WORKSPACE_TABS.includes(tab as typeof ADMIN_AGENT_WORKSPACE_TABS[number]));
}

function getStoredWorkspace(): AdminWorkspace {
  if (!storageAvailable()) return 'client';
  return window.localStorage.getItem(ADMIN_WORKSPACE_STORAGE_KEY) === 'agent' ? 'agent' : 'client';
}

function getStoredWorkspaceTab(workspace: AdminWorkspace) {
  if (!storageAvailable()) return workspace === 'client' ? CLIENT_DEFAULT_TAB : AGENT_DEFAULT_TAB;
  const stored = window.localStorage.getItem(
    workspace === 'client' ? ADMIN_CLIENT_TAB_STORAGE_KEY : ADMIN_AGENT_TAB_STORAGE_KEY,
  );
  if (workspace === 'client') return isClientTab(stored) ? stored : CLIENT_DEFAULT_TAB;
  return isAgentTab(stored) ? stored : AGENT_DEFAULT_TAB;
}

function persistWorkspaceSelection(workspace: AdminWorkspace, tab: string) {
  if (!storageAvailable()) return;
  window.localStorage.setItem(ADMIN_WORKSPACE_STORAGE_KEY, workspace);
  window.localStorage.setItem(
    workspace === 'client' ? ADMIN_CLIENT_TAB_STORAGE_KEY : ADMIN_AGENT_TAB_STORAGE_KEY,
    tab,
  );
}

async function safeDashboardTask<T>(task: Promise<T>): Promise<{ data: T | null; error: unknown | null }> {
  try {
    return { data: await task, error: null };
  } catch (error: unknown) {
    return { data: null, error };
  }
}

export default function AdminDashboard() {
  const { profile, user } = useAuth();
  const { config } = useRegion();
  const location = useLocation();
  const navigate = useNavigate();
  const routeTab = (() => {
    const segment = location.pathname.split('/').filter(Boolean)[1];
    if (segment === 'clients') return 'clients';
    if (segment === 'projects') return 'projects';
    if (segment === 'proposals') return 'proposals';
    if (segment === 'invoices') return 'invoices';
    if (segment === 'files') return 'files';
    if (segment === 'messages') return 'messages';
    if (segment === 'notifications') return 'notifications';
    if (segment === 'settings') return 'settings';
    return 'analytics';
  })();
  
  // Workspace and tab control states stay client-side so switching never reloads the dashboard.
  const [activeWorkspace, setActiveWorkspace] = useState<AdminWorkspace>(() => getStoredWorkspace());
  const [activeTab, setActiveTab] = useState<string>(() => getStoredWorkspaceTab(getStoredWorkspace()));
  
  // System State Lists
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [paymentQueue, setPaymentQueue] = useState<any[]>([]);
  const [projectFiles, setProjectFiles] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [agentWorkspace, setAgentWorkspace] = useState<AgentWorkspaceData>(emptyAgentWorkspace);
  const [chatbotLeads, setChatbotLeads] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resourceErrors, setResourceErrors] = useState<Record<string, string>>({});
  
  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Search & Filter state values
  const [regionFilter, setRegionFilter] = useState<'all' | RegionCode>('all');
  
  // MODAL States for CRUD
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  
  // Project Form States
  const [projectTitle, setProjectTitle] = useState('');
  const [projectServiceType, setProjectServiceType] = useState('Premium Website');
  const [projectStatus, setProjectStatus] = useState<any>('development');
  const [projectPrice, setProjectPrice] = useState<number>(0);
  const [projectDeadline, setProjectDeadline] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [projectClientId, setProjectClientId] = useState('');
  const [leadForm, setLeadForm] = useState({
    full_name: '',
    email: '',
    whatsapp: '',
    business_name: '',
    service_interested: '',
    budget_range: '',
    message: '',
    region: config.id as RegionCode,
  });

  // Toast trigger utility
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const userRole = String(profile?.role || '');
  const hasAdminRole = userRole === 'admin' || userRole === 'superadmin';
  const canAccessClientOperations = hasAdminRole;
  const canAccessAgentNetwork = userRole === 'admin' || userRole === 'superadmin';
  const canAccessActiveWorkspace =
    activeWorkspace === 'client' ? canAccessClientOperations : canAccessAgentNetwork;

  useEffect(() => {
    loadAllDashboardData();
  }, []);

  useEffect(() => {
    if (activeWorkspace !== 'client') setActiveWorkspace('client');
    if (activeTab !== routeTab) setActiveTab(routeTab);
  }, [routeTab]);

  useEffect(() => {
    persistWorkspaceSelection(activeWorkspace, activeTab);
  }, [activeWorkspace, activeTab]);

  useEffect(() => {
    if (activeWorkspace === 'agent' && !canAccessAgentNetwork && canAccessClientOperations) {
      const fallbackTab = getStoredWorkspaceTab('client');
      setActiveWorkspace('client');
      setActiveTab(fallbackTab);
    }
  }, [activeWorkspace, canAccessAgentNetwork, canAccessClientOperations]);

  const loadAllDashboardData = async () => {
    setLoading(true);
    setLoadError(null);
    setResourceErrors({});

    if (!isSupabaseConfigured) {
      const message = 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      setLoadError(message);
      setResourceErrors({ workspace: message });
      setLoading(false);
      return;
    }

    if (!canAccessClientOperations && !canAccessAgentNetwork) {
      const message = `Admin access is required. Your active role is "${profile?.role || 'Guest'}".`;
      setLoadError(message);
      setResourceErrors({ workspace: message });
      setLoading(false);
      return;
    }

    try {
      const [
        leadsRes,
        projectsRes,
        clientsRes,
        analyticsRes,
        bookingsRes,
        invoicesRes,
        paymentQueueRes,
        filesRes,
        notificationsRes,
        chatbotRes,
        ticketsRes,
        agentWorkspaceRes,
      ] = await Promise.all([
          logSupabaseQuery(
            'admin_dashboard.inquiries',
            supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
          ),
          logSupabaseQuery(
            'admin_dashboard.projects',
            supabase
              .from('projects')
              .select('*, client:profiles!projects_client_id_fkey(*)')
              .order('created_at', { ascending: false }),
          ),
          logSupabaseQuery(
            'admin_dashboard.profiles',
            supabase.from('profiles').select('*').eq('role', 'client').order('created_at', { ascending: false }),
          ),
          safeDashboardTask(logSupabaseTask('admin_dashboard.business_analytics', fetchBusinessAnalytics())),
          logSupabaseQuery(
            'admin_dashboard.bookings',
            supabase.from('bookings').select('*').order('created_at', { ascending: false }),
          ),
          logSupabaseQuery(
            'admin_dashboard.invoices',
            supabase
              .from('invoices')
              .select('*, client:profiles(full_name, email)')
              .order('created_at', { ascending: false }),
          ),
          safeDashboardTask(
            logSupabaseTask('admin_dashboard.payment_verification_queue', fetchPaymentVerificationQueue()),
          ),
          logSupabaseQuery(
            'admin_dashboard.project_files',
            supabase
              .from('project_files')
              .select(
                '*, client:profiles!project_files_client_id_fkey(full_name, email), project:projects!project_files_project_id_fkey(title)',
              )
              .order('created_at', { ascending: false }),
          ),
          logSupabaseQuery(
            'admin_dashboard.notifications',
            supabase
              .from('notifications')
              .select('*, user:profiles(full_name, email, role)')
              .order('created_at', { ascending: false }),
          ),
          logSupabaseQuery(
            'admin_dashboard.chatbot_leads',
            supabase.from('chatbot_leads').select('*').order('created_at', { ascending: false }),
          ),
          logSupabaseQuery(
            'admin_dashboard.support_tickets',
            supabase
              .from('support_tickets')
              .select('*, client:profiles(full_name, email)')
              .order('created_at', { ascending: false }),
          ),
          safeDashboardTask(logSupabaseTask('admin_dashboard.agent_workspace', adminFetchAgents())),
        ]);

      const nextErrors: Record<string, string> = {};
      [
        ['inquiries', leadsRes.error],
        ['projects', projectsRes.error],
        ['clients', clientsRes.error],
        ['analytics', analyticsRes.error],
        ['bookings', bookingsRes.error],
        ['invoices', invoicesRes.error],
        ['paymentQueue', paymentQueueRes.error || paymentQueueRes.data?.error],
        ['projectFiles', filesRes.error],
        ['notifications', notificationsRes.error],
        ['chatbotLeads', chatbotRes.error],
        ['supportTickets', ticketsRes.error],
        ['agentWorkspace', agentWorkspaceRes.error || agentWorkspaceRes.data?.error],
      ].forEach(([key, error]) => {
        if (error) nextErrors[String(key)] = getSupabaseErrorMessage(error);
      });

      setInquiries(leadsRes.data ?? []);
      setProjects(projectsRes.data ?? []);
      setClients(clientsRes.data ?? []);
      setAnalytics(analyticsRes.data);
      setBookings(bookingsRes.data ?? []);
      setInvoices(invoicesRes.data ?? []);
      setPaymentQueue(paymentQueueRes.data?.data ?? []);
      setProjectFiles(filesRes.data ?? []);
      setNotifications(notificationsRes.data ?? []);
      setChatbotLeads(chatbotRes.data ?? []);
      setSupportTickets(ticketsRes.data ?? []);
      setAgentWorkspace({
        agents: agentWorkspaceRes.data?.agents ?? [],
        leads: agentWorkspaceRes.data?.leads ?? [],
        commissions: agentWorkspaceRes.data?.commissions ?? [],
        payouts: agentWorkspaceRes.data?.payouts ?? [],
        referrals: agentWorkspaceRes.data?.referrals ?? [],
        tierHistory: agentWorkspaceRes.data?.tierHistory ?? [],
      });

      setResourceErrors(nextErrors);
      const firstMessage = Object.values(nextErrors)[0] ?? null;
      setLoadError(firstMessage);
      if (firstMessage) showToast('Some admin data could not be loaded.', 'error');
    } catch (error: unknown) {
      console.error('ADMIN DASHBOARD ERROR:', error);
      const message = getSupabaseErrorMessage(error);
      setLoadError(message);
      setResourceErrors({ workspace: message });
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // CRUD OPERATIONS FOR PROJECTS
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) {
      showToast("Project Title is required", "error");
      return;
    }

    const payload = {
      title: projectTitle,
      service_type: projectServiceType,
      status: projectStatus,
      price: Math.max(0, Number(projectPrice) || 0),
      deadline: projectDeadline || null,
      notes: projectNotes,
      client_id: projectClientId || null,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingProject) {
        const { error } = await logSupabaseQuery(
          'admin_dashboard.projects.update',
          supabase.from('projects').update(payload).eq('id', editingProject.id),
        );
        if (error) throw error;
        showToast("Project updated successfully!");
      } else {
        const { error } = await logSupabaseQuery(
          'admin_dashboard.projects.insert',
          supabase.from('projects').insert([payload]),
        );
        if (error) throw error;
        showToast("New project created!");
      }
      loadAllDashboardData();
      setProjectModalOpen(false);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleEditProjectClick = (p: any) => {
    setEditingProject(p);
    setProjectTitle(p.title);
    setProjectServiceType(p.service_type || 'Premium Website');
    setProjectStatus(p.status || 'development');
    setProjectPrice(p.price || 0);
    setProjectDeadline(p.deadline || '');
    setProjectNotes(p.notes || '');
    setProjectClientId(p.client_id || '');
    setProjectModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you absolutely sure?")) return;
    try {
      const { error } = await logSupabaseQuery(
        'admin_dashboard.projects.delete',
        supabase.from('projects').delete().eq('id', id),
      );
      if (error) throw error;
      showToast("Project deleted.");
      loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // INQUIRIES & BOOKING STATUS CHANGES
  const handleUpdateInquiryStatus = async (id: string, nextStatus: string) => {
    try {
      const { error } = await logSupabaseQuery(
        'admin_dashboard.inquiries.update_status',
        supabase.from('inquiries').update({ status: nextStatus }).eq('id', id),
      );
      if (error) throw error;
      showToast(`Inquiry marked as ${nextStatus}`);
      loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleUpdateBookingStatus = async (id: string, nextStatus: string) => {
    try {
      const { error } = await logSupabaseQuery(
        'admin_dashboard.bookings.update_status',
        supabase.from('bookings').update({ status: nextStatus }).eq('id', id),
      );
      if (error) throw error;
      showToast(`Booking marked as ${nextStatus}`);
      loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleUpdateInvoicePayment = async (id: string, paymentStatus: string) => {
    try {
      if (paymentStatus === 'paid') {
        const invoice = invoices.find((inv) => inv.id === id);
        if (invoice?.region === 'lk' && invoice?.payment_method === 'bank_transfer') {
          await adminApproveManualPayment(id, null, user?.id);
        } else {
          await completeInvoicePayment({
            invoiceId: id,
            amount: Number(invoice?.amount_due_now ?? invoice?.amount ?? 0),
            paymentMethod: invoice?.payment_method || 'bank_transfer',
            transactionId: invoice?.payment_reference ?? invoice?.transaction_id ?? undefined,
          });
        }
        showToast('Invoice milestone marked as paid.');
      } else {
        const { error } = await logSupabaseQuery(
          'admin_dashboard.invoices.update_payment',
          supabase
            .from('invoices')
            .update({
              payment_status: paymentStatus,
              status: paymentStatus === 'paid' ? 'paid' : undefined,
              paid_at: paymentStatus === 'paid' ? new Date().toISOString() : null,
            })
            .eq('id', id),
        );
        if (error) throw error;
        showToast(`Invoice marked as ${paymentStatus}`);
      }
      loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleViewPaymentProof = async (proofPath?: string | null) => {
    if (!proofPath) {
      showToast('No receipt file was uploaded for this submission.', 'info');
      return;
    }

    const { data, error } = await getPaymentProofSignedUrl(proofPath);
    if (error || !data?.signedUrl) {
      showToast(error?.message || 'Receipt access is unavailable.', 'error');
      return;
    }

    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  const handleApproveQueuePayment = async (item: any) => {
    try {
      await adminApproveManualPayment(item.invoice_id, item.id, user?.id);
      showToast('Payment approved and project status updated.');
      loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleRejectQueuePayment = async (item: any) => {
    const reason = window.prompt('Reason for rejecting this payment?', 'Payment proof could not be verified.');
    if (reason === null) return;

    try {
      await adminRejectManualPayment({
        invoiceId: item.invoice_id,
        paymentId: item.id,
        actorId: user?.id,
        reason,
      });
      showToast('Payment rejected.');
      loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleRequestUpdatedReceipt = async (item: any) => {
    const message = window.prompt(
      'Message to client',
      'Please upload a clearer receipt or submit the correct transaction reference number.',
    );
    if (message === null) return;

    try {
      await adminRequestUpdatedReceipt({
        invoiceId: item.invoice_id,
        paymentId: item.id,
        actorId: user?.id,
        message,
      });
      showToast('Updated receipt requested.');
      loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateChatbotStatus = async (id: string, nextStatus: string) => {
    try {
      const { error } = await logSupabaseQuery(
        'admin_dashboard.chatbot_leads.update_status',
        supabase.from('chatbot_leads').update({ status: nextStatus }).eq('id', id),
      );
      if (error) throw error;
      showToast(`Chatbot lead marked as ${nextStatus}`);
      loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const resetLeadForm = () => {
    setLeadForm({
      full_name: '',
      email: '',
      whatsapp: '',
      business_name: '',
      service_interested: '',
      budget_range: '',
      message: '',
      region: regionFilter === 'all' ? config.id : regionFilter,
    });
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.full_name.trim() || !leadForm.email.trim() || !leadForm.service_interested.trim()) {
      showToast('Name, email, and project type are required.', 'error');
      return;
    }

    try {
      const { error } = await logSupabaseQuery(
        'admin_dashboard.inquiries.insert',
        supabase.from('inquiries').insert({
          full_name: leadForm.full_name.trim(),
          email: leadForm.email.trim(),
          whatsapp: leadForm.whatsapp.trim() || null,
          phone: leadForm.whatsapp.trim() || null,
          business_name: leadForm.business_name.trim() || null,
          company: leadForm.business_name.trim() || null,
          service_interested: leadForm.service_interested.trim(),
          inquiry_type: 'project',
          budget_range: leadForm.budget_range.trim() || null,
          message: leadForm.message.trim() || null,
          source_page: leadForm.region,
          region: leadForm.region,
          country: config.countryName,
          status: 'new',
          notes: 'Created from Admin Workspace',
        }),
      );
      if (error) throw error;
      showToast('Lead added.');
      resetLeadForm();
      setLeadModalOpen(false);
      loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const totalClientLeads = inquiries.length + chatbotLeads.length;
  const activeClientIds = new Set(
    projects
      .filter((project) => !['completed', 'delivered', 'cancelled'].includes(project.status))
      .map((project) => project.client_id)
      .filter(Boolean),
  );
  const activeClientProjects = projects.filter(
    (project) => !['completed', 'delivered', 'cancelled'].includes(project.status),
  );
  const visiblePaymentQueue = paymentQueue.filter((item) => {
    const invoice = Array.isArray(item.invoice) ? item.invoice[0] : item.invoice;
    if (invoice?.region !== 'lk') return false;
    return regionFilter === 'all' || regionFilter === 'lk';
  });
  const clientRevenue = Number(
    analytics?.paidRevenue ?? analytics?.contractedRevenue ?? analytics?.totalRevenue ?? 0,
  );

  const visibleAgents =
    regionFilter === 'all'
      ? agentWorkspace.agents
      : agentWorkspace.agents.filter((agent) => agent.region === regionFilter);
  const visibleAgentIds = new Set(visibleAgents.map((agent) => agent.user_id));
  const visibleAgentLeads =
    regionFilter === 'all'
      ? agentWorkspace.leads
      : agentWorkspace.leads.filter((lead) => lead.region === regionFilter || visibleAgentIds.has(lead.agent_id));
  const visibleAgentCommissions =
    regionFilter === 'all'
      ? agentWorkspace.commissions
      : agentWorkspace.commissions.filter((commission) => visibleAgentIds.has(commission.agent_id));
  const visibleAgentPayouts =
    regionFilter === 'all'
      ? agentWorkspace.payouts
      : agentWorkspace.payouts.filter((payout) => visibleAgentIds.has(payout.agent_id));
  const visibleAgentReferrals =
    regionFilter === 'all'
      ? agentWorkspace.referrals
      : agentWorkspace.referrals.filter(
          (referral) => referral.region === regionFilter || visibleAgentIds.has(referral.agent_id),
        );
  const approvedAgents = visibleAgents.filter((agent) => agent.status === 'approved');
  const pendingApplications = visibleAgents.filter((agent) => ['pending', 'under_review', 'interview'].includes(agent.status)).length;
  const monthlyReferrals = visibleAgentReferrals.filter(
    (referral) => referral.created_at?.slice(0, 7) === new Date().toISOString().slice(0, 7),
  ).length;
  const commissionsDue = visibleAgentCommissions
    .filter((commission) => commission.status === 'pending' || commission.status === 'approved')
    .reduce((sum, commission) => sum + Number(commission.commission_amount || 0), 0);
  const totalPayouts = visibleAgentPayouts
    .filter((payout) => payout.status === 'completed')
    .reduce((sum, payout) => sum + Number(payout.amount || 0), 0);
  const topAgent = approvedAgents.reduce<any | null>((current, agent) => {
    if (!current) return agent;
    return Number(agent.completed_paid_projects || 0) > Number(current.completed_paid_projects || 0)
      ? agent
      : current;
  }, null);
  const topAgentName =
    topAgent?.profiles?.full_name || topAgent?.profiles?.agent_code || topAgent?.profiles?.email || 'N/A';

  const clientOperationTabs = [
    { id: 'analytics', label: 'Overview', icon: Activity },
    { id: 'crm', label: 'CRM', count: inquiries.length, icon: Users },
    { id: 'clients', label: 'Clients', count: clients.length, icon: Users },
    { id: 'leads', label: 'Leads', count: totalClientLeads, icon: FileText },
    { id: 'projects', label: 'Projects', count: projects.length, icon: Briefcase },
    { id: 'proposals', label: 'Proposals', icon: FileText },
    { id: 'invoices', label: 'Invoices', count: invoices.length, icon: DollarSign },
    { id: 'files', label: 'Files', count: projectFiles.length, icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', count: notifications.length, icon: MessageSquare },
    { id: 'bot_analytics', label: 'Bot Intelligence', icon: MessageSquare },
    { id: 'bot_training', label: 'Bot Training', icon: BrainCircuit },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const agentNetworkTabs = [
    { id: 'agent-applications', label: 'Agent Applications', count: pendingApplications, icon: Users },
    { id: 'approved-agents', label: 'Approved Agents', count: approvedAgents.length, icon: Users },
    { id: 'referral-tracking', label: 'Referral Tracking', count: visibleAgentLeads.length, icon: Activity },
    { id: 'commission-management', label: 'Commission Management', count: visibleAgentCommissions.length, icon: DollarSign },
    { id: 'payout-management', label: 'Payout Management', count: visibleAgentPayouts.length, icon: DollarSign },
    { id: 'agent-messages', label: 'Agent Messages', icon: MessageSquare },
    { id: 'tier-history', label: 'Tier History', count: agentWorkspace.tierHistory.length, icon: Activity },
    { id: 'agent-analytics', label: 'Agent Analytics', icon: Activity },
  ];

  const workspaceTabs = activeWorkspace === 'client' ? clientOperationTabs : agentNetworkTabs;
  const workspaceKpis =
    activeWorkspace === 'client'
      ? [
          { title: 'Total Leads', val: totalClientLeads, desc: 'CRM and lead capture' },
          { title: 'Active Clients', val: activeClientIds.size, desc: 'Clients in delivery' },
          { title: 'Active Projects', val: analytics?.activeProjects ?? activeClientProjects.length, desc: 'Current operations' },
          { title: 'Revenue', val: `${config.currencySymbol}${clientRevenue.toLocaleString()}`, desc: 'Paid revenue' },
          { title: 'Conversion Rate', val: `${analytics?.conversionRate ?? 0}%`, desc: 'Lead to win ratio' },
        ]
      : [
          { title: 'Approved Agents', val: approvedAgents.length, desc: 'Active network partners' },
          { title: 'Pending Applications', val: pendingApplications, desc: 'Awaiting review' },
          { title: 'Monthly Referrals', val: monthlyReferrals, desc: 'This month' },
          { title: 'Commissions Due', val: `${config.currencySymbol}${commissionsDue.toLocaleString()}`, desc: 'Pending or approved' },
          { title: 'Total Payouts', val: `${config.currencySymbol}${totalPayouts.toLocaleString()}`, desc: 'Completed payouts' },
          { title: 'Top Performing Agent', val: topAgentName, desc: 'Paid project count' },
        ];

  const tabErrorSources: Record<string, string[]> = {
    crm: ['inquiries'],
    leads: ['inquiries', 'chatbotLeads'],
    projects: ['projects'],
    proposals: [],
    invoices: ['invoices'],
    files: ['projectFiles'],
    messages: [],
    notifications: ['notifications'],
    analytics: ['analytics', 'inquiries', 'projects', 'invoices'],
    'agent-applications': ['agentWorkspace'],
    'approved-agents': ['agentWorkspace'],
    'referral-tracking': ['agentWorkspace'],
    'commission-management': ['agentWorkspace'],
    'payout-management': ['agentWorkspace'],
    'agent-messages': ['agentWorkspace'],
    'tier-history': ['agentWorkspace'],
    'agent-analytics': ['agentWorkspace'],
  };
  const activeTabErrors = (tabErrorSources[activeTab] ?? ['workspace'])
    .map((key) => resourceErrors[key])
    .filter(Boolean);
  const activeTabLabel = workspaceTabs.find((tab) => tab.id === activeTab)?.label || 'Workspace';
  const workspaceAccessMessage =
    activeWorkspace === 'agent'
      ? 'Agent Network requires admin or superadmin access.'
      : 'Client Operations requires admin access.';

  const renderTabLoading = (label = activeTabLabel) => (
    <div className="py-24 flex flex-col items-center justify-center text-brand-cyan gap-4">
      <Loader className="animate-spin" size={36} />
      <span className="text-xs font-mono uppercase tracking-widest text-brand-gray">
        Loading {label}...
      </span>
    </div>
  );

  const renderTabError = (message: string) => (
    <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-300 text-xs font-mono uppercase tracking-wider">
      {message}
    </div>
  );

  const renderEmptyState = (message: string, className = '') => (
    <p className={`text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center ${className}`}>
      {message}
    </p>
  );

  const handleWorkspaceChange = (workspace: AdminWorkspace) => {
    if (workspace === 'client' && !canAccessClientOperations) {
      showToast('Client Operations requires admin access.', 'error');
      return;
    }
    if (workspace === 'agent' && !canAccessAgentNetwork) {
      showToast('Agent Network requires admin or superadmin access.', 'error');
      return;
    }
    setActiveWorkspace(workspace);
    setActiveTab(getStoredWorkspaceTab(workspace));
  };

  const handleTabChange = (tabId: string) => {
    const path = ADMIN_TAB_PATHS[tabId];
    if (path) {
      navigate(path);
    }
    setActiveTab(tabId);
  };

  const activateWorkspaceTab = (workspace: AdminWorkspace, tabId: string) => {
    handleWorkspaceChange(workspace);
    if (workspace === 'client' && canAccessClientOperations) setActiveTab(tabId);
    if (workspace === 'agent' && canAccessAgentNetwork) setActiveTab(tabId);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-brand-black text-white relative font-sans overflow-x-hidden">
      <SEO 
        title="Admin CMS Operations Platform" 
        description="Full-suite database synchronization, bookings overview, client revision trackers, and client CRM controller." 
        noIndex
      />

      {/* Floating toasts render */}
      <div className="fixed top-20 left-3 right-3 sm:top-24 sm:right-6 sm:left-auto space-y-3 z-50 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`p-4 rounded-xl border flex items-center gap-3 shadow-2xl backdrop-blur-md pointer-events-auto animate-bounce-short ${
              t.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
              t.type === 'info' ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' :
              'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan'
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
            <p className="text-xs font-semibold uppercase font-mono tracking-wider">{t.message}</p>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl min-w-0">
        
        {/* UPPER TITLE HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="flex items-center gap-3.5 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-brand-cyan/15 border border-brand-cyan/25 text-brand-cyan font-mono text-[9px] uppercase tracking-widest font-bold">
                SYSTEM CONSOLE
              </span>
              <div className="flex items-center gap-1 text-[10px] text-brand-gray font-mono uppercase tracking-widest">
                <Activity size={12} className="text-brand-cyan" /> 
                Active DB Sync Active
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-semibold uppercase tracking-tight text-white">
              Operations Control
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="outline" size="sm" onClick={loadAllDashboardData} className="uppercase font-mono text-[10px] tracking-wider border-white/10">
              Reload Engine
            </Button>
          </div>
        </div>

        {/* SECURITY ALERT SYSTEM */}
        {!hasAdminRole && (
          <div className="mb-8 p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Supabase Admin Barrier</h4>
                <p className="text-xs text-brand-silver leading-relaxed font-light mt-0.5">
                  Your active role is "{profile?.role || 'Guest'}". Admin access is required for full write capabilities.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 space-y-4">
          <div className="p-2 bg-brand-black/40 border border-white/5 rounded-2xl flex flex-col sm:flex-row gap-2">
            {[
              { id: 'client' as AdminWorkspace, label: 'Client Operations', allowed: canAccessClientOperations },
              { id: 'agent' as AdminWorkspace, label: 'Partner Network', allowed: canAccessAgentNetwork },
            ].map((workspace) => {
              const isActive = activeWorkspace === workspace.id;
              return (
                <button
                  key={workspace.id}
                  type="button"
                  disabled={!workspace.allowed}
                  onClick={() => handleWorkspaceChange(workspace.id)}
                  className={`flex-1 p-3.5 rounded-xl border transition-all text-left ${
                    isActive
                      ? 'bg-brand-cyan/15 border-brand-cyan/30 text-brand-cyan font-bold select-none drop-shadow-[0_0_12px_rgba(34,211,238,0.1)]'
                      : workspace.allowed
                        ? 'border-white/5 bg-transparent text-brand-gray hover:text-white hover:border-white/15'
                        : 'border-white/5 bg-transparent text-brand-gray opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className="block text-[10px] sm:text-xs uppercase font-mono tracking-wider">
                    {workspace.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {workspaceKpis.map((card) => (
              <div key={card.title} className="p-4 sm:p-5 bg-brand-black/60 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                <div className="text-[9px] font-mono text-brand-gray uppercase tracking-widest">{card.title}</div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight mt-2 leading-tight break-words">
                  {card.val}
                </div>
                <p className="text-[9px] sm:text-[10px] text-brand-gray font-light font-sans mt-1">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!canAccessClientOperations}
              onClick={() => {
                resetLeadForm();
                setLeadModalOpen(true);
              }}
              className="uppercase font-mono text-[10px] tracking-wider border-white/10"
            >
              <Plus size={14} className="mr-1" /> Add Lead
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!canAccessClientOperations}
              onClick={() => activateWorkspaceTab('client', 'proposals')}
              className="uppercase font-mono text-[10px] tracking-wider border-white/10"
            >
              Create Proposal
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!canAccessClientOperations}
              onClick={() => activateWorkspaceTab('client', 'invoices')}
              className="uppercase font-mono text-[10px] tracking-wider border-white/10"
            >
              Create Invoice
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!canAccessAgentNetwork}
              onClick={() => activateWorkspaceTab('agent', 'agent-applications')}
              className="uppercase font-mono text-[10px] tracking-wider border-white/10"
            >
              Review Agent Applications
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!canAccessAgentNetwork}
              onClick={() => activateWorkspaceTab('agent', 'payout-management')}
              className="uppercase font-mono text-[10px] tracking-wider border-white/10"
            >
              Process Payouts
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* NAVIGATION CONTROL RAIL */}
          <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
            {workspaceTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-shrink-0 lg:flex-shrink-1 w-auto lg:w-full flex items-center justify-between p-3 sm:p-3.5 min-h-[44px] rounded-xl border transition-all text-[10px] sm:text-xs uppercase font-mono tracking-wider cursor-pointer text-left ${
                    isActive 
                      ? 'bg-brand-cyan/15 border-brand-cyan/30 text-brand-cyan font-bold select-none drop-shadow-[0_0_12px_rgba(34,211,238,0.1)]' 
                      : 'border-white/5 bg-transparent text-brand-gray hover:text-white hover:border-white/15'
                  }`}
                >
                  <span className="flex items-center gap-2 sm:gap-3">
                    <Icon size={14} className="sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </span>
                  {tab.count !== undefined && (
                    <span className={`ml-2 px-2 py-0.5 rounded text-[10px] ${isActive ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/5 text-brand-silver'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MAIN DYNAMIC CMS CONTAINER */}
          <div className="lg:col-span-9 glass-card p-4 sm:p-6 md:p-8 rounded-2xl relative bg-white/[0.01] border-white/10 min-h-[500px] min-w-0 overflow-hidden">
            {!canAccessActiveWorkspace ? (
              <div className="py-24 flex flex-col items-center justify-center text-amber-500 gap-4 text-center">
                <ShieldAlert size={36} />
                <span className="text-xs font-mono uppercase tracking-widest text-brand-gray">
                  {workspaceAccessMessage}
                </span>
              </div>
            ) : loading ? (
              renderTabLoading()
            ) : (
              <div>
                {activeTabErrors.map((message) => renderTabError(message))}
                {loadError && activeTabErrors.length === 0 && renderTabError(loadError)}
                
                {/* 1. ANALYTICS CONSOLE TAB */}
                {activeTab === 'analytics' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Operational Analytics</h2>
                      <span className="text-[10px] font-mono text-brand-gray uppercase">Status: Real-time DB Sync</span>
                    </div>

                    {/* Stats Metric Panel Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { title: 'Total Leads', val: analytics?.totalLeads || 0, growth: '+12%', desc: 'Inquiries across regions', icon: FileText, color: 'text-brand-cyan' },
                        { title: 'Active Projects', val: analytics?.activeProjects || 0, growth: 'Stable', desc: 'Current dev operations', icon: Briefcase, color: 'text-brand-blue' },
                        { title: 'New Inquiries', val: analytics?.newInquiries || 0, growth: 'High', desc: 'Unprocessed opportunities', icon: MessageSquare, color: 'text-purple-400' },
                        { title: 'Total Revenue', val: `${config.currencySymbol}${(Number(analytics?.paidRevenue ?? analytics?.contractedRevenue ?? 0)).toLocaleString()}`, growth: 'Live', desc: 'Contracted project value', icon: DollarSign, color: 'text-emerald-400' }
                      ].map((card, cIdx) => {
                        const Icon = card.icon;
                        return (
                          <div key={cIdx} className="p-4 sm:p-5 bg-brand-black/60 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2 sm:mb-3">
                              <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest">{card.title}</span>
                              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-brand-cyan">{card.growth}</span>
                            </div>
                            <div className="flex items-baseline gap-1.5 mb-1">
                              <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">{card.val}</span>
                            </div>
                            <p className="text-[9px] sm:text-[10px] text-brand-gray font-light font-sans">{card.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* LEADS BY STATUS CHART */}
                    <div className="p-6 bg-brand-black/40 border border-white/5 rounded-xl">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="text-xs font-mono text-brand-cyan uppercase tracking-widest mb-0.5">Lead Pipeline Distribution</h4>
                          <span className="text-xs text-brand-gray">Status breakdown for all incoming inquiries</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {CRM_PIPELINE.map((status) => {
                          const count = analytics?.leadsByStatus?.[status] || 0;
                          const percentage = analytics?.totalLeads ? (count / analytics.totalLeads) * 100 : 0;
                          return (
                            <div key={status} className="flex flex-col gap-2">
                              <div className="h-24 bg-white/5 rounded-lg relative overflow-hidden flex flex-col justify-end">
                                <div 
                                  className="bg-brand-cyan/20 border-t border-brand-cyan/40 w-full transition-all duration-1000" 
                                  style={{ height: `${percentage}%` }}
                                ></div>
                                <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold text-white">
                                  {count}
                                </span>
                              </div>
                              <span className="text-[9px] font-mono text-brand-gray uppercase text-center">{status.replace('_', ' ')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <AdminAnalyticsExtras analytics={analytics} />
                    {!analytics && renderEmptyState('No analytics data available yet.')}
                  </div>
                )}

                {activeTab === 'bot_analytics' && (
                  <BotAnalyticsDashboard />
                )}

                {activeTab === 'bot_training' && (
                  <BotTrainingCenter />
                )}

                <AdminEcosystemPanels
                  activeTab={activeTab}
                  hasAdminRole={hasAdminRole}
                  clients={clients}
                  projects={projects}
                  inquiries={inquiries}
                  regionFilter={regionFilter}
                  showToast={showToast}
                  onReload={loadAllDashboardData}
                  adminUserId={user?.id}
                />
                <AdminAgentNetworkPanel
                  activeTab={activeTab}
                  regionFilter={regionFilter}
                  showToast={showToast}
                  adminUserId={user?.id}
                  onReload={loadAllDashboardData}
                />

                {/* 2. LEADS (INQUIRIES) TAB */}
                {activeTab === 'leads' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Leads Lifecycle</h2>
                        <p className="text-xs text-brand-gray mt-0.5">Manage incoming inquiries and track conversion pipeline.</p>
                      </div>

                      <div className="flex gap-2">
                        <select 
                          value={regionFilter}
                          onChange={(e) => setRegionFilter(e.target.value as 'all' | RegionCode)}
                          className="bg-brand-navy/40 border border-white/10 rounded px-3 py-1.5 text-[10px] font-mono text-white uppercase"
                        >
                          <option value="all">All Regions</option>
                          {REGION_OPTIONS.map((region) => (
                            <option key={region.id} value={region.id}>
                              {region.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {inquiries.filter((inq) => regionFilter === 'all' || inq.region === regionFilter).length === 0 && (
                        renderEmptyState('No inquiries yet for this filter.')
                      )}
                      {inquiries
                        .filter(inq => regionFilter === 'all' || inq.region === regionFilter)
                        .map((inq) => (
                        <div key={inq.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl hover:border-brand-cyan/10 transition-colors relative group">
                          <div className="flex flex-wrap gap-2 mb-3 sm:absolute sm:top-4 sm:right-4">
                            {CRM_PIPELINE.map((st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateInquiryStatus(inq.id, st)}
                                className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase border transition-all cursor-pointer ${
                                  inq.status === st 
                                    ? 'bg-brand-cyan/20 border-brand-cyan/30 text-brand-cyan font-semibold' 
                                    : 'border-white/5 text-brand-gray hover:border-white/10'
                                }`}
                              >
                                {st.replace('_', ' ')}
                              </button>
                            ))}
                          </div>

                          <div className="space-y-2 max-w-2xl">
                            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block">{inq.business_name || 'Individual Lead'}</span>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{inq.full_name} ● <span className="text-brand-gray text-[11px] font-normal lowercase">{inq.email}</span></h3>
                            <p className="text-xs text-brand-silver font-light leading-relaxed italic">
                              "{inq.message || 'No additional project scope notes.'}"
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-mono text-brand-gray uppercase">
                              <span>WhatsApp: {inq.whatsapp || 'N/A'}</span>
                              <span>Budget: {inq.budget_range || 'N/A'}</span>
                              <span>Service: {inq.service_interested}</span>
                              <span>Source: {inq.source_page?.toUpperCase() || 'WEB'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. CLIENT CRM TAB */}
                {activeTab === 'clients' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Client CRM</h2>
                        <p className="text-xs text-brand-gray mt-0.5">Manage registered clients and their profile coordinates.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {clients.length === 0 && (
                        renderEmptyState('No registered clients yet.', 'col-span-full')
                      )}
                      {clients.map((client) => (
                        <div key={client.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan text-lg font-bold">
                            {client.full_name?.[0] || 'C'}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{client.full_name}</h3>
                            <p className="text-[10px] text-brand-gray font-mono lowercase">{client.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-brand-silver uppercase">
                                {client.country || 'Global'}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-brand-blue/10 text-[9px] font-mono text-brand-blue uppercase">
                                {client.region?.toUpperCase() || 'INTL'}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-brand-gray" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Project Portfolio</h2>
                        <p className="text-xs text-brand-gray mt-0.5">Live delivery management and revenue tracking.</p>
                      </div>

                      <Button 
                        size="sm" 
                        onClick={() => {
                          setEditingProject(null);
                          setProjectTitle('');
                          setProjectServiceType('Premium Website');
                          setProjectStatus('development');
                          setProjectPrice(0);
                          setProjectDeadline('');
                          setProjectNotes('');
                          setProjectClientId('');
                          setProjectModalOpen(true);
                        }}
                        className="uppercase font-mono tracking-widest text-[10px] luxury-glow shrink-0 font-bold"
                      >
                        <Plus size={14} className="mr-1" /> New Project
                      </Button>
                    </div>

                    <div className="md:hidden space-y-3">
                      {projects.length === 0 && (
                        <p className="p-8 text-center text-xs text-brand-gray font-mono uppercase tracking-widest border border-white/5 rounded-xl">
                          No projects in portfolio yet.
                        </p>
                      )}
                      {projects.map((proj) => (
                        <div key={proj.id} className="p-4 rounded-xl border border-white/5 bg-brand-black/40 space-y-3">
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white uppercase tracking-wider break-words">{proj.title}</div>
                            <div className="text-[10px] text-brand-gray mt-0.5">{proj.service_type}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase">
                            <div>
                              <span className="text-brand-gray block mb-0.5">Client</span>
                              <span className="text-brand-silver truncate block">{proj.client?.full_name || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-brand-gray block mb-0.5">Price</span>
                              <span className="text-brand-cyan">{config.currency} {Number(proj.price || 0).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                              proj.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              proj.status === 'development' ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {proj.status}
                            </span>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEditProjectClick(proj)} className="p-2.5 min-h-[44px] min-w-[44px] rounded bg-white/5 hover:bg-brand-cyan/15 text-brand-gray hover:text-brand-cyan transition-colors">
                                <Edit size={14} />
                              </button>
                              <button onClick={() => handleDeleteProject(proj.id)} className="p-2.5 min-h-[44px] min-w-[44px] rounded bg-white/5 hover:bg-red-500/15 text-brand-gray hover:text-red-400 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="hidden md:block border border-white/5 rounded-xl overflow-hidden bg-brand-black/20 overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/[0.03]">
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase">Project Architecture</th>
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase">Client</th>
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase">Price</th>
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase">Status</th>
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-xs text-brand-gray font-mono uppercase tracking-widest">
                                No projects in portfolio yet.
                              </td>
                            </tr>
                          )}
                          {projects.map((proj) => (
                            <tr key={proj.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <div className="text-xs font-semibold text-white uppercase tracking-wider">{proj.title}</div>
                                <div className="text-[10px] text-brand-gray block mt-0.5">{proj.service_type}</div>
                              </td>
                              <td className="p-4 text-[10px] text-brand-silver uppercase font-mono">
                                {proj.client?.full_name || 'N/A'}
                              </td>
                              <td className="p-4 font-mono text-xs text-brand-cyan">
                                {config.currency} {Number(proj.price || 0).toLocaleString()}
                              </td>
                              <td className="p-4">
                                <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                                  proj.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  proj.status === 'development' ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' :
                                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}>
                                  {proj.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => handleEditProjectClick(proj)} className="p-2 rounded bg-white/5 hover:bg-brand-cyan/15 text-brand-gray hover:text-brand-cyan transition-colors">
                                    <Edit size={14} />
                                  </button>
                                  <button onClick={() => handleDeleteProject(proj.id)} className="p-2 rounded bg-white/5 hover:bg-red-500/15 text-brand-gray hover:text-red-400 transition-colors">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. BOOKINGS TAB */}
                {activeTab === 'bookings' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Consultation Slots</h2>
                        <p className="text-xs text-brand-gray mt-0.5">Manage virtual briefing invitations and meeting timelines.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {bookings.length === 0 && (
                        renderEmptyState('No strategy bookings scheduled yet.')
                      )}
                      {bookings.map((book) => (
                        <div key={book.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded bg-brand-blue/10 border border-brand-blue/25 text-brand-blue font-mono text-[9px] uppercase tracking-widest">
                              {book.project_type}
                            </span>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mt-2">{book.name}</h3>
                            <div className="text-[10px] text-brand-gray font-mono lowercase">{book.email} ● {book.whatsapp || 'No WhatsApp'}</div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-[10px] font-mono uppercase text-brand-gray block">DATE & TIME</span>
                              <span className="text-xs font-mono text-white block">{book.preferred_date} at {book.preferred_time}</span>
                            </div>

                            <select
                              value={book.status}
                              onChange={(e) => handleUpdateBookingStatus(book.id, e.target.value)}
                              className="py-1 px-2.5 rounded bg-black border border-white/5 text-[10px] font-mono text-brand-cyan uppercase"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. INVOICES TAB */}
                {activeTab === 'invoices' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Invoices & Payments</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Track billing status, payment methods, and transaction references.</p>
                    </div>

                    <AdminInvoiceCreatePanel
                      clients={clients}
                      showToast={showToast}
                      onCreated={loadAllDashboardData}
                    />

                    <div className="p-5 bg-brand-black/60 border border-brand-cyan/15 rounded-xl space-y-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest">Sri Lanka Only</span>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider mt-1">Payment Verification Queue</h3>
                          <p className="text-xs text-brand-gray mt-1">Review bank transfer receipts and reference submissions before project start.</p>
                        </div>
                        <span className="px-2.5 py-1 rounded border border-brand-cyan/20 bg-brand-cyan/10 text-brand-cyan text-[10px] font-mono uppercase">
                          {visiblePaymentQueue.length} Awaiting
                        </span>
                      </div>

                      {visiblePaymentQueue.length === 0 ? (
                        <div className="p-4 rounded-xl border border-white/5 bg-black/30 text-xs text-brand-gray font-mono uppercase">
                          No Sri Lanka payment confirmations awaiting verification.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {visiblePaymentQueue.map((item) => {
                            const invoice = Array.isArray(item.invoice) ? item.invoice[0] : item.invoice;
                            const client = Array.isArray(invoice?.client) ? invoice.client[0] : invoice?.client;
                            const project = Array.isArray(invoice?.project) ? invoice.project[0] : invoice?.project;
                            const proofPath = item.receipt_storage_path || item.proof_storage_path || invoice?.proof_storage_path;
                            const amount = Number(item.amount_paid ?? item.amount ?? invoice?.amount_due_now ?? invoice?.amount ?? 0);
                            const clientName = item.client_name || client?.full_name || 'Client unavailable';
                            const clientEmail = item.client_email || client?.email || 'No email';
                            const clientPhone = item.client_phone || 'No phone';
                            const projectName = item.project_name || project?.title || invoice?.title || 'Invoice project';
                            const invoiceNumber = item.invoice_number || invoice?.invoice_number;
                            const bankReference = item.bank_reference || item.reference_number || 'No reference';
                            const submittedAt = item.submitted_at || item.created_at;
                            const queueStatus = String(item.status || 'pending_verification').replace(/_/g, ' ');

                            return (
                              <div key={item.id} className="p-4 rounded-xl border border-white/10 bg-black/30 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                                  <div className="min-w-0">
                                    <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest block">Client Name</span>
                                    <span className="text-xs text-white font-semibold break-words">
                                      {clientName}
                                    </span>
                                    <span className="text-[10px] text-brand-gray block truncate">{clientEmail}</span>
                                    <span className="text-[10px] text-brand-gray block truncate">{clientPhone}</span>
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest block">Project Name</span>
                                    <span className="text-xs text-white font-semibold break-words">
                                      {projectName}
                                    </span>
                                    <span className="text-[10px] text-brand-cyan font-mono block">{invoiceNumber}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest block">Amount</span>
                                    <span className="text-xs text-brand-cyan font-mono font-bold">
                                      {formatCurrencyAmount(amount, item.currency || invoice?.currency || 'LKR', 'lk')}
                                    </span>
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest block">Reference Number</span>
                                    <span className="text-xs text-white font-mono break-words">
                                      {bankReference}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest block">Submission Date</span>
                                    <span className="text-xs text-white font-mono">
                                      {submittedAt ? new Date(submittedAt).toLocaleDateString() : 'No date'}
                                    </span>
                                    <span className="text-[10px] text-amber-300 font-mono uppercase block mt-1">{queueStatus}</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px]">
                                  <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] min-w-0">
                                    <span className="font-mono text-brand-gray uppercase tracking-widest block">Receipt File</span>
                                    <span className="text-white break-words">{item.receipt_file_name || 'Receipt file'}</span>
                                    <span className="text-brand-gray block mt-1">{formatFileSize(item.receipt_file_size)}</span>
                                  </div>
                                  <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] min-w-0">
                                    <span className="font-mono text-brand-gray uppercase tracking-widest block">Client Notes</span>
                                    <span className="text-brand-silver break-words">{item.notes || 'No notes'}</span>
                                  </div>
                                  <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] min-w-0">
                                    <span className="font-mono text-brand-gray uppercase tracking-widest block">Admin Note</span>
                                    <span className="text-brand-silver break-words">{item.admin_note || 'No admin note yet'}</span>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={!proofPath}
                                    className="text-[9px] font-mono uppercase gap-1"
                                    onClick={() => handleViewPaymentProof(proofPath)}
                                  >
                                    <ExternalLink size={12} /> Receipt Image
                                  </Button>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="text-[9px] font-mono uppercase gap-1"
                                      onClick={() => handleApproveQueuePayment(item)}
                                    >
                                      <CheckCircle size={12} /> Approve Payment
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="text-[9px] font-mono uppercase gap-1"
                                      onClick={() => handleRejectQueuePayment(item)}
                                    >
                                      <XCircle size={12} /> Reject Payment
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      className="text-[9px] font-mono uppercase gap-1"
                                      onClick={() => handleRequestUpdatedReceipt(item)}
                                    >
                                      <RefreshCw size={12} /> Request Updated Receipt
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {invoices.length === 0 && (
                        renderEmptyState('No invoices issued yet.')
                      )}
                      {invoices.map((inv) => (
                        <div key={inv.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest">{inv.invoice_number}</span>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mt-1">{inv.title}</h3>
                            <p className="text-[10px] text-brand-gray font-mono lowercase mt-1">
                              {inv.client?.full_name || inv.guest_name || 'Guest'} ●{' '}
                              {inv.client?.email || inv.guest_email || 'No email'}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-xs font-mono text-brand-cyan">
                              Due: {formatCurrencyAmount(
                                Number(inv.amount_due_now ?? inv.amount ?? 0),
                                inv.currency || 'LKR',
                                inv.region,
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-brand-silver">
                              Project: {formatCurrencyAmount(Number(inv.project_value ?? inv.amount ?? 0), inv.currency || 'LKR', inv.region)}
                            </div>
                            <div className="text-[10px] font-mono uppercase text-brand-gray">
                              {paymentStatusLabel(inv.payment_status, inv.current_milestone)}
                            </div>
                            <div className="text-[10px] font-mono text-brand-silver">
                              {inv.payment_method || 'Not set'} {inv.transaction_id ? `● ${inv.transaction_id}` : ''}
                            </div>
                            <div className="flex flex-wrap gap-2 justify-end mt-2">
                              {['pending', 'manual_review', 'paid'].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleUpdateInvoicePayment(inv.id, st)}
                                  className="px-2 py-0.5 rounded text-[8px] font-mono uppercase border border-white/10 text-brand-gray hover:text-brand-cyan"
                                >
                                  Mark {st.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                            {inv.id && (
                              <BillingPdfActions
                                invoiceId={inv.id}
                                compact
                                showView
                                showResend
                                onToast={showToast}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. FILES TAB */}
                {activeTab === 'files' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Files</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Project files, contracts, invoices, proposals, and client assets.</p>
                    </div>

                    <div className="space-y-4">
                      {projectFiles.length === 0 && (
                        renderEmptyState('No files uploaded yet.')
                      )}
                      {projectFiles.map((file) => (
                        <div key={file.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest">
                              {file.file_category || 'project'}
                            </span>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mt-1">{file.file_name}</h3>
                            <p className="text-[10px] text-brand-gray font-mono lowercase mt-1">
                              {file.client?.full_name || 'Client unavailable'} / {file.project?.title || 'No linked project'}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-xs font-mono text-brand-cyan">{formatFileSize(file.size_bytes)}</div>
                            <div className="text-[10px] font-mono uppercase text-brand-gray">
                              {file.mime_type || 'Unknown type'}
                            </div>
                            <div className="text-[10px] font-mono text-brand-silver">
                              {file.created_at?.split('T')[0] || 'No date'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Notifications</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Client and platform notifications generated across the workspace.</p>
                    </div>

                    <div className="space-y-4">
                      {notifications.length === 0 && (
                        renderEmptyState('No notifications issued yet.')
                      )}
                      {notifications.map((note) => (
                        <div
                          key={note.id}
                          className={`p-5 border rounded-xl ${
                            note.read_at
                              ? 'bg-brand-black/60 border-white/5'
                              : 'bg-brand-cyan/5 border-brand-cyan/20'
                          }`}
                        >
                          <div className="flex justify-between gap-4 flex-wrap">
                            <div>
                              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{note.title}</h3>
                              <p className="text-xs text-brand-silver mt-2">{note.body || 'No notification body.'}</p>
                              <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-mono text-brand-gray uppercase">
                                <span>User: {note.user?.full_name || note.user?.email || 'N/A'}</span>
                                <span>Role: {note.user?.role || 'client'}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-mono uppercase text-brand-cyan block">
                                {note.read_at ? 'Read' : 'Unread'}
                              </span>
                              <span className="text-[10px] font-mono text-brand-gray block mt-1">
                                {note.created_at?.split('T')[0] || 'No date'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 9. CHATBOT LEADS TAB */}
                {activeTab === 'chatbot' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Chatbot Leads</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Leads captured from Jawrah-Bot conversations.</p>
                    </div>

                    <div className="space-y-4">
                      {chatbotLeads.length === 0 && (
                        renderEmptyState('No chatbot leads captured yet.')
                      )}
                      {chatbotLeads.map((lead) => (
                        <div key={lead.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {['new', 'contacted', 'qualified', 'archived'].map((st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateChatbotStatus(lead.id, st)}
                                className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase border transition-all cursor-pointer ${
                                  lead.status === st
                                    ? 'bg-brand-cyan/20 border-brand-cyan/30 text-brand-cyan font-semibold'
                                    : 'border-white/5 text-brand-gray hover:border-white/10'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{lead.name}</h3>
                          <p className="text-xs text-brand-silver mt-2">{lead.message || 'No message'}</p>
                          <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-mono text-brand-gray uppercase">
                            <span>Business: {lead.business_type || 'N/A'}</span>
                            <span>Project: {lead.project_type || 'N/A'}</span>
                            <span>Budget: {lead.budget_range || 'N/A'}</span>
                            <span>WhatsApp: {lead.whatsapp || 'N/A'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 10. SUPPORT TICKETS TAB */}
                {activeTab === 'support' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Support Tickets</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Client help desk requests from the portal.</p>
                    </div>
                    <div className="space-y-4">
                      {supportTickets.length === 0 && (
                        renderEmptyState('No support tickets logged yet.')
                      )}
                      {supportTickets.map((ticket) => (
                        <div key={ticket.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
                          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{ticket.subject}</h3>
                          <p className="text-xs text-brand-silver mt-2">{ticket.message}</p>
                          <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-mono text-brand-gray uppercase">
                            <span>Client: {ticket.client?.full_name || 'N/A'}</span>
                            <span>Status: {ticket.status}</span>
                            <span>Priority: {ticket.priority}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 11. SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">System Settings</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Global configuration for agency operations and security.</p>
                    </div>

                    <div className="p-6 bg-brand-black/60 border border-white/5 rounded-xl">
                      <div className="flex items-center gap-4 text-amber-500 mb-4">
                        <ShieldAlert size={20} />
                        <span className="text-xs font-mono uppercase tracking-widest">Administrative Boundaries Active</span>
                      </div>
                      <p className="text-xs text-brand-silver leading-relaxed">
                        Global settings are managed via environment variables and Supabase Auth configuration for production readiness.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>

      {/* LEAD MODAL */}
      {leadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm" onClick={() => setLeadModalOpen(false)}></div>
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto overscroll-contain bg-brand-navy/90 border border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl animate-scale-in">
            <button
              onClick={() => setLeadModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-brand-gray hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <h2 className="text-xl sm:text-2xl font-display font-semibold uppercase text-white mb-4 sm:mb-6 pr-8">
              Add Lead
            </h2>

            <form onSubmit={handleCreateLead} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Contact Person</label>
                  <Input value={leadForm.full_name} onChange={(e) => setLeadForm((p) => ({ ...p, full_name: e.target.value }))} placeholder="Client name" className="bg-black/40 border-white/5 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Email</label>
                  <Input type="email" value={leadForm.email} onChange={(e) => setLeadForm((p) => ({ ...p, email: e.target.value }))} placeholder="client@email.com" className="bg-black/40 border-white/5 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Business Name</label>
                  <Input value={leadForm.business_name} onChange={(e) => setLeadForm((p) => ({ ...p, business_name: e.target.value }))} placeholder="Company" className="bg-black/40 border-white/5 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">WhatsApp / Phone</label>
                  <Input value={leadForm.whatsapp} onChange={(e) => setLeadForm((p) => ({ ...p, whatsapp: e.target.value }))} placeholder="+94..." className="bg-black/40 border-white/5 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Project Type</label>
                  <Input value={leadForm.service_interested} onChange={(e) => setLeadForm((p) => ({ ...p, service_interested: e.target.value }))} placeholder="Premium Website" className="bg-black/40 border-white/5 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Region</label>
                  <select
                    value={leadForm.region}
                    onChange={(e) => setLeadForm((p) => ({ ...p, region: e.target.value as RegionCode }))}
                    className="w-full h-10 bg-black/40 border border-white/5 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  >
                    {REGION_OPTIONS.map((region) => (
                      <option key={region.id} value={region.id}>{region.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Budget Range</label>
                <Input value={leadForm.budget_range} onChange={(e) => setLeadForm((p) => ({ ...p, budget_range: e.target.value }))} placeholder="Budget range" className="bg-black/40 border-white/5 text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Requirements</label>
                <Textarea value={leadForm.message} onChange={(e) => setLeadForm((p) => ({ ...p, message: e.target.value }))} placeholder="Initial project notes..." className="bg-black/40 border-white/5 text-xs min-h-[100px]" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setLeadModalOpen(false)} className="uppercase font-mono text-[10px] tracking-widest border-white/10">
                  Cancel
                </Button>
                <Button type="submit" className="uppercase font-mono text-[10px] tracking-widest luxury-glow font-bold">
                  Save Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm" onClick={() => setProjectModalOpen(false)}></div>
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto overscroll-contain bg-brand-navy/90 border border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl animate-scale-in">
            <button 
              onClick={() => setProjectModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-brand-gray hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <h2 className="text-xl sm:text-2xl font-display font-semibold uppercase text-white mb-4 sm:mb-6 pr-8">
              {editingProject ? 'Revise Project Node' : 'Initialize New Project'}
            </h2>
            
            <form onSubmit={handleSaveProject} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Project Title</label>
                  <Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="e.g. AeroVista Flagship" className="bg-black/40 border-white/5 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Service Type</label>
                  <Input value={projectServiceType} onChange={(e) => setProjectServiceType(e.target.value)} placeholder="e.g. Web Architecture" className="bg-black/40 border-white/5 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Client</label>
                  <select 
                    value={projectClientId} 
                    onChange={(e) => setProjectClientId(e.target.value)}
                    className="w-full h-10 bg-black/40 border border-white/5 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="">Select Client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Price ({config.currency})</label>
                  <Input type="number" value={projectPrice} onChange={(e) => setProjectPrice(Number(e.target.value))} className="bg-black/40 border-white/5 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Status Matrix</label>
                  <select 
                    value={projectStatus} 
                    onChange={(e) => setProjectStatus(e.target.value as any)}
                    className="w-full h-10 bg-black/40 border border-white/5 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  >
                    {PROJECT_LIFECYCLE.map(s => (
                      <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Deadline</label>
                  <Input type="date" value={projectDeadline} onChange={(e) => setProjectDeadline(e.target.value)} className="bg-black/40 border-white/5 text-xs" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Internal Notes / CRM Data</label>
                <Textarea value={projectNotes} onChange={(e) => setProjectNotes(e.target.value)} placeholder="Enter sensitive client follow-up details..." className="bg-black/40 border-white/5 text-xs min-h-[100px]" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setProjectModalOpen(false)} className="uppercase font-mono text-[10px] tracking-widest border-white/10">
                  Cancel
                </Button>
                <Button type="submit" className="uppercase font-mono text-[10px] tracking-widest luxury-glow font-bold">
                  {editingProject ? 'Commit Changes' : 'Initialize Node'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
