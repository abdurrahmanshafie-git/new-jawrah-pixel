import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getProfileRole } from '@/lib/supabase/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'motion/react';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { isRegionCode, persistRegion } from '@/lib/region';

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
      if (isRegionCode(profileData?.region)) {
        persistRegion(profileData.region);
      }

      const requestedPath = (location.state as { from?: string } | null)?.from;

      if (requestedPath) {
        navigate(requestedPath);
      } else if (profileData?.role === 'admin') {
        navigate('/admin');
      } else if (profileData?.role === 'agent') {
        navigate('/agent');
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
    <div className="min-h-screen flex items-center justify-center bg-brand-black p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 rounded-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <Logo variant="icon" size="md" className="w-16 h-16" />
          </Link>
          <h1 className="text-2xl font-display font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-brand-gray text-sm">Sign in to your client portal</p>
        </div>

        {recoverySent && (
          <div className="mb-6 p-3 bg-brand-cyan/10 border border-brand-cyan/20 rounded-md">
            <p className="text-brand-cyan text-sm">Password recovery link sent. Check your inbox.</p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-3">
            <AlertCircle className="text-red-500 shrink-0" size={18} />
            <p className="text-red-500 text-sm">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-brand-silver">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@company.com"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-brand-silver">Password</label>
              <button
                type="button"
                onClick={handlePasswordRecovery}
                disabled={recoveryLoading}
                className="text-xs text-brand-blue hover:text-brand-cyan transition-colors disabled:opacity-50"
              >
                {recoveryLoading ? 'Sending...' : 'Forgot password?'}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray transition-colors hover:text-brand-cyan"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4 gap-2" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Opening Secure Portal...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-brand-gray">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-cyan hover:text-white transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
