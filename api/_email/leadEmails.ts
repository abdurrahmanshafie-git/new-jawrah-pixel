import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import {
  DASHBOARD_URL,
  JawrahEmailTemplate,
  SITE_URL,
  actionButton,
  detailRow,
  display,
  formatFromAddress,
  paragraph,
  summaryCard,
} from './jawrahEmailTemplate.js';

export interface LeadSubmission {
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  region?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  goals?: string;
  notes?: string;
  requirements?: string;
  source?: string;
  formType?: string;
  userId?: string;
  submissionId?: string;
  platform?: string;
  submissionTime?: string;
}

export interface WelcomeEmailPayload {
  name?: string;
  email: string;
  region?: string;
}

export interface LeadEmailResult {
  ok: boolean;
  clientEmailSent: boolean;
  adminEmailSent: boolean;
  skippedClientEmail: boolean;
  errors: Array<'client' | 'admin'>;
}

const FALLBACK_ADMIN_EMAIL = 'jawrahpixel@gmail.com';
const FALLBACK_FROM_EMAIL = 'projects@jawrahpixel.com';
const INTERNAL_EMAILS = new Set(['captured-via-bot@jawrahpixel.com']);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRealClientEmail(email?: string): email is string {
  if (!email) return false;
  const normalized = email.toLowerCase();
  return EMAIL_REGEX.test(email) && !INTERNAL_EMAILS.has(normalized);
}

function formatRegionLabel(region?: string): string {
  if (!region) return 'Global';
  if (region === 'lk') return 'Sri Lanka (LK)';
  if (region === 'pk') return 'Pakistan (PK)';
  if (region === 'int') return 'International (INT)';
  return region.toUpperCase();
}

function formatSubmittedDate(submissionTime?: string): string {
  const date = submissionTime ? new Date(submissionTime) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function resolveRequirements(lead: LeadSubmission): string | undefined {
  return (
    lead.requirements ||
    [lead.goals, lead.message, lead.notes].filter(Boolean).join('\n\n') ||
    undefined
  );
}

function adminSubject(lead: LeadSubmission): string {
  const formType = (lead.formType || '').toLowerCase();

  if (formType.includes('project') || formType.includes('brief')) return '[NEW PROJECT] Jawrah Pixel';
  if (formType.includes('strategy') || formType.includes('booking') || formType.includes('consultation')) {
    return '[NEW STRATEGY REQUEST] Jawrah Pixel';
  }
  if (formType.includes('proposal')) return '[NEW PROPOSAL REQUEST] Jawrah Pixel';
  if (formType.includes('agent')) return '[NEW AGENT APPLICATION] Jawrah Pixel';
  if (formType.includes('chatbot')) return '[NEW CONSULTATION] Jawrah Pixel';

  return '[NEW INQUIRY] Jawrah Pixel';
}

function clientSubject(lead: LeadSubmission): string {
  const formType = (lead.formType || '').toLowerCase();
  if (formType.includes('agent')) return 'Jawrah Pixel — Application Received';
  if (formType.includes('strategy') || formType.includes('booking')) return 'Jawrah Pixel — Consultation Request Received';
  return 'Jawrah Pixel — Request Received';
}

function idempotencyKey(target: 'client' | 'admin' | 'welcome', seedParts: Array<string | undefined>): string {
  const seed = [target, ...seedParts].filter(Boolean).join(':');
  return `${target}-${createHash('sha256').update(seed).digest('hex').slice(0, 32)}`;
}

export function buildClientConfirmationEmail(lead: LeadSubmission): string {
  const firstName = lead.name?.split(' ')[0] || 'there';
  const requirements = resolveRequirements(lead);
  const submittedAt = formatSubmittedDate(lead.submissionTime);

  const body = `<tr>
  <td class="card" style="border:1px solid rgba(255,255,255,.10);background:linear-gradient(145deg,rgba(14,18,28,.92),rgba(5,5,5,.94));border-radius:22px;padding:34px;box-shadow:0 28px 80px rgba(0,0,0,.46);backdrop-filter:blur(16px);">
    <div style="display:inline-block;padding:7px 10px;border:1px solid rgba(6,182,212,.35);border-radius:999px;background:rgba(6,182,212,.08);color:#67e8f9;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">Jawrah Pixel Studio</div>
    <h1 class="hero-title" style="margin:20px 0 14px;font-size:38px;line-height:44px;color:#ffffff;letter-spacing:-.2px;">Thank You For Choosing Jawrah Pixel</h1>
    <p style="margin:0 0 18px;font-size:16px;line-height:26px;color:#cbd5e1;">Hello ${display(firstName, 'there')},</p>
    <p style="margin:0 0 18px;font-size:16px;line-height:26px;color:#cbd5e1;">Your submission has been received successfully.</p>
    <p style="margin:0 0 18px;font-size:16px;line-height:26px;color:#cbd5e1;">Our team will review your request and contact you shortly.</p>
    <div style="margin:22px 0;padding:16px 18px;border-radius:16px;background:rgba(6,182,212,.10);border:1px solid rgba(6,182,212,.28);">
      <div style="font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#67e8f9;font-weight:800;margin-bottom:6px;">Expected response time</div>
      <div style="font-size:20px;line-height:28px;color:#ffffff;font-weight:800;">24-48 hours</div>
    </div>
    <h2 style="margin:28px 0 14px;font-size:17px;line-height:24px;color:#ffffff;">Project Summary</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        ${summaryCard('Service', lead.service, true)}
        ${summaryCard('Budget', lead.budget)}
        ${summaryCard('Timeline', lead.timeline)}
      </tr>
      <tr>
        ${summaryCard('Submission ID', lead.submissionId)}
        ${summaryCard('Region', formatRegionLabel(lead.region))}
        ${summaryCard('Date', submittedAt, true)}
      </tr>
    </table>
    <div style="margin-top:18px;padding:18px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);">
      <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#94a3b8;font-weight:800;margin-bottom:8px;">Requirements</div>
      <div style="font-size:14px;line-height:22px;color:#dbeafe;">${paragraph(requirements)}</div>
    </div>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:28px;">
      <tr>
        ${actionButton('View Dashboard', DASHBOARD_URL, true)}
        ${actionButton('Visit Jawrah Pixel', SITE_URL, false)}
      </tr>
    </table>
  </td>
</tr>`;

  return JawrahEmailTemplate({
    preview: 'Your Jawrah Pixel submission was received successfully.',
    kicker: 'Request Received',
    body,
  });
}

export function buildAdminNotificationEmail(lead: LeadSubmission): string {
  const submittedAt = lead.submissionTime || new Date().toISOString();
  const requirements = resolveRequirements(lead);
  const contactPhone = lead.phone || lead.whatsapp;

  const body = `<tr>
  <td class="card" style="border:1px solid rgba(255,255,255,.10);background:linear-gradient(145deg,rgba(9,14,25,.96),rgba(5,5,5,.96));border-radius:22px;padding:30px;box-shadow:0 28px 80px rgba(0,0,0,.50);">
    <div style="display:inline-block;padding:7px 10px;border:1px solid rgba(59,130,246,.40);border-radius:999px;background:rgba(59,130,246,.10);color:#93c5fd;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Luxury CRM Notification</div>
    <h1 class="hero-title" style="margin:18px 0 8px;font-size:34px;line-height:40px;color:#ffffff;letter-spacing:-.2px;">New Lead Received</h1>
    <p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#94a3b8;">Complete submission data captured from the Jawrah Pixel platform.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        ${summaryCard('Budget', lead.budget, true)}
        ${summaryCard('Region', formatRegionLabel(lead.region || lead.country), true)}
        ${summaryCard('Service Type', lead.service, true)}
      </tr>
    </table>
    <div style="margin:10px 0 18px;padding:18px;border-radius:16px;border:1px solid rgba(6,182,212,.22);background:linear-gradient(135deg,rgba(6,182,212,.10),rgba(59,130,246,.06));">
      <div style="font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#67e8f9;font-weight:900;margin-bottom:8px;">Lead Overview</div>
      <div style="font-size:18px;line-height:26px;color:#ffffff;font-weight:800;">${display(lead.name, 'Unnamed Lead')}</div>
      <div style="font-size:13px;line-height:22px;color:#cbd5e1;">${display(lead.email || contactPhone, 'No contact channel supplied')}</div>
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      ${detailRow('Form Type', lead.formType)}
      ${detailRow('Name', lead.name)}
      ${detailRow('Email', lead.email)}
      ${detailRow('Phone', contactPhone)}
      ${detailRow('WhatsApp', lead.whatsapp)}
      ${detailRow('Country', lead.country)}
      ${detailRow('Region', formatRegionLabel(lead.region))}
      ${detailRow('User ID', lead.userId)}
      ${detailRow('Submission ID', lead.submissionId)}
      ${detailRow('Project Type', lead.service)}
      ${detailRow('Budget', lead.budget)}
      ${detailRow('Timeline', lead.timeline)}
      ${detailRow('Requirements', requirements)}
      ${detailRow('Goals', lead.goals)}
      ${detailRow('Message', lead.message)}
      ${detailRow('Notes', lead.notes)}
      ${detailRow('Source Page', lead.source)}
      ${detailRow('Platform', lead.platform)}
      ${detailRow('Submitted Time', submittedAt)}
    </table>
  </td>
</tr>`;

  return JawrahEmailTemplate({
    preview: 'New Jawrah Pixel lead saved and ready for review.',
    kicker: 'Lead Notification',
    body,
    footerNote: `Jawrah Pixel Lead Desk • ${submittedAt}`,
  });
}

export function buildWelcomeEmail(payload: WelcomeEmailPayload): string {
  const firstName = payload.name?.split(' ')[0] || 'there';
  const regionLabel = formatRegionLabel(payload.region);

  const body = `<tr>
  <td class="card" style="border:1px solid rgba(255,255,255,.10);background:linear-gradient(145deg,rgba(14,18,28,.92),rgba(5,5,5,.94));border-radius:22px;padding:34px;box-shadow:0 28px 80px rgba(0,0,0,.46);">
    <div style="display:inline-block;padding:7px 10px;border:1px solid rgba(59,130,246,.35);border-radius:999px;background:rgba(59,130,246,.08);color:#93c5fd;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">Welcome Aboard</div>
    <h1 class="hero-title" style="margin:20px 0 14px;font-size:38px;line-height:44px;color:#ffffff;letter-spacing:-.2px;">Welcome to Jawrah Pixel</h1>
    <p style="margin:0 0 18px;font-size:16px;line-height:26px;color:#cbd5e1;">Hello ${display(firstName, 'there')},</p>
    <p style="margin:0 0 18px;font-size:16px;line-height:26px;color:#cbd5e1;">Your secure client workspace is ready. You now have premium access to project management, strategy submissions, and your dedicated Jawrah Pixel ecosystem.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        ${summaryCard('Assigned Region', regionLabel, true)}
        ${summaryCard('Dashboard', 'Active', true)}
        ${summaryCard('Workspace', 'Client Portal', true)}
      </tr>
    </table>
    <div style="margin-top:22px;padding:18px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);">
      <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#94a3b8;font-weight:800;margin-bottom:10px;">Your Access Includes</div>
      <div style="font-size:14px;line-height:24px;color:#dbeafe;">
        • Dashboard access for live project visibility<br />
        • Client workspace for submissions and updates<br />
        • Project management access for milestones, invoices, and support
      </div>
    </div>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:28px;">
      <tr>
        ${actionButton('View Dashboard', DASHBOARD_URL, true)}
        ${actionButton('Visit Jawrah Pixel', SITE_URL, false)}
      </tr>
    </table>
  </td>
</tr>`;

  return JawrahEmailTemplate({
    preview: 'Welcome to Jawrah Pixel. Your premium client workspace is ready.',
    kicker: 'Account Created',
    body,
  });
}

export async function sendLeadEmails(lead: LeadSubmission): Promise<LeadEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const attemptedClientEmail = isRealClientEmail(lead.email);
    console.error('[Resend] RESEND_API_KEY is not configured.');
    return {
      ok: false,
      clientEmailSent: false,
      adminEmailSent: false,
      skippedClientEmail: !attemptedClientEmail,
      errors: attemptedClientEmail ? ['client', 'admin'] : ['admin'],
    };
  }

  const resend = new Resend(apiKey);
  const from = formatFromAddress(process.env.FROM_EMAIL || FALLBACK_FROM_EMAIL);
  const adminEmail = process.env.ADMIN_EMAIL || FALLBACK_ADMIN_EMAIL;
  const result: LeadEmailResult = {
    ok: true,
    clientEmailSent: false,
    adminEmailSent: false,
    skippedClientEmail: !isRealClientEmail(lead.email),
    errors: [],
  };

  const deliveries: Array<Promise<void>> = [];

  if (isRealClientEmail(lead.email)) {
    deliveries.push(
      resend.emails
        .send(
          {
            from,
            to: lead.email,
            subject: clientSubject(lead),
            html: buildClientConfirmationEmail(lead),
          },
          { headers: { 'Idempotency-Key': idempotencyKey('client', [lead.formType, lead.email, lead.submissionId, lead.submissionTime]) } },
        )
        .then(({ error }) => {
          if (error) {
            console.error('[Resend] Client confirmation failed:', error);
            result.errors.push('client');
            return;
          }
          result.clientEmailSent = true;
        })
        .catch((error: unknown) => {
          console.error('[Resend] Client confirmation threw:', error);
          result.errors.push('client');
        }),
    );
  }

  deliveries.push(
    resend.emails
      .send(
        {
          from,
          to: adminEmail,
          subject: adminSubject(lead),
          html: buildAdminNotificationEmail(lead),
        },
        { headers: { 'Idempotency-Key': idempotencyKey('admin', [lead.formType, lead.email, lead.submissionId, lead.submissionTime]) } },
      )
      .then(({ error }) => {
        if (error) {
          console.error('[Resend] Admin notification failed:', error);
          result.errors.push('admin');
          return;
        }
        result.adminEmailSent = true;
      })
      .catch((error: unknown) => {
        console.error('[Resend] Admin notification threw:', error);
        result.errors.push('admin');
      }),
  );

  await Promise.all(deliveries);
  result.ok = result.errors.length === 0;
  return result;
}

export async function sendWelcomeEmail(payload: WelcomeEmailPayload): Promise<{ ok: boolean; sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Resend] RESEND_API_KEY is not configured.');
    return { ok: false, sent: false, reason: 'Email service unavailable.' };
  }

  if (!isRealClientEmail(payload.email)) {
    return { ok: false, sent: false, reason: 'Invalid recipient email.' };
  }

  const resend = new Resend(apiKey);
  const from = formatFromAddress(process.env.FROM_EMAIL || FALLBACK_FROM_EMAIL);

  const { error } = await resend.emails.send(
    {
      from,
      to: payload.email,
      subject: 'Welcome to Jawrah Pixel',
      html: buildWelcomeEmail(payload),
    },
    { headers: { 'Idempotency-Key': idempotencyKey('welcome', [payload.email, payload.region]) } },
  );

  if (error) {
    console.error('[Resend] Welcome email failed:', error);
    return { ok: false, sent: false, reason: error.message };
  }

  return { ok: true, sent: true };
}
