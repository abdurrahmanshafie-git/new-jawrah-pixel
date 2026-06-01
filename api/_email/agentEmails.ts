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
  captcha_token?: string;
}

const PARTNER_DASHBOARD_URL = `${DASHBOARD_URL.replace('/dashboard', '')}/partner/dashboard`;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email?: string): email is string {
  return Boolean(email && EMAIL_REGEX.test(email));
}

function subjectFor(type: AgentEmailType): string {
  switch (type) {
    case 'agent_application_received':
      return 'Application Received — Jawrah Pixel Partner Network';
    case 'agent_application_admin_alert':
      return '[Partner Application] Review Required — Jawrah Pixel';
    case 'agent_application_approved':
      return 'Welcome To The Jawrah Pixel Partner Network';
    case 'agent_application_rejected':
      return 'Partner Application Update — Jawrah Pixel';
    case 'agent_application_needs_info':
      return 'Additional Information Requested — Jawrah Pixel Partner Network';
    case 'agent_lead_submitted':
      return 'Lead Submitted — Jawrah Pixel Partner Network';
    case 'agent_lead_admin_alert':
      return '[Partner Lead] Review Required — Jawrah Pixel';
    case 'agent_commission_approved':
      return 'Commission Approved — Jawrah Pixel Partner Network';
    case 'agent_commission_paid':
      return 'Commission Paid — Jawrah Pixel Partner Network';
    case 'agent_message_received':
      return 'New Message — Jawrah Pixel Partner Network';
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
         <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Thank you for your interest in joining the Jawrah Pixel Partner Network. Our team will carefully review your application.</p>
         <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Estimated review time: 1–3 business days.</p>
         ${summaryRow('Status', 'Pending Review')}
         ${summaryRow('Region', region)}`,
        'View Partner Program',
        PARTNER_DASHBOARD_URL,
      );
    case 'agent_application_approved':
      return card(
        'Welcome To The Jawrah Pixel Partner Network',
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Congratulations.</p>
         <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Your application has been approved.</p>
         ${summaryRow('Partner ID', display(payload.partnerId))}
         ${summaryRow('Referral Code', display(payload.agentCode))}
         <p style="margin:16px 0 0;font-size:16px;line-height:26px;color:#cbd5e1;">You may now access your Partner Dashboard and begin referring projects.</p>`,
        'Open Partner Dashboard',
        PARTNER_DASHBOARD_URL,
      );
    case 'agent_application_needs_info':
      return card(
        'Additional Information Requested',
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Hello ${name},</p>
         <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">We need more information to continue reviewing your partner application.</p>
         <div style="margin-top:12px;font-size:14px;color:#dbeafe;">${details}</div>`,
        'Open Messages',
        PARTNER_DASHBOARD_URL,
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
        PARTNER_DASHBOARD_URL,
      );
    case 'agent_commission_approved':
      return card(
        'Commission Approved',
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Hello ${name},</p>
         <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">A commission on your referred project has been approved.</p>
         ${summaryRow('Amount', `${display(payload.amount)} ${display(payload.currency, '')}`)}`,
        'View Commissions',
        PARTNER_DASHBOARD_URL,
      );
    case 'agent_commission_paid':
      return card(
        'Commission Paid',
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Hello ${name},</p>
         <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Your partner commission payout has been processed.</p>
         ${summaryRow('Amount', `${display(payload.amount)} ${display(payload.currency, '')}`)}`,
        'View Payouts',
        PARTNER_DASHBOARD_URL,
      );
    case 'agent_message_received':
      return card(
        'New Message',
        `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">You have a new message in your Jawrah Pixel partner inbox.</p>
         <div style="margin-top:12px;font-size:14px;color:#dbeafe;">${details}</div>`,
        'Open Messages',
        PARTNER_DASHBOARD_URL,
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

  return card('New Partner Application', `<p style="color:#cbd5e1;margin:0 0 16px;">A new partner application requires review.</p>${details}`);
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
          subject: '[Partner Application] Review Required — Jawrah Pixel',
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
          subject: '[Partner Lead] Review Required — Jawrah Pixel',
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
