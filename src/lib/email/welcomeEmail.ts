export interface WelcomeEmailPayload {
  name?: string;
  email: string;
  region?: string;
  captcha_token?: string;
}

export interface WelcomeEmailResult {
  ok: boolean;
  sent?: boolean;
  reason?: string;
}

const EMAIL_TIMEOUT_MS = 8_000;

export async function sendWelcomeEmailNotification(
  payload: WelcomeEmailPayload,
): Promise<WelcomeEmailResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), EMAIL_TIMEOUT_MS);

  try {
    const response = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = (await response.json().catch(() => ({}))) as WelcomeEmailResult;
    if (!response.ok || data.ok === false) {
      console.error('[Email] Welcome email dispatch failed:', data.reason || response.status);
      return { ok: false, reason: data.reason || 'Welcome email dispatch failed.' };
    }

    console.log('WELCOME EMAIL SUCCESS');
    return { ok: true, sent: data.sent };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Welcome email dispatch unavailable.';
    console.error('CONTACT FLOW ERROR:', error);
    console.error('[Email] Welcome email dispatch unavailable:', reason);
    return { ok: false, reason };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
