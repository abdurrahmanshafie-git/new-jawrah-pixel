import { HelpCircle } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { partnerFaqs } from '@/data/partnerFaqs';

export function PartnerFAQ() {
  return (
    <section id="faq" className="scroll-mt-28 border-y border-white/10 bg-white/[0.025] py-20 md:py-28">
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
            FAQ
          </span>
          <h2 className="mt-5 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
            Clear answers before you apply
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 max-w-4xl divide-y divide-white/10 rounded-lg border border-white/10 bg-black/70">
          {partnerFaqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 0.025} className="p-5 md:p-6">
              <div className="flex gap-4">
                <HelpCircle className="mt-1 h-5 w-5 shrink-0 text-brand-cyan" />
                <div>
                  <h3 className="text-lg font-display font-semibold uppercase tracking-normal text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-500">{faq.answer}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
