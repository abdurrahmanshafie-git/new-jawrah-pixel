import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getProfileRole } from '@/lib/supabase/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Fetch the role immediately to navigate to correct place
      const { data: profileData } = await getProfileRole(data.user.id);
      const requestedPath = (location.state as { from?: string } | null)?.from;
        
      if (requestedPath) {
        navigate(requestedPath);
      } else if (profileData && profileData.role === 'admin') {
        navigate('/admin');
      } else if (profileData && profileData.role === 'agent') {
        navigate('/agent');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to login');
    } finally {
      setLoading(false);
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
              placeholder="you@company.com"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-brand-silver">Password</label>
              <a href="#" className="text-xs text-brand-blue hover:text-brand-cyan transition-colors">Forgot password?</a>
            </div>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
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
