import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/types';
import { SleekLoader } from '@/components/ui/SleekLoader';

interface RequireAuthProps {
  children: ReactNode;
  roles?: Role[];
}

function getRoleHome(role?: Role | null) {
  if (role === 'admin' || role === 'superadmin') return '/admin';
  if (role === 'agent') return '/partner/dashboard';
  return '/dashboard';
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <SleekLoader />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  if (roles?.length && profile && !roles.includes(profile.role)) {
    const home = getRoleHome(profile.role);
    return (
      <div className="min-h-screen bg-brand-black text-white flex items-center justify-center p-6">
        <div className="glass-card max-w-md rounded-2xl p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan">
            <ShieldAlert size={26} />
          </div>
          <h1 className="text-2xl font-display font-semibold uppercase tracking-tight mb-3">
            Access Restricted
          </h1>
          <p className="text-sm leading-relaxed text-brand-gray mb-6">
            This workspace requires {roles.join(' or ')} access. Your account role is {profile.role}.
          </p>
          <Link
            to={home}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan text-xs font-mono uppercase tracking-widest hover:bg-brand-cyan/25 transition-colors"
          >
            Go to your portal
          </Link>
        </div>
      </div>
    );
  }

  if (roles?.length && user && !profile) {
    return <SleekLoader />;
  }

  return <>{children}</>;
}
