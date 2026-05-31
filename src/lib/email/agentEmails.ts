export type AgentEmailType =
  | 'agent_application_received'
  | 'agent_application_admin_alert'
  | 'agent_application_approved'
  | 'agent_application_rejected'
  | 'agent_application_needs_info'
  | 'agent_lead_submitted'
  | 'agent_lead_admin_alert'
  | 'agent_commission_approved'
  | 'agent_commission_paid'
  | 'agent_message_received';

export interface AgentEmailPayload {
  emailType: AgentEmailType;
  email?: string;
  name?: string;
  region?: string;
  message?: string;
  agentCode?: string;
  partnerId?: string;
  amount?: string;
  currency?: string;
}

export async function sendAgentEmailNotification(payload: AgentEmailPayload): Promise<{ ok: boolean }> {
  try {
    const response = await fetch('/api/send-agent-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return { ok: false };
    return (await response.json()) as { ok: boolean };
  } catch {
    return { ok: false };
  }
}
