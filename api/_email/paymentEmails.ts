import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import {
  DASHBOARD_URL,
  JawrahEmailTemplate,
  FALLBACK_ADMIN_EMAIL,
  FALLBACK_FROM_EMAIL,
  actionButton,
  detailRow,
  display,
  formatFromAddress,
  summaryCard,
} from './jawrahEmailTemplate.js';

export type PaymentEmailType =
  | 'payment_confirmation'
  | 'admin_payment_notification'
  | 'manual_review'
  | 'invoice_paid'
  | 'invoice_created'
  | 'payment_proof_received_client'
  | 'payment_proof_received_admin'
  | 'payment_confirmed_client'
  | 'payment_confirmed_admin'
  | 'payment_rejected_client'
  | 'payment_update_requested_client';

export interface PaymentEmailPayload {
  emailType: PaymentEmailType;
  email?: string;
  invoiceNumber?: string;
  projectName?: string;
  amountDue?: string;
  currency?: string;
  referenceNumber?: string;
  transactionId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  notes?: string;
  submittedAt?: string;
  confirmedAt?: string;
  adminNote?: string;
  receiptSignedUrl?: string;
  adminReviewUrl?: string;
  captcha_token?: string;
}

const FALLBACK_FROM = FALLBACK_FROM_EMAIL;

function subjectFor(type: PaymentEmailType, payload?: PaymentEmailPayload): string {
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
    case 'payment_proof_received_client':
      return 'Payment proof received - verification in progress';
    case 'payment_proof_received_admin':
      return `New LK payment proof submitted - ${payload?.projectName || 'Project'} / ${payload?.invoiceNumber || 'Invoice'}`;
    case 'payment_confirmed_client':
      return 'Payment confirmed - your project is starting soon';
    case 'payment_confirmed_admin':
      return '[LK PAYMENT CONFIRMED] Jawrah Pixel';
    case 'payment_rejected_client':
      return 'Payment verification rejected - action required';
    case 'payment_update_requested_client':
      return 'Updated payment receipt requested';
    default:
      return 'Jawrah Pixel Billing';
  }
}

function idempotencyKey(type: string, seed: string): string {
  return `pay-${type}-${createHash('sha256').update(seed).digest('hex').slice(0, 32)}`;
}

function amountLabel(payload: PaymentEmailPayload): string {
  return `${display(payload.currency, '')} ${display(payload.amountDue)}`.trim();
}

function appUrl(path?: string) {
  if (!path) return DASHBOARD_URL;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/admin')) return `https://jawrahpixel.com${path}`;
  return `${DASHBOARD_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function buildBody(payload: PaymentEmailPayload): string {
  const rows = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        ${summaryCard('Invoice', payload.invoiceNumber, true)}
        ${summaryCard('Project', payload.projectName)}
        ${summaryCard('Amount', amountLabel(payload), true)}
      </tr>
    </table>`;

  let title = subjectFor(payload.emailType, payload).replace('[', '').replace('] Jawrah Pixel', '');
  let inner =
    payload.emailType === 'manual_review'
      ? `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">A client submitted manual payment proof for review.</p>${rows}<p style="margin-top:16px;font-size:14px;color:#94a3b8;">Reference: ${display(payload.referenceNumber)}</p>`
      : payload.emailType === 'invoice_created'
        ? `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Your professional invoice is ready in the Jawrah Pixel client dashboard.</p>${rows}`
        : `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">Payment activity has been recorded on your Jawrah Pixel account.</p>${rows}`;

  if (payload.emailType === 'payment_proof_received_client') {
    title = 'Payment Proof Received';
    inner = `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">We have received your payment proof for ${display(payload.projectName)}.</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:25px;color:#cbd5e1;">Your payment is now awaiting verification by the Jawrah Pixel team. Once confirmed, your project will move into the start queue.</p>
      ${rows}`;
  }

  if (payload.emailType === 'payment_confirmed_client') {
    title = 'Payment Confirmed';
    inner = `<p style="margin:0 0 14px;font-size:16px;line-height:26px;color:#cbd5e1;">Hi ${display(payload.clientName, 'there')},</p>
      <p style="margin:0 0 14px;font-size:16px;line-height:26px;color:#cbd5e1;">Your payment for ${display(payload.projectName)} has been successfully verified and confirmed.</p>
      ${rows}
      <p style="margin:16px 0 8px;font-size:15px;line-height:24px;color:#f8fafc;font-weight:700;">Status: Payment Confirmed</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:25px;color:#cbd5e1;">Your project will officially move into the start queue and our team will begin within the next 24 hours.</p>
      <p style="margin:0 0 8px;font-size:15px;line-height:24px;color:#f8fafc;font-weight:700;">What happens next:</p>
      <ol style="margin:0 0 0 18px;padding:0;color:#cbd5e1;font-size:14px;line-height:24px;">
        <li>Our team reviews your project brief and assets.</li>
        <li>We prepare the starting workspace.</li>
        <li>You will receive the next update through your Jawrah Pixel dashboard.</li>
        <li>If anything is needed, our team will contact you directly.</li>
      </ol>
      <p style="margin:18px 0 0;font-size:15px;line-height:25px;color:#cbd5e1;">Thank you for trusting Jawrah Pixel.<br />Jawrah Pixel Team</p>`;
  }

  if (payload.emailType === 'payment_rejected_client' || payload.emailType === 'payment_update_requested_client') {
    const rejected = payload.emailType === 'payment_rejected_client';
    title = rejected ? 'Payment Verification Rejected' : 'Updated Receipt Requested';
    inner = `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">${rejected ? 'We could not verify your submitted payment proof.' : 'We need an updated receipt or payment reference before confirming your payment.'}</p>
      ${rows}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:12px;">
        ${detailRow('Admin Note', payload.adminNote)}
        ${detailRow('Bank Reference', payload.referenceNumber)}
      </table>`;
  }

  if (payload.emailType === 'payment_proof_received_admin' || payload.emailType === 'payment_confirmed_admin') {
    const confirmed = payload.emailType === 'payment_confirmed_admin';
    title = confirmed ? 'LK Payment Confirmed' : 'New LK Payment Proof Submitted';
    inner = `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cbd5e1;">${confirmed ? 'An LK bank transfer payment has been confirmed.' : 'A client submitted LK bank transfer proof for review.'}</p>
      ${rows}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:12px;">
        ${detailRow('Client Name', payload.clientName)}
        ${detailRow('Client Email', payload.clientEmail)}
        ${detailRow('Client Phone', payload.clientPhone)}
        ${detailRow('Bank Reference', payload.referenceNumber)}
        ${detailRow('Notes', payload.notes)}
        ${detailRow(confirmed ? 'Confirmed Time' : 'Submitted Time', confirmed ? payload.confirmedAt : payload.submittedAt)}
      </table>
      ${payload.receiptSignedUrl ? `<p style="font-size:13px;margin:18px 0 0;"><a href="${payload.receiptSignedUrl}" style="color:#67e8f9;">View Receipt</a></p>` : ''}`;
  }

  return `<tr>
  <td class="card" style="border:1px solid rgba(255,255,255,.10);background:linear-gradient(145deg,rgba(14,18,28,.92),rgba(5,5,5,.94));border-radius:22px;padding:34px;">
    <h1 style="margin:0 0 14px;font-size:30px;color:#fff;">${display(title)}</h1>
    ${inner}
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:24px;"><tr>
      ${actionButton(payload.emailType.endsWith('_admin') ? 'Review Dashboard' : 'View Dashboard', payload.emailType.endsWith('_admin') ? appUrl(payload.adminReviewUrl || '/admin') : DASHBOARD_URL, true)}
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
  const subject = subjectFor(payload.emailType, payload);
  const html = JawrahEmailTemplate({
    preview: subject,
    kicker: 'Billing',
    body: buildBody(payload),
  });

  const sends: Promise<unknown>[] = [];
  const sendsAdmin =
    payload.emailType === 'admin_payment_notification' ||
    payload.emailType === 'manual_review' ||
    payload.emailType === 'invoice_created' ||
    payload.emailType === 'payment_proof_received_admin' ||
    payload.emailType === 'payment_confirmed_admin';
  const sendsClient =
    payload.emailType !== 'admin_payment_notification' &&
    payload.emailType !== 'manual_review' &&
    payload.emailType !== 'payment_proof_received_admin' &&
    payload.emailType !== 'payment_confirmed_admin';

  if (payload.email && sendsClient) {
    sends.push(
      resend.emails.send(
        { from, to: payload.email, subject, html },
        { headers: { 'Idempotency-Key': idempotencyKey(payload.emailType, payload.email) } },
      ),
    );
  }

  if (sendsAdmin) {
    sends.push(
      resend.emails.send(
        { from, to: adminEmail, subject, html },
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
