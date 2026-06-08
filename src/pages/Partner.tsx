import { useEffect, useState } from 'react';
import { ArrowRight, Calculator, Sparkles } from 'lucide-react';
import { PartnerHero } from '@/components/partner/PartnerHero';
import { PartnerValueGrid } from '@/components/partner/PartnerValueGrid';
import { HowItWorks } from '@/components/partner/HowItWorks';
import { CommissionCalculator } from '@/components/partner/CommissionCalculator';
import { PartnerTiers } from '@/components/partner/PartnerTiers';
import { PartnerDashboardPreview } from '@/components/partner/PartnerDashboardPreview';
import { PartnerPaymentWorkflow } from '@/components/partner/PartnerPaymentWorkflow';
import { FoundingPartnerProgram } from '@/components/partner/FoundingPartnerProgram';
import { WhoCanJoin } from '@/components/partner/WhoCanJoin';
import { PartnerTrustSection } from '@/components/partner/PartnerTrustSection';
import { PartnerFAQ } from '@/components/partner/PartnerFAQ';
import { PartnerApplicationForm } from '@/components/partner/PartnerApplicationForm';
import { SEO } from '@/components/layout/SEO';
import { Button } from '@/components/ui/Button';
import { useRegion } from '@/hooks/useRegion';
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics';
import { toAbsoluteUrl } from '@/lib/env';
import { partnerFaqs } from '@/data/partnerFaqs';
import { partnerRegionCopy } from '@/data/partnerDefaults';

const sectionLinks = [
  { id: 'commission-calculator', label: 'Earnings' },
  { id: 'partner-tiers', label: 'Tiers' },
  { id: 'how-it-works', label: 'Process' },
  { id: 'dashboard-preview', label: 'Dashboard' },
  { id: 'payment-workflow', label: 'Payouts' },
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
        onEarnings={() => scrollToSection('commission-calculator', 'hero_earnings')}
        onHowItWorks={() => scrollToSection('how-it-works', 'hero_how_it_works')}
      />

      <SectionNav onSelect={(id) => scrollToSection(id, `nav_${id}`)} />

      <CommissionCalculator region={config.id} />
      <PartnerValueGrid />
      <PartnerTiers region={config.id} />
      <HowItWorks />
      <PartnerDashboardPreview region={config.id} />
      <PartnerPaymentWorkflow />
      <FoundingPartnerProgram />
      <WhoCanJoin />
      <PartnerTrustSection region={config.id} regionPath={p} />
      <PartnerFAQ />
      <FinalPartnerCTA
        onApply={() => scrollToSection('application-form', 'final_apply')}
        onEarnings={() => scrollToSection('commission-calculator', 'final_earnings')}
      />

      <section id="application-form" className="scroll-mt-28 py-20 md:py-28">
        <div className="container mx-auto px-6">
          <PartnerApplicationForm region={config.id} copy={copy} countryName={config.countryName} />
        </div>
      </section>

      <MobileStickyApplyCTA onApply={() => scrollToSection('application-form', 'sticky_apply')} />
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

function FinalPartnerCTA({ onApply, onEarnings }: { onApply: () => void; onEarnings: () => void }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="rounded-lg border border-brand-cyan/25 bg-brand-cyan/[0.08] p-6 md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md border border-brand-cyan/35 bg-black/40 text-brand-cyan">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
                Start Earning With Jawrah Pixel
              </p>
              <h2 className="mt-5 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
                Turn qualified business relationships into long-term partner revenue
              </h2>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col xl:flex-row">
              <Button size="lg" onClick={onApply} className="w-full lg:w-auto">
                Apply to Become a Partner
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={onEarnings} className="w-full lg:w-auto">
                <Calculator className="h-4 w-4" />
                See Earnings Potential
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileStickyApplyCTA({ onApply }: { onApply: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 p-3 backdrop-blur-xl transition-all duration-300 md:hidden ${
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <Button size="lg" onClick={onApply} className="w-full" magnetic={false}>
        Apply to Become a Partner
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
