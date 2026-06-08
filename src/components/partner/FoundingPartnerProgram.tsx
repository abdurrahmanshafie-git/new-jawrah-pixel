import { CheckCircle2, Globe2, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const regions = ['Sri Lanka', 'Pakistan', 'International'] as const;

const benefits = [
  'Early access',
  'Direct support',
  'Priority approvals',
  'Future bonus opportunities',
] as const;

export function FoundingPartnerProgram() {
  return (
    <section id="founding-program" className="scroll-mt-28 py-20 md:py-28">
      <div className="container mx-auto px-6">
        <Reveal className="overflow-hidden rounded-lg border border-white/10 bg-black/80">
          <div className="grid gap-0 lg:grid-cols-[0.48fr_0.52fr]">
            <div className="border-b border-white/10 p-6 md:p-10 lg:border-b-0 lg:border-r">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-md border border-brand-cyan/35 bg-brand-cyan/10 text-brand-cyan">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
                Founding Partner Program
              </span>
              <h2 className="mt-5 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
                Early partners get closer support
              </h2>
              <p className="mt-5 text-base leading-8 text-zinc-500">
                The Partner Network is accepting early applicants across core regions. This section does not
                rely on fake partner counts or inflated earnings claims.
              </p>
            </div>

            <div className="p-6 md:p-10">
              <div>
                <div className="mb-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-brand-cyan">
                  <Globe2 className="h-4 w-4" />
                  Accepting Early Partners Across
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {regions.map((item) => (
                    <div key={item} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
                      <p className="text-sm font-display font-semibold uppercase tracking-normal text-white">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                  Early Partner Benefits
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {benefits.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.025] p-4">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-cyan" />
                      <span className="text-sm text-zinc-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
