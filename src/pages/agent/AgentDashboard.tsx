import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchAgentDashboard,
  fetchAgentMessages,
  markAgentNotificationsRead,
  sendAgentMessage,
  submitAgentLead,
  updatePartnerReferralCode,
} from '@/lib/supabase/agent-api';
import { buildAgentReferralLink } from '@/lib/referral';
import { nextTierProgress, regionCurrency } from '@/lib/agent/tiers';
import { partnerStatusLabel } from '@/lib/partner/ids';
import type { RegionCode } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { SEO } from '@/components/layout/SEO';
import {
  Loader,
  LayoutDashboard,
  Users,
  DollarSign,
  Link2,
  MessageSquare,
  Bell,
  User,
  RefreshCw,
} from 'lucide-react';

type TabId = 'overview' | 'leads' | 'commissions' | 'referral' | 'messages' | 'notifications' | 'profile';

const REFERRAL_REGIONS: RegionCode[] = ['lk', 'pk', 'int'];

export default function AgentDashboard() {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [codeSaving, setCodeSaving] = useState(false);
  const [copyHint, setCopyHint] = useState('');
  const [leadForm, setLeadForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    service_interested: '',
    project_value: 0,
    notes: '',
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await fetchAgentDashboard();
    if (!error && data) setDashboard(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchAgentMessages(threadId ?? undefined).then((res) => {
        setMessages(res.data ?? []);
        if (res.threadId) setThreadId(res.threadId);
      });
    }
  }, [activeTab, threadId]);

  const region = (dashboard?.agentProfile?.region ?? profile?.region ?? 'lk') as RegionCode;
  const agentCode = dashboard?.profile?.agent_code;
  const partnerId = dashboard?.agentProfile?.partner_id;
  const tierProgress = nextTierProgress(dashboard?.completedCount ?? 0);
  const unread = (dashboard?.notifications ?? []).filter((n: any) => !n.read_at).length;
  const totalReferrals = dashboard?.referrals?.length ?? 0;
  const pendingProjects =
    (dashboard?.leads ?? []).filter((l: { status: string }) => !['paid', 'lost', 'cancelled'].includes(l.status))
      .length ?? 0;

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyHint('Copied');
      setTimeout(() => setCopyHint(''), 2000);
    } catch {
      setCopyHint('Copy failed');
    }
  };

  const tabs: { id: TabId; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users, count: dashboard?.leads?.length },
    { id: 'commissions', label: 'Commissions', icon: DollarSign },
    { id: 'referral', label: 'Referral Links', icon: Link2 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: unread },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (loading && !dashboard) {
    return (
      <div className="agent-dashboard-page light-surface-page min-h-screen bg-brand-black flex items-center justify-center">
        <SEO title="Partner Dashboard | Jawrah Pixel" description="Secure Jawrah Pixel partner dashboard." noIndex />
        <Loader className="animate-spin text-brand-cyan" size={40} />
      </div>
    );
  }

  return (
    <div className="agent-dashboard-page light-surface-page min-h-screen bg-brand-black text-white relative overflow-x-hidden">
      <SEO title="Partner Dashboard | Jawrah Pixel" description="Secure Jawrah Pixel partner dashboard for referral links, commissions, leads, and messages." noIndex />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="container mx-auto px-4 md:px-6 py-8 sm:py-12 relative z-10 max-w-7xl min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 border-b border-white/10 pb-6 sm:pb-8 mb-8 sm:mb-10">
          <div className="min-w-0">
            <span className="px-2.5 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-mono uppercase tracking-widest">
              Partner Portal
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold tracking-tight text-white uppercase mt-2">
              Partner <span className="text-brand-cyan">Dashboard</span>
            </h1>
            <p className="text-brand-gray mt-1 text-sm">{profile?.full_name || profile?.email}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={load} className="border-white/10">
              <RefreshCw size={14} className="mr-2" /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-brand-silver">
              Sign Out
            </Button>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-4 mb-6 sm:mb-8 border-b border-white/5 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border text-[10px] sm:text-xs font-mono uppercase tracking-wider whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan'
                    : 'bg-white/5 border-white/10 text-brand-gray'
                }`}
              >
                <Icon size={14} />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full bg-brand-cyan/20 text-[10px]">{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <StatCard label="Partner ID" value={partnerId || '—'} />
            <StatCard label="Referral Code" value={agentCode || '—'} />
            <StatCard label="Current Tier" value={`${tierProgress.current.label} Partner`} />
            <StatCard label="Total Referrals" value={String(totalReferrals)} />
            <StatCard label="Paid Projects" value={String(dashboard?.completedCount ?? 0)} />
            <StatCard label="Pending Projects" value={String(pendingProjects)} />
            <StatCard
              label="Commission Earned"
              value={`${regionCurrency(region)} ${Number(dashboard?.totalEarned ?? 0).toLocaleString()}`}
            />
            <StatCard
              label="Commission Pending"
              value={`${regionCurrency(region)} ${Number(dashboard?.pendingCommission ?? 0).toLocaleString()}`}
            />
            <StatCard
              label="Partner Status"
              value={partnerStatusLabel(dashboard?.applicationStatus)}
            />
            <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="text-[10px] font-mono uppercase text-brand-gray mb-2">Next Tier Progress</div>
              <div className="text-white font-semibold">
                {tierProgress.next ? tierProgress.next.label : 'Max tier reached'}
              </div>
              <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-cyan"
                  style={{ width: `${tierProgress.progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-brand-silver mt-2">
                {tierProgress.next
                  ? `${tierProgress.projectsToNext} more paid project(s) to ${tierProgress.next.label}`
                  : 'Elite tier active'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
              <h3 className="text-sm font-mono uppercase text-brand-cyan tracking-widest">Submit Lead</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  value={leadForm.client_name}
                  onChange={(e) => setLeadForm((p) => ({ ...p, client_name: e.target.value }))}
                  placeholder="Client name"
                  className="h-10 text-xs"
                />
                <Input
                  value={leadForm.client_email}
                  onChange={(e) => setLeadForm((p) => ({ ...p, client_email: e.target.value }))}
                  placeholder="Client email"
                  className="h-10 text-xs"
                />
                <Input
                  value={leadForm.service_interested}
                  onChange={(e) => setLeadForm((p) => ({ ...p, service_interested: e.target.value }))}
                  placeholder="Service"
                  className="h-10 text-xs"
                />
                <Input
                  type="number"
                  value={leadForm.project_value}
                  onChange={(e) => setLeadForm((p) => ({ ...p, project_value: Number(e.target.value) }))}
                  placeholder="Project value"
                  className="h-10 text-xs"
                />
              </div>
              <Textarea
                value={leadForm.notes}
                onChange={(e) => setLeadForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Notes"
                className="text-xs min-h-[80px]"
              />
              <Button
                size="sm"
                onClick={() =>
                  submitAgentLead({ ...leadForm, region }).then(() => {
                    load();
                    setLeadForm({
                      client_name: '',
                      client_email: '',
                      client_phone: '',
                      service_interested: '',
                      project_value: 0,
                      notes: '',
                    });
                  })
                }
              >
                Submit Lead
              </Button>
            </div>
            {(dashboard?.leads ?? []).map((lead: any) => (
              <div key={lead.id} className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-semibold text-white">{lead.client_name}</h4>
                    <p className="text-xs text-brand-gray">
                      {lead.status} • {lead.currency} {Number(lead.project_value).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-mono uppercase text-brand-cyan">
                    Est. {Number(lead.commission_estimate).toLocaleString()} • {lead.commission_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'commissions' && (
          <div className="space-y-4">
            <SectionTitle>Commissions</SectionTitle>
            {(dashboard?.commissions ?? []).map((c: any) => (
              <div key={c.id} className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex justify-between">
                <div>
                  <div className="text-white font-semibold">
                    {c.currency} {Number(c.commission_amount).toLocaleString()}
                  </div>
                  <div className="text-xs text-brand-gray">
                    Project {c.currency} {Number(c.project_amount).toLocaleString()} @{' '}
                    {Math.round(Number(c.commission_rate) * 100)}%
                  </div>
                </div>
                <span className="text-xs font-mono uppercase text-brand-cyan">{c.status}</span>
              </div>
            ))}
            <SectionTitle>Payout History</SectionTitle>
            {(dashboard?.payouts ?? []).map((p: any) => (
              <div key={p.id} className="p-4 rounded-xl border border-white/5 text-sm text-brand-silver">
                {p.currency} {Number(p.amount).toLocaleString()} — {p.status}{' '}
                {p.paid_at ? `• ${new Date(p.paid_at).toLocaleDateString()}` : ''}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'referral' && (
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] max-w-2xl space-y-4">
            {agentCode ? (
              <>
                <p className="text-xs font-mono uppercase text-brand-gray">Referral code</p>
                <p className="text-2xl font-mono text-brand-cyan">{agentCode}</p>
                {copyHint && <p className="text-[10px] font-mono uppercase text-brand-cyan">{copyHint}</p>}
                <p className="text-xs text-brand-silver">Regional referral links</p>
                {REFERRAL_REGIONS.map((r) => {
                  const url = buildAgentReferralLink(agentCode, r);
                  return (
                    <div key={r} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      <code className="flex-1 text-xs text-white bg-black/40 p-3 rounded border border-white/10 break-all">
                        {url}
                      </code>
                      <Button type="button" size="sm" variant="outline" onClick={() => copyLink(url)}>
                        Copy
                      </Button>
                    </div>
                  );
                })}
                {!dashboard?.agentProfile?.referral_code_customized && (
                  <form
                    className="pt-4 border-t border-white/10 space-y-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!profile?.id || !customCode.trim()) return;
                      setCodeSaving(true);
                      const { error } = await updatePartnerReferralCode(profile.id, customCode);
                      setCodeSaving(false);
                      if (error) setCopyHint(error.message);
                      else {
                        setCustomCode('');
                        load();
                      }
                    }}
                  >
                    <p className="text-[10px] font-mono uppercase text-brand-gray">
                      Customize your referral code once (URL-safe, unique)
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        placeholder="e.g. ASHAFIE24"
                        className="h-10 text-xs"
                      />
                      <Button type="submit" size="sm" disabled={codeSaving}>
                        Save
                      </Button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <p className="text-sm text-brand-silver">
                Your referral code will appear once your partner application is approved.
              </p>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] min-h-[320px] flex flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[10px] font-mono text-brand-cyan uppercase">
                    {msg.sender_id === profile?.id ? 'You' : 'Admin'}
                  </div>
                  <p className="text-xs text-brand-silver mt-1">{msg.body}</p>
                </div>
              ))}
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!reply.trim()) return;
                await sendAgentMessage(reply, threadId ?? undefined);
                setReply('');
                const res = await fetchAgentMessages(threadId ?? undefined);
                setMessages(res.data ?? []);
                if (res.threadId) setThreadId(res.threadId);
              }}
              className="flex gap-2"
            >
              <Input value={reply} onChange={(e) => setReply(e.target.value)} className="h-10 text-xs" />
              <Button type="submit" size="sm">
                Send
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-3">
            <Button
              size="sm"
              variant="outline"
              className="mb-4 text-[10px] font-mono uppercase"
              onClick={() => markAgentNotificationsRead().then(load)}
            >
              Mark all read
            </Button>
            {(dashboard?.notifications ?? []).map((n: any) => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border ${n.read_at ? 'border-white/5 opacity-70' : 'border-brand-cyan/20'}`}
              >
                <div className="text-sm text-white font-medium">{n.title}</div>
                <p className="text-xs text-brand-silver mt-1">{n.body}</p>
                {!n.read_at && (
                  <button
                    className="text-[10px] text-brand-cyan mt-2 uppercase font-mono"
                    onClick={() => markAgentNotificationsRead([n.id]).then(load)}
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] max-w-xl space-y-3 text-sm">
            <Row label="Name" value={profile?.full_name} />
            <Row label="Email" value={profile?.email} />
            <Row
              label="Region"
              value={
                dashboard?.agentProfile?.region_locked
                  ? `${region.toUpperCase()} (locked)`
                  : region.toUpperCase()
              }
            />
            <Row label="Partner ID" value={partnerId} />
            <Row label="Referral Code" value={agentCode} />
            <Row label="Status" value={partnerStatusLabel(dashboard?.applicationStatus)} />
            <Row label="Tier" value={`${tierProgress.current.label} Partner`} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="text-[10px] font-mono uppercase text-brand-gray">{label}</div>
      <div className="text-lg font-display text-white mt-1 normal-case break-words">{value}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-mono uppercase text-brand-cyan tracking-widest mt-4">{children}</h3>;
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
      <span className="text-brand-gray font-mono text-[10px] uppercase">{label}</span>
      <span className="text-white">{value || '—'}</span>
    </div>
  );
}
