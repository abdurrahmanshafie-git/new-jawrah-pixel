import type { RegionCode } from '@/types';

export interface PartnerApplicationPayload {
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  city: string;
  region: RegionCode;
  profileLink: string;
  partnerType: string;
  experienceLevel: string;
  networkSize: string;
  businessTypes: string[];
  message: string;
  captchaToken: string;
  companyWebsite?: string;
}

export interface PartnerApplicationResult {
  ok: boolean;
  applicationId?: string;
  status?: 'pending' | 'under_review' | 'approved' | 'rejected';
  error?: string;
}

export async function submitPartnerApplication(
  payload: PartnerApplicationPayload,
  accessToken: string,
): Promise<PartnerApplicationResult> {
  const response = await fetch('/api/submit-partner-application', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => null)) as PartnerApplicationResult | null;
  if (!response.ok) {
    return {
      ok: false,
      error: body?.error || 'Unable to submit the application. Please try again.',
    };
  }

  return body ?? { ok: true };
}
