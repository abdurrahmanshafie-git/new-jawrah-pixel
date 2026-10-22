import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSavedAdminRegion, getSavedRegion, isRegionCode, persistAdminRegion, persistRegion, clearSavedRegion } from '@/lib/region';
import type { Profile } from '@/types';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  authError: string | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  authError: null,
  signOut: async () => {},
  refreshProfile: async () => {},
  clearAuthError: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;
    let idleHandle: number | ReturnType<typeof setTimeout> | null = null;
    let idleUsesRequestIdleCallback = false;

    // The public region chooser does not need authentication to render.
    // Defer loading Supabase there so its JavaScript/network work does not
    // compete with the first meaningful paint. Protected and regional routes
    // continue to initialize authentication immediately.
    const initializeAuth = async () => {
      try {
        const { supabase } = await import('@/lib/supabase/client');
        if (!mounted) return;

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          if (!mounted) return;
          setSession(nextSession);
          setUser(nextSession?.user ?? null);
          if (nextSession?.user) {
            void fetchProfile(nextSession.user);
          } else {
            setProfile(null);
            setLoading(false);
          }
        });
        authSubscription = subscription;

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!mounted) return;

        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) {
          await fetchProfile(data.session.user);
        } else {
          setLoading(false);
        }
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : 'Unable to restore session.';
        setAuthError(message);
        setLoading(false);
      }
    };

    const startAuth = () => {
      idleHandle = null;
      void initializeAuth();
    };

    if (window.location.pathname === '/' && 'requestIdleCallback' in window) {
      idleUsesRequestIdleCallback = true;
      idleHandle = window.requestIdleCallback(startAuth, { timeout: 1800 });
    } else if (window.location.pathname === '/') {
      idleHandle = setTimeout(startAuth, 700);
    } else {
      startAuth();
    }

    // Safety fallback: Never keep protected pages in a loading state indefinitely.
    const safetyTimeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 4000);

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      if (idleHandle !== null) {
        if (idleUsesRequestIdleCallback && 'cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleHandle as number);
        } else {
          clearTimeout(idleHandle as ReturnType<typeof setTimeout>);
        }
      }
      authSubscription?.unsubscribe();
    };
  }, []);

  const fetchProfile = async (nextUser: User) => {
    try {
      const { getOrCreateProfile } = await import('@/lib/supabase/api');
      const { data, error } = await getOrCreateProfile(nextUser);
        
      if (error) {
        console.error('Error fetching profile:', error);
        setAuthError(error.message);
      } else {
        setProfile(data);
        // Ensure authenticated user's account region takes priority for the app-wide active region
        if (isRegionCode(data?.region)) {
          persistRegion(data.region);
        }

        if ((data?.role === 'admin' || data?.role === 'superadmin') && !getSavedAdminRegion()) {
          const initialAdminRegion = isRegionCode(data.region) ? data.region : getSavedRegion();
          if (initialAdminRegion) {
            persistAdminRegion(initialAdminRegion);
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      setAuthError(err instanceof Error ? err.message : 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    await fetchProfile(user);
  };

  const signOut = async () => {
    setAuthError(null);
    const { supabase } = await import('@/lib/supabase/client');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    // Clear any guest-saved region so the app behaves like a fresh visitor
    clearSavedRegion();
    // Return visitor to the region selection page
    try {
      window.location.href = '/';
    } catch (e) {
      // ignore
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{ user, profile, session, loading, authError, signOut, refreshProfile, clearAuthError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
