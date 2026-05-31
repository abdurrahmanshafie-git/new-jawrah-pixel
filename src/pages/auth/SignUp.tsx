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
import { REGION_OPTIONS } from '@/data/regions';
import type { RegionCode } from '@/types';
import { sendWelcomeEmailNotification } from '@/lib/email/welcomeEmail';

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
    if (!region) return 'Choose Sri Lanka, Pakistan, or International before creating your account.';
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

      void sendWelcomeEmailNotification({
        name: fullName.trim(),
        email: email.trim(),
        region,
      });
      
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const selectedRegionLabel = region
    ? REGION_OPTIONS.find((option) => option.id === region)?.label ?? 'your selected region'
    : 'your selected region';

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black p-0 sm:p-4 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.03] bg-center"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md min-h-screen sm:min-h-0 glass-card p-8 sm:p-10 sm:rounded-3xl relative z-10 flex flex-col justify-center sm:block border-0 sm:border border-white/5"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-8 group">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-cyan/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Logo variant="icon" size="md" className="w-16 h-16 relative z-10" />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-3 uppercase tracking-tight">Register Node</h1>
          <p className="text-brand-gray text-sm font-light">Initialize your secure client environment</p>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-4"
          >
            <div className="w-20 h-20 bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Verification Sent</h3>
            <p className="text-brand-gray text-sm leading-relaxed font-light">
              We've transmitted a verification link to <span className="text-white font-medium">{email}</span>. Your portal is provisioned for <span className="text-brand-cyan font-bold">{selectedRegionLabel}</span>.
            </p>
            <Link to="/login" className="block pt-4">
              <Button variant="outline" className="w-full h-14 text-[11px] font-mono uppercase tracking-widest border-white/10 hover:bg-white/5">Back to Terminal</Button>
            </Link>
          </motion.div>
        ) : (
          <>
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

            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand-cyan/70 ml-1">Operative Full Name</label>
                <Input 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                  autoComplete="name"
                  placeholder="Alexander Vance"
                  className="h-14 bg-white/[0.03] border-white/10 focus:border-brand-cyan/50 focus:bg-white/[0.05] transition-all rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand-cyan/70 ml-1">Strategic Region</label>
                <div className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-brand-navy/40 p-1.5">
                  {REGION_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setRegion(option.id);
                        persistRegion(option.id);
                        setErrorMsg('');
                      }}
                      className={cn(
                        'rounded-xl border px-3 py-3 text-left transition-all duration-300',
                        region === option.id
                          ? 'border-brand-cyan/40 bg-brand-cyan/10 shadow-[0_0_20px_rgba(34,211,238,0.12)] text-white'
                          : 'border-transparent bg-transparent text-brand-gray hover:border-white/10 hover:bg-white/[0.03]'
                      )}
                    >
                      <span className="block text-[10px] font-mono font-bold uppercase tracking-widest">
                        {option.shortLabel}
                      </span>
                      <span className="mt-1 block text-[8px] font-light uppercase tracking-widest opacity-60">
                        {option.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand-cyan/70 ml-1">Corporate Email Address</label>
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
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand-cyan/70 ml-1">New Access Key</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    minLength={8}
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
                {loading ? 'Initializing Node...' : 'Initialize Environment'}
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-white/5 pt-8">
              <p className="text-[11px] font-mono text-brand-gray uppercase tracking-widest">
                Already registered?{' '}
                <Link to="/login" className="text-brand-cyan hover:text-white transition-colors font-bold ml-1">
                  Authorize Node
                </Link>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
