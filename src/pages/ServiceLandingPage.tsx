import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, LineChart, SearchCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import { FAQSection } from '@/components/seo/FAQSection';
import { Button } from '@/components/ui/Button';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { getServiceLandingPage } from '@/data/serviceLandingPages';
import { useRegion } from '@/hooks/useRegion';
import { toAbsoluteUrl } from '@/lib/env';
import { buildBreadcrumbSchema, buildServiceSchema } from '@/lib/seo/schema';

export default function ServiceLandingPage() {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const { currentRegion, p, config } = useRegion();
  const page = getServiceLandingPage(serviceSlug, currentRegion);

  if (!page) {
    return <Navigate to={p('/services')} replace />;
  }

  const canonical = toAbsoluteUrl(page.route);
  const serviceAlternates = (() => {
    if (page.slug.includes('web-design')) {
      return [
        { hrefLang: 'en-LK', href: toAbsoluteUrl('/lk/services/web-design-sri-lanka') },
        { hrefLang: 'en-PK', href: toAbsoluteUrl('/pk/services/web-design-pakistan') },
        { hrefLang: 'en', href: toAbsoluteUrl('/int/services/international-digital-services') },
        { hrefLang: 'x-default', href: toAbsoluteUrl('/int/services/international-digital-services') },
      ];
    }

    if (page.slug.includes('ecommerce')) {
      return [
        { hrefLang: 'en-LK', href: toAbsoluteUrl('/lk/services/ecommerce-development-sri-lanka') },
        { hrefLang: 'en-PK', href: toAbsoluteUrl('/pk/services/ecommerce-development-pakistan') },
        { hrefLang: 'en', href: toAbsoluteUrl('/int/services/international-digital-services') },
        { hrefLang: 'x-default', href: toAbsoluteUrl('/int/services/international-digital-services') },
      ];
    }

    if (page.slug === 'international-digital-services') {
      return [
        { hrefLang: 'en', href: toAbsoluteUrl('/int/services/international-digital-services') },
        { hrefLang: 'x-default', href: toAbsoluteUrl('/int/services/international-digital-services') },
      ];
    }

    return [
      { hrefLang: 'en-LK', href: canonical },
      { hrefLang: 'x-default', href: canonical },
    ];
  })();
  const schema = [
    buildServiceSchema({
      name: page.serviceName,
      description: page.description,
      url: canonical,
      region: page.region,
      serviceType: page.keywords,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', url: toAbsoluteUrl(`/${page.region}`) },
      { name: 'Services', url: toAbsoluteUrl(`/${page.region}/services`) },
      { name: page.h1, url: canonical },
    ]),
  ];

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <SEO
        title={page.title}
        description={page.description}
        canonicalUrl={canonical}
        keywords={page.keywords}
        schemaData={schema}
        region={page.region}
        alternates={serviceAlternates}
        ogImage="/assets/logo.png"
      />

      <section className="relative overflow-hidden border-b border-white/5 pt-32 pb-16 md:pt-44 md:pb-28">
        <div className="absolute inset-0 premium-grid-overlay opacity-30" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-brand-cyan/10 blur-[130px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-brand-blue/10 blur-[130px]" />
        <div className="container relative z-10 mx-auto max-w-7xl px-5 sm:px-6 md:px-8">
          <Reveal className="max-w-4xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-brand-cyan">
              <Sparkles className="h-3.5 w-3.5" />
              SEO Service Landing Page
            </span>
            <h1 className="text-4xl font-display font-medium uppercase leading-[1.05] tracking-tight md:text-7xl">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-3xl text-base font-light leading-relaxed text-brand-gray md:text-xl">
              {page.description} Built for {page.audience}.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to={p('/contact')}>
                <Button className="h-13 w-full px-7 text-[10px] font-mono font-bold uppercase tracking-[0.18em] luxury-glow sm:w-auto">
                  Start A Project
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Button>
              </Link>
              <Link to={p('/case-studies')}>
                <Button variant="outline" className="h-13 w-full border-white/15 bg-white/5 px-7 text-[10px] font-mono font-bold uppercase tracking-[0.18em] sm:w-auto">
                  View Proof
                </Button>
              </Link>
            </div>
          </Reveal>

          <StaggerContainer className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3 md:mt-16">
            {[
              { icon: SearchCheck, label: 'Search Market', value: page.market },
              { icon: LineChart, label: 'Outcome', value: page.primaryOutcome },
              { icon: ShieldCheck, label: 'Commercial Scope', value: page.priceSignal },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.label} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                  <Icon className="mb-4 h-5 w-5 text-brand-cyan" />
                  <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand-cyan">{item.label}</p>
                  <p className="text-xs font-light leading-relaxed text-brand-gray">{item.value}</p>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:px-8 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="space-y-14">
            {page.sections.map((section, index) => (
              <Reveal key={section.title} className="border-b border-white/5 pb-12 last:border-b-0 last:pb-0">
                <span className="mb-3 block text-[10px] font-mono font-bold uppercase tracking-[0.26em] text-brand-cyan">
                  {String(index + 1).padStart(2, '0')} / Strategy
                </span>
                <h2 className="mb-5 text-2xl font-display font-medium uppercase leading-tight tracking-tight text-white md:text-4xl">
                  {section.title}
                </h2>
                <div className="space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm font-light leading-8 text-brand-gray md:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <p className="mb-4 text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-brand-cyan">
                Internal Links
              </p>
              <div className="grid gap-2">
                <Link to={p('/services')} className="rounded-lg border border-white/10 px-4 py-3 text-xs text-brand-gray transition hover:border-brand-cyan/30 hover:text-white">
                  All Services
                </Link>
                <Link to={p('/pricing')} className="rounded-lg border border-white/10 px-4 py-3 text-xs text-brand-gray transition hover:border-brand-cyan/30 hover:text-white">
                  Pricing
                </Link>
                <Link to={p('/process')} className="rounded-lg border border-white/10 px-4 py-3 text-xs text-brand-gray transition hover:border-brand-cyan/30 hover:text-white">
                  Delivery Process
                </Link>
                <Link to={p('/case-studies')} className="rounded-lg border border-white/10 px-4 py-3 text-xs text-brand-gray transition hover:border-brand-cyan/30 hover:text-white">
                  Case Studies
                </Link>
                {page.relatedServices.map((service) => (
                  <Link key={service.label} to={p(service.path)} className="rounded-lg border border-white/10 px-4 py-3 text-xs text-brand-gray transition hover:border-brand-cyan/30 hover:text-white">
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="relative border-y border-white/5 bg-brand-navy/25 py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <Reveal className="mb-10 max-w-3xl">
            <span className="mb-4 block text-[10px] font-mono font-bold uppercase tracking-[0.26em] text-brand-cyan">
              Deliverables
            </span>
            <h2 className="text-3xl font-display font-medium uppercase leading-tight tracking-tight text-white md:text-5xl">
              What the engagement includes
            </h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {page.deliverables.map((item) => (
              <StaggerItem key={item} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                <CheckCircle2 className="mb-4 h-5 w-5 text-brand-cyan" />
                <p className="text-sm font-light leading-relaxed text-brand-silver">{item}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <Reveal className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-4 block text-[10px] font-mono font-bold uppercase tracking-[0.26em] text-brand-cyan">
              Process
            </span>
            <h2 className="text-3xl font-display font-medium uppercase leading-tight tracking-tight text-white md:text-5xl">
              From search strategy to launch validation
            </h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {page.process.map((item) => (
              <StaggerItem key={item.step} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                <span className="mb-4 block text-sm font-mono font-bold text-brand-cyan">{item.step}</span>
                <h3 className="mb-3 text-lg font-display font-medium uppercase tracking-tight text-white">{item.title}</h3>
                <p className="text-xs font-light leading-relaxed text-brand-gray">{item.copy}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <FAQSection
        title={`${page.h1} FAQ`}
        eyebrow={`${config.countryName} FAQ`}
        faqs={page.faqs}
        schemaId={`faq-${page.slug}`}
      />

      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-brand-blue/12 to-transparent" />
        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center md:px-8">
          <Reveal>
            <h2 className="text-3xl font-display font-medium uppercase leading-tight tracking-tight text-white md:text-6xl">
              Ready to make this service visible?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-relaxed text-brand-gray md:text-lg">
              Send the brief and Jawrah Pixel will map the SEO structure, conversion path, and launch plan for {page.serviceName.toLowerCase()}.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to={p('/contact')}>
                <Button className="h-13 w-full px-8 text-[10px] font-mono font-bold uppercase tracking-[0.18em] luxury-glow sm:w-auto">
                  Request Strategy
                </Button>
              </Link>
              <a href={config.whatsappLink} target="_blank" rel="noreferrer">
                <Button variant="outline" className="h-13 w-full border-white/15 bg-white/5 px-8 text-[10px] font-mono font-bold uppercase tracking-[0.18em] sm:w-auto">
                  WhatsApp
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
