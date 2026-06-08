import { CheckCircle2, LayoutDashboard, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PartnerSuccessStateProps {
  email?: string;
  onReset: () => void;
}

export function PartnerSuccessState({ email, onReset }: PartnerSuccessStateProps) {
  return (
    <div className="rounded-lg border border-brand-cyan/30 bg-brand-cyan/[0.08] p-6 text-center md:p-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md border border-brand-cyan/35 bg-brand-cyan/10 text-brand-cyan">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h3 className="mt-6 text-2xl font-display font-semibold uppercase tracking-normal text-white">
        Application Submitted
      </h3>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
        The partner desk will review the application and contact you with the next step.
        {email ? ` Confirmation details were sent to ${email}.` : ''}
      </p>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-white/10 bg-black/40 p-4 text-left">
          <MailCheck className="mb-3 h-5 w-5 text-brand-cyan" />
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">Review</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">We check fit, network quality, and referral potential.</p>
        </div>
        <div className="rounded-md border border-white/10 bg-black/40 p-4 text-left">
          <LayoutDashboard className="mb-3 h-5 w-5 text-brand-cyan" />
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">Next</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">Approved partners receive dashboard and referral workflow access.</p>
        </div>
      </div>
      <Button onClick={onReset} variant="outline" className="mt-8">
        Submit Another Application
      </Button>
    </div>
  );
}
