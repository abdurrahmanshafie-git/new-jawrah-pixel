import { ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/ui/Reveal';
import { getCaseStudiesForRegion } from '@/data/caseStudies';
import { getServicesForRegion } from '@/data/services';
import { partnerTrustPillars } from '@/data/partnerDefaults';
import type { RegionCode } from '@/types';

interface PartnerTrustSectionProps {
  region: RegionCode;
  regionPath: (path: string) => string;
}

const referableServices = [
  'Premium Websites',
  'Ecommerce Systems',
  'Booking Platforms',
  'AI Automation',
  'Business Portals',
  'SEO & Digital Growth',
] as const;

export function PartnerTrustSection({ region, regionPath }: PartnerTrustSectionProps) {
  const caseStudies = getCaseStudiesForRegion(region).slice(0, 3);
  const services = getServicesForRegion(region).slice(0, 6);

  return (
    <section id="trust-proof" className="scroll-mt-28 py-20 md:py-28">
      <div className="container mx-auto px-6">
        <Reveal className="mb-10 rounded-lg border border-brand-cyan/20 bg-brand-cyan/[0.07] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
                Built by Jawrah Pixel
              </p>
              <h2 className="mt-4 text-2xl font-display font-semibold uppercase tracking-normal text-white md:text-3xl">
                Services partners can refer with confidence
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[34rem]">
              {referableServices.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-black/45 p-4">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-cyan" />
                  <span className="text-sm font-medium text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
          <Reveal>
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
              Trust And Proof
            </span>
            <h2 className="mt-5 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
              A delivery team partners can confidently introduce
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-500">
              Jawrah Pixel is built around production-ready systems, premium UI, and long-term support.
              Partners can refer businesses without pretending to be the technical team.
            </p>

            <div className="mt-8 grid gap-3">
              {partnerTrustPillars.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-zinc-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-cyan" />
                  {item}
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-4">
            {caseStudies.map((item, index) => (
              <Reveal
                key={item.slug}
                delay={index * 0.05}
                className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]"
              >
                <Link to={regionPath(`/case-studies/${item.slug}`)} className="grid gap-0 md:grid-cols-[0.42fr_0.58fr]">
                  <div className="aspect-[16/10] bg-zinc-950 md:aspect-auto">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={`${item.title} project preview`}
                        loading="lazy"
                        className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-white/[0.03]">
                        <ShieldCheck className="h-8 w-8 text-brand-cyan" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-cyan">
                          Case Study
                        </p>
                        <h3 className="mt-3 text-xl font-display font-semibold uppercase tracking-normal text-white">
                          {item.title}
                        </h3>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-zinc-500 transition-colors group-hover:text-brand-cyan" />
                    </div>
                    <p className="mt-3 text-sm leading-7 text-zinc-500">{item.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-10 rounded-lg border border-white/10 bg-black/70 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
                Services Partners Can Offer
              </p>
              <h3 className="mt-4 text-2xl font-display font-semibold uppercase tracking-normal text-white md:text-3xl">
                Websites, commerce, automation, SEO, and digital growth systems
              </h3>
            </div>
            <Link
              to={regionPath('/services')}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-medium text-white transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
            >
              View Services
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div key={service.id} className="rounded-md border border-white/10 bg-white/[0.025] p-4">
                <h4 className="text-sm font-display font-semibold uppercase tracking-normal text-white">
                  {service.title}
                </h4>
                <p className="mt-2 text-xs font-mono uppercase tracking-[0.14em] text-brand-cyan">
                  {service.price}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
