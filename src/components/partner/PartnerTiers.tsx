import { Award, CheckCircle2, Crown, Rocket } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics';
import { getPartnerTiers, type PartnerTier } from '@/data/partnerTiers';
import type { RegionCode } from '@/types';

interface PartnerTiersProps {
  region: RegionCode;
}

const tierIcons = {
  starter: Rocket,
  growth: Award,
  elite: Crown,
};

export function PartnerTiers({ region }: PartnerTiersProps) {
  const tiers = getPartnerTiers(region);

  return (
    <section id="partner-tiers" className="scroll-mt-28 border-y border-white/10 bg-white/[0.025] py-20 md:py-28">
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
            Partner Tiers
          </span>
          <h2 className="mt-5 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
            Clear commission levels for serious partners
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-500">
            Start with a straightforward referral path, then grow into higher support, visibility, and commission potential.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <div key={tier.id}>
              <TierCard tier={tier} region={region} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TierCard({ tier, region, index }: { tier: PartnerTier; region: RegionCode; index: number }) {
  const Icon = tierIcons[tier.id];
  const trackTier = () => {
    trackEvent(ANALYTICS_EVENTS.TIER_VIEWED, {
      region,
      tier: tier.id,
      commission_rate: tier.commissionRate,
    });
  };

  return (
    <Reveal delay={index * 0.05}>
      <div
        className={`relative rounded-lg border p-6 transition-colors duration-300 ${
          tier.featured
            ? 'border-brand-cyan/45 bg-brand-cyan/[0.08]'
            : 'border-white/10 bg-black/70 hover:border-brand-cyan/30'
        }`}
        onMouseEnter={trackTier}
        onFocus={trackTier}
        tabIndex={0}
      >
      {tier.featured && (
        <div className="absolute right-4 top-4 rounded-md border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-[9px] font-mono uppercase tracking-[0.18em] text-brand-cyan">
          Common fit
        </div>
      )}

      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-md border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="text-2xl font-display font-semibold uppercase tracking-normal text-white">
        {tier.name}
      </h3>
      <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-zinc-500">{tier.bestFor}</p>

      <div className="mt-7 border-y border-white/10 py-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">Commission rate</p>
        <p className="mt-2 text-4xl font-display font-semibold text-white">{tier.commissionRate}%</p>
      </div>

      <TierList title="Requirements" items={tier.requirements} />
      <TierList title="Benefits" items={tier.benefits} />

      <div className="mt-7 rounded-md border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-cyan">Upgrade condition</p>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{tier.upgradeCondition}</p>
      </div>
      </div>
    </Reveal>
  );
}

function TierList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-7">
      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">{title}</p>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-400">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
