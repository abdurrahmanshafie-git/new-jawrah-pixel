import { useState } from 'react';
import { Building2, CheckCircle, Copy, ShieldCheck } from 'lucide-react';
import { formatCurrencyAmount } from '@/lib/billing/format';
import {
  LK_BANK_TRANSFER_DETAILS,
  LK_PAYMENT_CLIENT_MESSAGE,
  type PaymentRegion,
} from '@/lib/payments/config';

interface LkBankTransferCardProps {
  invoiceNumber?: string;
  amountDue?: number;
  currency?: string;
  region?: PaymentRegion | null;
}

export function LkBankTransferCard({
  invoiceNumber,
  amountDue = 0,
  currency = 'LKR',
  region,
}: LkBankTransferCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (region !== 'lk') return null;

  const copyToClipboard = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 1800);
    } catch {
      setCopiedField(null);
    }
  };

  const details = [
    { label: 'Bank Name', value: LK_BANK_TRANSFER_DETAILS.bankName },
    { label: 'Account Name', value: LK_BANK_TRANSFER_DETAILS.accountName },
    { label: 'Account Number', value: LK_BANK_TRANSFER_DETAILS.accountNumber },
    { label: 'Branch', value: LK_BANK_TRANSFER_DETAILS.branch },
  ];

  return (
    <div className="rounded-2xl border border-brand-cyan/20 bg-brand-black/70 overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-br from-brand-cyan/10 via-white/[0.02] to-transparent">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
            <Building2 size={18} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block">
              Sri Lanka Bank Transfer
            </span>
            <h3 className="text-lg sm:text-xl font-display font-semibold uppercase tracking-wider text-white mt-1">
              Payment Instructions
            </h3>
            <p className="text-xs sm:text-sm text-brand-silver leading-relaxed mt-3">
              {LK_PAYMENT_CLIENT_MESSAGE}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
            <span className="text-[9px] font-mono uppercase text-brand-gray tracking-widest block">Invoice</span>
            <span className="text-sm font-mono font-bold text-white break-words">{invoiceNumber || 'Pending'}</span>
          </div>
          <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
            <span className="text-[9px] font-mono uppercase text-brand-gray tracking-widest block">Advance Due</span>
            <span className="text-sm font-mono font-bold text-brand-cyan">
              {formatCurrencyAmount(amountDue, currency, 'lk')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {details.map((item) => (
            <div key={item.label} className="p-3 rounded-xl border border-white/5 bg-black/30 min-w-0">
              <span className="text-[9px] font-mono uppercase text-brand-gray tracking-widest block">{item.label}</span>
              <span className="text-sm font-mono text-white break-words">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            title="Copy account number"
            onClick={() => copyToClipboard('number', LK_BANK_TRANSFER_DETAILS.accountNumber)}
            className="min-h-[44px] px-4 border border-brand-cyan/20 bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/15 transition-colors text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {copiedField === 'number' ? <CheckCircle size={14} /> : <Copy size={14} />}
            {copiedField === 'number' ? 'Copied Number' : 'Copy Account Number'}
          </button>
          <button
            type="button"
            title="Copy account name"
            onClick={() => copyToClipboard('name', LK_BANK_TRANSFER_DETAILS.accountName)}
            className="min-h-[44px] px-4 border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] transition-colors text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {copiedField === 'name' ? <CheckCircle size={14} /> : <Copy size={14} />}
            {copiedField === 'name' ? 'Copied Name' : 'Copy Account Name'}
          </button>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <ShieldCheck size={15} className="text-brand-cyan mt-0.5 shrink-0" />
          <p className="text-[11px] text-brand-gray leading-relaxed">
            Receipt uploads stay in the private project file vault and are released through signed access links for authorized users only.
          </p>
        </div>
      </div>
    </div>
  );
}
