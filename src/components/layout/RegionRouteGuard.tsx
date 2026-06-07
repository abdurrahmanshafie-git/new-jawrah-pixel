import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { SleekLoader } from '@/components/ui/SleekLoader';
import { useAuth } from '@/contexts/AuthContext';
import {
  getExplicitRegionFromPathname,
  getSavedAdminRegion,
  getSavedRegion,
  isRegionCode,
  persistAdminRegion,
  persistRegion,
  regionPath,
} from '@/lib/region';

interface RegionRouteGuardProps {
  children: ReactNode;
}

export function RegionRouteGuard({ children }: RegionRouteGuardProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  const pathRegion = getExplicitRegionFromPathname(location.pathname);
  const savedRegion = useMemo(() => getSavedRegion(), [location.pathname, user?.id, profile?.role, profile?.region]);

  if (loading) return <SleekLoader />;
  if (user && !profile) return <SleekLoader />;

  const isAdmin = user && (profile?.role === 'admin' || profile?.role === 'superadmin');
  const profileRegion = isRegionCode(profile?.region) ? profile.region : null;
  if (pathRegion) {
    if (isAdmin) {
      persistAdminRegion(pathRegion);
    } else {
      persistRegion(pathRegion);
    }
    return <>{children}</>;
  }

  if (user) {
    const activeRegion = isAdmin
      ? getSavedAdminRegion() ?? profileRegion ?? savedRegion
      : lockedRegion ?? savedRegion;
    if (activeRegion) {
      if (isAdmin) {
        persistAdminRegion(activeRegion);
      } else {
        persistRegion(activeRegion);
      }

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
