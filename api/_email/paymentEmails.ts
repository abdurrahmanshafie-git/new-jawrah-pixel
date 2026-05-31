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
  summaryCard,
} from './jawrahEmailTemplate.js';

export type PaymentEmailType =
  | 'payment_confirmation'
  | 'admin_payment_notification'
  | 'manual_review'
  | 'invoice_paid'
  | 'invoice_created';

export interface PaymentEmailPayload {
  emailType: PaymentEmailType;
  email?: string;
  invoiceNumber?: string;
  projectName?: string;
  amountDue?: string;
  currency?: string;
  referenceNumber?: string;
  transactionId?: string;
}

const FALLBACK_FROM = FALLBACK_FROM_EMAIL;

function subjectFor(type: PaymentEmailType): string {
  switch (type) {
    case 'payment_confirmation':
      return '[PAYMENT RECEIVED] Jawrah Pixel';
    case 'admin_payment_notification':
      return '[NEW PAYMENT] Jawrah Pixel';
    case 'manual_review':
      return '[PAYMENT REVIEW] Jawrah Pixel';
    case 'invoice_paid':
      return '[INVOICE PAID] Jawrah Pixel';
    case 'invoice_created':
      return '[INVOICE READY] Jawrah Pixel';
    default:
      return 'Jawrah Pixel Billing';
  }
}

function idempotencyKey(type: string, seed: string): string {
  return `pay-${type}-${createHash('sha256').update(seed).digest('hex').slice(0, 32)}`;
}

function buildBody(payload: PaymentEmailPayload): string {
  const rows = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        ${summaryCard('Invoice', payload.invoiceNumber, true)}
        ${summaryCard('Project', payload.projectName)}
        ${summaryCard('Amount', `${display(payload.amountDue)} ${display(payload.currency, '')}`, true)}
      </tr>
    </table>`;

  const inner =
    payload.emailType === 'manual_review'
      ? `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">A client submitted manual payment proof for review.</p>${rows}<p style="margin-top:16px;font-size:14px;color:#94a3b8;">Reference: ${display(payload.referenceNumber)}</p>`
      : payload.emailType === 'invoice_created'
        ? `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Your professional invoice is ready in the Jawrah Pixel client dashboard.</p>${rows}`
        : `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Payment activity has been recorded on your Jawrah Pixel account.</p>${rows}`;

  return `<tr>
  <td class="card" style="border:1px solid rgba(255,255,255,.10);background:linear-gradient(145deg,rgba(14,18,28,.92),rgba(5,5,5,.94));border-radius:22px;padding:34px;">
    <h1 style="margin:0 0 14px;font-size:30px;color:#fff;">${display(subjectFor(payload.emailType).replace('[', '').replace('] Jawrah Pixel', ''))}</h1>
    ${inner}
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:24px;"><tr>
      ${actionButton('View Dashboard', DASHBOARD_URL, true)}
    </tr></table>
  </td>
</tr>`;
}

export async function sendPaymentEmails(payload: PaymentEmailPayload): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Resend] RESEND_API_KEY missing');
    return { ok: false };
  }

  const resend = new Resend(apiKey);
  const from = formatFromAddress(process.env.FROM_EMAIL || FALLBACK_FROM);
  const adminEmail = process.env.ADMIN_EMAIL || FALLBACK_ADMIN_EMAIL;
  const html = JawrahEmailTemplate({
    preview: subjectFor(payload.emailType),
    kicker: 'Billing',
    body: buildBody(payload),
  });

  const sends: Promise<unknown>[] = [];

  if (payload.email && payload.emailType !== 'admin_payment_notification' && payload.emailType !== 'manual_review') {
    sends.push(
      resend.emails.send(
        { from, to: payload.email, subject: subjectFor(payload.emailType), html },
        { headers: { 'Idempotency-Key': idempotencyKey(payload.emailType, payload.email) } },
      ),
    );
  }

  if (
    payload.emailType === 'admin_payment_notification' ||
    payload.emailType === 'manual_review' ||
    payload.emailType === 'invoice_created'
  ) {
    sends.push(
      resend.emails.send(
        { from, to: adminEmail, subject: subjectFor(payload.emailType), html },
        { headers: { 'Idempotency-Key': idempotencyKey(`admin-${payload.emailType}`, payload.invoiceNumber ?? '') } },
      ),
    );
  }

  await Promise.all(sends);
  return { ok: true };
}

export interface PaymentPdfEmailPayload {
  email: string;
  invoiceNumber: string;
  projectName: string;
  amountDue: string;
  currency: string;
  invoicePdfUrl?: string;
  receiptPdfUrl?: string;
  invoicePdfBytes?: Uint8Array;
  receiptPdfBytes?: Uint8Array;
  isReceipt?: boolean;
}

export async function sendPaymentEmailsWithPdf(payload: PaymentPdfEmailPayload): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false };

  const resend = new Resend(apiKey);
  const from = formatFromAddress(process.env.FROM_EMAIL || FALLBACK_FROM);
  const adminEmail = process.env.ADMIN_EMAIL || FALLBACK_ADMIN_EMAIL;
  const subject = payload.isReceipt ? '[PAYMENT RECEIVED] Jawrah Pixel' : '[INVOICE READY] Jawrah Pixel';

  const linkBlock = `
    <p style="margin:16px 0;font-size:14px;color:#cbd5e1;">Your branded PDF documents are ready.</p>
    ${payload.invoicePdfUrl ? `<p style="font-size:13px;"><a href="${payload.invoicePdfUrl}" style="color:#67e8f9;">Download Invoice PDF</a></p>` : ''}
    ${payload.receiptPdfUrl ? `<p style="font-size:13px;"><a href="${payload.receiptPdfUrl}" style="color:#67e8f9;">Download Receipt PDF</a></p>` : ''}
  `;

  const body = `<tr>
  <td class="card" style="border:1px solid rgba(255,255,255,.10);background:linear-gradient(145deg,rgba(14,18,28,.92),rgba(5,5,5,.94));border-radius:22px;padding:34px;">
    <h1 style="margin:0 0 14px;font-size:28px;color:#fff;">${payload.isReceipt ? 'Payment Receipt' : 'Invoice Ready'}</h1>
    <table role="presentation" width="100%"><tr>
      ${summaryCard('Invoice', payload.invoiceNumber, true)}
      ${summaryCard('Project', payload.projectName)}
      ${summaryCard('Amount', `${display(payload.amountDue)} ${display(payload.currency, '')}`, true)}
    </tr></table>
    ${linkBlock}
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:24px;"><tr>
      ${actionButton('Open Dashboard', DASHBOARD_URL, true)}
    </tr></table>
  </td>
</tr>`;

  const html = JawrahEmailTemplate({ preview: subject, kicker: 'Billing PDF', body });
  const attachments: Array<{ filename: string; content: Buffer }> = [];
  if (payload.invoicePdfBytes?.length) {
    attachments.push({ filename: `invoice-${payload.invoiceNumber}.pdf`, content: Buffer.from(payload.invoicePdfBytes) });
  }
  if (payload.receiptPdfBytes?.length) {
    attachments.push({ filename: `receipt-${payload.invoiceNumber}.pdf`, content: Buffer.from(payload.receiptPdfBytes) });
  }

  const clientPayload = {
    from,
    to: payload.email,
    subject,
    html,
    attachments: attachments.length ? attachments : undefined,
  };

  await resend.emails.send(clientPayload, {
    headers: { 'Idempotency-Key': idempotencyKey('pdf-client', payload.invoiceNumber) },
  });

  await resend.emails.send(
    {
      from,
      to: adminEmail,
      subject: '[NEW PAYMENT PDF] Jawrah Pixel',
      html,
      attachments: attachments.length ? attachments : undefined,
    },
    { headers: { 'Idempotency-Key': idempotencyKey('pdf-admin', payload.invoiceNumber) } },
  );

  return { ok: true };
}
