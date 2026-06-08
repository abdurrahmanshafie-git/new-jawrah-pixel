import { createHash } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin, verifyUserToken } from './_lib/supabaseAdmin.js';
import { enforceSecurity, getClientIp } from './_lib/security.js';
import { sendAgentEmails } from './_email/agentEmails.js';

type RegionCode = 'lk' | 'pk' | 'int';
type PartnerApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

interface PartnerApplicationRequest {
  name?: string;
  email?: string;
  whatsapp?: string;
  country?: string;
  city?: string;
  region?: RegionCode;
  profileLink?: string;
  partnerType?: string;
  experienceLevel?: string;
  networkSize?: string;
  businessTypes?: string[];
  message?: string;
  captchaToken?: string;
  companyWebsite?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_REGIONS = new Set<RegionCode>(['lk', 'pk', 'int']);

function text(value: unknown, maxLength = 500) {
  return String(value ?? '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function textBlock(value: unknown, maxLength = 2400) {
  return String(value ?? '')
    .replace(/[<>]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength);
}

function optionalUrl(value: unknown) {
  const clean = text(value, 300);
  if (!clean) return null;

  try {
    const url = new URL(clean);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.toString().slice(0, 300);
  } catch {
    return null;
  }
}

function captchaDigest(token: string) {
  return `sha256:${createHash('sha256').update(token).digest('hex')}`;
}

function validatePayload(body: PartnerApplicationRequest) {
  const honeypot = text(body.companyWebsite, 200);
  if (honeypot) return { spam: true };

  const region = body.region && ALLOWED_REGIONS.has(body.region) ? body.region : null;
  const name = text(body.name, 120);
  const email = text(body.email, 180).toLowerCase();
  const whatsapp = text(body.whatsapp, 60);
  const country = text(body.country, 80);
  const city = text(body.city, 100);
  const partnerType = text(body.partnerType, 80);
  const experienceLevel = text(body.experienceLevel, 80);
  const networkSize = text(body.networkSize, 80);
  const businessTypes = Array.isArray(body.businessTypes)
    ? body.businessTypes.map((item) => text(item, 80)).filter(Boolean).slice(0, 8)
    : [];
  const message = textBlock(body.message, 2400);
  const profileLink = optionalUrl(body.profileLink);
  const captchaToken = text(body.captchaToken, 4000);

  if (!region) return { error: 'Select a valid region.' };
  if (name.length < 2) return { error: 'Enter your full name.' };
  if (!EMAIL_RE.test(email)) return { error: 'Enter a valid professional email.' };
  if (whatsapp.length < 7) return { error: 'Enter a valid WhatsApp number.' };
  if (!country) return { error: 'Enter your country.' };
  if (!city) return { error: 'Enter your city or region.' };
  if (!partnerType) return { error: 'Select a partner type.' };
  if (!experienceLevel) return { error: 'Select your experience level.' };
  if (!networkSize) return { error: 'Select your estimated network size.' };
  if (!businessTypes.length) return { error: 'Select at least one business type you can refer.' };
  if (message.length < 30) return { error: 'Tell us why you want to join in at least 30 characters.' };
  if (!captchaToken) return { error: 'Complete the security verification.' };
  if (body.profileLink && !profileLink) return { error: 'Enter a valid profile link using http or https.' };

  return {
    data: {
      region,
      name,
      email,
      whatsapp,
      country,
      city,
      partnerType,
      experienceLevel,
      networkSize,
      businessTypes,
      message,
      profileLink,
      captchaToken,
    },
  };
}

function json(res: VercelResponse, status: number, body: Record<string, unknown>) {
  return res.status(status).json(body);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  const user = await verifyUserToken(Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization);
  if (!user?.id) {
    return json(res, 401, { ok: false, error: 'Sign in before submitting your application.' });
  }

  const parsed = validatePayload((req.body ?? {}) as PartnerApplicationRequest);
  if ('spam' in parsed) {
    return json(res, 200, { ok: true, status: 'pending' });
  }
  if ('error' in parsed) {
    return json(res, 400, { ok: false, error: parsed.error });
  }

  const ip = getClientIp(req.headers);
  const secure = await enforceSecurity({
    req,
    res,
    captchaToken: parsed.data.captchaToken,
    rateLimit: {
      key: `partner_application:${user.id}:${ip}`,
      limit: 3,
      windowSeconds: 86400,
    },
  });
  if (!secure) return;

  const status: PartnerApplicationStatus = 'pending';
  let admin: ReturnType<typeof getSupabaseAdmin> | null = null;

  try {
    admin = getSupabaseAdmin();
    const existing = await admin
      .from('partner_applications')
      .select('id, status')
      .eq('user_id', user.id)
      .in('status', ['pending', 'under_review', 'approved'])
      .maybeSingle();

    if (existing.error) throw existing.error;
    if (existing.data) {
      return json(res, 409, {
        ok: false,
        error: 'You already have an active partner application in review.',
        applicationId: existing.data.id,
        status: existing.data.status,
      });
    }

    const applicationMessage = [
      `Partner type: ${parsed.data.partnerType}`,
      `Experience level: ${parsed.data.experienceLevel}`,
      `Network size: ${parsed.data.networkSize}`,
      `Business types: ${parsed.data.businessTypes.join(', ')}`,
      '',
      parsed.data.message,
    ].join('\n');

    const inquiry = await admin
      .from('inquiries')
      .insert({
        full_name: parsed.data.name,
        email: parsed.data.email,
        whatsapp: parsed.data.whatsapp,
        business_name: `Partner Application - ${parsed.data.city}`,
        service_interested: 'Partner Network',
        inquiry_type: 'collaboration',
        budget_range: 'Referral Program',
        message: applicationMessage,
        country: parsed.data.country,
        region: parsed.data.region,
        source_page: parsed.data.region,
        status: 'new',
      })
      .select('id')
      .single();

    if (inquiry.error) throw inquiry.error;

    const partnerApplication = await admin
      .from('partner_applications')
      .insert({
        user_id: user.id,
        name: parsed.data.name,
        email: parsed.data.email,
        whatsapp: parsed.data.whatsapp,
        country: parsed.data.country,
        city: parsed.data.city,
        region: parsed.data.region,
        profile_link: parsed.data.profileLink,
        partner_type: parsed.data.partnerType,
        experience_level: parsed.data.experienceLevel,
        network_size: parsed.data.networkSize,
        business_types: parsed.data.businessTypes,
        message: parsed.data.message,
        status,
        captcha_token: captchaDigest(parsed.data.captchaToken),
        inquiry_id: inquiry.data.id,
        partner_tier: 'starter',
        metadata: {
          ip,
          user_agent: req.headers['user-agent'] ?? null,
          submitted_from: 'partner_page',
        },
      })
      .select('id, status')
      .single();

    if (partnerApplication.error) throw partnerApplication.error;

    const agentApplication = await admin
      .from('agent_applications')
      .insert({
        inquiry_id: inquiry.data.id,
        user_id: user.id,
        partner_application_id: partnerApplication.data.id,
        applicant_name: parsed.data.name,
        applicant_email: parsed.data.email,
        whatsapp: parsed.data.whatsapp,
        country: parsed.data.country,
        city: parsed.data.city,
        region: parsed.data.region,
        experience: `${parsed.data.experienceLevel} / ${parsed.data.networkSize}`,
        profile_link: parsed.data.profileLink,
        partner_type: parsed.data.partnerType,
        network_size: parsed.data.networkSize,
        business_types: parsed.data.businessTypes,
        message: applicationMessage,
        status: 'pending',
        captcha_token: captchaDigest(parsed.data.captchaToken),
      })
      .select('id')
      .single();

    if (agentApplication.error) throw agentApplication.error;

    const agentProfile = await admin
      .from('agent_profiles')
      .upsert(
        {
          user_id: user.id,
          application_id: agentApplication.data.id,
          partner_application_id: partnerApplication.data.id,
          region: parsed.data.region,
          status: 'pending',
          whatsapp: parsed.data.whatsapp,
          experience: parsed.data.message,
          profile_link: parsed.data.profileLink,
          partner_type: parsed.data.partnerType,
          network_size: parsed.data.networkSize,
          business_types: parsed.data.businessTypes,
          tier: 'bronze',
          commission_rate: 0.08,
        },
        { onConflict: 'user_id' },
      );

    if (agentProfile.error) throw agentProfile.error;

    await admin
      .from('profiles')
      .update({
        agent_status: 'pending',
        region: parsed.data.region,
        country: parsed.data.country,
        whatsapp: parsed.data.whatsapp,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    await admin.from('audit_events').insert({
      actor_id: user.id,
      action: 'partner_application_submitted',
      entity_table: 'partner_applications',
      entity_id: partnerApplication.data.id,
      metadata: {
        region: parsed.data.region,
        city: parsed.data.city,
        partner_type: parsed.data.partnerType,
        network_size: parsed.data.networkSize,
      },
    });

    void sendAgentEmails({
      emailType: 'agent_application_received',
      email: parsed.data.email,
      name: parsed.data.name,
      region: parsed.data.region,
      message: applicationMessage,
    }).catch((error) => console.error('[PartnerApplication] email failed', error));

    return json(res, 200, {
      ok: true,
      applicationId: partnerApplication.data.id,
      status: partnerApplication.data.status,
    });
  } catch (error) {
    console.error('[PartnerApplication] submit failed', error);
    if (admin) {
      await admin.from('audit_events').insert({
        actor_id: user.id,
        action: 'partner_application_failed',
        entity_table: 'partner_applications',
        metadata: {
          region: parsed.data.region,
          city: parsed.data.city,
          partner_type: parsed.data.partnerType,
        },
      });
    }

    return json(res, 500, {
      ok: false,
      error: 'Application service is temporarily unavailable. Please try again.',
    });
  }
}
