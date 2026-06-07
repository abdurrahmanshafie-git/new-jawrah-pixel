import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyTurnstileToken, getClientIp } from './_lib/security.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  try {
    const { captchaToken, token, type } = (req.body ?? {}) as {
      captchaToken?: string;
      token?: string;
      type?: string;
    };

    const finalToken = captchaToken || token;

    if (!finalToken) {
      return res.status(400).json({ ok: false, error: 'Missing captcha token.' });
    }

    const ip = getClientIp(req.headers);

    const verification = await verifyTurnstileToken(finalToken, ip);

    if (!verification.success) {
      return res.status(403).json({
        ok: false,
        error: verification.error || 'Security verification failed.',
      });
    }

    return res.status(200).json({ ok: true, type: type || 'general' });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: error?.message || 'Captcha verification crashed.',
    });
  }
}