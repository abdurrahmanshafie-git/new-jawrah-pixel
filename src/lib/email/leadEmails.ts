export interface LeadEmailPayload {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  country?: string | null;
  region?: string | null;
  service?: string | null;
  budget?: string | null;
  timeline?: string | null;
  message?: string | null;
  goals?: string | null;
  notes?: string | null;
  requirements?: string | null;
  source?: string | null;
  formType?: string | null;
  userId?: string | null;
  submissionId?: string | null;
  platform?: string | null;
  submissionTime?: string | null;
}

export interface LeadEmailDispatchResult {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  clientEmailSent?: boolean;
  adminEmailSent?: boolean;
}

const EMAIL_TIMEOUT_MS = 8_000;
const inFlightPayloads = new Set<string>();

function cleanPayload(payload: LeadEmailPayload): Record<string, string> {
  return Object.fromEntries(
    Object.entries(payload)
      .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
      .map(([key, value]) => [key, String(value).trim()]),
  );
}

function stablePayloadKey(payload: Record<string, string>): string {
  return JSON.stringify(payload, Object.keys(payload).sort());
}

export async function sendLeadEmailNotification(
  payload: LeadEmailPayload,
): Promise<LeadEmailDispatchResult> {
  const cleanedPayload = cleanPayload(payload);
  const payloadKey = stablePayloadKey(cleanedPayload);

  if (inFlightPayloads.has(payloadKey)) {
    return { ok: true, skipped: true, reason: 'Duplicate email dispatch already in progress.' };
  }

  inFlightPayloads.add(payloadKey);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), EMAIL_TIMEOUT_MS);

  try {
    const response = await fetch('/api/send-lead-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanedPayload),
      signal: controller.signal,
    });

    const data = (await response.json().catch(() => ({}))) as LeadEmailDispatchResult;
    if (!response.ok || data.ok === false) {
      console.error('[Email] Lead email dispatch failed:', {
        status: response.status,
        reason: data.reason || 'Email endpoint returned an error.',
      });
      return { ok: false, reason: data.reason || 'Email dispatch failed.' };
    }

    return {
      ok: true,
      clientEmailSent: data.clientEmailSent,
      adminEmailSent: data.adminEmailSent,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Email dispatch unavailable.';
    console.error('[Email] Lead email dispatch unavailable:', reason);
    return { ok: false, reason };
  } finally {
    window.clearTimeout(timeoutId);
    inFlightPayloads.delete(payloadKey);
  }
}
