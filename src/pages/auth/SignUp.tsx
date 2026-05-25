import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { cn } from '@/lib/utils';
import { getRegionMeta, getSavedRegion, persistRegion } from '@/lib/region';
import type { RegionCode } from '@/types';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [region, setRegion] = useState<RegionCode | ''>(() => getSavedRegion() ?? '');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (fullName.trim().length < 2) return 'Enter your full name so we can prepare your portal profile.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid business email address.';
    if (!region) return 'Choose Pakistan or Sri Lanka before creating your account.';
    if (password.length < 8) return 'Use at least 8 characters for a more secure password.';
    return '';
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const regionMeta = getRegionMeta(region as RegionCode);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            region,
            country: regionMeta.countryName,
            currency: regionMeta.currency,
          }
        }
      });

      if (error) throw error;

      persistRegion(region as RegionCode);

      if (data.session?.user) {
        await supabase
          .from('profiles')
          .update({
            full_name: fullName.trim(),
            email: email.trim(),
            region,
            country: regionMeta.countryName,
            currency: regionMeta.currency,
          })
          .eq('id', data.session.user.id);
      }
      
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-[100px]"></div>
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
          <h1 className="text-2xl font-display font-bold text-white mb-2">Create Account</h1>
          <p className="text-brand-gray text-sm">Join to access your client portal</p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-display font-semibold text-white">Check your email</h3>
            <p className="text-brand-gray text-sm leading-relaxed">
              We've sent a verification link to {email}. Your client region is reserved for {region === 'pk' ? 'Pakistan' : 'Sri Lanka'}.
            </p>
            <Link to="/login">
              <Button variant="outline" className="mt-4 w-full">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-3">
                <AlertCircle className="text-red-500 shrink-0" size={18} />
                <p className="text-red-500 text-sm">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-brand-silver">Full Name</label>
                <Input 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                  autoComplete="name"
                  placeholder="Your full name"
                />
              </div>
              <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4 text-xs leading-relaxed text-brand-silver">
                New signups are provisioned as client accounts. Agent and admin roles are issued internally after verification.
              </div>
              <div className="space-y-2">
                <label className="text-sm text-brand-silver">Client Region</label>
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-brand-navy/40 p-1.5">
                  {([
                    { value: 'lk', label: 'Sri Lanka', caption: 'LKR portal' },
                    { value: 'pk', label: 'Pakistan', caption: 'PKR portal' },
                  ] as const).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setRegion(option.value);
                        persistRegion(option.value);
                        setErrorMsg('');
                      }}
                      className={cn(
                        'rounded-sm border px-3 py-3 text-left transition-all duration-300',
                        region === option.value
                          ? 'border-brand-cyan/40 bg-brand-cyan/10 shadow-[0_0_20px_rgba(34,211,238,0.12)]'
                          : 'border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.03]'
                      )}
                    >
                      <span className="block text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-white">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-[10px] font-light uppercase tracking-[0.12em] text-brand-gray">
                        {option.caption}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
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
                <label className="text-sm text-brand-silver">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    minLength={8}
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
                {loading ? 'Creating Secure Portal...' : 'Create Client Portal'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-brand-gray">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-cyan hover:text-white transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
