import { CheckCircle2 } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { partnerProcessSteps } from '@/data/partnerDefaults';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 border-y border-white/10 bg-white/[0.025] py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
          <Reveal>
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
              How It Works
            </span>
            <h2 className="mt-5 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
              From application to paid commission
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-500">
              The partner path is built for clarity. You make qualified introductions; Jawrah Pixel reviews,
              closes, delivers, approves commission, and sends payment through the supported workflow.
            </p>
          </Reveal>

          <div className="relative">
            <div className="absolute bottom-6 left-6 top-6 hidden w-px bg-gradient-to-b from-brand-cyan/60 via-brand-cyan/20 to-transparent md:block" />
            {partnerProcessSteps.map((step, index) => (
              <Reveal
                key={step.title}
                delay={index * 0.04}
                className="relative mb-4 last:mb-0 md:pl-16"
              >
                <div className="absolute left-0 top-5 z-10 hidden h-12 w-12 items-center justify-center rounded-md border border-brand-cyan/35 bg-black font-mono text-sm text-brand-cyan shadow-[0_0_0_8px_rgba(0,0,0,0.75)] md:flex">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="rounded-lg border border-white/10 bg-black/60 p-5 transition-colors duration-300 hover:border-brand-cyan/30 hover:bg-white/[0.04] md:p-6">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md border border-brand-cyan/35 bg-brand-cyan/10 font-mono text-sm text-brand-cyan md:hidden">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-display font-semibold uppercase tracking-normal text-white">
                        {step.title}
                      </h3>
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <ProcessDetail label="Partner" value={step.partner} />
                      <ProcessDetail label="Jawrah Pixel" value={step.jawrah} />
                      <ProcessDetail label="Outcome" value={step.outcome} accent />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessDetail({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.025] p-4">
      <div className={`mb-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] ${
        accent ? 'text-brand-cyan' : 'text-zinc-500'
      }`}>
        {accent && <CheckCircle2 className="h-3.5 w-3.5" />}
        {label}
      </div>
      <p className="text-sm leading-6 text-zinc-400">{value}</p>
    </div>
  );
}
