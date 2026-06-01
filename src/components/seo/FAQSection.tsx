import { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';
import { buildFAQSchema } from '@/lib/seo/schema';

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQSectionProps {
  title?: string;
  eyebrow?: string;
  faqs: FAQItem[];
  schemaId?: string;
}

export function FAQSection({
  title = 'Frequently Asked Questions',
  eyebrow = 'FAQ',
  faqs,
  schemaId = 'faq-schema',
}: FAQSectionProps) {
  const schemaJson = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        ...buildFAQSchema(faqs),
      }),
    [faqs],
  );

  useEffect(() => {
    if (!faqs.length) return;

    document.getElementById(schemaId)?.remove();

    const script = document.createElement('script');
    script.id = schemaId;
    script.type = 'application/ld+json';
    script.textContent = schemaJson;
    document.head.appendChild(script);

    return () => {
      document.getElementById(schemaId)?.remove();
    };
  }, [faqs.length, schemaId, schemaJson]);

  if (!faqs.length) return null;

  return (
    <section className="relative border-y border-white/5 bg-brand-black py-20 md:py-28">
      <div className="container mx-auto max-w-5xl px-4 md:px-8">
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-brand-cyan">
            <HelpCircle className="h-3.5 w-3.5" />
            {eyebrow}
          </span>
          <h2 className="text-3xl font-display font-medium uppercase leading-tight tracking-tight text-white md:text-5xl">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {faqs.map((item, index) => (
            <motion.details
              key={item.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.025, 0.25) }}
              className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 open:border-brand-cyan/25 open:bg-brand-cyan/[0.035] md:p-6"
            >
              <summary className="cursor-pointer list-none text-sm font-display font-semibold uppercase leading-snug tracking-tight text-white marker:hidden md:text-base">
                <span className="flex items-start justify-between gap-4">
                  {item.q}
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/10 text-brand-cyan transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-4 text-sm font-light leading-relaxed text-brand-gray">
                {item.a}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
