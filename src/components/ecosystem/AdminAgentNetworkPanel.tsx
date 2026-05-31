import React, { useEffect, useState } from 'react';
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
import type { RegionCode } from '@/types';

const AGENT_STATUSES: AgentStatus[] = ['pending', 'interview', 'approved', 'rejected', 'suspended'];
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
}

export function AdminAgentNetworkPanel({
  activeTab,
  regionFilter,
  showToast,
  adminUserId,
}: AdminAgentNetworkPanelProps) {
  const [agents, setAgents] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [messageAgentId, setMessageAgentId] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [commissionForm, setCommissionForm] = useState({
    agent_id: '',
    project_amount: 0,
    agent_lead_id: '',
  });
  const [payoutForm, setPayoutForm] = useState({ agent_id: '', amount: 0, currency: 'LKR' });

  const load = () => {
    const region = regionFilter === 'all' ? undefined : regionFilter;
    adminFetchAgents(region).then(({ agents: a, leads: l, commissions: c, error }) => {
      if (error) showToast(error.message, 'error');
      setAgents(a);
      setLeads(l);
      setCommissions(c);
    });
  };

  useEffect(() => {
    if (activeTab === 'agent-network') load();
  }, [activeTab, regionFilter]);

  if (activeTab !== 'agent-network') return null;

  const filteredLeads =
    regionFilter === 'all' ? leads : leads.filter((lead) => lead.region === regionFilter);

  const totalCommissions = commissions.reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Agent Network</h2>
        <p className="text-xs text-brand-gray mt-0.5">
          Approve partners, manage leads, commissions, payouts, and messaging.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-brand-black/50">
          <div className="text-[10px] font-mono uppercase text-brand-gray">Active Agents</div>
          <div className="text-2xl font-display text-white mt-1">
            {agents.filter((a) => a.status === 'approved').length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-brand-black/50">
          <div className="text-[10px] font-mono uppercase text-brand-gray">Open Leads</div>
          <div className="text-2xl font-display text-white mt-1">{filteredLeads.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-brand-black/50">
          <div className="text-[10px] font-mono uppercase text-brand-gray">Commission Volume</div>
          <div className="text-2xl font-display text-brand-cyan mt-1">{totalCommissions.toLocaleString()}</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Partner Applications</h3>
        {agents.map((agent) => {
          const profile = agent.profiles ?? {};
          return (
            <div key={agent.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="text-white font-semibold">{profile.full_name || 'Unnamed Agent'}</h4>
                  <p className="text-xs text-brand-gray">
                    {profile.email} • {agent.region?.toUpperCase()} • Tier {agent.tier} ({Math.round(Number(agent.commission_rate) * 100)}%)
                  </p>
                  <p className="text-xs text-brand-silver mt-1">
                    Code: {profile.agent_code || '—'} • Paid projects: {agent.completed_paid_projects}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {AGENT_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        adminUpdateAgentStatus(agent.user_id, status, {
                          applicationId: agent.application_id ?? undefined,
                          reviewedBy: adminUserId,
                        }).then(({ error }) => {
                          if (error) showToast(error.message, 'error');
                          else {
                            showToast(`Agent marked ${status}.`);
                            load();
                          }
                        })
                      }
                      className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase border ${
                        agent.status === status
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
          );
        })}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Agent Leads</h3>
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl">
            <div className="flex justify-between gap-4 flex-wrap">
              <div>
                <h4 className="text-white font-semibold">{lead.client_name}</h4>
                <p className="text-xs text-brand-gray">
                  {lead.service_interested || 'General'} • {lead.currency}{' '}
                  {Number(lead.project_value || 0).toLocaleString()} • Est. commission{' '}
                  {Number(lead.commission_estimate || 0).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-1 flex-wrap">
                {LEAD_STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      adminUpdateAgentLeadStatus(lead.id, status).then(({ error }) => {
                        if (error) showToast(error.message, 'error');
                        else load();
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-brand-black/60 border border-white/5 rounded-xl space-y-3">
          <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Create Commission</h3>
          <Input
            placeholder="Agent user ID"
            value={commissionForm.agent_id}
            onChange={(e) => setCommissionForm((p) => ({ ...p, agent_id: e.target.value }))}
            className="h-10 text-xs"
          />
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
            onChange={(e) =>
              setCommissionForm((p) => ({ ...p, project_amount: Number(e.target.value) }))
            }
            className="h-10 text-xs"
          />
          <Button
            size="sm"
            className="font-mono text-[10px] uppercase"
            onClick={() =>
              adminCreateCommission({
                agent_id: commissionForm.agent_id,
                agent_lead_id: commissionForm.agent_lead_id || null,
                project_amount: commissionForm.project_amount,
                status: 'approved',
              }).then(({ error }) => {
                if (error) showToast(error.message, 'error');
                else {
                  showToast('Commission created.');
                  load();
                }
              })
            }
          >
            Approve Commission
          </Button>
        </div>

        <div className="p-5 bg-brand-black/60 border border-white/5 rounded-xl space-y-3">
          <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Record Payout</h3>
          <Input
            placeholder="Agent user ID"
            value={payoutForm.agent_id}
            onChange={(e) => setPayoutForm((p) => ({ ...p, agent_id: e.target.value }))}
            className="h-10 text-xs"
          />
          <Input
            type="number"
            placeholder="Amount"
            value={payoutForm.amount}
            onChange={(e) => setPayoutForm((p) => ({ ...p, amount: Number(e.target.value) }))}
            className="h-10 text-xs"
          />
          <Button
            size="sm"
            className="font-mono text-[10px] uppercase"
            onClick={() =>
              adminCreatePayout({
                agent_id: payoutForm.agent_id,
                amount: payoutForm.amount,
                currency: payoutForm.currency,
                created_by: adminUserId,
              }).then(({ error }) => {
                if (error) showToast(error.message, 'error');
                else {
                  showToast('Payout recorded.');
                  load();
                }
              })
            }
          >
            Create Payout
          </Button>
        </div>
      </div>

      <div className="p-5 bg-brand-black/60 border border-white/5 rounded-xl space-y-3">
        <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Message Agent</h3>
        <Input
          placeholder="Agent user ID"
          value={messageAgentId}
          onChange={(e) => setMessageAgentId(e.target.value)}
          className="h-10 text-xs"
        />
        <Textarea
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          placeholder="Message to agent..."
          className="text-xs min-h-[100px]"
        />
        <Button
          size="sm"
          className="font-mono text-[10px] uppercase"
          onClick={() =>
            adminSendAgentMessage(messageAgentId, messageBody).then((result) => {
              if (result.error) showToast(result.error.message, 'error');
              else {
                showToast('Message sent.');
                setMessageBody('');
              }
            })
          }
        >
          Send Message
        </Button>
      </div>
    </div>
  );
}
