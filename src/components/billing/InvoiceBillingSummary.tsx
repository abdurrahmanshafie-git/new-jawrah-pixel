import { formatCurrencyAmount, formatPercent } from '@/lib/billing/format';
import { paymentStatusLabel } from '@/lib/billing/calculations';
import type { RegionCode } from '@/types';

interface InvoiceBillingSummaryProps {
  invoice: {
    project_value?: number;
    deposit_percentage?: number;
    deposit_amount?: number;
    remaining_balance?: number;
    amount_due_now?: number;
    amount?: number;
    currency?: string;
    current_milestone?: string;
    payment_status?: string;
    status?: string;
    region?: RegionCode;
  };
  compact?: boolean;
}

export function InvoiceBillingSummary({ invoice, compact }: InvoiceBillingSummaryProps) {
  const region = invoice.region;
  const projectValue = Number(invoice.project_value ?? invoice.amount ?? 0);
  const depositPct = Number(invoice.deposit_percentage ?? 10);
  const depositAmount = Number(invoice.deposit_amount ?? 0);
  const amountDue = Number(invoice.amount_due_now ?? invoice.amount ?? 0);
  const remaining = Number(invoice.remaining_balance ?? 0);
  const currency = invoice.currency ?? 'LKR';
  const statusLabel = paymentStatusLabel(invoice.payment_status, invoice.current_milestone);

  const rowClass = compact
    ? 'flex justify-between gap-4 text-xs py-1.5 border-b border-white/5 last:border-0'
    : 'flex justify-between gap-4 text-sm py-2 border-b border-white/5 last:border-0';

  return (
    <div className={compact ? 'space-y-0' : 'space-y-1 p-4 rounded-xl border border-white/5 bg-white/[0.02]'}>
      <div className={rowClass}>
        <span className="text-brand-gray font-mono uppercase text-[10px] tracking-widest">Project Value</span>
        <span className="text-white font-semibold">{formatCurrencyAmount(projectValue, currency, region)}</span>
      </div>
      <div className={rowClass}>
        <span className="text-brand-gray font-mono uppercase text-[10px] tracking-widest">Deposit Required</span>
        <span className="text-brand-cyan font-semibold">{formatPercent(depositPct)}</span>
      </div>
      <div className={rowClass}>
        <span className="text-brand-gray font-mono uppercase text-[10px] tracking-widest">Amount Due Now</span>
        <span className="text-brand-cyan font-bold font-mono">{formatCurrencyAmount(amountDue, currency, region)}</span>
      </div>
      <div className={rowClass}>
        <span className="text-brand-gray font-mono uppercase text-[10px] tracking-widest">Remaining Balance</span>
        <span className="text-white">{formatCurrencyAmount(remaining, currency, region)}</span>
      </div>
      <div className={rowClass}>
        <span className="text-brand-gray font-mono uppercase text-[10px] tracking-widest">Status</span>
        <span className="text-amber-400 font-mono uppercase text-[10px]">{statusLabel}</span>
      </div>
      {!compact && depositAmount > 0 && (
        <p className="text-[10px] text-brand-silver pt-2 font-mono">
          Deposit milestone: {formatCurrencyAmount(depositAmount, currency, region)}
        </p>
      )}
    </div>
  );
}
