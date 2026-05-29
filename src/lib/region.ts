import { REGION_OPTIONS, regions, type RegionConfig } from '@/data/regions';
import type { RegionCode } from '@/types';

export const REGION_STORAGE_KEY = 'jawrah_region';
const REGION_COOKIE_NAME = 'jawrah_region';

export function isRegionCode(value: unknown): value is RegionCode {
  return REGION_OPTIONS.some((region) => region.id === value);
}

export function getRegionMeta(region: RegionCode): Pick<RegionConfig, 'countryName' | 'currency'> {
  return {
    countryName: regions[region].countryName,
    currency: regions[region].currency,
  };
}

export function getExplicitRegionFromPathname(pathname: string): RegionCode | null {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return isRegionCode(firstSegment) ? firstSegment : null;
}

export function getSavedRegion(): RegionCode | null {
  if (typeof window === 'undefined') return null;

  const localRegion = window.localStorage.getItem(REGION_STORAGE_KEY);
  if (isRegionCode(localRegion)) return localRegion;

  const cookieRegion = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${REGION_COOKIE_NAME}=`))
    ?.split('=')[1];

  return isRegionCode(cookieRegion) ? cookieRegion : null;
}

export function persistRegion(region: RegionCode) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(REGION_STORAGE_KEY, region);
  document.cookie = `${REGION_COOKIE_NAME}=${region}; max-age=31536000; path=/; SameSite=Lax`;
}

export function regionPath(region: RegionCode, pathname = '/') {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const strippedPath = cleanPath.replace(/^\/(lk|pk|int)(?=\/|$)/, '') || '/';
  return `/${region}${strippedPath === '/' ? '' : strippedPath}`;
}
