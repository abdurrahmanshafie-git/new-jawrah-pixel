import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getProfile } from '@/lib/supabase/api';
import { getSavedAdminRegion, getSavedRegion, isRegionCode, persistAdminRegion, persistRegion } from '@/lib/region';
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

    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!mounted) return;

        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) {
          await fetchProfile(data.session.user.id);
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

    void initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        void fetchProfile(nextSession.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await getProfile(userId);
        
      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
        if ((data?.role === 'admin' || data?.role === 'superadmin') && !getSavedAdminRegion()) {
          const initialAdminRegion = isRegionCode(data.region) ? data.region : getSavedRegion();
          if (initialAdminRegion) {
            persistAdminRegion(initialAdminRegion);
          }
        } else if (data?.role !== 'admin' && data?.role !== 'superadmin' && isRegionCode(data?.region)) {
          persistRegion(data.region);
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    await fetchProfile(user.id);
  };

  const signOut = async () => {
    setAuthError(null);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
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
