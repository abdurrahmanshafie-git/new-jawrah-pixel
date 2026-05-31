import { CheckCircle, Circle } from 'lucide-react';
import { formatCurrencyAmount } from '@/lib/billing/format';
import type { RegionCode } from '@/types';

interface MilestoneRow {
  milestone_key: string;
  label: string;
  percentage: number;
  amount: number;
  status: string;
}

export function MilestoneProgress({
  milestones,
  currency,
  region,
}: {
  milestones: MilestoneRow[];
  currency: string;
  region?: RegionCode;
}) {
  return (
    <div className="space-y-3">
      {milestones.map((m) => {
        const paid = m.status === 'paid';
        const Icon = paid ? CheckCircle : Circle;
        return (
          <div
            key={m.milestone_key}
            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02]"
          >
            <div className="flex items-center gap-3">
              <Icon size={16} className={paid ? 'text-emerald-400' : 'text-brand-gray'} />
              <div>
                <div className="text-xs font-semibold text-white uppercase tracking-wide">{m.label}</div>
                <div className="text-[10px] text-brand-gray font-mono">{m.percentage}%</div>
              </div>
            </div>
            <div className="text-xs font-mono text-brand-cyan font-bold">
              {formatCurrencyAmount(Number(m.amount), currency, region)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
