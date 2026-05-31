import type { RegionCode } from '@/types';

export function partnerRegionCode(region: RegionCode): string {
  if (region === 'lk') return 'LK';
  if (region === 'pk') return 'PK';
  return 'PT';
}

export function formatPartnerId(region: RegionCode, sequence: number): string {
  return `JP-${partnerRegionCode(region)}-${sequence}`;
}

export function generateReferralCodeFromName(fullName: string): string {
  const letters = fullName.replace(/[^a-zA-Z]/g, '').toUpperCase();
  const base = (letters.slice(0, 8) || 'PARTNER').padEnd(4, 'X').slice(0, 8);
  const year = String(new Date().getFullYear()).slice(-2);
  return `${base}${year}`.slice(0, 12);
}

export function isUrlSafeReferralCode(code: string): boolean {
  return /^[A-Z0-9][A-Z0-9_-]{2,31}$/i.test(code);
}

export function normalizeReferralCode(code: string): string {
  return code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
}

export const PARTNER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Review',
  interview: 'Needs More Information',
  approved: 'Approved',
  rejected: 'Rejected',
  suspended: 'Suspended',
};

export function partnerStatusLabel(status?: string | null): string {
  if (!status) return 'Pending Review';
  return PARTNER_STATUS_LABELS[status] ?? status;
}
