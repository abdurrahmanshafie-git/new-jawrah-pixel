import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitRevisionRequest, submitSupportTicket } from '@/lib/supabase/api';
import { fetchExtendedClientWorkspace, markAllNotificationsRead, markNotificationRead, subscribeToNotifications } from '@/lib/supabase/ecosystem-api';
import {
  ClientFilesPanel,
  ClientInvoicesPanel,
  ClientMessagesPanel,
  ClientNotificationsBar,
  ClientNotificationsPanel,
  ClientOverviewExtras,
  ClientProjectsPanel,
  ClientProposalsPanel,
} from '@/components/ecosystem/ClientPortalExtras';
import { notifySupportTicketCreated } from '@/lib/email/notifications';
import { createUserNotification } from '@/lib/platform/notifications';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { supabase } from '@/lib/supabase/client';
import { PaymentModal, type PaymentModalOpenPayload } from '@/components/payments/PaymentModal';
import { parsePriceAmount } from '@/lib/payments/amounts';
import { currencyForRegion } from '@/lib/payments/config';
import { useAuth } from '@/contexts/AuthContext';
import { resolvePortalRegion } from '@/lib/region';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Loader, 
  Activity, 
  Settings, 
  User as UserIcon, 
  TrendingUp, 
  FileText, 
  Layers, 
  Download, 
  UploadCloud, 
  CheckCircle, 
  Clock, 
  Send, 
  ShieldCheck, 
  BookOpen, 
  MessageSquare, 
  Calendar,
  DollarSign,
  AlertCircle,
  X,
  Bell,
  Star,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { SEO } from '@/components/layout/SEO';
import { TurnstileCaptcha } from '@/components/ui/TurnstileCaptcha';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function ClientDashboard() {
  const { user, profile, loading: authLoading, signOut, refreshProfile } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const navigate = useNavigate();
  const { region: portalRegion, pendingVerification: regionPendingVerification } = resolvePortalRegion(profile?.region);
  const portalCurrency = currencyForRegion(portalRegion);
  const routeTab = (() => {
    const segment = location.pathname.split('/').filter(Boolean)[1];
    if (segment === 'projects') return 'projects';
    if (segment === 'files') return 'files';
    if (segment === 'proposals') return 'proposals';
    if (segment === 'invoices') return 'invoices';
    if (segment === 'messages') return 'messages';
    if (segment === 'notifications') return 'notifications';
    if (segment === 'settings') return 'settings';
    return 'overview';
  })();
  
  // Tab Controls
  const [activeTab, setActiveTab] = useState(routeTab);
  const [sandboxMode, setSandboxMode] = useState(!isSupabaseConfigured);
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Feedback Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // State lists
  const [projects, setProjects] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);

  // Submissions state controllers
  const [newRevisionText, setNewRevisionText] = useState('');
  const [newRevisionProject, setNewRevisionProject] = useState('');
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  
  // Live support chat simulations
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    { sender: 'agent', text: "Hello! Welcome to Jawrah Pixel's instant support node. How can we help you with your active system deploy today?", time: '09:40' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Schedulers State
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('10:00 (GMT+5:30)');
  const [meetingTopic, setMeetingTopic] = useState('Technical Scope Architecture review');
  const [revisionCaptchaToken, setRevisionCaptchaToken] = useState<string | null>(null);
  const [ticketCaptchaToken, setTicketCaptchaToken] = useState<string | null>(null);
  const [messageCaptchaToken, setMessageCaptchaToken] = useState<string | null>(null);

  // tab countersFile Upload states
  const [dragActive, setDragActive] = useState(false);
  const [simUploadName, setSimUploadName] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentModalPayload, setPaymentModalPayload] = useState<PaymentModalOpenPayload | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    full_name: '',
    company_name: '',
    phone: '',
    whatsapp: '',
  });

  // Toast dispatch utility
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Pre-seed mock datasets for accessible instant evaluators
  const mockProjectValue = portalRegion === 'int' ? 8_000 : portalRegion === 'pk' ? 900_000 : 2_200_000;
  const mockMilestoneA = Math.round(mockProjectValue * 0.3);
  const mockMilestoneB = Math.round(mockProjectValue * 0.4);
  const INITIAL_MOCK_PROJECTS = [
    {
      id: 'proj1',
      title: 'Shabnam Jewellers Flagship Store',
      service_type: 'Bespoke Ecommerce & UI Branding',
      status: 'development',
      progress: 68,
      price: mockProjectValue,
      region: portalRegion,
      currency: portalCurrency,
      deadline: '2026-06-15',
      description: 'Heritage fine gold jewelry showcase with real-time appraisers.',
    }
  ];

  const INITIAL_MOCK_INVOICES = [
    { id: 'inv_01', item: 'System Discovery & Wireframing Milestone', amount: `${portalCurrency} ${mockMilestoneA.toLocaleString()}`, amountNumeric: mockMilestoneA, amount_due_now: mockMilestoneA, currency: portalCurrency, region: portalRegion, rate: '30%', status: 'Paid', date: '2026-05-10' },
    { id: 'inv_02', item: 'Backend Database Sync & RLS Implementation', amount: `${portalCurrency} ${mockMilestoneB.toLocaleString()}`, amountNumeric: mockMilestoneB, amount_due_now: mockMilestoneB, currency: portalCurrency, region: portalRegion, rate: '40%', status: 'Paid', date: '2026-05-20' },
    { id: 'inv_03', item: 'Final Deployment & SEO Optimization Phase', amount: `${portalCurrency} ${mockMilestoneA.toLocaleString()}`, amountNumeric: mockMilestoneA, amount_due_now: mockMilestoneA, currency: portalCurrency, region: portalRegion, rate: '30%', status: 'Pending', date: '2026-06-10' }
  ];

  const INITIAL_MOCK_REVISIONS = [
    { id: 'rev_1', project: 'Shabnam Jewellers Flagship Store', detail: 'Update global font sizes on gold item price tags to stand out on mobile viewports.', status: 'Completed', date: '2026-05-18' },
    { id: 'rev_2', project: 'Shabnam Jewellers Flagship Store', detail: 'Incorporate dark slate background frame around checkouts.', status: 'Integrating', date: '2026-05-22' }
  ];

  const INITIAL_MOCK_TICKETS = [
    { id: 'tick_1', subject: 'Price Sync Trigger Delay', message: 'The gold rate scraper API took 3 seconds to synchronise this morning instead of immediate.', status: 'open', date: '2026-05-22' },
    { id: 'tick_2', subject: 'Stripe Pay-Node Verification', message: 'Testing sandbox transaction webhook payloads returned correct variables.', status: 'resolved', date: '2026-05-15' }
  ];

  const INITIAL_MOCK_FILES = [
    { id: 'f_1', name: 'shabnam_editorial_catalog_assets.zip', size: '24.2 MB', uploader: 'Client (You)', date: '2026-05-11' },
    { id: 'f_2', name: 'jawrah_production_wireframe_v1_0.pdf', size: '4.8 MB', uploader: 'Jawrah Designer', date: '2026-05-14' }
  ];

  const INITIAL_MOCK_MEETINGS = [
    { id: 'm_1', topic: 'Milestone 2 Approval Call', date: '2026-05-28', time: '14:00 (GMT+5:30)', status: 'scheduled' }
  ];

  const INITIAL_MOCK_NOTIFICATIONS = [
    { id: 'n_1', title: 'Milestone 2 Completed Successfully', desc: 'The database RLS and stripe pay hooks are synchronized. View your active project card.', date: '2026-05-21' },
    { id: 'n_2', title: 'Revision Request updated to Integrating', desc: 'OurColombo design team is revising checkout background color frames.', date: '2026-05-22' }
  ];

  useEffect(() => {
    setActiveTab(routeTab);
  }, [routeTab]);

  useEffect(() => {
    setSettingsForm({
      full_name: profile?.full_name ?? '',
      company_name: profile?.company_name ?? '',
      phone: profile?.phone ?? '',
      whatsapp: profile?.whatsapp ?? '',
    });
  }, [profile?.full_name, profile?.company_name, profile?.phone, profile?.whatsapp]);

  useEffect(() => {
    loadPortalData();
  }, [sandboxMode, user, portalRegion]);

  useEffect(() => {
    if (!user || sandboxMode) return;
    const channel = subscribeToNotifications(user.id, () => loadPortalData());
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user, sandboxMode, portalRegion]);

  const loadPortalData = async () => {
    setLoading(true);
    setPortalError(null);

    if (!user) {
      setLoading(false);
      return;
    }

    if (sandboxMode) {
      setProjects(INITIAL_MOCK_PROJECTS);
      setInvoices(INITIAL_MOCK_INVOICES);
      setRevisions(INITIAL_MOCK_REVISIONS);
      setSupportTickets(INITIAL_MOCK_TICKETS);
      setUploadedFiles(INITIAL_MOCK_FILES);
      setNotifications(INITIAL_MOCK_NOTIFICATIONS);
      setMeetings(INITIAL_MOCK_MEETINGS);
      setLoading(false);
      return;
    }

    try {
      const workspace = await fetchExtendedClientWorkspace(user.id, portalRegion);

      const workspaceError =
        workspace.projects.error ||
        workspace.invoices.error ||
        workspace.supportTickets.error;

      if (workspaceError) throw workspaceError;

      if (!workspace.projects.error && workspace.projects.data) {
        setProjects(workspace.projects.data.map((item: any) => ({
          ...item,
          region: portalRegion,
          currency: portalCurrency,
        })));
      }
        if (!workspace.bookings.error && workspace.bookings.data) setMeetings(workspace.bookings.data);
        if (!workspace.revisionRequests.error && workspace.revisionRequests.data) {
          setRevisions(workspace.revisionRequests.data.map((item: any) => ({
            ...item,
            project: item.project_id || 'Active project',
            date: item.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          })));
        }
        if (!workspace.supportTickets.error && workspace.supportTickets.data) {
          setSupportTickets(workspace.supportTickets.data.map((item: any) => ({
            ...item,
            date: item.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          })));
        }
        if (!workspace.invoices.error && workspace.invoices.data) {
          setInvoices(
            workspace.invoices.data.map((item: any) => {
              const amountDue = Number(item.amount_due_now ?? item.amount ?? 0);
              const projectValue = Number(item.project_value ?? item.amount ?? 0);
              const latestPaymentProof = [...(item.payments ?? [])].sort(
                (a: any, b: any) =>
                  new Date(b.submitted_at || b.created_at || 0).getTime() -
                  new Date(a.submitted_at || a.created_at || 0).getTime(),
              )[0] ?? null;
              return {
                ...item,
                latestPaymentProof,
                region: portalRegion,
                currency: portalCurrency,
                item: item.title,
                amount: `${portalCurrency} ${amountDue.toLocaleString()}`,
                amountNumeric: amountDue,
                project_value: projectValue,
                amount_due_now: amountDue,
                deposit_percentage: item.deposit_percentage ?? 10,
                deposit_amount: item.deposit_amount,
                remaining_balance: item.remaining_balance,
                current_milestone: item.current_milestone ?? 'deposit',
                rate: item.invoice_number,
                status:
                  item.payment_status === 'paid' || item.status === 'paid'
                    ? 'Paid'
                    : item.payment_status === 'manual_review' || item.payment_status === 'awaiting_verification'
                      ? 'Awaiting Verification'
                      : item.payment_status === 'update_requested'
                        ? 'Receipt Update Requested'
                        : item.payment_status === 'rejected'
                          ? 'Payment Rejected'
                      : item.payment_status === 'failed'
                        ? 'Failed'
                        : item.payment_status === 'processing'
                          ? 'Processing'
                          : item.payment_status === 'cancelled'
                            ? 'Cancelled'
                            : item.payment_status === 'pending' || item.status === 'pending' || item.status === 'sent'
                              ? 'Pending'
                              : item.status,
                paymentStatus: item.payment_status,
                date: item.due_date || item.created_at?.split('T')[0],
              };
            }),
          );
        }
        if (!workspace.files.error && workspace.files.data) {
          setUploadedFiles(workspace.files.data.map((item: any) => ({
            ...item,
            name: item.file_name,
            size: item.size_bytes ? `${(item.size_bytes / 1024 / 1024).toFixed(1)} MB` : 'Vault file',
            uploader: item.uploaded_by === user.id ? 'Client (You)' : 'Jawrah Team',
            date: item.created_at?.split('T')[0],
          })));
        }
      if (!workspace.notifications.error && workspace.notifications.data) {
        setNotifications(workspace.notifications.data.map((item: any) => ({
          ...item,
          desc: item.body,
          date: item.created_at?.split('T')[0],
        })));
      }
      if (!workspace.milestones.error && workspace.milestones.data) {
        setMilestones(workspace.milestones.data);
      }
      if (!workspace.proposals?.error && workspace.proposals?.data) {
        setProposals(workspace.proposals.data.map((item: any) => ({
          ...item,
          region: portalRegion,
          currency: portalCurrency,
        })));
      }
      if (!workspace.threads?.error && workspace.threads?.data) setThreads(workspace.threads.data);
      if (!workspace.updates?.error && workspace.updates?.data) setUpdates(workspace.updates.data);

      setLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load portal data.';
      console.warn('Client portal fetch failed:', message);
      setPortalError(message);
      setProjects([]);
      setInvoices([]);
      setSupportTickets([]);
      setRevisions([]);
      setUploadedFiles([]);
      setLoading(false);
    }
  };

  // SUBMIT REVISION REQUEST ACTIONS
  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRevision || !newRevisionText.trim()) return;

    if (!revisionCaptchaToken) {
      showToast('Please complete the security verification.', 'error');
      return;
    }

    setIsSubmittingRevision(true);

    try {
      // Server-side CAPTCHA verification
      const verifyRes = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captchaToken: revisionCaptchaToken, type: 'revision' }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.ok) {
        throw new Error(verifyData.error || 'Security verification failed.');
      }

      if (!sandboxMode && user) {
        const projectId = projects.find((p) => p.title === newRevisionProject)?.id ?? projects[0]?.id ?? null;
        const { error } = await submitRevisionRequest({
          client_id: user.id,
          project_id: projectId,
          detail: newRevisionText.trim(),
          status: 'submitted',
        });
        if (error) throw error;
        await loadPortalData();
      } else {
        const payload = {
          id: 'rev_' + Date.now(),
          project: newRevisionProject || (projects[0]?.title || 'Signature Project'),
          detail: newRevisionText,
          status: 'In Review',
          date: new Date().toISOString().split('T')[0],
        };
        setRevisions((prev) => [payload, ...prev]);
      }

      showToast('Revision request logged. Our creative leads are reviewing details.');
      setNewRevisionText('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit revision.';
      showToast(message, 'error');
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  // SUBMIT SUPPORT TICKET ACTIONS
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingTicket || !newTicketSubject.trim() || !newTicketMessage.trim()) return;

    if (!ticketCaptchaToken) {
      showToast('Please complete the security verification.', 'error');
      return;
    }

    setIsSubmittingTicket(true);

    try {
      // Server-side CAPTCHA verification
      const verifyRes = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captchaToken: ticketCaptchaToken, type: 'support' }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.ok) {
        throw new Error(verifyData.error || 'Security verification failed.');
      }

      if (!sandboxMode && user) {
        const { error } = await submitSupportTicket({
          client_id: user.id,
          project_id: projects[0]?.id ?? null,
          subject: newTicketSubject.trim(),
          message: newTicketMessage.trim(),
          status: 'open',
          priority: 'normal',
        });
        if (error) throw error;
        void notifySupportTicketCreated({ email: user.email ?? '', subject: newTicketSubject.trim() });
        void createUserNotification({
          userId: user.id,
          title: 'Support ticket submitted',
          body: newTicketSubject.trim(),
        });
        await loadPortalData();
      } else {
        const payload = {
          id: 'tick_' + Date.now(),
          subject: newTicketSubject,
          message: newTicketMessage,
          status: 'open',
          date: new Date().toISOString().split('T')[0],
        };
        setSupportTickets((prev) => [payload, ...prev]);
      }

      showToast('Support ticket registered in workspace queues.');
      setNewTicketSubject('');
      setNewTicketMessage('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit support ticket.';
      showToast(message, 'error');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const openInvoicePayment = (
    inv: {
      id: string;
      item?: string;
      title?: string;
      amountNumeric?: number;
      currency?: string;
      rate?: string;
      invoice_number?: string;
      amount?: string;
    },
    mode: 'full' | 'deposit',
  ) => {
    const lineAmount = Math.max(0, inv.amountNumeric ?? (parsePriceAmount(String(inv.amount || '')) || 0));

    if (mode === 'full') {
      setPaymentModalPayload({
        serviceName: inv.item || inv.title || 'Invoice Payment',
        totalAmount: lineAmount,
        defaultPercent: 100,
        intent: 'invoice',
        lockPercent: true,
        guestEmail: user?.email ?? undefined,
        guestName: profile?.full_name ?? undefined,
        existingInvoiceId: inv.id,
        existingInvoiceNumber: inv.rate || inv.invoice_number,
      });
    } else {
      const projectPrice = Number(projects[0]?.price);
      const projectTotal = !isNaN(projectPrice) && projectPrice > 0 ? projectPrice : lineAmount * 10;
      setPaymentModalPayload({
        serviceName: projects[0]?.title || inv.item || 'Project Deposit',
        totalAmount: projectTotal,
        defaultPercent: 10,
        intent: 'advance_10',
        lockPercent: true,
        guestEmail: user?.email ?? undefined,
        guestName: profile?.full_name ?? undefined,
      });
    }
    setPaymentModalOpen(true);
  };

  const unreadNotifications = notifications.filter((n) => !n.read_at).length;

  const openTab = (tabId: string) => {
    const path = tabId === 'overview' ? '/dashboard' : `/dashboard/${tabId}`;
    navigate(path);
    setActiveTab(tabId);
  };

  const handleSettingsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || settingsSaving) return;
    setSettingsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: settingsForm.full_name.trim() || null,
          company_name: settingsForm.company_name.trim() || null,
          phone: settingsForm.phone.trim() || null,
          whatsapp: settingsForm.whatsapp.trim() || null,
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      showToast('Profile settings updated.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Something went wrong. Retry.', 'error');
    } finally {
      setSettingsSaving(false);
    }
  };

  // LIVE SHIELD CHAT RESPONSE SIMULATOR
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Trigger delayed professional simulated response from agency lead
    setTimeout(() => {
      const agentMsg = {
        sender: 'agent' as const,
        text: "Understood. I have flagged this query to our Lead Developer in Colombo. We will adjust the price appraiser hook variables and update you on Slack/WhatsApp shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, agentMsg]);
      showToast("Incoming message from Account Manager", "info");
    }, 1500);
  };

  // SCHEDULE MEETING ACTIONS
  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingDate) {
      showToast("Please choose a target date", "error");
      return;
    }

    const payload = {
      id: 'm_' + Date.now(),
      topic: meetingTopic,
      date: meetingDate,
      time: meetingTime,
      status: 'scheduled'
    };

    setMeetings(prev => [payload, ...prev]);
    showToast("Discovery call reserved on Google Calendar / Calendly router.");
    setMeetingDate('');
  };

  // SIMULATED FILE DRAG AND DROP
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFakeFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simUploadName.trim()) return;

    const payload = {
      id: 'f_' + Date.now(),
      name: simUploadName.replace(/[^a-zA-Z0-9_.]/g, '_'),
      size: '2.4 MB',
      uploader: 'Client (You)',
      date: new Date().toISOString().split('T')[0]
    };

    setUploadedFiles(prev => [payload, ...prev]);
    showToast(`${simUploadName} uploaded to secure file vault!`);
    setSimUploadName('');
  };

  if (authLoading) {
    return (
      <div className="pt-40 min-h-screen theme-bg text-center text-brand-cyan flex flex-col items-center justify-center gap-4">
        <Loader className="animate-spin" size={32} />
        <span className="text-xs font-mono uppercase tracking-widest theme-text-muted">Retrieving account records...</span>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen theme-bg theme-text-primary relative font-sans overflow-x-hidden">
      <SEO 
        title="Premium Project Workspace" 
        description="Dynamic client collaboration terminal. Track project milestones, submit revisions, download invoices, schedule meetings, and chat with design experts." 
        noIndex
      />

      {/* Floating toasts container */}
      <div className="fixed top-20 left-3 right-3 sm:top-24 sm:right-6 sm:left-auto space-y-3 z-50 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`p-4 rounded-xl border flex items-center gap-3 shadow-2xl backdrop-blur-md pointer-events-auto ${
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

        {portalError && !sandboxMode && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-200 text-xs font-mono uppercase tracking-wider">
            {portalError}
          </div>
        )}

        {!sandboxMode && !loading && projects.length === 0 && (
          <div className="mb-6 p-4 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 text-brand-cyan text-xs font-mono uppercase tracking-wider">
            Onboarding: Your account is active. A project node will appear here once your scope is approved.
          </div>
        )}
        
        {/* UPPER TITLE HEADER BLOCK */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <span className="px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan font-mono text-[9px] uppercase tracking-widest font-bold shrink-0">
                CLIENT PORTAL
              </span>
              <div className="text-[9px] sm:text-[10px] text-brand-gray font-mono uppercase tracking-widest flex items-center gap-1 min-w-0">
                <ShieldCheck size={12} className="text-brand-cyan shrink-0" />
                <span className="truncate">256-bit Document Vault Enabled</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold uppercase tracking-tight text-white mb-1 break-words">
              Welcome, {profile?.full_name || user?.email || 'Valued Partner'}
            </h1>
            <p className="text-xs text-brand-gray font-light">
              Collaborate on active milestones, invoices, and design assets securely.
            </p>
            {regionPendingVerification && (
              <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-amber-200">
                Region pending verification.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* System Sandbox Switcher */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-1 flex items-center">
              <button 
                onClick={() => { setSandboxMode(true); showToast("Portal Sandbox Mock Activated.", "info"); }}
                className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  sandboxMode ? 'bg-brand-cyan text-brand-black font-semibold' : 'text-brand-gray hover:text-white'
                }`}
              >
                Demonstration Mode
              </button>
              <button 
                onClick={() => { setSandboxMode(false); showToast("Syncing Live Account Rows...", "info"); }}
                className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  !sandboxMode ? 'bg-brand-cyan text-brand-black font-semibold' : 'text-brand-gray hover:text-white'
                }`}
              >
                Live DB
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={signOut} className="uppercase font-mono text-[10px] tracking-wider border-white/10 h-9">
              Sign Out
            </Button>
          </div>
        </div>

        {/* WORKSPACE SECTIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: COLLABORATION ROUTING LIST */}
          <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'projects', label: 'Projects', count: projects.length, icon: Briefcase },
              { id: 'files', label: 'Files', count: uploadedFiles.length, icon: UploadCloud },
              { id: 'proposals', label: 'Proposals', count: proposals.length, icon: FileText },
              { id: 'invoices', label: 'Invoices', count: invoices.length, icon: DollarSign },
              { id: 'messages', label: 'Messages', count: threads.length, icon: MessageSquare },
              { id: 'notifications', label: 'Notifications', count: unreadNotifications, icon: Bell },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => openTab(tab.id)}
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
            <button
              onClick={signOut}
              className="flex-shrink-0 lg:flex-shrink-1 w-auto lg:w-full flex items-center justify-between p-3 sm:p-3.5 min-h-[44px] rounded-xl border border-white/5 bg-transparent text-brand-gray hover:text-white hover:border-white/15 transition-all text-[10px] sm:text-xs uppercase font-mono tracking-wider cursor-pointer text-left"
            >
              <span className="flex items-center gap-2 sm:gap-3">
                <X size={14} className="sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">Sign Out</span>
              </span>
            </button>
          </div>

          {/* RIGHT: CONTENT PANEL DISPLAY */}
          <div className="lg:col-span-9 glass-card p-4 sm:p-6 md:p-8 rounded-2xl relative bg-white/[0.01] border-white/10 min-h-[480px] min-w-0 overflow-hidden">
            
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-brand-cyan gap-4">
                <Loader className="animate-spin" size={36} />
                <span className="text-xs font-mono uppercase tracking-widest text-brand-gray">Decrypting profile folder...</span>
              </div>
            ) : (
              <div>
                {!sandboxMode && user && (
                  <ClientNotificationsBar
                    notifications={notifications}
                    onMarkRead={() => markAllNotificationsRead(user.id).then(() => loadPortalData())}
                  />
                )}

                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Overview</h2>
                      <span className="text-[10px] font-mono text-brand-gray uppercase">Workspace Summary</span>
                    </div>

                    <ClientOverviewExtras
                      projects={projects}
                      notifications={notifications}
                      updates={updates}
                      invoices={invoices}
                    />
                  </div>
                )}

                {/* 2. PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Projects</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Track lifecycle progress, milestones, and submit revision requests.</p>
                    </div>

                    <ClientProjectsPanel projects={projects} milestones={milestones} updates={updates} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-white/5">
                      <form onSubmit={handleSubmitRevision} className="lg:col-span-6 bg-brand-black/60 p-5 border border-white/5 rounded-xl space-y-4">
                        <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest font-bold">REVISION EMITTER</span>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-brand-gray uppercase">Target Project Node</label>
                          <select
                            value={newRevisionProject}
                            onChange={(e) => setNewRevisionProject(e.target.value)}
                            className="flex h-10 w-full rounded-sm border border-white/5 bg-black px-3 py-2 text-xs font-mono text-brand-silver focus:outline-none"
                          >
                            {projects.map((p) => <option key={p.id} value={p.title}>{p.title}</option>)}
                            <option value="Direct Blueprints">Direct Blueprints</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-brand-gray uppercase">Detail Revision Specifications</label>
                          <Textarea
                            required
                            value={newRevisionText}
                            onChange={(e) => setNewRevisionText(e.target.value)}
                            placeholder="e.g. Adjust checkout background frames to slate-950 on small screen breakpoints..."
                            className="bg-black border-white/5 text-xs min-h-[140px]"
                          />
                        </div>
                        <div className="py-2">
                          <TurnstileCaptcha onVerify={setRevisionCaptchaToken} theme="dark" size="flexible" />
                        </div>
                        <Button
                          type="submit"
                          disabled={isSubmittingRevision}
                          className="w-full text-xs font-mono uppercase tracking-widest h-10 select-none font-bold"
                        >
                          {isSubmittingRevision ? 'Sending...' : 'Transmit Revision Request'}
                        </Button>
                      </form>

                      <div className="lg:col-span-6 space-y-3">
                        <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest font-bold block">REVISION LOG RECORDS</span>
                        <div className="space-y-3 max-h-[350px] overflow-y-auto bg-brand-black/20 p-2 border border-white/5 rounded-xl">
                          {revisions.map((rev) => (
                            <div key={rev.id} className="p-4 bg-brand-black/40 border border-white/5 rounded-lg space-y-2">
                              <div className="flex justify-between items-center truncate">
                                <span className="text-[10px] font-semibold text-brand-cyan uppercase tracking-wider">{rev.status}</span>
                                <span className="text-[9px] text-brand-gray font-mono">{rev.date}</span>
                              </div>
                              <p className="text-[11px] text-brand-silver leading-relaxed pr-1 font-light italic">"{rev.detail}"</p>
                              <span className="text-[9px] text-brand-gray font-mono block uppercase">Node: {rev.project}</span>
                            </div>
                          ))}
                          {revisions.length === 0 && (
                            <p className="text-[10px] text-brand-gray font-mono uppercase p-4 text-center">No revision requests yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. FILES TAB */}
                {activeTab === 'files' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Document Vault</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Asset vault to catalog custom briefs, style guides, logs, and graphics.</p>
                    </div>

                    {!sandboxMode && user && (
                      <ClientFilesPanel
                        userId={user.id}
                        projects={projects}
                        uploadedFiles={uploadedFiles}
                        sandboxMode={sandboxMode}
                        showToast={showToast}
                        onReload={loadPortalData}
                      />
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* Drag drop simulation form */}
                      <div className="lg:col-span-6 space-y-4">
                        <div 
                          onDragEnter={handleDrag}
                          className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col justify-center items-center gap-3 transition-colors ${
                            dragActive ? 'border-brand-cyan bg-brand-cyan/5' : 'border-white/10 hover:border-brand-cyan/20'
                          }`}
                        >
                          <UploadCloud size={32} className="text-brand-gray" />
                          <div>
                            <span className="text-xs font-semibold text-white uppercase block">Drag & Drop briefing files</span>
                            <span className="text-[10px] text-brand-gray font-mono mt-1 block">Maximum upload block scope 50MB</span>
                          </div>
                        </div>

                        <form onSubmit={handleFakeFileUpload} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                          <div className="sm:col-span-8 space-y-1">
                            <label className="text-[9px] font-mono text-brand-gray uppercase">Or manually select filename</label>
                            <Input 
                              required
                              value={simUploadName}
                              onChange={(e) => setSimUploadName(e.target.value)}
                              placeholder="e.g. shabnam_palette_hex.pdf"
                              className="bg-black border-white/5 h-10 select-all"
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <Button type="submit" className="w-full text-xs font-mono uppercase h-10 select-none font-bold">
                              Select File
                            </Button>
                          </div>
                        </form>
                      </div>

                      {/* Right active lists */}
                      <div className="lg:col-span-6 space-y-3">
                        <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest font-bold block">SHARED CLOUD FILES</span>
                        <div className="space-y-2.5 bg-brand-black/20 p-2 border border-white/5 rounded-xl max-h-[300px] overflow-y-auto">
                          {uploadedFiles.map((file) => (
                            <div key={file.id} className="p-3 bg-brand-black/40 border border-white/5 rounded-lg flex justify-between items-center flex-wrap gap-4 group">
                              <div>
                                <div className="text-xs font-semibold text-white uppercase tracking-wider block truncate max-w-[180px]">{file.name}</div>
                                <span className="text-[10px] text-brand-gray font-mono block mt-0.5">{file.size} ● By {file.uploader}</span>
                              </div>
                              <button 
                                onClick={() => showToast(`System downloaded dynamic backup trigger: ${file.name}`)}
                                className="p-1.5 rounded bg-white/5 hover:bg-brand-cyan/15 text-brand-gray hover:text-brand-cyan transition-colors"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* 4. PROPOSALS TAB */}
                {activeTab === 'proposals' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Proposals</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Review scope, pricing, and accept proposals from your account team.</p>
                    </div>

                    {!sandboxMode && user ? (
                      <ClientProposalsPanel proposals={proposals} userId={user.id} showToast={showToast} onReload={loadPortalData} />
                    ) : (
                      <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">No proposals available in sandbox mode.</p>
                    )}
                  </div>
                )}

                {/* 5. INVOICES TAB */}
                {activeTab === 'invoices' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Invoices</h2>
                      <p className="text-xs text-brand-gray mt-0.5">View billing statements, download receipts, and pay milestones.</p>
                    </div>

                    <ClientInvoicesPanel
                      invoices={invoices}
                      onPay={(inv) => openInvoicePayment(inv, 'full')}
                      showToast={showToast}
                    />

                    {invoices.length === 0 && (
                      <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">
                        No invoices available yet. Your account manager will issue milestone billing here.
                      </p>
                    )}

                  </div>
                )}

                {/* 6. MESSAGES TAB */}
                {activeTab === 'messages' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Messages</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Threaded communication with your Jawrah Pixel account team.</p>
                    </div>

                    {!sandboxMode && user ? (
                      <ClientMessagesPanel
                        userId={user.id}
                        threads={threads}
                        showToast={showToast}
                        onReload={loadPortalData}
                      />
                    ) : (
                      <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">Messaging requires a live workspace connection.</p>
                    )}
                  </div>
                )}

                {/* 7. NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Notifications</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Project updates, proposals, invoices, files, and messages.</p>
                    </div>

                    <ClientNotificationsPanel
                      notifications={notifications}
                      onMarkRead={(id) => {
                        if (!user) return;
                        markNotificationRead(id).then(() => loadPortalData());
                      }}
                      onMarkAllRead={() => {
                        if (!user) return;
                        markAllNotificationsRead(user.id).then(() => loadPortalData());
                      }}
                    />
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Settings</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Update your basic contact details. Region and role are locked by Jawrah Pixel.</p>
                    </div>

                    <form onSubmit={handleSettingsSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-black/50 border border-white/5 rounded-xl p-5">
                      <Input
                        value={settingsForm.full_name}
                        onChange={(e) => setSettingsForm((prev) => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Full name"
                        className="h-11 text-xs"
                      />
                      <Input
                        value={settingsForm.company_name}
                        onChange={(e) => setSettingsForm((prev) => ({ ...prev, company_name: e.target.value }))}
                        placeholder="Company name"
                        className="h-11 text-xs"
                      />
                      <Input
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Phone"
                        className="h-11 text-xs"
                      />
                      <Input
                        value={settingsForm.whatsapp}
                        onChange={(e) => setSettingsForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
                        placeholder="WhatsApp"
                        className="h-11 text-xs"
                      />
                      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                          <span className="text-[9px] font-mono text-brand-gray uppercase block">Locked Region</span>
                          <span className="text-sm font-mono text-brand-cyan font-bold">{portalRegion.toUpperCase()} - {portalCurrency}</span>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                          <span className="text-[9px] font-mono text-brand-gray uppercase block">Role</span>
                          <span className="text-sm font-mono text-white font-bold">{profile?.role || 'client'}</span>
                        </div>
                      </div>
                      <Button type="submit" disabled={settingsSaving} className="sm:col-span-2 w-full text-xs font-mono uppercase tracking-widest h-10">
                        {settingsSaving ? 'Saving...' : 'Save Profile Settings'}
                      </Button>
                    </form>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        payload={paymentModalPayload}
      />
    </div>
  );
}
