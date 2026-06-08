import { Bell, Building2, CheckCircle2, CreditCard, FileCheck2, Send } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const workflowSteps = [
  { title: 'Client Pays', description: 'The referred client payment is received and logged.', icon: CreditCard },
  { title: 'Project Confirmed', description: 'Scope, attribution, and paid project value are reviewed.', icon: FileCheck2 },
  { title: 'Commission Approved', description: 'The partner commission is approved against tier and referral status.', icon: CheckCircle2 },
  { title: 'Payment Sent', description: 'The approved payout is sent through the supported regional method.', icon: Send },
  { title: 'Partner Notified', description: 'The partner receives confirmation after the payout is processed.', icon: Bell },
] as const;

const paymentMethods = ['Bank Transfer', 'Wise', 'Payoneer', 'Regional Payment Methods'] as const;

export function PartnerPaymentWorkflow() {
  return (
    <section id="payment-workflow" className="scroll-mt-28 border-y border-white/10 bg-white/[0.025] py-20 md:py-28">
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
            Payment Workflow
          </span>
          <h2 className="mt-5 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
            Transparent commission approval and payout
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-500">
            Commissions are paid after the client payment and project status are confirmed. The workflow is
            designed so partners understand what happens before money is sent.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          {workflowSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.04}>
              <div className="relative h-full rounded-lg border border-white/10 bg-black/70 p-5 transition-colors duration-300 hover:border-brand-cyan/35 hover:bg-white/[0.04]">
                {index < workflowSteps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-brand-cyan/40 lg:block" aria-hidden="true" />
                )}
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-zinc-600">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-xl font-display font-semibold uppercase tracking-normal text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-500">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 rounded-lg border border-brand-cyan/20 bg-brand-cyan/[0.07] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-brand-cyan/30 bg-black/40 text-brand-cyan">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-brand-cyan">
                Supported Payout Paths
              </p>
              <h3 className="mt-3 text-2xl font-display font-semibold uppercase tracking-normal text-white">
                Regional methods are confirmed after approval
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[32rem]">
              {paymentMethods.map((method) => (
                <div key={method} className="rounded-md border border-white/10 bg-black/45 p-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-white">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-cyan" />
                    {method}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
