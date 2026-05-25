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

  if (user) {
    if (!profile) return <SleekLoader />;

    const activeRegion = profileRegion ?? savedRegion;
    if (activeRegion) {
      persistRegion(activeRegion);

      if (location.pathname === '/') {
        return <Navigate to={`/${activeRegion}`} replace />;
      }

      if (pathRegion && pathRegion !== activeRegion) {
        return <Navigate to={regionPath(activeRegion, location.pathname)} replace />;
      }
    }

    return <>{children}</>;
  }

  if (location.pathname === '/') {
    return savedRegion ? <Navigate to={`/${savedRegion}`} replace /> : <>{children}</>;
  }

  if (pathRegion && !savedRegion) {
    return <Navigate to="/" replace />;
  }

  if (pathRegion && savedRegion && pathRegion !== savedRegion) {
    return <Navigate to={regionPath(savedRegion, location.pathname)} replace />;
  }

  return <>{children}</>;
}
