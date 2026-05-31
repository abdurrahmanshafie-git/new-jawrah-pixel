import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getProfileRole } from '@/lib/supabase/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'motion/react';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { getSavedAdminRegion, getSavedRegion, isRegionCode, persistAdminRegion, persistRegion } from '@/lib/region';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      const { data: profileData } = await getProfileRole(data.user.id);
      if (profileData?.role === 'admin' && !getSavedAdminRegion()) {
        const initialAdminRegion = isRegionCode(profileData.region) ? profileData.region : getSavedRegion();
        if (initialAdminRegion) {
          persistAdminRegion(initialAdminRegion);
        }
      } else if (profileData?.role !== 'admin' && isRegionCode(profileData?.region)) {
        persistRegion(profileData.region);
      }

      const requestedPath = (location.state as { from?: string } | null)?.from;

      if (requestedPath) {
        navigate(requestedPath);
      } else if (profileData?.role === 'admin') {
        navigate('/admin');
      } else if (profileData?.role === 'agent') {
        navigate('/agent/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to login';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordRecovery = async () => {
    if (!email.trim()) {
      setErrorMsg('Enter your email address to receive a recovery link.');
      return;
    }

    setRecoveryLoading(true);
    setErrorMsg('');
    setRecoverySent(false);

    try {
      const redirectTo = `${window.location.origin}/login`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (error) throw error;
      setRecoverySent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not send recovery email.';
      setErrorMsg(message);
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black p-0 sm:p-4 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-cyan/5 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.03] bg-center"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md min-h-screen sm:min-h-0 glass-card p-8 sm:p-10 sm:rounded-3xl relative z-10 flex flex-col justify-center sm:block border-0 sm:border border-white/5"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center mb-8 group">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-cyan/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Logo variant="icon" size="md" className="w-16 h-16 relative z-10" />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-3 uppercase tracking-tight">Access Terminal</h1>
          <p className="text-brand-gray text-sm font-light">Secure gateway to your strategic workspace</p>
        </div>

        {recoverySent && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></div>
            <p className="text-brand-cyan text-xs font-mono uppercase tracking-widest">Recovery link transmitted. Check inbox.</p>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
            <p className="text-red-400 text-xs leading-relaxed font-mono">{errorMsg}</p>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand-cyan/70 ml-1">Identity Coordinates</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="vance@enterprise.com"
              className="h-14 bg-white/[0.03] border-white/10 focus:border-brand-cyan/50 focus:bg-white/[0.05] transition-all rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand-cyan/70">Access Key</label>
              <button
                type="button"
                onClick={handlePasswordRecovery}
                disabled={recoveryLoading}
                className="text-[10px] font-mono uppercase tracking-widest text-brand-blue hover:text-brand-cyan transition-colors disabled:opacity-50"
              >
                {recoveryLoading ? 'Encrypting...' : 'Forgot key?'}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-14 bg-white/[0.03] border-white/10 focus:border-brand-cyan/50 focus:bg-white/[0.05] transition-all rounded-xl pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray transition-colors hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-14 text-[11px] font-mono uppercase tracking-[0.3em] font-bold luxury-glow shadow-[0_10px_30px_rgba(34,211,238,0.2)]" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {loading ? 'Authenticating...' : 'Authorize Session'}
          </Button>
        </form>

        <div className="mt-10 text-center border-t border-white/5 pt-8">
          <p className="text-[11px] font-mono text-brand-gray uppercase tracking-widest">
            New operative?{' '}
            <Link to="/signup" className="text-brand-cyan hover:text-white transition-colors font-bold ml-1">
              Register Node
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
