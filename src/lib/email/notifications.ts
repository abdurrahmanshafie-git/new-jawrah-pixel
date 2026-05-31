import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { appEnv } from '@/lib/env';
import { sendLeadEmailNotification } from './leadEmails';

export type EmailTemplate =
  | 'inquiry_received'
  | 'admin_notification'
  | 'account_welcome'
  | 'booking_confirmation'
  | 'proposal_sent'
  | 'payment_confirmation'
  | 'invoice_created'
  | 'payment_pending'
  | 'project_update'
  | 'support_ticket_created';

export interface EmailPayload {
  to?: string;
  subject?: string;
  data?: Record<string, string | number | null | undefined>;
}

export interface EmailDispatchResult {
  sent: boolean;
  skipped: boolean;
  reason?: string;
}

const TEMPLATE_SUBJECTS: Record<EmailTemplate, string> = {
  inquiry_received: 'We received your inquiry — Jawrah Pixel',
  admin_notification: 'New lead activity — Jawrah Pixel Admin',
  account_welcome: 'Welcome to Jawrah Pixel',
  booking_confirmation: 'Your strategy briefing is scheduled — Jawrah Pixel',
  proposal_sent: 'Your project proposal is ready — Jawrah Pixel',
  payment_confirmation: 'Payment received — Jawrah Pixel',
  invoice_created: 'Your invoice is ready — Jawrah Pixel',
  payment_pending: 'Payment pending confirmation — Jawrah Pixel',
  project_update: 'Project status update — Jawrah Pixel',
  support_ticket_created: 'Support ticket received — Jawrah Pixel',
};

async function invokeSendNotification(template: EmailTemplate, payload: EmailPayload): Promise<EmailDispatchResult> {
  if (!isSupabaseConfigured) {
    return { sent: false, skipped: true, reason: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabase.functions.invoke('send-notification', {
      body: {
        template,
        to: payload.to ?? appEnv.contactEmail,
        subject: payload.subject ?? TEMPLATE_SUBJECTS[template],
        data: payload.data ?? {},
      },
    });

    if (error) {
      return { sent: false, skipped: true, reason: error.message };
    }

    return { sent: true, skipped: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Email dispatch unavailable';
    return { sent: false, skipped: true, reason: message };
  }
}

/** Never throws — callers should persist data first, then fire-and-forget this. */
export async function dispatchEmail(template: EmailTemplate, payload: EmailPayload = {}): Promise<EmailDispatchResult> {
  return invokeSendNotification(template, payload);
}

export async function notifyInquiryReceived(data: {
  fullName: string;
  email: string;
  service?: string;
}) {
  await sendLeadEmailNotification({
    name: data.fullName,
    email: data.email,
    service: data.service,
    source: 'inquiry',
    formType: 'Contact Form',
  });
}

export async function notifyBookingConfirmation(data: {
  name: string;
  email: string;
  date?: string | null;
  time?: string | null;
}) {
  await sendLeadEmailNotification({
    name: data.name,
    email: data.email,
    timeline: [data.date, data.time].filter(Boolean).join(' '),
    source: 'booking',
    formType: 'Strategy Call Booking',
  });
}

export async function notifyProposalSent(data: { email: string; projectTitle: string }) {
  return dispatchEmail('proposal_sent', {
    to: data.email,
    data: { projectTitle: data.projectTitle },
  });
}

export async function notifyPaymentConfirmation(data: {
  email: string;
  invoiceNumber: string;
  amount: string;
  currency: string;
}) {
  return dispatchEmail('payment_confirmation', {
    to: data.email,
    data: {
      invoiceNumber: data.invoiceNumber,
      amount: data.amount,
      currency: data.currency,
    },
  });
}

export async function notifyInvoiceCreated(data: {
  email: string;
  invoiceNumber: string;
  amount: string;
  currency: string;
  serviceName: string;
}) {
  await Promise.all([
    dispatchEmail('invoice_created', {
      to: data.email,
      data: {
        invoiceNumber: data.invoiceNumber,
        amount: data.amount,
        currency: data.currency,
        serviceName: data.serviceName,
      },
    }),
    dispatchEmail('admin_notification', {
      to: appEnv.contactEmail,
      data: { source: 'invoice_created', invoiceNumber: data.invoiceNumber, amount: data.amount },
    }),
  ]);
}

export async function notifyPaymentPending(data: {
  email: string;
  invoiceNumber: string;
  amount: string;
  currency: string;
}) {
  return dispatchEmail('payment_pending', {
    to: data.email,
    data: {
      invoiceNumber: data.invoiceNumber,
      amount: data.amount,
      currency: data.currency,
    },
  });
}

export async function notifySupportTicketCreated(data: { email: string; subject: string }) {
  return dispatchEmail('support_ticket_created', {
    to: data.email,
    data: { subject: data.subject },
  });
}
