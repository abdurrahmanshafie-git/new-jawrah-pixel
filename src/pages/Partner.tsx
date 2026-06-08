import { useEffect } from 'react';
import { PartnerHero } from '@/components/partner/PartnerHero';
import { PartnerValueGrid } from '@/components/partner/PartnerValueGrid';
import { HowItWorks } from '@/components/partner/HowItWorks';
import { CommissionCalculator } from '@/components/partner/CommissionCalculator';
import { PartnerTiers } from '@/components/partner/PartnerTiers';
import { WhoCanJoin } from '@/components/partner/WhoCanJoin';
import { PartnerTrustSection } from '@/components/partner/PartnerTrustSection';
import { PartnerFAQ } from '@/components/partner/PartnerFAQ';
import { PartnerApplicationForm } from '@/components/partner/PartnerApplicationForm';
import { SEO } from '@/components/layout/SEO';
import { useRegion } from '@/hooks/useRegion';
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics';
import { toAbsoluteUrl } from '@/lib/env';
import { partnerFaqs } from '@/data/partnerFaqs';
import { partnerRegionCopy } from '@/data/partnerDefaults';

const sectionLinks = [
  { id: 'partner-value', label: 'Value' },
  { id: 'how-it-works', label: 'Process' },
  { id: 'commission-calculator', label: 'Estimator' },
  { id: 'partner-tiers', label: 'Tiers' },
  { id: 'trust-proof', label: 'Proof' },
  { id: 'application-form', label: 'Apply' },
];

export default function Partner() {
  const { config, p } = useRegion();
  const copy = partnerRegionCopy[config.id];
  const canonicalUrl = toAbsoluteUrl(p('/partner'));

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.PARTNER_PAGE_VIEW, {
      region: config.id,
      country: config.countryName,
    });
  }, [config.countryName, config.id]);

  const scrollToSection = (id: string, ctaLabel?: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (ctaLabel) {
      trackEvent(ANALYTICS_EVENTS.PARTNER_CTA_CLICK, {
        region: config.id,
        cta: ctaLabel,
      });
    }
  };

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: partnerFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: toAbsoluteUrl(p('/')),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Partner Network',
        item: canonicalUrl,
      },
    ],
  };

  const webPageSchema = {
    '@type': 'WebPage',
    name: copy.seoTitle,
    description: copy.seoDescription,
    url: canonicalUrl,
    about: [
      'digital agency partner program',
      'website referral program',
      'earn commission referring website clients',
      'web design partner program Sri Lanka',
      'web design partner program Pakistan',
    ],
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-black text-white">
      <SEO
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonicalUrl={canonicalUrl}
        region={config.id}
        keywords={[
          'digital agency partner program',
          'website referral program',
          'earn commission referring website clients',
          'web design partner program Sri Lanka',
          'web design partner program Pakistan',
        ]}
        ogTitle={copy.seoTitle}
        ogDescription={copy.seoDescription}
        schemaData={[webPageSchema, breadcrumbSchema, faqSchema]}
      />

      <PartnerHero
        region={config.id}
        copy={copy}
        onApply={() => scrollToSection('application-form', 'hero_apply')}
        onHowItWorks={() => scrollToSection('how-it-works', 'hero_how_it_works')}
      />

      <SectionNav onSelect={(id) => scrollToSection(id, `nav_${id}`)} />

      <PartnerValueGrid />
      <HowItWorks />
      <CommissionCalculator region={config.id} />
      <PartnerTiers region={config.id} />
      <WhoCanJoin />
      <PartnerTrustSection region={config.id} regionPath={p} />
      <PartnerFAQ />

      <section id="application-form" className="scroll-mt-28 py-20 md:py-28">
        <div className="container mx-auto px-6">
          <PartnerApplicationForm region={config.id} copy={copy} countryName={config.countryName} />
        </div>
      </section>
    </main>
  );
}

function SectionNav({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <nav className="sticky top-20 z-30 border-y border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto py-3">
          {sectionLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onSelect(link.id)}
              className="min-h-11 shrink-0 rounded-md border border-white/10 px-4 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-cyan"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
