import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { parsePriceAmount } from '@/lib/payments/amounts';
import { useRegion } from '@/hooks/useRegion';
import { cn } from '@/lib/utils';
import { submitInquiry } from '@/lib/supabase/api';
import { useAuth } from '@/contexts/AuthContext';
import type { RegionCode } from '@/types';

interface PaymentCTAGroupProps {
  serviceName: string;
  priceLabel: string;
  compact?: boolean;
  className?: string;
}

export function PaymentCTAGroup({ serviceName, priceLabel, compact, className }: PaymentCTAGroupProps) {
  const navigate = useNavigate();
  const { config, currentRegion, isInternational } = useRegion();
  const { user, profile } = useAuth();
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalSubmitting, setProposalSubmitting] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [proposalError, setProposalError] = useState('');
  const [proposalForm, setProposalForm] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    projectType: serviceName,
    budgetRange: '',
    requirements: '',
    timeline: '',
  });

  const totalAmount =
    parsePriceAmount(priceLabel) || (isInternational ? 8_000 : config.id === 'pk' ? 450_000 : 500_000);

  useEffect(() => {
    setProposalForm((prev) => ({
      ...prev,
      contactPerson: prev.contactPerson || profile?.full_name || '',
      email: prev.email || profile?.email || user?.email || '',
      projectType: serviceName,
    }));
  }, [profile?.email, profile?.full_name, serviceName, user?.email]);

  const btnClass = compact
    ? 'text-[9px] sm:text-[10px] h-8 sm:h-9 font-mono uppercase tracking-wider'
    : 'text-[10px] sm:text-xs h-9 sm:h-10 font-mono uppercase tracking-wider';

  const budgetOptions = isInternational ? [
    { value: '$500 - $1,000', label: 'USD $500 - $1,000' },
    { value: '$1,000 - $3,000', label: 'USD $1,000 - $3,000' },
    { value: '$3,000 - $10,000', label: 'USD $3,000 - $10,000' },
    { value: '$10,000+', label: 'USD $10,000+ (Enterprise)' },
  ] : config.id === 'lk' ? [
    { value: 'Under LKR 200k', label: 'Under LKR 200,000' },
    { value: 'LKR 200k - 500k', label: 'LKR 200,000 - LKR 500k' },
    { value: 'LKR 500k - 1.5M', label: 'LKR 500,000 - LKR 1.5M' },
    { value: 'Over LKR 1.5M', label: 'Over LKR 1,500,000 (Enterprise)' },
  ] : [
    { value: 'Under PKR 150k', label: 'Under PKR 150,000' },
    { value: 'PKR 150k - 400k', label: 'PKR 150,000 - PKR 400k' },
    { value: 'PKR 400k - 1.2M', label: 'PKR 400,000 - PKR 1.2M' },
    { value: 'Over PKR 1.2M', label: 'Over PKR 1,200,000 (Enterprise)' },
  ];

  const updateProposalField = (field: keyof typeof proposalForm, value: string) => {
    setProposalForm((prev) => ({ ...prev, [field]: value }));
  };

  const startProject = () => {
    const params = new URLSearchParams({
      project: serviceName,
      amount: String(totalAmount),
      region: config.id,
      currency: config.currency,
    });

    navigate(`/checkout?${params.toString()}`);
  };

  const handleProposalSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProposalError('');

    if (!proposalForm.contactPerson.trim() || !proposalForm.email.trim() || !proposalForm.projectType.trim()) {
      setProposalError('Contact person, email, and project type are required.');
      return;
    }

    setProposalSubmitting(true);

    try {
      const requirements = proposalForm.requirements.trim();
      const timelineNote = proposalForm.timeline.trim() ? `Timeline: ${proposalForm.timeline.trim()}` : '';
      const { error } = await submitInquiry(
        {
          full_name: proposalForm.contactPerson.trim(),
          email: proposalForm.email.trim(),
          whatsapp: proposalForm.phone.trim() || null,
          phone: proposalForm.phone.trim() || null,
          country: config.countryName,
          business_name: proposalForm.businessName.trim() || null,
          company: proposalForm.businessName.trim() || null,
          service_interested: proposalForm.projectType.trim(),
          inquiry_type: 'project',
          budget_range: proposalForm.budgetRange || null,
          message: requirements || null,
          notes: timelineNote || null,
          source_page: currentRegion as RegionCode,
          region: currentRegion as RegionCode,
          status: 'new',
        },
        {
          name: proposalForm.contactPerson.trim(),
          email: proposalForm.email.trim(),
          phone: proposalForm.phone.trim() || null,
          country: config.countryName,
          region: currentRegion,
          service: proposalForm.projectType.trim(),
          budget: proposalForm.budgetRange || null,
          timeline: proposalForm.timeline.trim() || null,
          requirements,
          notes: proposalForm.businessName.trim() ? `Business Name: ${proposalForm.businessName.trim()}` : null,
          source: config.id,
          formType: 'Proposal Request',
          userId: user?.id ?? null,
        },
      );

      if (error) throw error;
      setProposalSuccess(true);
    } catch (err) {
      setProposalError(err instanceof Error ? err.message : 'Could not submit proposal request.');
    } finally {
      setProposalSubmitting(false);
    }
  };

  return (
    <>
      <div className={cn('flex flex-col gap-2', className)}>
        <Button
          type="button"
          variant="default"
          className={cn('w-full font-bold luxury-glow', btnClass)}
          onClick={startProject}
        >
          Start Project
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn('w-full border-brand-cyan/30 text-brand-cyan', btnClass)}
          onClick={() => {
            setProposalOpen(true);
            setProposalSuccess(false);
            setProposalError('');
          }}
        >
          Get Proposal
        </Button>
      </div>

      {proposalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-3 sm:p-4">
          <button
            type="button"
            aria-label="Close proposal form"
            className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm"
            onClick={() => setProposalOpen(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[92vh] bg-brand-navy/95 border border-white/10 rounded-t-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setProposalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-brand-gray hover:text-white z-10"
              aria-label="Close proposal form"
            >
              <X size={16} />
            </button>

            <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
              <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest font-bold block mb-2">
                Proposal Request
              </span>
              <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider mb-1">
                {serviceName}
              </h2>
              <p className="text-xs text-brand-gray font-light mb-6">
                {config.countryName} - {config.currency}
              </p>

              {proposalSuccess ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-brand-cyan/10 border border-brand-cyan/25 flex gap-3">
                    <CheckCircle className="text-brand-cyan shrink-0" size={18} />
                    <p className="text-xs text-brand-silver leading-relaxed">
                      Proposal request received. Your request is now in the CRM and the admin team can generate a proposal from the dashboard.
                    </p>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setProposalOpen(false)} className="w-full text-[10px] font-mono uppercase">
                    Close
                  </Button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleProposalSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      value={proposalForm.businessName}
                      onChange={(e) => updateProposalField('businessName', e.target.value)}
                      placeholder="Business Name"
                      className="h-10 text-xs"
                    />
                    <Input
                      value={proposalForm.contactPerson}
                      onChange={(e) => updateProposalField('contactPerson', e.target.value)}
                      placeholder="Contact Person"
                      className="h-10 text-xs"
                      required
                    />
                    <Input
                      type="email"
                      value={proposalForm.email}
                      onChange={(e) => updateProposalField('email', e.target.value)}
                      placeholder="Email"
                      className="h-10 text-xs"
                      required
                    />
                    <Input
                      value={proposalForm.phone}
                      onChange={(e) => updateProposalField('phone', e.target.value)}
                      placeholder="Phone"
                      className="h-10 text-xs"
                    />
                    <Input
                      value={proposalForm.projectType}
                      onChange={(e) => updateProposalField('projectType', e.target.value)}
                      placeholder="Project Type"
                      className="h-10 text-xs"
                      required
                    />
                    <select
                      value={proposalForm.budgetRange}
                      onChange={(e) => updateProposalField('budgetRange', e.target.value)}
                      className="h-10 bg-brand-navy/40 border border-white/10 rounded px-3 text-xs text-white"
                    >
                      <option value="">Budget Range</option>
                      {budgetOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <Input
                      value={proposalForm.timeline}
                      onChange={(e) => updateProposalField('timeline', e.target.value)}
                      placeholder="Timeline"
                      className="h-10 text-xs sm:col-span-2"
                    />
                    <Textarea
                      value={proposalForm.requirements}
                      onChange={(e) => updateProposalField('requirements', e.target.value)}
                      placeholder="Project Requirements"
                      className="text-xs min-h-[120px] sm:col-span-2"
                    />
                  </div>

                  {proposalError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      {proposalError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={proposalSubmitting}
                    className="w-full font-mono text-xs uppercase tracking-widest h-11 luxury-glow font-bold"
                  >
                    {proposalSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Proposal Request
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
