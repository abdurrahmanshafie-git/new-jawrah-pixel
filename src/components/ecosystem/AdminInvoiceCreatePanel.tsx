import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createProfessionalInvoice } from '@/lib/supabase/billing-api';
import { calculateBillingFields } from '@/lib/billing/calculations';
import { formatCurrencyAmount } from '@/lib/billing/format';
import type { RegionCode } from '@/types';

interface AdminInvoiceCreatePanelProps {
  clients: Array<{ id: string; full_name?: string | null; email?: string | null; region?: string | null }>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onCreated: () => void;
}

export function AdminInvoiceCreatePanel({ clients, showToast, onCreated }: AdminInvoiceCreatePanelProps) {
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [projectValue, setProjectValue] = useState(100_000);
  const [depositPercentage, setDepositPercentage] = useState(10);
  const [region, setRegion] = useState<RegionCode>('lk');
  const [saving, setSaving] = useState(false);

  const preview = calculateBillingFields(projectValue, depositPercentage, region);

  const handleCreate = async () => {
    if (!clientId || !title.trim()) {
      showToast('Select a client and enter a project title.', 'error');
      return;
    }
    setSaving(true);
    const { error } = await createProfessionalInvoice({
      client_id: clientId,
      title: title.trim(),
      project_value: projectValue,
      deposit_percentage: depositPercentage,
      region,
    });
    setSaving(false);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Professional invoice created with milestones.');
      setTitle('');
      onCreated();
    }
  };

  return (
    <div className="p-5 bg-brand-black/60 border border-white/5 rounded-xl space-y-4">
      <div>
        <h3 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Create Professional Invoice</h3>
        <p className="text-xs text-brand-gray mt-1">Deposit, development, and final milestones are calculated automatically.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={clientId}
          onChange={(e) => {
            setClientId(e.target.value);
            const client = clients.find((c) => c.id === e.target.value);
            if (client?.region && ['lk', 'pk', 'int'].includes(client.region)) {
              setRegion(client.region as RegionCode);
            }
          }}
          className="h-10 bg-brand-navy/40 border border-white/10 rounded px-3 text-xs text-white"
        >
          <option value="">Select Client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name || c.email}
            </option>
          ))}
        </select>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project / invoice title" className="h-10 text-xs" />
        <Input
          type="number"
          value={projectValue}
          onChange={(e) => setProjectValue(Number(e.target.value))}
          placeholder="Project value"
          className="h-10 text-xs"
        />
        <Input
          type="number"
          value={depositPercentage}
          onChange={(e) => setDepositPercentage(Number(e.target.value))}
          placeholder="Deposit %"
          className="h-10 text-xs"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value as RegionCode)}
          className="h-10 bg-brand-navy/40 border border-white/10 rounded px-3 text-xs text-white sm:col-span-2"
        >
          <option value="lk">Sri Lanka (LKR)</option>
          <option value="pk">Pakistan (PKR)</option>
          <option value="int">International (USD)</option>
        </select>
      </div>
      <div className="p-3 rounded-lg border border-brand-cyan/20 bg-brand-cyan/5 text-xs text-brand-silver space-y-1">
        <div>Amount due now: <strong className="text-brand-cyan">{formatCurrencyAmount(preview.amount_due_now, preview.currency, region)}</strong></div>
        <div>Remaining after deposit: {formatCurrencyAmount(preview.remaining_balance, preview.currency, region)}</div>
      </div>
      <Button size="sm" className="font-mono text-[10px] uppercase" disabled={saving} onClick={handleCreate}>
        {saving ? 'Creating...' : 'Generate Invoice'}
      </Button>
    </div>
  );
}
