import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { SleekLoader } from '@/components/ui/SleekLoader';
import { useAuth } from '@/contexts/AuthContext';
import { getExplicitRegionFromPathname, getSavedRegion, isRegionCode, persistRegion, regionPath } from '@/lib/region';

interface RegionRouteGuardProps {
  children: ReactNode;
}

export function RegionRouteGuard({ children }: RegionRouteGuardProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  const pathRegion = getExplicitRegionFromPathname(location.pathname);
  const savedRegion = useMemo(() => getSavedRegion(), [location.pathname, user?.id, profile?.region]);

  if (loading) return <SleekLoader />;
  if (user && !profile) return <SleekLoader />;

  const lockedRegion = user && isRegionCode(profile?.region) ? profile.region : null;

  if (lockedRegion && pathRegion && pathRegion !== lockedRegion) {
    persistRegion(lockedRegion);
    return (
      <Navigate
        to={`${regionPath(lockedRegion, location.pathname)}${location.search}${location.hash}`}
        replace
      />
    );
  }

  if (pathRegion) {
    persistRegion(pathRegion);
    return <>{children}</>;
  }

  if (user) {
    const activeRegion = lockedRegion ?? savedRegion;
    if (activeRegion) {
      persistRegion(activeRegion);

      if (location.pathname === '/') {
        return <Navigate to={`/${activeRegion}`} replace />;
      }

    }

    return <>{children}</>;
  }

  if (location.pathname === '/') {
    return savedRegion ? <Navigate to={`/${savedRegion}`} replace /> : <>{children}</>;
  }

  return <>{children}</>;
}
