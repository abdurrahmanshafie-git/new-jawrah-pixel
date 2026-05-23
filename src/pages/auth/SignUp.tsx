import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'client' | 'agent'>('client');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          }
        }
      });

      if (error) throw error;
      
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
            <p className="text-brand-gray text-sm">We've sent a verification link to {email}</p>
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
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-brand-silver">I am registering as</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                      role === 'client'
                        ? 'bg-brand-blue/20 border-brand-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-white/5 border-white/10 text-brand-gray hover:text-white hover:border-white/20'
                    }`}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('agent')}
                    className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                      role === 'agent'
                        ? 'bg-brand-cyan/20 border-brand-cyan text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                        : 'bg-white/5 border-white/10 text-brand-gray hover:text-white hover:border-white/20'
                    }`}
                  >
                    Agency Agent
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-brand-silver">Email Address</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="you@company.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-brand-silver">Password</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="Minimum 6 characters"
                  minLength={6}
                />
              </div>
              
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
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
