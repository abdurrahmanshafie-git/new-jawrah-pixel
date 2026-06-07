import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { regions, getRegionFromPathname, RegionConfig } from '../data/regions';
import type { RegionCode } from '@/types';
import { getServicesForRegion } from '../data/services';
import { getCaseStudiesForRegion } from '../data/caseStudies';
import { getMaintenancePlans } from '../data/pricing';
import { getFaqsForRegion } from '../data/faqs';
import {
  ADMIN_REGION_CHANGE_EVENT,
  ADMIN_REGION_STORAGE_KEY,
  getExplicitRegionFromPathname,
  getSavedAdminRegion,
  getSavedRegion,
  isRegionCode,
  persistRegion,
  resolvePortalRegion,
  regionPath,
} from '@/lib/region';
import { useAuth } from '@/contexts/AuthContext';

export function useRegion() {
  const location = useLocation();
  const { user, profile } = useAuth();
  const [adminPreviewRegion, setAdminPreviewRegion] = useState<RegionCode | null>(() => getSavedAdminRegion());
  const pathRegion = getExplicitRegionFromPathname(location.pathname);
  const isAdmin = Boolean(user && (profile?.role === 'admin' || profile?.role === 'superadmin'));
  const profileRegion = isRegionCode(profile?.region) ? profile.region : null;
  const portalRegion = resolvePortalRegion(profile?.region).region;
  const isWorkspacePath = /^\/(?:dashboard|partner\/dashboard|agent(?:\/dashboard)?)(?=\/|$)/.test(location.pathname);
  const currentRegion = (
    user && !isAdmin && isWorkspacePath
      ? portalRegion
      : isAdmin && !pathRegion
      ? adminPreviewRegion ?? profileRegion ?? getSavedRegion() ?? 'lk'
      : getRegionFromPathname(location.pathname)
  ) as RegionCode;
  const config: RegionConfig = regions[currentRegion] ?? regions.lk;

  useEffect(() => {
    setAdminPreviewRegion(getSavedAdminRegion());
  }, [user?.id, profile?.role, profile?.region]);

  useEffect(() => {
    if (!isAdmin || typeof window === 'undefined') return;

    const handleAdminRegionChange = (event: Event) => {
      const nextRegion = event instanceof CustomEvent ? event.detail : getSavedAdminRegion();
      setAdminPreviewRegion(isRegionCode(nextRegion) ? nextRegion : getSavedAdminRegion());
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ADMIN_REGION_STORAGE_KEY) {
        setAdminPreviewRegion(isRegionCode(event.newValue) ? event.newValue : null);
      }
    };

    window.addEventListener(ADMIN_REGION_CHANGE_EVENT, handleAdminRegionChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(ADMIN_REGION_CHANGE_EVENT, handleAdminRegionChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, [isAdmin]);

  return {
    currentRegion,
    config,
    services: getServicesForRegion(currentRegion),
    cases: getCaseStudiesForRegion(currentRegion),
    pricingPlans: getMaintenancePlans(currentRegion),
    faqs: getFaqsForRegion(currentRegion),
    // Helper to format url paths with the active country prefix
    p: (path: string) => {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `/${currentRegion}${cleanPath === '/' ? '' : cleanPath}`;
    },
    // Helper to switch the active pathname to another region path
    getSwitchUrl: (targetRegion: RegionCode) => regionPath(targetRegion, location.pathname),
    persistRegion,
    isInternational: currentRegion === 'int',
  };
}
