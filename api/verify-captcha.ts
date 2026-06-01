import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyTurnstileToken, getClientIp, checkRateLimit } from './_lib/security.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const { captchaToken, type } = (req.body ?? {}) as { captchaToken?: string; type?: string };
  const ip = getClientIp(req.headers);

  // Default rate limits
  let limit = 10;
  let window = 3600;

  if (type === 'login') {
    limit = 10;
  } else if (type === 'signup') {
    limit = 5;
  } else if (type === 'revision' || type === 'message') {
    limit = 10;
  } else if (type === 'support') {
    limit = 5;
  }

  // 1. Rate Limiting
  const { allowed } = await checkRateLimit(`captcha_verify:${type || 'gen'}:${ip}`, limit, window);
  if (!allowed) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please try again later.' });
  }

  // 2. Turnstile Verification
  const verification = await verifyTurnstileToken(captchaToken, ip);
  
  if (!verification.success) {
    return res.status(403).json({ ok: false, error: verification.error || 'Security verification failed.' });
  }

  return res.status(200).json({ ok: true });
}
