import { useEffect, useMemo, useRef, useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
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

export function CommissionCalculator({ region, city, partnerType }: CommissionCalculatorProps) {
  const defaults = commissionDefaults[region];
  const [projectValue, setProjectValue] = useState(defaults.projectValue);
  const [commissionPercent, setCommissionPercent] = useState(defaults.commissionPercent);
  const [clientsPerMonth, setClientsPerMonth] = useState(defaults.clientsPerMonth);
  const hasInteracted = useRef(false);

  useEffect(() => {
    setProjectValue(defaults.projectValue);
    setCommissionPercent(defaults.commissionPercent);
    setClientsPerMonth(defaults.clientsPerMonth);
    hasInteracted.current = false;
  }, [defaults]);

  const monthly = useMemo(
    () => Math.round(projectValue * (commissionPercent / 100) * clientsPerMonth),
    [projectValue, commissionPercent, clientsPerMonth],
  );
  const yearly = useMemo(() => monthly * 12, [monthly]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(defaults.locale, {
        style: 'currency',
        currency: defaults.currency,
        maximumFractionDigits: defaults.currency === 'USD' ? 0 : 0,
      }),
    [defaults.currency, defaults.locale],
  );

  useEffect(() => {
    if (!hasInteracted.current) return;
    const timer = window.setTimeout(() => {
      trackEvent(ANALYTICS_EVENTS.CALCULATOR_USED, {
        region,
        city,
        partner_type: partnerType,
        project_value: projectValue,
        commission_percent: commissionPercent,
        clients_per_month: clientsPerMonth,
        currency: defaults.currency,
      });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [city, clientsPerMonth, commissionPercent, defaults.currency, partnerType, projectValue, region]);

  const markInteracted = () => {
    hasInteracted.current = true;
  };

  return (
    <section id="commission-calculator" className="scroll-mt-28 py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-[0.46fr_0.54fr] lg:items-stretch">
          <Reveal className="rounded-lg border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-md border border-brand-cyan/35 bg-brand-cyan/10 text-brand-cyan">
              <Calculator className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
              Earnings Estimator
            </span>
            <h2 className="mt-5 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
              Estimate partner commission
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-500">
              Use realistic regional defaults to understand the monthly and yearly potential from qualified
              referred clients. Final commission depends on approval, project value, payment status, and tier.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="rounded-lg border border-white/10 bg-black/70 p-5 md:p-8">
            <div className="grid gap-5">
              <CalculatorField
                label="Project value"
                value={projectValue}
                min={defaults.minProjectValue}
                max={defaults.maxProjectValue}
                step={defaults.projectStep}
                displayValue={formatter.format(projectValue)}
                onChange={(next) => {
                  markInteracted();
                  setProjectValue(next);
                }}
              />
              <CalculatorField
                label="Commission percentage"
                value={commissionPercent}
                min={5}
                max={20}
                step={1}
                displayValue={`${commissionPercent}%`}
                onChange={(next) => {
                  markInteracted();
                  setCommissionPercent(next);
                }}
              />
              <CalculatorField
                label="Referred clients per month"
                value={clientsPerMonth}
                min={1}
                max={10}
                step={1}
                displayValue={`${clientsPerMonth}`}
                onChange={(next) => {
                  markInteracted();
                  setClientsPerMonth(next);
                }}
              />
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <ResultCard label="Estimated monthly earnings" value={formatter.format(monthly)} />
              <ResultCard label="Estimated yearly earnings" value={formatter.format(yearly)} />
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-md border border-brand-cyan/20 bg-brand-cyan/10 p-4 text-sm leading-6 text-zinc-300">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
              <p>
                Estimates use {defaults.currency} for this region and are not a payment guarantee.
                Approved partners receive exact commission and payout rules.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

interface CalculatorFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (next: number) => void;
}

function CalculatorField({ label, value, min, max, step, displayValue, onChange }: CalculatorFieldProps) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="rounded-md border border-white/10 bg-white/[0.025] p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </label>
        <span className="text-sm font-mono text-white">{displayValue}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-brand-cyan"
      />
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 h-11 rounded-md bg-black/50"
        aria-label={`${label} numeric value`}
      />
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-4 text-3xl font-display font-semibold text-white md:text-4xl">{value}</p>
    </div>
  );
}
