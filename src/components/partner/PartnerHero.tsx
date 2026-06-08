import { ArrowRight, BadgeCheck, CircleDollarSign, Globe2, LayoutDashboard, MousePointer2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import type { RegionCode } from '@/types';
import type { RegionPartnerCopy } from '@/data/partnerDefaults';

interface PartnerHeroProps {
  region: RegionCode;
  copy: RegionPartnerCopy;
  onApply: () => void;
  onEarnings: () => void;
  onHowItWorks: () => void;
}

const trustItems = [
  { label: 'Premium Web Projects', icon: BadgeCheck },
  { label: 'Referral Commissions', icon: CircleDollarSign },
  { label: 'Partner Dashboard', icon: LayoutDashboard },
  { label: 'Sri Lanka / Pakistan / Global', icon: Globe2 },
];

export function PartnerHero({ region, copy, onApply, onEarnings, onHowItWorks }: PartnerHeroProps) {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] pt-28 pb-14 md:pt-36 md:pb-20 flex items-center overflow-hidden">
      <div className="absolute inset-0 premium-grid-overlay opacity-25" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/50 to-transparent" aria-hidden="true" />
      <div
        className="absolute right-0 top-24 h-96 w-1/2 bg-[linear-gradient(135deg,transparent,rgba(6,182,212,0.08),transparent)]"
        aria-hidden="true"
      />
      <div
        className="absolute left-0 bottom-0 h-72 w-3/5 bg-[linear-gradient(35deg,rgba(59,130,246,0.07),transparent_62%)]"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-mono uppercase tracking-[0.24em] text-brand-cyan"
          >
            <span className="h-2 w-2 rounded-full bg-brand-cyan" />
            {copy.eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="mt-8 max-w-5xl text-4xl font-display font-semibold uppercase leading-[0.98] tracking-normal text-white md:text-7xl lg:text-8xl"
          >
            {copy.headline}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(18rem,0.45fr)] lg:items-end"
          >
            <div className="max-w-3xl">
              <p className="text-lg leading-8 text-zinc-300 md:text-xl">{copy.subheadline}</p>
              <p className="mt-4 text-sm leading-7 text-zinc-500 md:text-base">{copy.regionLine}</p>
            </div>

            <div className="border-l border-brand-cyan/40 pl-5 text-sm text-zinc-400">
              <div className="mb-2 flex items-center gap-2 text-brand-cyan">
                <MousePointer2 className="h-4 w-4" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em]">3 second clarity</span>
              </div>
              <p>
                Refer qualified clients. Jawrah Pixel closes, builds, supports, and tracks the project.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button size="lg" onClick={onApply} className="w-full sm:w-auto">
              Apply to Become a Partner
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={onEarnings} className="w-full sm:w-auto">
              See Earnings Potential
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4"
          >
            {trustItems.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-4 min-h-[6.25rem]"
              >
                <item.icon className="mb-4 h-5 w-5 text-brand-cyan" />
                <p className="text-xs font-mono uppercase leading-5 tracking-[0.14em] text-zinc-200">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>

          <div className="mt-10 h-px w-full max-w-4xl bg-gradient-to-r from-brand-cyan/40 via-white/10 to-transparent" />
          <p className="mt-6 text-xs font-mono uppercase tracking-[0.18em] text-zinc-600">
            Active region: {region.toUpperCase()} | <button type="button" onClick={onHowItWorks} className="text-brand-cyan transition-colors hover:text-white">View partner process</button>
          </p>
        </div>
      </div>
    </section>
  );
}
