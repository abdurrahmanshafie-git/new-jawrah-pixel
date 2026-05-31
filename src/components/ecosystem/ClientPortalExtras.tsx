import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, Download, FileText, MessageSquare, UploadCloud } from 'lucide-react';
import { InvoiceBillingSummary } from '@/components/billing/InvoiceBillingSummary';
import { formatPayButtonLabel } from '@/lib/billing/format';
import { paymentStatusLabel } from '@/lib/billing/calculations';
import { BillingPdfActions } from '@/components/billing/BillingPdfActions';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import {
  acceptProposal,
  createMessageThread,
  fetchThreadMessages,
  getProjectFileUrl,
  markAllNotificationsRead,
  downloadInvoiceRecord,
  markNotificationRead,
  requestProposalRevision,
  sendThreadMessage,
  uploadProjectFile,
} from '@/lib/supabase/ecosystem-api';
import {
  formatLifecycleLabel,
  FILE_CATEGORIES,
  isActiveProject,
  isCompletedProject,
  isPendingProject,
  PROJECT_LIFECYCLE,
} from '@/lib/platform/ecosystem';

interface ToastFn {
  (message: string, type?: 'success' | 'info' | 'error'): void;
}

interface ClientPortalExtrasProps {
  userId: string;
  projects: any[];
  proposals: any[];
  notifications: any[];
  updates: any[];
  threads: any[];
  uploadedFiles: any[];
  invoices: any[];
  sandboxMode: boolean;
  showToast: ToastFn;
  onReload: () => void;
}

export function ClientOverviewExtras({
  projects,
  notifications,
  updates,
  invoices,
}: Pick<ClientPortalExtrasProps, 'projects' | 'notifications' | 'updates' | 'invoices'>) {
  const active = projects.filter((p) => isActiveProject(p.status));
  const pending = projects.filter((p) => isPendingProject(p.status));
  const completed = projects.filter((p) => isCompletedProject(p.status));
  const unpaid = invoices.filter((inv) => {
    const status = String(inv.status || '').toLowerCase();
    const paymentStatus = String(inv.payment_status || '').toLowerCase();
    return status !== 'paid' && paymentStatus !== 'paid';
  });
  const unread = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Active Projects', val: active.length },
          { label: 'Pending Projects', val: pending.length },
          { label: 'Completed Projects', val: completed.length },
        ].map((card) => (
          <div key={card.label} className="p-4 bg-brand-black/60 border border-white/5 rounded-xl">
            <span className="text-[9px] font-mono text-brand-gray uppercase">{card.label}</span>
            <div className="text-2xl font-mono font-bold text-white mt-2">{card.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 bg-brand-black/60 border border-white/5 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={14} className="text-brand-cyan" />
            <h4 className="text-xs font-mono uppercase text-white tracking-widest">Notifications</h4>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {notifications.slice(0, 5).map((note) => (
              <div key={note.id} className="p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="text-xs text-white font-semibold">{note.title}</div>
                <p className="text-[10px] text-brand-gray mt-1">{note.body}</p>
              </div>
            ))}
            {notifications.length === 0 && <p className="text-[10px] text-brand-gray font-mono uppercase">No notifications yet.</p>}
          </div>
        </div>

        <div className="p-4 bg-brand-black/60 border border-white/5 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={14} className="text-brand-cyan" />
            <h4 className="text-xs font-mono uppercase text-white tracking-widest">Recent Activity</h4>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {updates.slice(0, 5).map((update) => (
              <div key={update.id} className="p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="text-[10px] font-mono text-brand-cyan uppercase">{update.project?.title || 'Project Update'}</div>
                <p className="text-xs text-brand-silver mt-1">{update.title}</p>
              </div>
            ))}
            {updates.length === 0 && <p className="text-[10px] text-brand-gray font-mono uppercase">Team updates will appear here.</p>}
          </div>
        </div>
      </div>

      <div className="p-4 bg-brand-black/60 border border-white/5 rounded-xl">
        <h4 className="text-xs font-mono uppercase text-white tracking-widest mb-2">Payment Status</h4>
        <p className="text-xs text-brand-gray">{unpaid.length} invoice(s) pending payment.</p>
        {unread > 0 && (
          <p className="text-xs text-brand-cyan mt-2">{unread} unread notification(s).</p>
        )}
      </div>
    </div>
  );
}

export function ClientProposalsPanel({
  proposals,
  userId,
  showToast,
  onReload,
}: Pick<ClientPortalExtrasProps, 'proposals' | 'userId' | 'showToast' | 'onReload'>) {
  const [revisionProposalId, setRevisionProposalId] = useState<string | null>(null);
  const [revisionMessage, setRevisionMessage] = useState('');
  const [revisionSubmitting, setRevisionSubmitting] = useState(false);

  const submitRevisionRequest = async (proposalId: string) => {
    if (!revisionMessage.trim()) {
      showToast('Add revision notes before sending.', 'info');
      return;
    }

    setRevisionSubmitting(true);
    const { error } = await requestProposalRevision(proposalId, userId, revisionMessage.trim());
    setRevisionSubmitting(false);

    if (error) {
      showToast(error.message, 'error');
      return;
    }

    showToast('Revision request sent.');
    setRevisionProposalId(null);
    setRevisionMessage('');
    onReload();
  };

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
          <div className="flex justify-between gap-4 flex-wrap">
            <div>
              <span className="text-[10px] font-mono text-brand-cyan uppercase">{proposal.proposal_number}</span>
              <h3 className="text-white font-semibold mt-1">{proposal.title}</h3>
              <p className="text-xs text-brand-gray mt-2">{proposal.scope_of_work || 'Scope details attached.'}</p>
              <p className="text-xs text-brand-silver mt-1">Timeline: {proposal.timeline || 'TBD'} • {proposal.currency} {Number(proposal.pricing || 0).toLocaleString()}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase text-brand-cyan">{proposal.status}</span>
              {(proposal.status === 'sent' || proposal.status === 'viewed') && (
                <>
                  <Button size="sm" className="text-[9px] font-mono uppercase" onClick={() => acceptProposal(proposal.id, userId).then(() => { showToast('Proposal accepted.'); onReload(); })}>
                    Accept Proposal
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[9px] font-mono uppercase"
                    onClick={() => setRevisionProposalId(revisionProposalId === proposal.id ? null : proposal.id)}
                  >
                    Request Revision
                  </Button>
                </>
              )}
            </div>
          </div>
          {revisionProposalId === proposal.id && (
            <form
              className="mt-4 pt-4 border-t border-white/5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void submitRevisionRequest(proposal.id);
              }}
            >
              <Textarea
                value={revisionMessage}
                onChange={(e) => setRevisionMessage(e.target.value)}
                placeholder="Revision request"
                className="text-xs min-h-[90px]"
              />
              <Button
                type="submit"
                size="sm"
                className="text-[9px] font-mono uppercase"
                disabled={revisionSubmitting}
              >
                Send Revision Request
              </Button>
            </form>
          )}
        </div>
      ))}
      {proposals.length === 0 && <p className="text-xs text-brand-gray font-mono uppercase tracking-widest">No proposals yet.</p>}
    </div>
  );
}

export function ClientFilesPanel({
  userId,
  projects,
  uploadedFiles,
  sandboxMode,
  showToast,
  onReload,
}: Pick<ClientPortalExtrasProps, 'userId' | 'projects' | 'uploadedFiles' | 'sandboxMode' | 'showToast' | 'onReload'>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [category, setCategory] = useState<(typeof FILE_CATEGORIES)[number]>('project');

  const handleUpload = async (file: File) => {
    if (sandboxMode) {
      showToast('Switch to Live DB mode to upload files.', 'info');
      return;
    }
    const { error } = await uploadProjectFile({
      clientId: userId,
      projectId: projectId || null,
      file,
      category,
      uploadedBy: userId,
    });
    if (error) showToast(error.message, 'error');
    else {
      showToast('File uploaded successfully.');
      onReload();
    }
  };

  return (
    <div className="space-y-4">
      {!sandboxMode && (
        <div className="p-4 bg-brand-black/60 border border-white/5 rounded-xl space-y-3">
          <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="h-10 w-full bg-black border border-white/10 rounded px-3 text-xs text-white">
            {FILE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
            ))}
          </select>
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="h-10 w-full bg-black border border-white/10 rounded px-3 text-xs text-white">
            {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            <option value="">General Upload</option>
          </select>
          <input ref={inputRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          <Button size="sm" className="font-mono text-[10px] uppercase" onClick={() => inputRef.current?.click()}>
            <UploadCloud size={14} className="mr-2" /> Upload Project File
          </Button>
        </div>
      )}

      {uploadedFiles.map((file) => (
        <div key={file.id} className="p-4 bg-brand-black/60 border border-white/5 rounded-xl flex justify-between gap-4 items-center">
          <div>
            <div className="text-xs text-white font-semibold">{file.file_name}</div>
            <div className="text-[10px] text-brand-gray font-mono uppercase mt-1">{file.file_category || 'project'}</div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-[9px] font-mono uppercase"
            onClick={async () => {
              const { data, error } = await getProjectFileUrl(file.storage_path);
              if (error || !data?.signedUrl) showToast('Download unavailable.', 'error');
              else window.open(data.signedUrl, '_blank');
            }}
          >
            <Download size={12} className="mr-1" /> Download
          </Button>
        </div>
      ))}
    </div>
  );
}

export function ClientMessagesPanel({
  userId,
  threads,
  showToast,
  onReload,
}: Pick<ClientPortalExtrasProps, 'userId' | 'threads' | 'showToast' | 'onReload'>) {
  const [selectedThread, setSelectedThread] = useState<string | null>(threads[0]?.id || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [reply, setReply] = useState('');
  const attachmentRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (selectedThread) fetchThreadMessages(selectedThread).then(({ data }) => setMessages(data ?? []));
  }, [selectedThread]);

  return (
    <div className="space-y-4">
      <form
        className="p-4 bg-brand-black/60 border border-white/5 rounded-xl space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await createMessageThread({ client_id: userId, subject: subject || 'Client Message', status: 'open' }, body, userId);
          showToast('Message thread created.');
          setSubject('');
          setBody('');
          onReload();
        }}
      >
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="h-10 text-xs" />
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message..." className="text-xs min-h-[100px]" />
        <Button type="submit" size="sm" className="font-mono text-[10px] uppercase"><MessageSquare size={12} className="mr-1" /> Start Conversation</Button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 space-y-2">
          {threads.map((thread) => (
            <button key={thread.id} onClick={() => setSelectedThread(thread.id)} className={`w-full text-left p-3 rounded-xl border ${selectedThread === thread.id ? 'border-brand-cyan/30 bg-brand-cyan/10' : 'border-white/5 bg-brand-black/40'}`}>
              <div className="text-xs text-white">{thread.subject}</div>
            </button>
          ))}
        </div>
        <div className="lg:col-span-8 p-4 bg-brand-black/60 border border-white/5 rounded-xl min-h-[260px] flex flex-col">
          <div className="flex-1 space-y-2 overflow-y-auto mb-3">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="text-[10px] font-mono text-brand-cyan uppercase">{msg.sender?.full_name || 'Team'}</div>
                <p className="text-xs text-brand-silver mt-1">{msg.body}</p>
                {msg.attachment_path && (
                  <p className="text-[10px] text-brand-cyan mt-1 font-mono">Attachment included</p>
                )}
                {!msg.read_at && msg.sender_id !== userId && (
                  <span className="text-[9px] text-brand-cyan font-mono uppercase">Unread</span>
                )}
              </div>
            ))}
          </div>
          {selectedThread && (
            <form
              className="flex flex-col gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                await sendThreadMessage(selectedThread, userId, reply);
                setReply('');
                fetchThreadMessages(selectedThread).then(({ data }) => setMessages(data ?? []));
              }}
            >
              <div className="flex gap-2">
                <Input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply..." className="h-10 text-xs" />
                <Button type="submit" size="sm" className="font-mono text-[10px] uppercase">Send</Button>
              </div>
              <input ref={attachmentRef} type="file" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !selectedThread) return;
                const { data, error } = await uploadProjectFile({ clientId: userId, file, uploadedBy: userId, category: 'asset' });
                if (error) showToast(error.message, 'error');
                else await sendThreadMessage(selectedThread, userId, `Attachment: ${file.name}`, data?.storage_path);
                fetchThreadMessages(selectedThread).then(({ data }) => setMessages(data ?? []));
              }} />
              <Button type="button" size="sm" variant="outline" className="text-[9px] font-mono uppercase w-fit" onClick={() => attachmentRef.current?.click()}>
                Attach File
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function ClientNotificationsBar({
  notifications,
  onMarkRead,
}: {
  notifications: any[];
  onMarkRead: () => void;
}) {
  const unread = notifications.filter((n) => !n.read_at).length;
  if (!unread) return null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Bell size={16} className="text-brand-cyan" />
        <span className="text-xs text-white">{unread} unread notification(s)</span>
      </div>
      <Button size="sm" variant="outline" className="text-[9px] font-mono uppercase" onClick={onMarkRead}>Mark all read</Button>
    </div>
  );
}

export function ClientProjectsPanel({
  projects,
  milestones,
  updates,
}: {
  projects: any[];
  milestones: any[];
  updates: any[];
}) {
  if (!projects.length) {
    return (
      <div className="p-12 text-center border border-white/5 bg-brand-black/40 rounded-xl space-y-4">
        <CheckCircle className="w-12 h-12 text-brand-cyan mx-auto opacity-40" />
        <h4 className="text-sm font-semibold uppercase text-white font-mono tracking-wider">No Active Projects Yet</h4>
        <p className="text-xs text-brand-gray max-w-sm mx-auto">Your project timeline will appear here once your account is assigned.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((proj) => {
        const projectUpdates = updates.filter((u) => u.project_id === proj.id);
        const lastUpdate = projectUpdates[0];
        const projectMilestones = milestones.filter((m) => m.project_id === proj.id);

        return (
          <div key={proj.id} className="p-6 bg-brand-black/60 border border-white/5 rounded-2xl space-y-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <ProjectStatusBadge status={proj.status || 'lead'} />
                <h3 className="text-lg font-semibold text-white uppercase tracking-wide mt-2">{proj.title}</h3>
                <p className="text-xs text-brand-gray mt-1">{proj.service_type || 'Bespoke Development'}</p>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[10px] font-mono text-brand-gray uppercase block">Progress</span>
                <span className="text-sm font-mono text-brand-cyan font-bold">{proj.progress || 0}%</span>
              </div>
            </div>

            <div className="w-full bg-white/5 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-brand-blue to-brand-cyan h-3 rounded-full transition-all duration-1000"
                style={{ width: `${proj.progress || 0}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Last Update', value: lastUpdate?.title || 'Awaiting team update' },
                { label: 'Assigned Team', value: proj.assignee?.full_name || 'Jawrah Pixel Team' },
                { label: 'Est. Completion', value: proj.estimated_completion || proj.deadline || 'TBD' },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                  <span className="text-[9px] font-mono text-brand-gray uppercase">{item.label}</span>
                  <p className="text-xs text-white mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {PROJECT_LIFECYCLE.map((step) => (
                <span
                  key={step}
                  className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase border ${
                    proj.status === step
                      ? 'bg-brand-cyan/20 border-brand-cyan/30 text-brand-cyan'
                      : 'border-white/5 text-brand-gray'
                  }`}
                >
                  {formatLifecycleLabel(step)}
                </span>
              ))}
            </div>

            {projectMilestones.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/5">
                {projectMilestones.map((ms: any, idx: number) => (
                  <div key={ms.id} className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] font-mono text-brand-gray">{String(idx + 1).padStart(2, '0')}</span>
                    <h4 className="text-xs font-semibold text-white uppercase mt-1">{ms.title}</h4>
                    <p className="text-[10px] text-brand-gray mt-1">{ms.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ClientNotificationsPanel({
  notifications,
  onMarkRead,
  onMarkAllRead,
}: {
  notifications: any[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}) {
  const unread = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <p className="text-xs text-brand-gray">{unread} unread notification(s)</p>
        {unread > 0 && (
          <Button size="sm" variant="outline" className="text-[9px] font-mono uppercase" onClick={onMarkAllRead}>
            Mark all read
          </Button>
        )}
      </div>
      {notifications.map((note) => (
        <div key={note.id} className={`p-4 rounded-xl border ${note.read_at ? 'border-white/5 bg-brand-black/40' : 'border-brand-cyan/20 bg-brand-cyan/5'}`}>
          <div className="flex justify-between gap-3">
            <div>
              <div className="text-xs text-white font-semibold">{note.title}</div>
              <p className="text-[10px] text-brand-gray mt-1">{note.body || note.desc}</p>
              <span className="text-[9px] font-mono text-brand-silver mt-2 block">{note.date || note.created_at?.split('T')[0]}</span>
            </div>
            {!note.read_at && (
              <Button size="sm" variant="outline" className="text-[8px] font-mono uppercase h-8" onClick={() => onMarkRead(note.id)}>
                Mark read
              </Button>
            )}
          </div>
        </div>
      ))}
      {notifications.length === 0 && (
        <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">No notifications yet.</p>
      )}
    </div>
  );
}

export function ClientInvoicesPanel({
  invoices,
  onPay,
  showToast,
}: {
  invoices: any[];
  onPay?: (inv: any) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}) {
  const navigate = useNavigate();

  const handlePay = (inv: any) => {
    if (inv.id) {
      navigate(`/dashboard/checkout/${inv.id}`);
      return;
    }
    onPay?.(inv);
  };

  return (
    <div className="space-y-3.5">
      {invoices.map((inv) => {
        const isPaid = inv.status === 'Paid' || inv.status === 'paid' || inv.payment_status === 'paid';
        const amountDue = Number(inv.amount_due_now ?? inv.amountNumeric ?? 0);
        const statusLabel = paymentStatusLabel(inv.payment_status, inv.current_milestone);

        return (
          <div key={inv.id} className="p-4 bg-brand-black/60 border border-white/5 rounded-xl space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-brand-cyan uppercase">{inv.rate || inv.invoice_number}</div>
                <div className="text-xs font-semibold text-white uppercase tracking-wider">{inv.item || inv.title}</div>
                <span className="text-[10px] text-brand-gray font-mono block">
                  Issue: {inv.date || inv.created_at?.split('T')[0]} ● Due: {inv.due_date || inv.date || 'TBD'}
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-mono border ${
                  isPaid
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : inv.payment_status === 'manual_review'
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}
              >
                {statusLabel}
              </span>
            </div>

            <InvoiceBillingSummary invoice={inv} compact />

            <div className="flex flex-col items-end gap-3">
              {inv.id && (
                <BillingPdfActions invoiceId={inv.id} compact onToast={showToast} />
              )}
            <div className="flex flex-wrap items-center gap-3 justify-end">
              <Button
                size="sm"
                variant="outline"
                className="text-[9px] font-mono uppercase"
                onClick={() =>
                  downloadInvoiceRecord({
                    invoice_number: inv.rate || inv.invoice_number,
                    title: inv.item || inv.title,
                    amount: inv.amount_due_now ?? inv.amountNumeric ?? inv.amount,
                    currency: inv.currency,
                    status: inv.status,
                    due_date: inv.due_date || inv.date,
                    created_at: inv.created_at,
                  })
                }
              >
                <Download size={12} className="mr-1" /> Download
              </Button>
              {!isPaid && amountDue > 0 && (
                <Button size="sm" className="text-[9px] font-mono uppercase luxury-glow" onClick={() => handlePay(inv)}>
                  {formatPayButtonLabel(amountDue, inv.currency || 'LKR', inv.region)}
                </Button>
              )}
            </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProjectStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan text-[10px] font-mono uppercase tracking-widest">
      {formatLifecycleLabel(status)}
    </span>
  );
}
