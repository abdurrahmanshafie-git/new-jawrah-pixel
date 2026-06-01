import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendAgentEmails, type AgentEmailPayload } from './_email/agentEmails.js';
import { enforceSecurity, getClientIp } from './_lib/security.js';

const ALLOWED_TYPES = new Set([
  'agent_application_received',
  'agent_application_admin_alert',
  'agent_application_approved',
  'agent_application_rejected',
  'agent_application_needs_info',
  'agent_lead_submitted',
  'agent_lead_admin_alert',
  'agent_commission_approved',
  'agent_commission_paid',
  'agent_message_received',
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const body = (req.body ?? {}) as Partial<AgentEmailPayload>;
  if (!body.emailType || !ALLOWED_TYPES.has(body.emailType)) {
    return res.status(400).json({ ok: false, error: 'Invalid email type.' });
  }

  // Enforce security for public-facing agent application
  if (body.emailType === 'agent_application_received' || body.emailType === 'agent_application_admin_alert') {
    const ip = getClientIp(req.headers);
    const isSecure = await enforceSecurity({
      req,
      res,
      captchaToken: body.captcha_token,
      rateLimit: {
        key: `agent_app:${ip}`,
        limit: 3,
        windowSeconds: 86400, // 24 hours
      },
    });
    if (!isSecure) return;
  }

  const result = await sendAgentEmails(body as AgentEmailPayload);
  return res.status(result.ok ? 200 : 500).json(result);
}
