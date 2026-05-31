import { sendWelcomeEmail, type WelcomeEmailPayload } from './_email/leadEmails';

type JsonRecord = Record<string, unknown>;

const MAX_BODY_BYTES = 8_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function jsonResponse(body: JsonRecord, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
    },
  });
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

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return (
    forwardedFor ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
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

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          Allow: 'POST, OPTIONS',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405);
    }

    try {
      const rawBody = await request.text();
      if (rawBody.length > MAX_BODY_BYTES) {
        return jsonResponse({ ok: false, error: 'Payload too large.' }, 413);
      }

      let body: unknown;
      try {
        body = JSON.parse(rawBody || '{}');
      } catch {
        return jsonResponse({ ok: false, error: 'Invalid JSON payload.' }, 400);
      }

      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return jsonResponse({ ok: false, error: 'Invalid request body.' }, 400);
      }

      const payload = sanitizeWelcomePayload(body as JsonRecord);
      if (!payload) {
        return jsonResponse({ ok: false, error: 'Provide a valid email address.' }, 400);
      }

      const rateLimitKey = `${getClientIp(request)}:${payload.email.toLowerCase()}`;
      const rateLimit = checkRateLimit(rateLimitKey);
      if (!rateLimit.allowed) {
        return Response.json(
          { ok: false, error: 'Too many requests. Please try again shortly.' },
          {
            status: 429,
            headers: {
              'Cache-Control': 'no-store',
              'Content-Type': 'application/json',
              'Retry-After': String(rateLimit.retryAfterSeconds ?? 60),
            },
          },
        );
      }

      const result = await sendWelcomeEmail(payload);
      return jsonResponse(
        {
          ok: result.ok,
          sent: result.sent,
          reason: result.reason,
        },
        result.ok ? 200 : 502,
      );
    } catch (error) {
      console.error('[send-welcome-email] Unexpected failure:', error);
      return jsonResponse({ ok: false, error: 'Email service unavailable.' }, 500);
    }
  },
};
