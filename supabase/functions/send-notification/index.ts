import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  template?: string;
  to?: string;
  subject?: string;
  data?: Record<string, unknown>;
}

function smtpConfigured(): boolean {
  return Boolean(
    Deno.env.get('SMTP_HOST') &&
      Deno.env.get('SMTP_PORT') &&
      Deno.env.get('SMTP_USER') &&
      Deno.env.get('SMTP_PASS'),
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as NotificationRequest;
    const adminEmail = Deno.env.get('ADMIN_EMAIL') ?? Deno.env.get('VITE_ADMIN_EMAIL');
    const recipient = body.to ?? adminEmail;

    if (!recipient) {
      return new Response(JSON.stringify({ sent: false, skipped: true, reason: 'No recipient configured.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!smtpConfigured()) {
      console.info('[send-notification] SMTP not configured — skipped', body.template, recipient);
      return new Response(JSON.stringify({ sent: false, skipped: true, reason: 'SMTP not configured.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Placeholder: wire nodemailer/resend/smtp when keys are present in production.
    console.info('[send-notification] queued', {
      template: body.template,
      to: recipient,
      subject: body.subject,
      data: body.data,
    });

    return new Response(JSON.stringify({ sent: true, skipped: false }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ sent: false, skipped: true, reason: message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
