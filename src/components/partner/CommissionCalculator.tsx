import { useEffect, useMemo, useRef, useState } from 'react';
import { BadgeDollarSign, Calculator, Globe2, TrendingUp } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Input } from '@/components/ui/Input';
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics';
import { commissionDefaults } from '@/data/partnerDefaults';
import type { RegionCode } from '@/types';

interface CommissionCalculatorProps {
  region: RegionCode;
  city?: string;
  partnerType?: string;
}

const commissionRate = 10;

const regionLabels: Record<RegionCode, string> = {
  lk: 'LK',
  pk: 'PK',
  int: 'INT',
};

const exampleValues: Record<RegionCode, number[]> = {
  lk: [100000, 250000, 500000],
  pk: [100000, 250000, 500000],
  int: [2000, 5000, 10000],
};

const defaultProjectValues: Record<RegionCode, number> = {
  lk: 250000,
  pk: 250000,
  int: 2000,
};

export function CommissionCalculator({ region, city, partnerType }: CommissionCalculatorProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>(region);
  const [projectValue, setProjectValue] = useState(defaultProjectValues[region]);
  const hasInteracted = useRef(false);
  const defaults = commissionDefaults[selectedRegion];

  useEffect(() => {
    setSelectedRegion(region);
    setProjectValue(defaultProjectValues[region]);
    hasInteracted.current = false;
  }, [region]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(defaults.locale, {
        style: 'currency',
        currency: defaults.currency,
        maximumFractionDigits: 0,
      }),
    [defaults.currency, defaults.locale],
  );

  const commission = useMemo(() => Math.round(projectValue * (commissionRate / 100)), [projectValue]);
  const animatedCommission = useAnimatedNumber(commission);
  const displayCommission = `${formatter.format(animatedCommission)}${defaults.currency === 'USD' ? '+' : ''}`;

  useEffect(() => {
    if (!hasInteracted.current) return;
    const timer = window.setTimeout(() => {
      trackEvent(ANALYTICS_EVENTS.CALCULATOR_USED, {
        region,
        selected_region: selectedRegion,
        city,
        partner_type: partnerType,
        project_value: projectValue,
        commission_percent: commissionRate,
        currency: defaults.currency,
      });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [city, defaults.currency, partnerType, projectValue, region, selectedRegion]);

  const updateProjectValue = (next: number) => {
    hasInteracted.current = true;
    setProjectValue(Math.max(0, next));
  };

  const selectRegion = (nextRegion: RegionCode) => {
    hasInteracted.current = true;
    setSelectedRegion(nextRegion);
    setProjectValue(defaultProjectValues[nextRegion]);
  };

  return (
    <section id="commission-calculator" className="scroll-mt-28 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr] lg:items-stretch">
          <Reveal className="rounded-lg border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-md border border-brand-cyan/35 bg-brand-cyan/10 text-brand-cyan">
              <Calculator className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
              Premium Earnings Calculator
            </span>
            <h2 className="mt-5 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
              See your referral upside in seconds
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-500">
              Enter a project value, choose the region, and estimate the starting commission for a completed
              approved referral. No selling required. Simply connect businesses with Jawrah Pixel.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {exampleValues[selectedRegion].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateProjectValue(value)}
                  className="rounded-md border border-white/10 bg-black/50 p-4 text-left transition-colors hover:border-brand-cyan/35 hover:bg-brand-cyan/[0.08] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-cyan"
                >
                  <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500">
                    Example
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-white">{formatter.format(value)}</span>
                  <span className="mt-1 block text-xs text-brand-cyan">
                    {formatter.format(Math.round(value * (commissionRate / 100)))}
                    {defaults.currency === 'USD' ? '+' : ''} commission
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.06} className="rounded-lg border border-brand-cyan/25 bg-black/80 p-5 shadow-[0_24px_100px_rgba(6,182,212,0.08)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500">
                  You Could Earn
                </span>
                <p className="mt-3 text-5xl font-display font-semibold tracking-normal text-white md:text-7xl">
                  {displayCommission}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Based on {commissionRate}% Bronze starting commission from a {formatter.format(projectValue)} project.
                </p>
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-md border border-brand-cyan/25 bg-brand-cyan/10 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-cyan">
                <BadgeDollarSign className="h-4 w-4" />
                Starting tier
              </div>
            </div>

            <div className="mt-8 grid gap-5">
              <div className="rounded-md border border-white/10 bg-white/[0.025] p-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label htmlFor="partner-project-value" className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                    Project Value
                  </label>
                  <span className="text-sm font-mono text-white">{formatter.format(projectValue)}</span>
                </div>
                <input
                  id="partner-project-value"
                  type="range"
                  min={defaults.minProjectValue}
                  max={defaults.maxProjectValue}
                  step={defaults.projectStep}
                  value={projectValue}
                  onChange={(event) => updateProjectValue(Number(event.target.value))}
                  className="w-full accent-brand-cyan"
                />
                <Input
                  type="number"
                  min={defaults.minProjectValue}
                  max={defaults.maxProjectValue}
                  step={defaults.projectStep}
                  value={projectValue}
                  onChange={(event) => updateProjectValue(Number(event.target.value))}
                  className="mt-4 h-11 rounded-md bg-black/50"
                  aria-label="Project value"
                />
              </div>

              <div className="rounded-md border border-white/10 bg-white/[0.025] p-4">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                  <Globe2 className="h-4 w-4 text-brand-cyan" />
                  Region
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['lk', 'pk', 'int'] as RegionCode[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selectedRegion === option}
                      onClick={() => selectRegion(option)}
                      className={`min-h-11 rounded-md border px-3 text-sm font-mono uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-cyan ${
                        selectedRegion === option
                          ? 'border-brand-cyan/45 bg-brand-cyan/15 text-brand-cyan'
                          : 'border-white/10 bg-black/40 text-zinc-400 hover:border-brand-cyan/30 hover:text-white'
                      }`}
                    >
                      {regionLabels[option]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-md border border-brand-cyan/20 bg-brand-cyan/10 p-4 text-sm leading-6 text-zinc-300">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
              <p>
                Final commission depends on approval, project value, payment status, referral attribution, and partner tier.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function useAnimatedNumber(value: number) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const from = previousValue.current;
    const to = value;
    const start = window.performance.now();
    const duration = 520;

    if (frame.current) {
      window.cancelAnimationFrame(frame.current);
    }

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(from + (to - from) * eased));

      if (progress < 1) {
        frame.current = window.requestAnimationFrame(tick);
      } else {
        previousValue.current = to;
      }
    };

    frame.current = window.requestAnimationFrame(tick);

    return () => {
      if (frame.current) {
        window.cancelAnimationFrame(frame.current);
      }
    };
  }, [value]);

  return displayValue;
}
