import { BadgeDollarSign, Copy, LayoutDashboard, Target, Trophy, Users } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { commissionDefaults } from '@/data/partnerDefaults';
import type { RegionCode } from '@/types';

interface PartnerDashboardPreviewProps {
  region: RegionCode;
}

const previewAmounts: Record<RegionCode, { estimated: number; paid: number; code: string }> = {
  lk: { estimated: 75000, paid: 25000, code: 'JP-LK-A47' },
  pk: { estimated: 85000, paid: 30000, code: 'JP-PK-K21' },
  int: { estimated: 950, paid: 300, code: 'JP-INT-G12' },
};

export function PartnerDashboardPreview({ region }: PartnerDashboardPreviewProps) {
  const preview = previewAmounts[region];
  const currency = commissionDefaults[region];
  const formatter = new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.currency,
    maximumFractionDigits: 0,
  });

  const stats = [
    { label: 'Total Referrals', value: '08', icon: Users },
    { label: 'Active Leads', value: '03', icon: Target },
    { label: 'Won Projects', value: '02', icon: Trophy },
    { label: 'Estimated Earnings', value: formatter.format(preview.estimated), icon: BadgeDollarSign },
    { label: 'Paid Commissions', value: formatter.format(preview.paid), icon: BadgeDollarSign },
    { label: 'Referral Code', value: preview.code, icon: Copy },
  ];

  return (
    <section id="dashboard-preview" className="scroll-mt-28 py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-center">
          <Reveal>
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-md border border-brand-cyan/35 bg-brand-cyan/10 text-brand-cyan">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
              Your Partner Dashboard
            </span>
            <h2 className="mt-5 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
              A serious workflow after approval
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-500">
              Approved partners get a focused workspace for referral visibility, estimated earnings,
              paid commissions, and the unique code used to attribute introductions.
            </p>
            <p className="mt-6 w-fit rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400">
              Preview data shown for interface clarity
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-black/80 shadow-[0_24px_100px_rgba(6,182,212,0.08)]">
              <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.035] p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-brand-cyan">
                    Partner OS
                  </p>
                  <h3 className="mt-2 text-2xl font-display font-semibold uppercase tracking-normal text-white">
                    Dashboard Preview
                  </h3>
                </div>
                <div className="rounded-md border border-brand-cyan/25 bg-brand-cyan/10 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-cyan">
                  Region {region.toUpperCase()}
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-md border border-white/10 bg-white/[0.025] p-4">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500">
                        {item.label}
                      </p>
                      <item.icon className="h-4 w-4 text-brand-cyan" />
                    </div>
                    <p className="break-words text-2xl font-display font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 border-t border-white/10 p-4 md:grid-cols-[0.58fr_0.42fr]">
                <div className="rounded-md border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                    Referral Pipeline
                  </p>
                  <div className="mt-5 space-y-3">
                    {['New lead received', 'Discovery scheduled', 'Commission pending'].map((item, index) => (
                      <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-black/40 p-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-brand-cyan/25 bg-brand-cyan/10 font-mono text-xs text-brand-cyan">
                          {index + 1}
                        </span>
                        <span className="text-sm text-zinc-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-md border border-brand-cyan/25 bg-brand-cyan/[0.08] p-4">
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-cyan">
                    Referral Code
                  </p>
                  <p className="mt-4 break-all text-3xl font-display font-semibold text-white">{preview.code}</p>
                  <p className="mt-4 text-sm leading-6 text-zinc-400">
                    Use this code or tracked introduction path so attribution stays clean.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
