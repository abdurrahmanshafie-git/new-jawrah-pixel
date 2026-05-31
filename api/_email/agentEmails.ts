import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import {
  DASHBOARD_URL,
  JawrahEmailTemplate,
  FALLBACK_ADMIN_EMAIL,
  FALLBACK_FROM_EMAIL,
  actionButton,
  display,
  formatFromAddress,
  paragraph,
} from './jawrahEmailTemplate.js';

export type AgentEmailType =
  | 'agent_application_received'
  | 'agent_application_admin_alert'
  | 'agent_application_approved'
  | 'agent_application_rejected'
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
  amount?: string;
  currency?: string;
}

const AGENT_DASHBOARD_URL = `${DASHBOARD_URL.replace('/dashboard', '')}/agent/dashboard`;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email?: string): email is string {
  return Boolean(email && EMAIL_REGEX.test(email));
}

function subjectFor(type: AgentEmailType): string {
  switch (type) {
    case 'agent_application_received':
    case 'agent_application_admin_alert':
      return '[NEW AGENT APPLICATION] Jawrah Pixel';
    case 'agent_application_approved':
      return '[AGENT APPROVED] Welcome to Jawrah Pixel Partner Network';
    case 'agent_application_rejected':
      return '[AGENT APPLICATION] Jawrah Pixel';
    case 'agent_lead_submitted':
      return '[AGENT LEAD SUBMITTED] Jawrah Pixel';
    case 'agent_lead_admin_alert':
      return '[NEW AGENT LEAD] Jawrah Pixel';
    case 'agent_commission_approved':
      return '[COMMISSION APPROVED] Jawrah Pixel';
    case 'agent_commission_paid':
      return '[COMMISSION PAID] Jawrah Pixel';
    case 'agent_message_received':
      return '[NEW MESSAGE] Jawrah Pixel';
    default:
      return 'Jawrah Pixel Partner Network';
  }
}

function idempotencyKey(type: string, seed: string): string {
  return `agent-${type}-${createHash('sha256').update(seed).digest('hex').slice(0, 32)}`;
}

function buildBody(payload: AgentEmailPayload): string {
  const name = display(payload.name, 'Partner');
  const region = display(payload.region?.toUpperCase(), 'Global');
  const details = paragraph(payload.message);

  switch (payload.emailType) {
    case 'agent_application_received':
      return card(
        'Application Received',
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Hello ${name},</p>
         <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Your Jawrah Pixel partner application has been received. Our team will review your profile within 24–48 hours.</p>
         ${summaryRow('Region', region)}`,
        'Track Application',
        AGENT_DASHBOARD_URL,
      );
    case 'agent_application_approved':
      return card(
        'Welcome to the Partner Network',
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Hello ${name},</p>
         <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Your agent application has been approved. Your partner workspace, referral link, and commission tracking are now active.</p>
         ${summaryRow('Partner Code', display(payload.agentCode))}
         ${summaryRow('Region', region)}`,
        'Open Agent Dashboard',
        AGENT_DASHBOARD_URL,
      );
    case 'agent_application_rejected':
      return card(
        'Application Update',
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Hello ${name},</p>
         <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Thank you for applying to the Jawrah Pixel Partner Network. After review, we are unable to approve your application at this time.</p>`,
      );
    case 'agent_lead_submitted':
      return card(
        'Lead Submitted',
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Hello ${name},</p>
         <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Your referred lead has been submitted successfully and is now in review.</p>
         <div style="margin-top:12px;font-size:14px;color:#dbeafe;">${details}</div>`,
        'View Leads',
        AGENT_DASHBOARD_URL,
      );
    case 'agent_commission_approved':
      return card(
        'Commission Approved',
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Hello ${name},</p>
         <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">A commission on your referred project has been approved.</p>
         ${summaryRow('Amount', `${display(payload.amount)} ${display(payload.currency, '')}`)}`,
        'View Commissions',
        AGENT_DASHBOARD_URL,
      );
    case 'agent_commission_paid':
      return card(
        'Commission Paid',
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Hello ${name},</p>
         <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Your partner commission payout has been processed.</p>
         ${summaryRow('Amount', `${display(payload.amount)} ${display(payload.currency, '')}`)}`,
        'View Payouts',
        AGENT_DASHBOARD_URL,
      );
    case 'agent_message_received':
      return card(
        'New Message',
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">You have a new message in your Jawrah Pixel partner inbox.</p>
         <div style="margin-top:12px;font-size:14px;color:#dbeafe;">${details}</div>`,
        'Open Messages',
        AGENT_DASHBOARD_URL,
      );
    default:
      return card('Partner Network', `<p style="color:#cbd5e1;">${details}</p>`);
  }
}

function buildAdminBody(payload: AgentEmailPayload): string {
  const details = `
    ${summaryRow('Name', display(payload.name))}
    ${summaryRow('Email', display(payload.email))}
    ${summaryRow('Region', display(payload.region?.toUpperCase()))}
    ${summaryRow('Details', paragraph(payload.message))}
  `;

  if (payload.emailType === 'agent_lead_admin_alert') {
    return card('New Agent Lead', `<p style="color:#cbd5e1;margin:0 0 16px;">An agent submitted a new lead for review.</p>${details}`);
  }

  return card('New Agent Application', `<p style="color:#cbd5e1;margin:0 0 16px;">A new partner application requires review.</p>${details}`);
}

function summaryRow(label: string, value: string): string {
  return `<div style="margin:8px 0;font-size:13px;color:#94a3b8;"><strong style="color:#fff;">${label}:</strong> ${value}</div>`;
}

function card(title: string, inner: string, ctaLabel?: string, ctaUrl?: string): string {
  const cta =
    ctaLabel && ctaUrl
      ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:24px;"><tr>${actionButton(ctaLabel, ctaUrl, true)}</tr></table>`
      : '';

  return `<tr>
  <td class="card" style="border:1px solid rgba(255,255,255,.10);background:linear-gradient(145deg,rgba(14,18,28,.92),rgba(5,5,5,.94));border-radius:22px;padding:34px;">
    <div style="display:inline-block;padding:7px 10px;border:1px solid rgba(6,182,212,.35);border-radius:999px;background:rgba(6,182,212,.08);color:#67e8f9;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">Partner Network</div>
    <h1 class="hero-title" style="margin:20px 0 14px;font-size:32px;line-height:38px;color:#ffffff;">${display(title)}</h1>
    ${inner}
  </td>
</tr>${cta ? `<tr><td style="padding:0 34px 24px;">${cta}</td></tr>` : ''}`;
}

export async function sendAgentEmails(payload: AgentEmailPayload): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Resend] RESEND_API_KEY is not configured.');
    return { ok: false };
  }

  const resend = new Resend(apiKey);
  const from = formatFromAddress(process.env.FROM_EMAIL || FALLBACK_FROM_EMAIL);
  const adminEmail = process.env.ADMIN_EMAIL || FALLBACK_ADMIN_EMAIL;
  const isAdminType =
    payload.emailType === 'agent_application_admin_alert' ||
    payload.emailType === 'agent_lead_admin_alert' ||
    payload.emailType === 'agent_message_received';

  const html = JawrahEmailTemplate({
    preview: subjectFor(payload.emailType),
    kicker: 'Jawrah Pixel Partner',
    body: isAdminType ? buildAdminBody(payload) : buildBody(payload),
  });

  const deliveries: Promise<unknown>[] = [];

  if (!isAdminType && isValidEmail(payload.email)) {
    deliveries.push(
      resend.emails.send(
        {
          from,
          to: payload.email,
          subject: subjectFor(payload.emailType),
          html,
        },
        {
          headers: {
            'Idempotency-Key': idempotencyKey(payload.emailType, `${payload.email}-${payload.message ?? ''}`),
          },
        },
      ),
    );
  }

  if (isAdminType || payload.emailType.includes('admin')) {
    deliveries.push(
      resend.emails.send(
        {
          from,
          to: adminEmail,
          subject: subjectFor(payload.emailType),
          html: buildAdminBody(payload),
        },
        {
          headers: {
            'Idempotency-Key': idempotencyKey(`${payload.emailType}-admin`, payload.email ?? payload.message ?? ''),
          },
        },
      ),
    );
  }

  if (payload.emailType === 'agent_application_received') {
    deliveries.push(
      resend.emails.send(
        {
          from,
          to: adminEmail,
          subject: '[NEW AGENT APPLICATION] Jawrah Pixel',
          html: buildAdminBody({ ...payload, emailType: 'agent_application_admin_alert' }),
        },
        {
          headers: { 'Idempotency-Key': idempotencyKey('admin-app', payload.email ?? '') },
        },
      ),
    );
  }

  if (payload.emailType === 'agent_lead_submitted') {
    deliveries.push(
      resend.emails.send(
        {
          from,
          to: adminEmail,
          subject: '[NEW AGENT LEAD] Jawrah Pixel',
          html: buildAdminBody({ ...payload, emailType: 'agent_lead_admin_alert' }),
        },
        {
          headers: { 'Idempotency-Key': idempotencyKey('admin-lead', payload.message ?? '') },
        },
      ),
    );
  }

  await Promise.all(deliveries);
  return { ok: true };
}
