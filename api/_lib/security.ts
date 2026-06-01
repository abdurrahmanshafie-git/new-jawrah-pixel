import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from './supabaseAdmin.js';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

/**
 * Verifies a Cloudflare Turnstile token server-side.
 */
export async function verifyTurnstileToken(token?: string, ip?: string): Promise<{ success: boolean; error?: string }> {
  if (!TURNSTILE_SECRET_KEY) {
    console.error('TURNSTILE_SECRET_KEY is not set in environment variables.');
    // In production, we should probably fail closed, but for dev flexibility:
    if (process.env.NODE_ENV === 'production') {
      return { success: false, error: 'Security provider not configured.' };
    }
    return { success: true }; // Allow in dev if not configured
  }

  if (!token) {
    return { success: false, error: 'Security verification token is missing.' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const outcome = await result.json() as { success: boolean; 'error-codes'?: string[] };

    if (!outcome.success) {
      console.warn('[Turnstile] Verification failed:', outcome['error-codes']);
      return { success: false, error: 'Security verification failed. Please try again.' };
    }

    return { success: true };
  } catch (err) {
    console.error('[Turnstile] API error:', err);
    return { success: false, error: 'Failed to verify security token.' };
  }
}

/**
 * Basic IP-based rate limiting helper using a simple memory store or Supabase.
 * For serverless functions, a memory store is per-instance, so Supabase is more reliable.
 */
export async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number }> {
  const admin = getSupabaseAdmin();
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowSeconds * 1000);

  // We use the public.audit_events or a dedicated rate_limits table if it exists.
  // Since we have audit_events, we'll use that as a proxy for rate limiting.
  const { count, error } = await admin
    .from('audit_events')
    .select('*', { count: 'exact', head: true })
    .eq('action', 'rate_limit_hit')
    .eq('entity_table', key)
    .gt('created_at', windowStart.toISOString());

  if (error) {
    console.error('[RateLimit] DB error:', error);
    return { allowed: true, remaining: limit }; // Fail open if DB is down
  }

  const currentCount = count || 0;
  
  if (currentCount >= limit) {
    return { allowed: false, remaining: 0 };
  }

  // Log the hit (async)
  void admin.from('audit_events').insert({
    action: 'rate_limit_hit',
    entity_table: key,
    metadata: { timestamp: now.toISOString() }
  });

  return { allowed: true, remaining: limit - currentCount - 1 };
}

/**
 * Standard security handler for Vercel Functions.
 * Verifies Turnstile token and checks rate limits.
 */
export async function enforceSecurity(params: {
  req: VercelRequest;
  res: VercelResponse;
  captchaToken?: string;
  rateLimit: {
    key: string;
    limit: number;
    windowSeconds: number;
  };
}): Promise<boolean> {
  const { req, res, captchaToken, rateLimit } = params;

  // 1. Turnstile Verification
  const ip = getClientIp(req.headers);
  const verification = await verifyTurnstileToken(captchaToken, ip);
  
  if (!verification.success) {
    res.status(403).json({ ok: false, error: verification.error || 'Security verification failed.' });
    return false;
  }

  // 2. Rate Limiting
  const { allowed, remaining } = await checkRateLimit(rateLimit.key, rateLimit.limit, rateLimit.windowSeconds);
  
  if (!allowed) {
    res.setHeader('Retry-After', String(rateLimit.windowSeconds));
    res.status(429).json({ ok: false, error: 'Too many requests. Please try again later.' });
    return false;
  }

  return true;
}

/**
 * Extracts client IP from Vercel request headers
 */
export function getClientIp(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  const realIp = headers['x-real-ip'];
  if (typeof realIp === 'string') return realIp;
  return 'unknown';
}
