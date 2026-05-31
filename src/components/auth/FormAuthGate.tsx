import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface FormAuthGateProps {
  children: ReactNode;
  className?: string;
}

export function FormAuthGate({ children, className }: FormAuthGateProps) {
  const { user, loading } = useAuth();

  if (loading || user) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn('relative', className)}>
      <div
        className="pointer-events-none select-none blur-[2px] opacity-55 saturate-50"
        aria-hidden="true"
      >
        {children}
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-brand-black/90 p-6 sm:p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan">
            <Lock size={20} />
          </div>
          <h3 className="text-lg sm:text-xl font-display font-semibold uppercase tracking-wide text-white">
            Please login to continue.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-brand-gray">
            Create your Jawrah account to submit projects, access agents and manage your digital workspace.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="w-full font-mono text-xs uppercase tracking-widest">Login</Button>
            </Link>
            <Link to="/signup" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full font-mono text-xs uppercase tracking-widest border-white/15">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
