import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import {
  AGENT_APPLICATION_STATUSES,
  CRM_PIPELINE,
  PROPOSAL_STATUSES,
  PROJECT_LIFECYCLE,
  formatLifecycleLabel,
} from '@/lib/platform/ecosystem';
import {
  createAdminInvoice,
  createProposal,
  createProjectUpdate,
  fetchAgentApplications,
  fetchMessageThreads,
  fetchProposals,
  fetchThreadMessages,
  sendProposal,
  sendThreadMessage,
  updateAgentApplication,
  updateCrmLead,
  updateProposal,
} from '@/lib/supabase/ecosystem-api';
import { currencyForRegion } from '@/lib/payments/config';
import type { RegionCode } from '@/types';

interface ToastFn {
  (message: string, type?: 'success' | 'error' | 'info'): void;
}

interface AdminEcosystemPanelsProps {
  activeTab: string;
  hasAdminRole: boolean;
  clients: any[];
  projects: any[];
  inquiries: any[];
  regionFilter: 'all' | RegionCode;
  showToast: ToastFn;
  onReload: () => void;
  adminUserId?: string;
}

function PanelLoading({ label }: { label: string }) {
  return (
    <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">
      Loading {label}...
    </p>
  );
}

function PanelError({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-300 text-xs font-mono uppercase tracking-wider">
      {message}
    </div>
  );
}

function PanelEmpty({ message }: { message: string }) {
  return (
    <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">
      {message}
    </p>
  );
}

export function AdminEcosystemPanels({
  activeTab,
  hasAdminRole,
  clients,
  projects,
  inquiries,
  regionFilter,
  showToast,
  onReload,
  adminUserId,
}: AdminEcosystemPanelsProps) {
  const [proposals, setProposals] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelError, setPanelError] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [leadSearch, setLeadSearch] = useState('');
  const [proposalForm, setProposalForm] = useState({
    inquiry_id: '',
    client_id: '',
    title: '',
    scope_of_work: '',
    timeline: '',
    deliverables: '',
    pricing: 0,
    currency: 'LKR',
    terms: '',
    region: 'lk' as RegionCode,
  });

  const applyProposalLead = (inquiryId: string) => {
    const inquiry = inquiries.find((item) => item.id === inquiryId);
    const matchedClient = clients.find(
      (client) => String(client.email || '').toLowerCase() === String(inquiry?.email || '').toLowerCase(),
    );

    if (!inquiry) {
      setProposalForm((prev) => ({ ...prev, inquiry_id: '' }));
      return;
    }

    const leadRegion = inquiry.region || (regionFilter === 'all' ? 'lk' : regionFilter);
    const safeRegion = (leadRegion === 'pk' || leadRegion === 'int' || leadRegion === 'lk' ? leadRegion : 'lk') as RegionCode;

    setProposalForm((prev) => ({
      ...prev,
      inquiry_id: inquiry.id,
      client_id: matchedClient?.id ?? prev.client_id,
      title: inquiry.service_interested ? `${inquiry.service_interested} Proposal` : prev.title,
      scope_of_work: inquiry.message || prev.scope_of_work,
      timeline: String(inquiry.notes || '').replace(/^Timeline:\s*/i, '') || prev.timeline,
      currency: currencyForRegion(safeRegion),
      region: safeRegion,
    }));
  };

  React.useEffect(() => {
    setPanelError(null);
    if (activeTab === 'proposals') {
      setPanelLoading(true);
      fetchProposals()
        .then(({ data, error }) => {
          if (error) setPanelError(error.message);
          setProposals(data ?? []);
        })
        .finally(() => setPanelLoading(false));
    }
    if (activeTab === 'agents') {
      setPanelLoading(true);
      fetchAgentApplications()
        .then(({ data, error }) => {
          if (error) setPanelError(error.message);
          setApplications(data ?? []);
        })
        .finally(() => setPanelLoading(false));
    }
    if (activeTab === 'messages') {
      setPanelLoading(true);
      fetchMessageThreads()
        .then(({ data, error }) => {
          if (error) setPanelError(error.message);
          setThreads(data ?? []);
        })
        .finally(() => setPanelLoading(false));
    }
  }, [activeTab]);

  React.useEffect(() => {
    if (selectedThread) {
      fetchThreadMessages(selectedThread).then(({ data, error }) => {
        if (error) setPanelError(error.message);
        setThreadMessages(data ?? []);
      });
    }
  }, [selectedThread]);

  if (activeTab === 'proposals') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Proposal System</h2>
          <p className="text-xs text-brand-gray mt-0.5">Create, send, and track premium client proposals.</p>
        </div>

        {hasAdminRole && (
          <div className="p-5 bg-brand-black/60 border border-white/5 rounded-xl space-y-4">
            <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest font-bold">Create Proposal</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={proposalForm.inquiry_id}
                onChange={(e) => applyProposalLead(e.target.value)}
                className="h-10 bg-brand-navy/40 border border-white/10 rounded px-3 text-xs text-white"
              >
                <option value="">Select Lead</option>
                {inquiries.map((inquiry) => (
                  <option key={inquiry.id} value={inquiry.id}>
                    {inquiry.full_name} - {inquiry.service_interested}
                  </option>
                ))}
              </select>
              <select
                value={proposalForm.client_id}
                onChange={(e) => setProposalForm((prev) => ({ ...prev, client_id: e.target.value }))}
                className="h-10 bg-brand-navy/40 border border-white/10 rounded px-3 text-xs text-white"
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.full_name || client.email}</option>
                ))}
              </select>
              <Input value={proposalForm.title} onChange={(e) => setProposalForm((p) => ({ ...p, title: e.target.value }))} placeholder="Proposal title" className="h-10 text-xs" />
              <Textarea value={proposalForm.scope_of_work} onChange={(e) => setProposalForm((p) => ({ ...p, scope_of_work: e.target.value }))} placeholder="Scope of work" className="text-xs min-h-[80px] sm:col-span-2" />
              <Input value={proposalForm.timeline} onChange={(e) => setProposalForm((p) => ({ ...p, timeline: e.target.value }))} placeholder="Timeline" className="h-10 text-xs" />
              <Input value={proposalForm.pricing} onChange={(e) => setProposalForm((p) => ({ ...p, pricing: Number(e.target.value) }))} placeholder="Pricing" type="number" className="h-10 text-xs" />
            </div>
            <Button
              size="sm"
              className="font-mono text-[10px] uppercase tracking-widest"
              onClick={async () => {
                const { error } = await createProposal({
                  client_id: proposalForm.client_id || null,
                  inquiry_id: proposalForm.inquiry_id || null,
                  title: proposalForm.title || 'Custom Proposal',
                  scope_of_work: proposalForm.scope_of_work,
                  timeline: proposalForm.timeline,
                  deliverables: proposalForm.deliverables,
                  pricing: proposalForm.pricing,
                  currency: proposalForm.currency,
                  terms: proposalForm.terms,
                  region: proposalForm.region,
                  status: 'draft',
                });
                if (error) showToast(error.message, 'error');
                else {
                  showToast('Proposal created.');
                  onReload();
                  fetchProposals().then(({ data }) => setProposals(data ?? []));
                }
              }}
            >
              Save Draft Proposal
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {panelLoading && <PanelLoading label="proposals" />}
          {panelError && <PanelError message={panelError} />}
          {!panelLoading && !panelError && proposals.length === 0 && <PanelEmpty message="No proposals created yet." />}
          {!panelLoading && !panelError && proposals.map((proposal) => (
            <div key={proposal.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-[10px] font-mono text-brand-cyan uppercase">{proposal.proposal_number}</span>
                  <h3 className="text-white font-semibold mt-1">{proposal.title}</h3>
                  <p className="text-xs text-brand-gray mt-1">{proposal.client?.full_name || proposal.client?.email || 'Unassigned client'}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {PROPOSAL_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateProposal(proposal.id, { status }).then(() => onReload())}
                      className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase border ${proposal.status === status ? 'bg-brand-cyan/20 border-brand-cyan/30 text-brand-cyan' : 'border-white/5 text-brand-gray'}`}
                    >
                      {status}
                    </button>
                  ))}
                  <Button size="sm" variant="outline" className="text-[9px] font-mono uppercase" onClick={() => sendProposal(proposal.id).then(() => showToast('Proposal sent.'))}>
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'agents') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Agent Applications</h2>
          <p className="text-xs text-brand-gray mt-0.5">Review, approve, or reject partner network applications.</p>
        </div>
        <div className="space-y-4">
          {panelLoading && <PanelLoading label="agent applications" />}
          {panelError && <PanelError message={panelError} />}
          {!panelLoading && !panelError && applications.length === 0 && <PanelEmpty message="No agent applications yet." />}
          {!panelLoading && !panelError && applications.map((app) => (
            <div key={app.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-white font-semibold">{app.applicant_name}</h3>
                  <p className="text-xs text-brand-gray">{app.applicant_email} • {app.region?.toUpperCase() || 'N/A'}</p>
                  <p className="text-xs text-brand-silver mt-2">{app.experience || app.message || 'No notes provided.'}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {AGENT_APPLICATION_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateAgentApplication(app.id, { status, reviewed_at: new Date().toISOString() }).then(() => {
                        showToast(`Application marked ${status}.`);
                        fetchAgentApplications().then(({ data }) => setApplications(data ?? []));
                      })}
                      className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase border ${app.status === status ? 'bg-brand-cyan/20 border-brand-cyan/30 text-brand-cyan' : 'border-white/5 text-brand-gray'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'messages') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Internal Messaging</h2>
          <p className="text-xs text-brand-gray mt-0.5">Client ↔ Admin conversation threads.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 space-y-2">
            {panelLoading && <PanelLoading label="messages" />}
            {panelError && <PanelError message={panelError} />}
            {!panelLoading && !panelError && threads.length === 0 && <PanelEmpty message="No message threads yet." />}
            {!panelLoading && !panelError && threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread.id)}
                className={`w-full text-left p-4 rounded-xl border ${selectedThread === thread.id ? 'border-brand-cyan/30 bg-brand-cyan/10' : 'border-white/5 bg-brand-black/40'}`}
              >
                <div className="text-xs text-white font-semibold">{thread.subject}</div>
                <div className="text-[10px] text-brand-gray mt-1">{thread.client?.full_name || thread.client?.email}</div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-8 p-4 bg-brand-black/60 border border-white/5 rounded-xl min-h-[320px] flex flex-col">
            {selectedThread ? (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                  {threadMessages.length === 0 && <PanelEmpty message="No messages in this thread yet." />}
                  {threadMessages.map((msg) => (
                    <div key={msg.id} className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-[10px] font-mono text-brand-cyan uppercase">{msg.sender?.full_name || 'Team'}</div>
                      <p className="text-xs text-brand-silver mt-1">{msg.body}</p>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!replyText.trim()) return;
                    await sendThreadMessage(selectedThread, adminUserId || '', replyText);
                    setReplyText('');
                    fetchThreadMessages(selectedThread).then(({ data }) => setThreadMessages(data ?? []));
                  }}
                  className="flex gap-2"
                >
                  <Input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Reply to client..." className="text-xs h-10" />
                  <Button type="submit" size="sm" className="font-mono text-[10px] uppercase">Send</Button>
                </form>
              </>
            ) : (
              <p className="text-xs text-brand-gray font-mono uppercase tracking-widest m-auto">Select a conversation thread</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'crm') {
    const filtered = inquiries.filter((inq) => {
      const matchesRegion = regionFilter === 'all' || inq.region === regionFilter;
      const q = leadSearch.toLowerCase();
      const matchesSearch = !q || [inq.full_name, inq.email, inq.company, inq.service_interested].some((v) => String(v || '').toLowerCase().includes(q));
      return matchesRegion && matchesSearch;
    });

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Agency CRM</h2>
            <p className="text-xs text-brand-gray mt-0.5">Lead pipeline, client history, and region filtering.</p>
          </div>
          <Input value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} placeholder="Search leads..." className="h-10 text-xs max-w-xs" />
        </div>
        <div className="space-y-4">
          {filtered.length === 0 && <PanelEmpty message="No CRM leads match this view." />}
          {filtered.map((inq) => (
            <div key={inq.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-white font-semibold">{inq.full_name}</h3>
                  <p className="text-xs text-brand-gray">{inq.email} • {inq.company || inq.business_name || 'No company'} • {inq.region?.toUpperCase()}</p>
                  <p className="text-xs text-brand-silver mt-2">{inq.service_interested} • {inq.budget_range || 'Budget TBD'}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {CRM_PIPELINE.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateCrmLead(inq.id, { status }).then(() => { showToast('Lead updated.'); onReload(); })}
                      className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase border ${inq.status === status ? 'bg-brand-cyan/20 border-brand-cyan/30 text-brand-cyan' : 'border-white/5 text-brand-gray'}`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'tracking') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Project Tracking</h2>
          <p className="text-xs text-brand-gray mt-0.5">Update lifecycle status, progress, and team assignments.</p>
        </div>
        <div className="space-y-4">
          {projects.length === 0 && <PanelEmpty message="No active project tracking records yet." />}
          {projects.map((project) => (
            <div key={project.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl space-y-4">
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-white font-semibold">{project.title}</h3>
                  <p className="text-xs text-brand-gray">{project.client?.full_name || 'Unassigned client'} • {project.progress || 0}%</p>
                </div>
                <select
                  value={project.status}
                  onChange={async (e) => {
                    await createProjectUpdate({
                      project_id: project.id,
                      status: e.target.value,
                      progress: undefined,
                      title: `Status updated to ${formatLifecycleLabel(e.target.value)}`,
                      body: `Project moved to ${formatLifecycleLabel(e.target.value)}.`,
                      created_by: null,
                    });
                    showToast('Project status updated.');
                    onReload();
                  }}
                  className="h-10 bg-brand-navy/40 border border-white/10 rounded px-3 text-xs text-white"
                >
                  {PROJECT_LIFECYCLE.map((status) => (
                    <option key={status} value={status}>{formatLifecycleLabel(status)}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export function AdminAnalyticsExtras({ analytics }: { analytics: any }) {
  if (!analytics?.regionBreakdown) return null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Total Clients', val: analytics.totalClients || 0 },
          { title: 'Conversion Rate', val: `${analytics.conversionRate || 0}%` },
          { title: 'Paid Revenue', val: (analytics.paidRevenue || 0).toLocaleString() },
        ].map((card) => (
          <div key={card.title} className="p-4 bg-brand-black/60 border border-white/5 rounded-xl">
            <span className="text-[9px] font-mono text-brand-gray uppercase">{card.title}</span>
            <div className="text-xl font-mono font-bold text-white mt-2">{card.val}</div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-brand-black/40 border border-white/5 rounded-xl">
        <h4 className="text-xs font-mono text-brand-cyan uppercase tracking-widest mb-4">Region Performance</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {analytics.regionBreakdown.map((row: any) => (
            <div key={row.region} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="text-[10px] font-mono text-brand-gray uppercase">{row.region}</div>
              <div className="text-sm text-white mt-2">Leads: {row.leads}</div>
              <div className="text-sm text-brand-silver">Clients: {row.clients}</div>
              <div className="text-sm text-brand-silver">Projects: {row.projects}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
