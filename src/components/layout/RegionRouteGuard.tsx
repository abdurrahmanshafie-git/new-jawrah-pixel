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
  const profileRegion = isRegionCode(profile?.region) ? profile.region : null;

  if (loading) return <SleekLoader />;
  if (user && !profile) return <SleekLoader />;

  const lockedClientRegion = user && profile?.role === 'client' ? profileRegion : null;

  if (lockedClientRegion && pathRegion && pathRegion !== lockedClientRegion) {
    persistRegion(lockedClientRegion);
    return (
      <Navigate
        to={`${regionPath(lockedClientRegion, location.pathname)}${location.search}${location.hash}`}
        replace
      />
    );
  }

  if (pathRegion) {
    persistRegion(pathRegion);
    return <>{children}</>;
  }

  if (user) {
    const activeRegion = lockedClientRegion ?? profileRegion ?? savedRegion;
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
