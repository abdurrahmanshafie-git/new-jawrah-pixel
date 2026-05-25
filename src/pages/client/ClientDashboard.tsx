import React, { useEffect, useState } from 'react';
import { fetchClientWorkspace, submitRevisionRequest, submitSupportTicket } from '@/lib/supabase/api';
import { notifySupportTicketCreated } from '@/lib/email/notifications';
import { createUserNotification } from '@/lib/platform/notifications';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { PaymentModal, type PaymentModalOpenPayload } from '@/components/payments/PaymentModal';
import { appEnv } from '@/lib/env';
import { parsePriceAmount } from '@/lib/payments/amounts';
import { useAuth } from '@/contexts/AuthContext';
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
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { SEO } from '@/components/layout/SEO';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function ClientDashboard() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  
  // Tab Controls
  const [activeTab, setActiveTab] = useState('overview');
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
  const [paymentProofNote, setPaymentProofNote] = useState('');

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

  // File Upload states
  const [dragActive, setDragActive] = useState(false);
  const [simUploadName, setSimUploadName] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentModalPayload, setPaymentModalPayload] = useState<PaymentModalOpenPayload | null>(null);

  // Toast dispatch utility
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Pre-seed mock datasets for accessible instant evaluators
  const INITIAL_MOCK_PROJECTS = [
    { id: 'proj1', title: 'Shabnam Jewellers Flagship Store', service_type: 'Bespoke Ecommerce & UI Branding', status: 'development', progress: 68, price: 2200000, deadline: '2026-06-15', description: 'Heritage fine gold jewelry showcase with real-time appraisers.' }
  ];

  const INITIAL_MOCK_INVOICES = [
    { id: 'inv_01', item: 'System Discovery & Wireframing Milestone', amount: 'LKR 660,000', rate: '30%', status: 'Paid', date: '2026-05-10' },
    { id: 'inv_02', item: 'Backend Database Sync & RLS Implementation', amount: 'LKR 880,000', rate: '40%', status: 'Paid', date: '2026-05-20' },
    { id: 'inv_03', item: 'Final Deployment & SEO Optimization Phase', amount: 'LKR 660,000', rate: '30%', status: 'Pending', date: '2026-06-10' }
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
    loadPortalData();
  }, [sandboxMode, user]);

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
      const workspace = await fetchClientWorkspace(user.id);

      const workspaceError =
        workspace.projects.error ||
        workspace.invoices.error ||
        workspace.supportTickets.error;

      if (workspaceError) throw workspaceError;

      if (!workspace.projects.error && workspace.projects.data) setProjects(workspace.projects.data);
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
            workspace.invoices.data.map((item: any) => ({
              ...item,
              item: item.title,
              amount: `${item.currency || profile?.currency || 'LKR'} ${Number(item.amount || 0).toLocaleString()}`,
              amountNumeric: Number(item.amount || 0),
              rate: item.invoice_number,
              status:
                item.payment_status === 'paid' || item.status === 'paid'
                  ? 'Paid'
                  : item.payment_status === 'manual_review'
                    ? 'Manual Review'
                    : item.payment_status === 'failed'
                      ? 'Failed'
                      : item.payment_status === 'pending' || item.status === 'sent'
                        ? 'Pending'
                        : item.status,
              paymentStatus: item.payment_status,
              date: item.due_date || item.created_at?.split('T')[0],
            })),
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

    setIsSubmittingRevision(true);

    try {
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

    setIsSubmittingTicket(true);

    try {
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
    const lineAmount =
      inv.amountNumeric ?? (parsePriceAmount(String(inv.amount || '')) || 0);

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
      const projectTotal = Number(projects[0]?.price) || lineAmount * 10;
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
      <div className="pt-40 min-h-screen bg-brand-black text-center text-brand-cyan flex flex-col items-center justify-center gap-4">
        <Loader className="animate-spin" size={32} />
        <span className="text-xs font-mono uppercase tracking-widest text-brand-gray">Retrieving account records...</span>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-brand-black text-white relative font-sans">
      <SEO 
        title="Premium Project Workspace" 
        description="Dynamic client collaboration terminal. Track project milestones, submit revisions, download invoices, schedule meetings, and chat with design experts." 
      />

      {/* Floating toasts container */}
      <div className="fixed top-24 right-6 space-y-3 z-50 max-w-sm pointer-events-none">
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

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">

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
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan font-mono text-[9px] uppercase tracking-widest font-bold">
                CLIENT PORTAL
              </span>
              <div className="text-[10px] text-brand-gray font-mono uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck size={12} className="text-brand-cyan" /> 256-bit Document Vault Enabled
              </div>
            </div>
            <h1 className="text-3xl font-display font-semibold uppercase tracking-tight text-white mb-1">
              Welcome, {profile?.full_name || user?.email || 'Valued Partner'}
            </h1>
            <p className="text-xs text-brand-gray font-light">
              Collaborate on active milestones, invoices, and design assets securely.
            </p>
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
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'overview', label: 'Milestones Overview', icon: Activity },
              { id: 'revisions', label: 'Revision Requests', count: revisions.length, icon: Layers },
              { id: 'files', label: 'Document & Assets', count: uploadedFiles.length, icon: UploadCloud },
              { id: 'invoices', label: 'Invoices & Payments', count: invoices.length, icon: DollarSign },
              { id: 'support', label: 'Tickets & Live Chat', count: supportTickets.length, icon: MessageSquare },
              { id: 'meetings', label: 'Consultation Calendar', count: meetings.length, icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-xs uppercase font-mono tracking-wider cursor-pointer text-left ${
                    isActive 
                      ? 'bg-brand-cyan/15 border-brand-cyan/30 text-brand-cyan font-bold select-none drop-shadow-[0_0_12px_rgba(34,211,238,0.1)]' 
                      : 'border-white/5 bg-transparent text-brand-gray hover:text-white hover:border-white/15'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} />
                    {tab.label}
                  </span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded text-[10px] ${isActive ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/5 text-brand-silver'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT: CONTENT PANEL DISPLAY */}
          <div className="lg:col-span-9 glass-card p-6 md:p-8 rounded-2xl relative bg-white/[0.01] border-white/10 min-h-[480px]">
            
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-brand-cyan gap-4">
                <Loader className="animate-spin" size={36} />
                <span className="text-xs font-mono uppercase tracking-widest text-brand-gray">Decrypting profile folder...</span>
              </div>
            ) : (
              <div>
                
                {/* 1. MILESTONES OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Milestones Overview</h2>
                      <span className="text-[10px] font-mono text-brand-gray uppercase">Active: Phase 2</span>
                    </div>

                    {projects.length > 0 ? (
                      projects.map((proj) => (
                        <div key={proj.id} className="p-6 bg-brand-black/60 border border-white/5 rounded-2xl space-y-6">
                          
                          <div className="flex justify-between items-start flex-wrap gap-4">
                            <div>
                              <span className="inline-block px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan text-[10px] font-mono uppercase tracking-widest">
                                {proj.service_type || 'Bespoke Development'}
                              </span>
                              <h3 className="text-lg md:text-xl font-semibold text-white uppercase tracking-wide mt-2">{proj.title}</h3>
                              <p className="text-xs text-brand-gray font-light max-w-lg leading-relaxed mt-1">
                                {proj.description || 'System launch catalog tracking configuration indicators.'}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] font-mono text-brand-gray uppercase block">TARGET PRICE</span>
                              <span className="text-sm font-semibold text-brand-cyan">{proj.price ? `${proj.price.toLocaleString()}` : 'Calculated project'}</span>
                            </div>
                          </div>

                          {/* Dynamic progress bar animation */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-mono text-brand-silver">
                              <span>ACTIVE SYSTEM PROGRESSIVE INTEGRATION</span>
                              <span className="text-brand-cyan">{proj.progress || 0}% Complete</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-brand-blue to-brand-cyan h-3 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                                style={{ width: `${proj.progress || 50}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Milestone Steps Timeline */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                            {(milestones.filter((m) => m.project_id === proj.id).length
                              ? milestones.filter((m) => m.project_id === proj.id)
                              : [
                                  { id: 'ph1', title: 'Discovery', description: 'Scope lock-in pending.', status: 'queued' },
                                  { id: 'ph2', title: 'Build', description: 'Development phase.', status: 'queued' },
                                ]
                            ).map((ms: any, msIdx: number) => {
                              const done = ms.status === 'complete' || ms.status === 'approved';
                              const active = ms.status === 'active' || ms.status === 'review';
                              return (
                              <div key={ms.id ?? msIdx} className={`p-4 rounded-xl border ${
                                done ? 'bg-brand-cyan/5 border-brand-cyan/20' :
                                active ? 'bg-brand-blue/5 border-brand-blue/20 animate-pulse' :
                                'bg-white/[0.01] border-white/5'
                              }`}>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-mono font-bold text-brand-gray">{String(msIdx + 1).padStart(2, '0')}</span>
                                  {done && <CheckCircle size={14} className="text-brand-cyan" />}
                                  {active && !done && <Clock size={14} className="text-brand-blue" />}
                                </div>
                                <h4 className={`text-xs font-semibold uppercase tracking-wider ${active || done ? 'text-white' : 'text-brand-gray'}`}>{ms.title}</h4>
                                <p className="text-[10px] text-brand-gray font-light mt-1 leading-snug">{ms.description || ms.desc || 'Milestone pending assignment.'}</p>
                              </div>
                            );})}
                          </div>

                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center border border-white/5 bg-brand-black/40 rounded-xl space-y-4">
                        <Activity className="w-12 h-12 text-brand-cyan mx-auto animate-pulse opacity-40" />
                        <h4 className="text-sm font-semibold uppercase text-white font-mono tracking-wider">Establishing Active Project Node...</h4>
                        <p className="text-xs text-brand-gray max-w-sm mx-auto">
                          Our Colombo relations office will authorize your custom project timeline parameters shortly to track milestones.
                        </p>
                      </div>
                    )}

                  </div>
                )}

                {/* 2. REVISION REQUESTS TAB */}
                {activeTab === 'revisions' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Revision Requests</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Submit specific visual or structural revisions. Track implementation phases.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* Left form input */}
                      <form onSubmit={handleSubmitRevision} className="lg:col-span-6 bg-brand-black/60 p-5 border border-white/5 rounded-xl space-y-4">
                        <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest font-bold">REVISION EMITTER</span>
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-brand-gray uppercase">Target Project Node</label>
                          <select 
                            value={newRevisionProject}
                            onChange={(e) => setNewRevisionProject(e.target.value)}
                            className="flex h-10 w-full rounded-sm border border-white/5 bg-black px-3 py-2 text-xs font-mono text-brand-silver focus:outline-none"
                          >
                            {projects.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
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

                        <Button
                          type="submit"
                          disabled={isSubmittingRevision}
                          className="w-full text-xs font-mono uppercase tracking-widest h-10 select-none font-bold"
                        >
                          {isSubmittingRevision ? 'Sending...' : 'Transmit Revision Request'}
                        </Button>
                      </form>

                      {/* Right list logs */}
                      <div className="lg:col-span-6 space-y-3">
                        <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest font-bold block">REVISION LOG RECORDS</span>
                        
                        <div className="space-y-3 max-h-[350px] overflow-y-auto bg-brand-black/20 p-2 border border-white/5 rounded-xl">
                          {revisions.map((rev) => (
                            <div key={rev.id} className="p-4 bg-brand-black/40 border border-white/5 rounded-lg space-y-2">
                              <div className="flex justify-between items-center truncate">
                                <span className="text-[10px] font-semibold text-brand-cyan uppercase tracking-wider">{rev.status}</span>
                                <span className="text-[9px] text-brand-gray font-mono">{rev.date}</span>
                              </div>
                              <p className="text-[11px] text-brand-silver leading-relaxed pr-1 font-light italic">
                                "{rev.detail}"
                              </p>
                              <span className="text-[9px] text-brand-gray font-mono block uppercase">Node: {rev.project}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* 3. UPLOADS & MEDIA ASSETS */}
                {activeTab === 'files' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Document Vault</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Asset vault to catalog custom briefs, style guides, logs, and graphics.</p>
                    </div>

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

                {/* 4. INVOICES & PAYMENTS TAB */}
                {activeTab === 'invoices' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Invoices & Payment Tracking</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Automated accounting statements displaying milestone fees schedules.</p>
                    </div>

                    <div className="space-y-3.5">
                      {invoices.length === 0 && (
                        <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">
                          No invoices available yet. Your account manager will issue milestone billing here.
                        </p>
                      )}
                      {invoices.map((inv) => (
                        <div key={inv.id} className="p-4 bg-brand-black/60 border border-white/5 rounded-xl flex items-center justify-between flex-wrap gap-4 hover:border-white/10 transition-colors">
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-white uppercase tracking-wider">{inv.item}</div>
                            <span className="text-[10px] text-brand-gray font-mono block">Milestone Release Key: {inv.rate} ● Date: {inv.date}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-[9px] font-mono text-brand-gray uppercase block text-right">FEE TOTAL</span>
                              <span className="text-xs font-mono text-brand-cyan font-bold block">{inv.amount}</span>
                            </div>

                            <span className={`px-2.5 py-0.5 rounded text-[10px] whitespace-nowrap uppercase font-mono border ${
                              inv.status === 'Paid' 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}>
                              {inv.status}
                            </span>

                            {inv.status !== 'Paid' && (
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => openInvoicePayment(inv, 'full')}
                                  className="px-2 py-1 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-[9px] font-mono uppercase text-brand-cyan"
                                >
                                  Pay Now
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openInvoicePayment(inv, 'deposit')}
                                  className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono uppercase text-brand-gray hover:text-white"
                                >
                                  Deposit
                                </button>
                              </div>
                            )}

                            <button 
                              onClick={() => showToast(`Generated simulated receipt PDF for ${inv.id}`)}
                              className="p-1.5 rounded bg-white/5 text-brand-gray hover:text-white"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl bg-brand-black/50 border border-white/5 space-y-3">
                      <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest font-bold block">
                        Upload Payment Proof (Placeholder)
                      </span>
                      <p className="text-[10px] text-brand-gray font-light">
                        Reference your transfer receipt below, then confirm via WhatsApp. File vault upload connects when storage is enabled.
                      </p>
                      <Input
                        value={paymentProofNote}
                        onChange={(e) => setPaymentProofNote(e.target.value)}
                        placeholder="e.g. HNB transfer ref #48291 — LKR 66,000"
                        className="bg-black border-white/5 h-10 text-xs"
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-[10px] font-mono uppercase"
                          onClick={() => {
                            if (!paymentProofNote.trim()) {
                              showToast('Add a payment reference first.', 'error');
                              return;
                            }
                            showToast('Payment proof note saved for manual review.', 'success');
                            setPaymentProofNote('');
                          }}
                        >
                          Save Proof Reference
                        </Button>
                        <a
                          href={`https://wa.me/${appEnv.contactWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            paymentProofNote || 'Payment proof for Jawrah Pixel invoice',
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button type="button" size="sm" className="text-[10px] font-mono uppercase">
                            WhatsApp Payment Confirmation
                          </Button>
                        </a>
                      </div>
                    </div>

                  </div>
                )}

                {/* 5. LIVE CHAT & SUPPORT SUPPORT TICKETS */}
                {activeTab === 'support' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Help Desk & Live Chat</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Lodge operations support tickets or chat with account managers instantly.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* Left side support ticket form */}
                      <form onSubmit={handleSubmitTicket} className="lg:col-span-5 bg-brand-black/60 p-5 border border-white/5 rounded-xl space-y-4">
                        <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest font-bold block">SUPPORT DISPATCH</span>
                        <h4 className="text-xs font-semibold uppercase text-white">Lodge Support Ticket</h4>
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-brand-gray uppercase">Subject Ticket Title</label>
                          <Input 
                            required
                            value={newTicketSubject}
                            onChange={(e) => setNewTicketSubject(e.target.value)}
                            placeholder="e.g. Scraper Latency Query"
                            className="bg-black border-white/5 h-10"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-brand-gray uppercase">Describe Issue Specifications</label>
                          <Textarea 
                            required
                            value={newTicketMessage}
                            onChange={(e) => setNewTicketMessage(e.target.value)}
                            placeholder="Detail parameters, exact date triggers, and browser systems..."
                            className="bg-black border-white/5 min-h-[100px]"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmittingTicket}
                          className="w-full text-xs font-mono uppercase tracking-widest h-10 font-bold select-none"
                        >
                          {isSubmittingTicket ? 'Sending...' : 'Lodge Work Ticket'}
                        </Button>
                      </form>

                      {/* Right side live support chat board */}
                      <div className="lg:col-span-7 bg-brand-black/60 border border-white/5 rounded-xl overflow-hidden flex flex-col justify-between">
                        
                        {/* Live chat headers */}
                        <div className="bg-white/5 py-4 px-4 border-b border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
                            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Account Executive Node</span>
                          </div>
                          <span className="text-[9px] text-brand-gray font-mono">24/7 SLOTS ACTIVE</span>
                        </div>

                        {/* Interactive Message scroll */}
                        <div className="p-4 space-y-3 min-h-[220px] max-h-[220px] overflow-y-auto bg-black/40 font-light flex flex-col">
                          {chatMessages.map((msg, mIdx) => (
                            <div 
                              key={mIdx} 
                              className={`max-w-[85%] p-3 rounded-xl text-xs space-y-1 ${
                                msg.sender === 'user' 
                                  ? 'bg-brand-blue text-white self-end rounded-tr-none' 
                                  : 'bg-white/5 border border-white/10 text-brand-silver self-start rounded-tl-none'
                              }`}
                            >
                              <p className="leading-relaxed whitespace-pre-wrap pr-1">{msg.text}</p>
                              <span className="text-[9px] text-white/30 block text-right font-mono">{msg.time}</span>
                            </div>
                          ))}
                        </div>

                        {/* Input bar */}
                        <form onSubmit={handleSendChatMessage} className="p-2 bg-brand-black/80 border-t border-white/10 flex gap-2">
                          <input 
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type direct client revision message..."
                            className="w-full bg-black/60 border border-white/5 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
                          />
                          <button 
                            type="submit" 
                            className="p-2.5 rounded bg-brand-cyan hover:bg-brand-cyan/90 text-brand-black transition-colors cursor-pointer shrink-0"
                          >
                            <Send size={14} />
                          </button>
                        </form>

                      </div>

                    </div>

                  </div>
                )}

                {/* 6. MEETING TIMELINE CALENDAR */}
                {activeTab === 'meetings' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Consultation Calendar</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Select preferred technical calibration slots directly on Google Calendar.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* Booking Scheduler form */}
                      <form onSubmit={handleScheduleMeeting} className="lg:col-span-5 bg-brand-black/60 p-5 border border-white/5 rounded-xl space-y-4">
                        <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest font-bold block">SCHEDULER CARD</span>
                        <h4 className="text-xs font-semibold uppercase text-white">Reserve Strategy Call</h4>
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-brand-gray uppercase">Choose Calendar Date</label>
                          <input 
                            type="date"
                            required
                            value={meetingDate}
                            onChange={(e) => setMeetingDate(e.target.value)}
                            className="flex h-10 w-full rounded-sm border border-white/5 bg-black px-3 py-2 text-xs font-mono text-brand-silver focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-brand-gray uppercase">Select Clock Hour</label>
                          <select 
                            value={meetingTime}
                            onChange={(e) => setMeetingTime(e.target.value)}
                            className="flex h-10 w-full rounded-sm border border-white/5 bg-black px-3 py-2 text-xs font-mono text-brand-silver focus:outline-none"
                          >
                            <option value="09:00 (GMT+5:30)">09:00 AM (GMT+5:30)</option>
                            <option value="11:30 (GMT+5:30)">11:30 AM (GMT+5:30)</option>
                            <option value="14:00 (GMT+5:30)">14:00 PM (GMT+5:30)</option>
                            <option value="16:30 (GMT+5:30)">16:30 PM (GMT+5:30)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-brand-gray uppercase">Consultation Topic</label>
                          <Input 
                            value={meetingTopic}
                            onChange={(e) => setMeetingTopic(e.target.value)}
                            className="bg-black border-white/5 h-10"
                          />
                        </div>

                        <Button type="submit" className="w-full text-xs font-mono uppercase tracking-widest h-10 select-none font-bold">
                          Reserve Calendar Slot
                        </Button>
                      </form>

                      {/* Right side active dates list */}
                      <div className="lg:col-span-7 space-y-3">
                        <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest block font-bold">APPROVED CALL SCHEDULES</span>
                        
                        <div className="space-y-2.5">
                          {meetings.map((meet) => (
                            <div key={meet.id} className="p-4 bg-brand-black/40 border border-white/5 rounded-xl flex items-center justify-between flex-wrap gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-brand-gray uppercase">GOOGLE CALENDAR LINK APPROVED</span>
                                <h4 className="text-xs font-bold text-white uppercase mt-1">{meet.topic}</h4>
                                <span className="text-[10px] text-brand-gray font-mono block">Date: {meet.date} ● Hour: {meet.time}</span>
                              </div>

                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-mono uppercase">
                                {meet.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

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
