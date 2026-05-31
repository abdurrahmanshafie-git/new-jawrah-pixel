const REFERRAL_STORAGE_KEY = 'jawrah_agent_ref';
const REFERRAL_SOURCE_KEY = 'jawrah_referral_source';

export interface StoredReferral {
  agentCode: string;
  agentId?: string;
  region?: string;
  capturedAt: string;
  landingPath?: string;
}

export function captureReferralFromSearch(search: string, landingPath?: string): StoredReferral | null {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const ref = params.get('ref')?.trim();
  if (!ref) return null;

  const stored: StoredReferral = {
    agentCode: ref.toUpperCase(),
    capturedAt: new Date().toISOString(),
    landingPath,
  };

  localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(stored));
  localStorage.setItem(REFERRAL_SOURCE_KEY, landingPath || 'referral_link');
  return stored;
}

export function getStoredReferral(): StoredReferral | null {
  try {
    const raw = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredReferral;
  } catch {
    return null;
  }
}

export function getReferralSource(): string | null {
  return localStorage.getItem(REFERRAL_SOURCE_KEY);
}

export function setStoredReferralAgentId(agentId: string, region?: string) {
  const current = getStoredReferral();
  if (!current) return;
  localStorage.setItem(
    REFERRAL_STORAGE_KEY,
    JSON.stringify({ ...current, agentId, region }),
  );
}

export function clearStoredReferral() {
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
  localStorage.removeItem(REFERRAL_SOURCE_KEY);
}

export function buildAgentReferralLink(agentCode: string, region?: string): string {
  const base = 'https://jawrahpixel.com';
  if (region && ['lk', 'pk', 'int'].includes(region)) {
    return `${base}/${region}?ref=${encodeURIComponent(agentCode)}`;
  }
  return `${base}/ref/${encodeURIComponent(agentCode)}`;
}
