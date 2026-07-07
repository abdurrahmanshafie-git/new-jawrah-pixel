import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import {
  adminCreateCommission,
  adminCreatePayout,
  adminFetchAgents,
  adminSendAgentMessage,
  adminUpdateAgentLeadStatus,
  adminUpdateAgentStatus,
  type AgentLeadStatus,
  type AgentStatus,
} from '@/lib/supabase/agent-api';
import { partnerStatusLabel } from '@/lib/partner/ids';
import type { RegionCode } from '@/types';

export const ADMIN_AGENT_WORKSPACE_TABS = [
  'agent-applications',
  'approved-agents',
  'referral-tracking',
  'commission-management',
  'payout-management',
  'agent-messages',
  'tier-history',
  'agent-analytics',
] as const;

const AGENT_NETWORK_TAB_SET = new Set<string>(ADMIN_AGENT_WORKSPACE_TABS);
const PARTNER_ADMIN_ACTIONS: { status: AgentStatus; label: string }[] = [
  { status: 'approved', label: 'Approve' },
  { status: 'rejected', label: 'Reject' },
  { status: 'interview', label: 'Request More Information' },
  { status: 'suspended', label: 'Suspend' },
];
const LEAD_STATUSES: AgentLeadStatus[] = [
  'submitted',
  'reviewing',
  'qualified',
  'proposal_sent',
  'won',
  'lost',
  'paid',
  'cancelled',
];

interface ToastFn {
  (message: string, type?: 'success' | 'error' | 'info'): void;
}

interface AdminAgentNetworkPanelProps {
  activeTab: string;
  regionFilter: 'all' | RegionCode;
  showToast: ToastFn;
  adminUserId?: string;
  onReload?: () => void;
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

function formatMoney(amount: number | string | null | undefined, currency = 'LKR') {
  return `${currency} ${Number(amount || 0).toLocaleString()}`;
}

function agentProfile(agent: any) {
  return agent?.profiles ?? {};
}

function agentDisplayName(agent: any) {
  const profile = agentProfile(agent);
  return profile.full_name || profile.email || profile.agent_code || 'Unnamed Partner';
}

function agentLookupName(agentId: string, agents: any[]) {
  const agent = agents.find((item) => item.user_id === agentId || item.id === agentId);
  return agent ? agentDisplayName(agent) : agentId || 'Unassigned Agent';
}

function isCurrentMonth(value?: string | null) {
  if (!value) return false;
  return value.slice(0, 7) === new Date().toISOString().slice(0, 7);
}

export function AdminAgentNetworkPanel({
  activeTab,
  regionFilter,
  showToast,
  adminUserId,
  onReload,
}: AdminAgentNetworkPanelProps) {
  const [agents, setAgents] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [tierHistory, setTierHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [messageAgentId, setMessageAgentId] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [commissionForm, setCommissionForm] = useState({
    agent_id: '',
    project_amount: 0,
    agent_lead_id: '',
  });
  const [payoutForm, setPayoutForm] = useState({ agent_id: '', amount: 0, currency: 'LKR' });

  const load = useCallback(() => {
    const region = regionFilter === 'all' ? undefined : regionFilter;
    setLoading(true);
    setLoadError(null);
    adminFetchAgents(region)
      .then(({ agents: a, leads: l, commissions: c, payouts: p, referrals: r, tierHistory: h, error }) => {
        if (error) {
          setLoadError(error.message);
          showToast(error.message, 'error');
        }
        setAgents(a);
        setLeads(l);
        setCommissions(c);
        setPayouts(p);
        setReferrals(r);
        setTierHistory(h);
      })
      .catch((error: Error) => {
        setLoadError(error.message);
        showToast(error.message, 'error');
      })
      .finally(() => setLoading(false));
  }, [regionFilter, showToast]);

  const reloadWorkspace = useCallback(() => {
    load();
    onReload?.();
  }, [load, onReload]);

  useEffect(() => {
    if (AGENT_NETWORK_TAB_SET.has(activeTab)) load();
  }, [activeTab, load]);

  const scopedAgentIds = useMemo(() => new Set(agents.map((agent) => agent.user_id)), [agents]);
  const approvedAgents = agents.filter((agent) => agent.status === 'approved');
  const applicationAgents = agents.filter((agent) => agent.status !== 'approved');
  const filteredLeads =
    regionFilter === 'all'
      ? leads
      : leads.filter((lead) => lead.region === regionFilter || scopedAgentIds.has(lead.agent_id));
  const filteredCommissions =
    regionFilter === 'all'
      ? commissions
      : commissions.filter((commission) => scopedAgentIds.has(commission.agent_id));
  const filteredPayouts =
    regionFilter === 'all' ? payouts : payouts.filter((payout) => scopedAgentIds.has(payout.agent_id));
  const filteredReferrals =
    regionFilter === 'all'
      ? referrals
      : referrals.filter((referral) => referral.region === regionFilter || scopedAgentIds.has(referral.agent_id));
  const filteredTierHistory =
    regionFilter === 'all'
      ? tierHistory
      : tierHistory.filter((entry) => scopedAgentIds.has(entry.agent_id));

  const pendingApplications = agents.filter((agent) => ['pending', 'under_review', 'interview'].includes(agent.status)).length;
  const monthlyReferrals = filteredReferrals.filter((referral) => isCurrentMonth(referral.created_at)).length;
  const commissionsDue = filteredCommissions
    .filter((commission) => commission.status === 'pending' || commission.status === 'approved')
    .reduce((sum, commission) => sum + Number(commission.commission_amount || 0), 0);
  const totalPayouts = filteredPayouts
    .filter((payout) => payout.status === 'completed')
    .reduce((sum, payout) => sum + Number(payout.amount || 0), 0);
  const topAgent = approvedAgents.reduce<any | null>((current, agent) => {
    if (!current) return agent;
    return Number(agent.completed_paid_projects || 0) > Number(current.completed_paid_projects || 0)
      ? agent
      : current;
  }, null);

  if (!AGENT_NETWORK_TAB_SET.has(activeTab)) return null;

  const handleCreateCommission = () => {
    if (!commissionForm.agent_id || commissionForm.project_amount <= 0) {
      showToast('Select an agent and enter a project amount.', 'error');
      return;
    }

    adminCreateCommission({
      agent_id: commissionForm.agent_id,
      agent_lead_id: commissionForm.agent_lead_id || null,
      project_amount: commissionForm.project_amount,
      status: 'approved',
    }).then(({ error }) => {
      if (error) showToast(error.message, 'error');
      else {
        showToast('Commission created.');
        setCommissionForm({ agent_id: '', project_amount: 0, agent_lead_id: '' });
        reloadWorkspace();
      }
    });
  };

  const handleCreatePayout = () => {
    if (!payoutForm.agent_id || payoutForm.amount <= 0) {
      showToast('Select an agent and enter a payout amount.', 'error');
      return;
    }

    adminCreatePayout({
      agent_id: payoutForm.agent_id,
      amount: payoutForm.amount,
      currency: payoutForm.currency,
      created_by: adminUserId,
    }).then(({ error }) => {
      if (error) showToast(error.message, 'error');
      else {
        showToast('Payout recorded.');
        setPayoutForm({ agent_id: '', amount: 0, currency: 'LKR' });
        reloadWorkspace();
      }
    });
  };

  const renderAgentRow = (agent: any) => {
    const profile = agentProfile(agent);
    return (
      <div key={agent.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
        <div className="flex justify-between gap-4 flex-wrap">
          <div>
            <h4 className="text-white font-semibold">{agentDisplayName(agent)}</h4>
            <p className="text-xs text-brand-gray">
              {profile.email || 'No email'} / {agent.region?.toUpperCase() || 'INT'} / Tier {agent.tier}{' '}
              ({Math.round(Number(agent.commission_rate || 0) * 100)}%)
            </p>
            <p className="text-xs text-brand-silver mt-1">
              Partner ID: {agent.partner_id || 'Pending'} / Referral: {profile.agent_code || 'N/A'} / Paid:{' '}
              {agent.completed_paid_projects || 0}
            </p>
            <p className="text-[10px] text-brand-gray mt-1">
              Applied: {agent.created_at?.split('T')[0] ?? '—'} / Status: {partnerStatusLabel(agent.status)}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {PARTNER_ADMIN_ACTIONS.map(({ status, label }) => (
              <button
                key={status}
                onClick={() =>
                  adminUpdateAgentStatus(agent.user_id, status, {
                    applicationId: agent.application_id ?? undefined,
                    reviewedBy: adminUserId,
                  }).then(({ error }) => {
                    if (error) showToast(error.message, 'error');
                    else {
                      showToast(`Partner marked: ${partnerStatusLabel(status)}.`);
                      reloadWorkspace();
                    }
                  })
                }
                className={`px-2.5 py-1 rounded text-[8px] font-mono uppercase border ${
                  agent.status === status
                    ? 'bg-brand-cyan/20 border-brand-cyan/30 text-brand-cyan'
                    : 'border-white/5 text-brand-gray hover:border-white/15'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAgentSelect = (
    value: string,
    onChange: (next: string) => void,
    placeholder = 'Select Agent',
  ) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 bg-black/40 border border-white/5 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
    >
      <option value="">{placeholder}</option>
      {agents.map((agent) => (
        <option key={agent.user_id} value={agent.user_id}>
          {agentDisplayName(agent)}
        </option>
      ))}
    </select>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Partner Network</h2>
        <p className="text-xs text-brand-gray mt-0.5">
          Approve partners, manage referrals, commissions, payouts, messages, and tier movement.
        </p>
      </div>

      {loading && <PanelLoading label="agent workspace" />}
      {loadError && <PanelError message={loadError} />}

      {!loading && !loadError && activeTab === 'agent-analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { title: 'Approved Partners', value: approvedAgents.length },
              { title: 'Pending Applications', value: pendingApplications },
              { title: 'Monthly Referrals', value: monthlyReferrals },
              { title: 'Commissions Due', value: formatMoney(commissionsDue) },
              { title: 'Total Payouts', value: formatMoney(totalPayouts) },
              { title: 'Top Performing Partner', value: topAgent ? agentDisplayName(topAgent) : 'N/A' },
            ].map((card) => (
              <div key={card.title} className="p-4 rounded-xl border border-white/5 bg-brand-black/50">
                <div className="text-[10px] font-mono uppercase text-brand-gray">{card.title}</div>
                <div className="text-2xl font-display text-white mt-1">{card.value}</div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
            <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan mb-4">
              Lead Status Snapshot
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {LEAD_STATUSES.map((status) => (
                <div key={status} className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[9px] font-mono uppercase text-brand-gray">{status.replace('_', ' ')}</div>
                  <div className="text-xl font-mono text-white mt-1">
                    {filteredLeads.filter((lead) => lead.status === status).length}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {agents.length === 0 &&
            filteredLeads.length === 0 &&
            filteredReferrals.length === 0 &&
            filteredCommissions.length === 0 &&
            filteredPayouts.length === 0 && <PanelEmpty message="No agent analytics data available yet." />}
        </div>
      )}

      {!loading && !loadError && activeTab === 'agent-applications' && (
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Partner Applications</h3>
          {applicationAgents.length === 0 && (
            <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">
              No pending partner applications.
            </p>
          )}
          {applicationAgents.map(renderAgentRow)}
        </div>
      )}

      {!loading && !loadError && activeTab === 'approved-agents' && (
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Approved Partners</h3>
          {approvedAgents.length === 0 && (
            <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">
              No approved partners yet.
            </p>
          )}
          {approvedAgents.map(renderAgentRow)}
        </div>
      )}

      {!loading && !loadError && activeTab === 'referral-tracking' && (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Referral Tracking</h3>
            {filteredReferrals.length === 0 && (
              <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">
                No referral visits recorded.
              </p>
            )}
            {filteredReferrals.map((referral) => (
              <div key={referral.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <h4 className="text-white font-semibold">{referral.agent_code}</h4>
                    <p className="text-xs text-brand-gray">
                      {agentLookupName(referral.agent_id, agents)} / {referral.region?.toUpperCase() || 'INT'}
                    </p>
                    <p className="text-xs text-brand-silver mt-1">
                      Landing: {referral.landing_path || 'Direct'} / {referral.created_at?.split('T')[0]}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[9px] font-mono uppercase border self-start ${
                      referral.converted
                        ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                        : 'bg-white/5 text-brand-gray border-white/5'
                    }`}
                  >
                    {referral.converted ? 'Converted' : 'Visit'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Agent Leads</h3>
            {filteredLeads.length === 0 && (
              <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">
                No agent leads recorded.
              </p>
            )}
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <h4 className="text-white font-semibold">{lead.client_name}</h4>
                    <p className="text-xs text-brand-gray">
                      {agentLookupName(lead.agent_id, agents)} / {lead.service_interested || 'General'} /{' '}
                      {formatMoney(lead.project_value, lead.currency)}
                    </p>
                    <p className="text-xs text-brand-silver mt-1">
                      Est. commission {formatMoney(lead.commission_estimate, lead.currency)}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {LEAD_STATUSES.map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          adminUpdateAgentLeadStatus(lead.id, status).then(({ error }) => {
                            if (error) showToast(error.message, 'error');
                            else reloadWorkspace();
                          })
                        }
                        className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase border ${
                          lead.status === status
                            ? 'bg-brand-cyan/20 border-brand-cyan/30 text-brand-cyan'
                            : 'border-white/5 text-brand-gray'
                        }`}
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
      )}

      {!loading && !loadError && activeTab === 'commission-management' && (
        <div className="space-y-6">
          <div className="p-5 bg-brand-black/60 border border-white/5 rounded-xl space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Create Commission</h3>
            {renderAgentSelect(commissionForm.agent_id, (agent_id) =>
              setCommissionForm((previous) => ({ ...previous, agent_id })),
            )}
            <Input
              placeholder="Lead ID (optional)"
              value={commissionForm.agent_lead_id}
              onChange={(e) => setCommissionForm((p) => ({ ...p, agent_lead_id: e.target.value }))}
              className="h-10 text-xs"
            />
            <Input
              type="number"
              placeholder="Project amount"
              value={commissionForm.project_amount}
              onChange={(e) => setCommissionForm((p) => ({ ...p, project_amount: Number(e.target.value) }))}
              className="h-10 text-xs"
            />
            <Button size="sm" className="font-mono text-[10px] uppercase" onClick={handleCreateCommission}>
              Approve Commission
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Commission Ledger</h3>
            {filteredCommissions.length === 0 && (
              <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">
                No commissions recorded.
              </p>
            )}
            {filteredCommissions.map((commission) => (
              <div key={commission.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <h4 className="text-white font-semibold">
                      {formatMoney(commission.commission_amount, commission.currency)}
                    </h4>
                    <p className="text-xs text-brand-gray">
                      {agentLookupName(commission.agent_id, agents)} / Project{' '}
                      {formatMoney(commission.project_amount, commission.currency)}
                    </p>
                  </div>
                  <span className="text-xs font-mono uppercase text-brand-cyan">{commission.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !loadError && activeTab === 'payout-management' && (
        <div className="space-y-6">
          <div className="p-5 bg-brand-black/60 border border-white/5 rounded-xl space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Record Payout</h3>
            {renderAgentSelect(payoutForm.agent_id, (agent_id) => setPayoutForm((previous) => ({ ...previous, agent_id })))}
            <Input
              type="number"
              placeholder="Amount"
              value={payoutForm.amount}
              onChange={(e) => setPayoutForm((p) => ({ ...p, amount: Number(e.target.value) }))}
              className="h-10 text-xs"
            />
            <Input
              placeholder="Currency"
              value={payoutForm.currency}
              onChange={(e) => setPayoutForm((p) => ({ ...p, currency: e.target.value.toUpperCase() }))}
              className="h-10 text-xs"
            />
            <Button size="sm" className="font-mono text-[10px] uppercase" onClick={handleCreatePayout}>
              Create Payout
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Payout History</h3>
            {filteredPayouts.length === 0 && (
              <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">
                No payouts recorded.
              </p>
            )}
            {filteredPayouts.map((payout) => (
              <div key={payout.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <h4 className="text-white font-semibold">{formatMoney(payout.amount, payout.currency)}</h4>
                    <p className="text-xs text-brand-gray">{agentLookupName(payout.agent_id, agents)}</p>
                    <p className="text-xs text-brand-silver mt-1">
                      {payout.method || 'Manual'} / {payout.paid_at ? payout.paid_at.split('T')[0] : 'Pending'}
                    </p>
                  </div>
                  <span className="text-xs font-mono uppercase text-brand-cyan">{payout.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !loadError && activeTab === 'agent-messages' && (
        <div className="p-5 bg-brand-black/60 border border-white/5 rounded-xl space-y-3">
          <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Agent Messages</h3>
          {agents.length === 0 && <PanelEmpty message="No agents available for messaging yet." />}
          {renderAgentSelect(messageAgentId, setMessageAgentId)}
          <Textarea
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            placeholder="Message to agent..."
            className="text-xs min-h-[100px]"
          />
          <Button
            size="sm"
            className="font-mono text-[10px] uppercase"
            onClick={() => {
              if (!messageAgentId || !messageBody.trim()) {
                showToast('Select an agent and enter a message.', 'error');
                return;
              }
              adminSendAgentMessage(messageAgentId, messageBody).then((result) => {
                if (result.error) showToast(result.error.message, 'error');
                else {
                  showToast('Message sent.');
                  setMessageBody('');
                }
              });
            }}
          >
            Send Message
          </Button>
        </div>
      )}

      {!loading && !loadError && activeTab === 'tier-history' && (
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Tier History</h3>
          {filteredTierHistory.length === 0 && (
            <p className="text-xs text-brand-gray font-mono uppercase tracking-widest py-8 text-center">
              No tier movements recorded.
            </p>
          )}
          {filteredTierHistory.map((entry) => (
            <div key={entry.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="text-white font-semibold">{agentLookupName(entry.agent_id, agents)}</h4>
                  <p className="text-xs text-brand-gray">
                    {entry.previous_tier || 'New'} to {entry.new_tier} / {entry.completed_projects} paid projects
                  </p>
                </div>
                <span className="text-xs font-mono uppercase text-brand-cyan">
                  {Math.round(Number(entry.commission_rate || 0) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
