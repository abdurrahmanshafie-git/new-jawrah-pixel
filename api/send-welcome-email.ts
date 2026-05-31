import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendWelcomeEmail, type WelcomeEmailPayload } from './_email/welcomeEmail.js';

type JsonRecord = Record<string, unknown>;

const MAX_BODY_BYTES = 8_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function jsonResponse(res: VercelResponse, body: JsonRecord, status = 200) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

function getHeader(req: VercelRequest, name: string): string | undefined {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function getBodyByteLength(body: unknown): number {
  if (typeof body === 'string') return Buffer.byteLength(body, 'utf8');
  if (Buffer.isBuffer(body)) return body.length;
  if (body === undefined || body === null) return 0;
  return Buffer.byteLength(JSON.stringify(body), 'utf8');
}

function parseJsonBody(req: VercelRequest): { body?: JsonRecord; error?: string; status?: number } {
  if (getBodyByteLength(req.body) > MAX_BODY_BYTES) {
    return { error: 'Payload too large.', status: 413 };
  }

  let body: unknown = req.body ?? {};
  if (Buffer.isBuffer(body)) body = body.toString('utf8');

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}');
    } catch {
      return { error: 'Invalid JSON payload.', status: 400 };
    }
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid request body.', status: 400 };
  }

  return { body: body as JsonRecord };
}

function sanitizeString(value: unknown, maxLength: number): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;

  const normalized = String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  return normalized ? normalized.slice(0, maxLength) : undefined;
}

function sanitizeWelcomePayload(body: JsonRecord): WelcomeEmailPayload | null {
  const email = sanitizeString(body.email, 254);
  if (!email || !EMAIL_REGEX.test(email)) return null;

  return {
    email,
    name: sanitizeString(body.name, 120),
    region: sanitizeString(body.region, 80),
  };
}

function getClientIp(req: VercelRequest): string {
  const forwardedFor = getHeader(req, 'x-forwarded-for')?.split(',')[0]?.trim();
  return (
    forwardedFor ||
    getHeader(req, 'x-real-ip') ||
    getHeader(req, 'cf-connecting-ip') ||
    'unknown'
  );
}

function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();

  for (const [storeKey, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) rateLimitStore.delete(storeKey);
  }

  const current = rateLimitStore.get(key);
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  current.count += 1;
  if (current.count > RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  return { allowed: true };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return jsonResponse(res, { ok: false, error: 'Method not allowed.' }, 405);
  }

  try {
    const parsed = parseJsonBody(req);
    if (!parsed.body) {
      return jsonResponse(res, { ok: false, error: parsed.error || 'Invalid request body.' }, parsed.status || 400);
    }

    const payload = sanitizeWelcomePayload(parsed.body);
    if (!payload) {
      return jsonResponse(res, { ok: false, error: 'Provide a valid email address.' }, 400);
    }

    const rateLimitKey = `${getClientIp(req)}:${payload.email.toLowerCase()}`;
    const rateLimit = checkRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds ?? 60));
      return jsonResponse(res, { ok: false, error: 'Too many requests. Please try again shortly.' }, 429);
    }

    const result = await sendWelcomeEmail(payload);
    return jsonResponse(
      res,
      {
        ok: result.ok,
        sent: result.sent,
        reason: result.reason,
      },
      result.ok ? 200 : 502,
    );
  } catch (error) {
    console.error('[send-welcome-email] Unexpected failure:', error);
    return jsonResponse(res, { ok: false, error: 'Email service unavailable.' }, 500);
  }
}
