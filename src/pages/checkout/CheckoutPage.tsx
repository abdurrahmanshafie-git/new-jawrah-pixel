import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Loader, MessageCircle, Building2, ArrowLeft, CheckCircle, ShieldCheck, UploadCloud } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { InvoiceBillingSummary } from '@/components/billing/InvoiceBillingSummary';
import { MilestoneProgress } from '@/components/billing/MilestoneProgress';
import { fetchInvoiceForCheckout, submitManualPaymentProof } from '@/lib/supabase/billing-api';
import { completeInvoicePayment } from '@/lib/supabase/billing-api';
import { getAvailablePaymentMethods, type PaymentProviderId } from '@/lib/payments';
import { getManualPaymentInstructions } from '@/lib/payments/instructions';
import { runDepositCheckout, type PaymentModalIntent } from '@/lib/payments/checkout';
import { calculateDeposit, formatMoney, type DepositPercent } from '@/lib/payments/amounts';
import { currencyForRegion, RECEIPT_UPLOAD_SETTINGS } from '@/lib/payments/config';
import { submitInquiry } from '@/lib/supabase/api';
import { isRegionCode } from '@/lib/region';
import type { Profile, RegionCode } from '@/types';
import { trackEvent, ANALYTICS_EVENTS, trackPurchase } from '@/lib/analytics';
import { TurnstileCaptcha } from '@/components/ui/TurnstileCaptcha';
import { SEO } from '@/components/layout/SEO';
import { LkBankTransferCard } from '@/components/payments/LkBankTransferCard';

type StartCheckoutOption = 'reserve_10' | 'deposit_50' | 'full_payment' | 'custom_invoice';

const START_PAYMENT_OPTIONS: Array<{
  id: StartCheckoutOption;
  label: string;
  percent: DepositPercent | 0;
  intent: PaymentModalIntent;
}> = [
  { id: 'reserve_10', label: 'Reserve Project Slot (10% Advance)', percent: 10, intent: 'advance_10' },
  { id: 'deposit_50', label: 'Start Project (50% Deposit)', percent: 50, intent: 'deposit_50' },
  { id: 'full_payment', label: 'Full Payment', percent: 100, intent: 'invoice' },
  { id: 'custom_invoice', label: 'Request Custom Invoice', percent: 0, intent: 'invoice' },
];

function fallbackProjectValue(region: RegionCode): number {
  if (region === 'int') return 8_000;
  if (region === 'pk') return 450_000;
  return 500_000;
}

function paymentTypeForInvoice(optionId: StartCheckoutOption): string {
  if (optionId === 'reserve_10') return '10% Advance';
  if (optionId === 'deposit_50') return '50% Deposit';
  if (optionId === 'full_payment') return 'Full Payment';
  return 'Custom Invoice Request';
}

function resolveCheckoutRegion(queryRegion: string | null, profileRegion?: string | null): RegionCode {
  if (isRegionCode(queryRegion)) return queryRegion;
  if (isRegionCode(profileRegion)) return profileRegion;
  return 'lk';
}

function ServiceStartCheckout({
  user,
  profile,
  searchParams,
}: {
  user: User | null;
  profile: Profile | null;
  searchParams: URLSearchParams;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const region = resolveCheckoutRegion(searchParams.get('region'), profile?.region);
  const currency = searchParams.get('currency') || currencyForRegion(region);
  const projectName = searchParams.get('project') || 'Custom Project';
  const queryTotal = Number(searchParams.get('amount'));
  const totalProjectValue = Number.isFinite(queryTotal) && queryTotal > 0 ? queryTotal : fallbackProjectValue(region);
  const [selectedOption, setSelectedOption] = useState<StartCheckoutOption>('reserve_10');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [customInvoiceRequested, setCustomInvoiceRequested] = useState(false);

  const option = START_PAYMENT_OPTIONS.find((item) => item.id === selectedOption) ?? START_PAYMENT_OPTIONS[0];
  const amountDueToday = option.percent === 0 ? 0 : calculateDeposit(totalProjectValue, option.percent);
  const clientEmail = profile?.email ?? user?.email ?? '';
  const clientName = profile?.full_name || user?.user_metadata?.full_name || (clientEmail ? clientEmail.split('@')[0] : 'Client');

  const handleProceed = async () => {
    setError('');
    setCustomInvoiceRequested(false);
    setProcessing(true);

    try {
      if (!user) {
        navigate('/login', { state: { from: `${location.pathname}${location.search}` } });
        return;
      }

      if (selectedOption === 'custom_invoice') {
        const { error: inquiryError } = await submitInquiry(
          {
            full_name: clientName,
            email: clientEmail,
            country: profile?.country ?? null,
            business_name: null,
            service_interested: projectName,
            inquiry_type: 'pricing',
            budget_range: formatMoney(totalProjectValue, currency),
            message: `Custom invoice requested from checkout for ${projectName}.`,
            notes: `Project value: ${formatMoney(totalProjectValue, currency)}. Region: ${region.toUpperCase()}.`,
            source_page: region,
            region,
            status: 'qualified',
          },
          {
            name: clientName,
            email: clientEmail,
            country: profile?.country,
            region,
            service: projectName,
            budget: formatMoney(totalProjectValue, currency),
            requirements: `Custom invoice requested from checkout for ${projectName}.`,
            source: 'checkout',
            formType: 'Custom Invoice Request',
            userId: user.id,
          },
        );

        if (inquiryError) throw inquiryError;
        setCustomInvoiceRequested(true);
        return;
      }

      const result = await runDepositCheckout({
        serviceName: projectName,
        totalAmount: totalProjectValue,
        depositPercent: option.percent === 0 ? 10 : option.percent,
        currency,
        region,
        provider: 'bank_transfer',
        intent: option.intent,
        clientId: user.id,
        guestEmail: null,
        guestName: clientName,
      });

      trackEvent(ANALYTICS_EVENTS.CHECKOUT_STARTED, {
        project: projectName,
        option: selectedOption,
        amount: amountDueToday,
        currency
      });

      navigate(`/dashboard/checkout/${result.invoiceId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout could not be started.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <SEO
        title="Secure Checkout | Jawrah Pixel"
        description="Secure Jawrah Pixel checkout for project invoices, deposits, manual payment proof, and payment confirmation."
        noIndex
      />
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-mono uppercase text-brand-gray hover:text-white">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div>
        <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest">Start Project Checkout</span>
        <h1 className="text-2xl font-display font-semibold text-white uppercase mt-1">{projectName}</h1>
        <p className="text-xs text-brand-gray mt-1">
          {region.toUpperCase()} - {currency}
        </p>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Checkout Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Project Name', value: projectName },
            { label: 'Region', value: region.toUpperCase() },
            { label: 'Currency', value: currency },
            { label: 'Total Project Value', value: formatMoney(totalProjectValue, currency) },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl border border-white/5 bg-black/30">
              <span className="text-[9px] font-mono text-brand-gray uppercase block">{item.label}</span>
              <span className="text-sm font-mono text-white font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-5">
        <h2 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Payment Options</h2>

        <div className="grid grid-cols-1 gap-2">
          {START_PAYMENT_OPTIONS.map((item) => (
            <label
              key={item.id}
              className={`p-3 rounded-xl border text-left text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-3 cursor-pointer ${
                selectedOption === item.id
                  ? 'border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan'
                  : 'border-white/10 text-brand-gray hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name="payment-option"
                checked={selectedOption === item.id}
                onChange={() => setSelectedOption(item.id)}
                className="accent-cyan-400"
              />
              {item.label}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-brand-black/50 border border-white/5">
          <div>
            <span className="text-[9px] font-mono text-brand-gray uppercase block">Project Total</span>
            <span className="text-sm font-mono text-white font-bold">{formatMoney(totalProjectValue, currency)}</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-brand-gray uppercase block">Selected Payment Type</span>
            <span className="text-sm font-mono text-white font-bold">{paymentTypeForInvoice(selectedOption)}</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-brand-gray uppercase block">Amount Due Today</span>
            <span className="text-sm font-mono text-brand-cyan font-bold">{formatMoney(amountDueToday, currency)}</span>
          </div>
        </div>

        {customInvoiceRequested && (
          <div className="p-4 rounded-xl bg-brand-cyan/10 border border-brand-cyan/25 flex gap-3">
            <CheckCircle className="text-brand-cyan shrink-0" size={18} />
            <p className="text-xs text-brand-silver leading-relaxed">
              Custom invoice request received. It is now in the CRM for admin review.
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
        )}

        <Button
          className="w-full luxury-glow font-mono uppercase tracking-widest text-xs"
          disabled={processing}
          onClick={handleProceed}
        >
          {processing && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Proceed To Payment
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [method, setMethod] = useState<PaymentProviderId>('bank_transfer');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const proofInputRef = useRef<HTMLInputElement>(null);

  const region = (invoice?.region ?? profile?.region ?? 'lk') as RegionCode;
  const methods = useMemo(() => getAvailablePaymentMethods(region), [region]);
  const manual = getManualPaymentInstructions(region);
  const isPaid = invoice?.payment_status === 'paid' || invoice?.status === 'paid';
  const isAwaitingVerification =
    invoice?.payment_status === 'manual_review' || invoice?.payment_status === 'awaiting_verification';
  const isSriLankaBankTransfer = region === 'lk' && method === 'bank_transfer';
  const lkWorkflowState = isAwaitingVerification
    ? 'Awaiting Verification'
    : invoice?.current_milestone && invoice.current_milestone !== 'deposit'
      ? 'Project Started'
      : isPaid
        ? 'Payment Confirmed'
        : 'Payment Pending';
  const amountDue = Number(invoice?.amount_due_now ?? invoice?.amount ?? 0);

  useEffect(() => {
    if (!invoiceId || !user) return;
    setLoading(true);
    fetchInvoiceForCheckout(invoiceId, user.id, profile?.role === 'admin').then((res) => {
      if (res.error) {
        setError(res.error.message);
        setLoading(false);
        return;
      }
      setInvoice(res.data?.invoice);
      setMilestones(res.data?.milestones ?? []);
      setMethod(methods[0]?.id ?? 'bank_transfer');
      setLoading(false);
    });
  }, [invoiceId, user, profile?.role, methods]);

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader className="animate-spin text-brand-cyan" />
      </div>
    );
  }

  if (!invoiceId) return <ServiceStartCheckout user={user} profile={profile} searchParams={searchParams} />;
  if (!user) return <Navigate to="/login" replace />;

  if (!loading && error && !invoice) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleReceiptSelect = (file: File | null) => {
    if (!file) {
      setProofFile(null);
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const mimeAllowed = RECEIPT_UPLOAD_SETTINGS.allowedMimeTypes.includes(file.type);
    const extAllowed = RECEIPT_UPLOAD_SETTINGS.allowedExtensions.includes(ext);

    if (file.size > RECEIPT_UPLOAD_SETTINGS.maxBytes) {
      setError('Receipt file must be 10MB or smaller.');
      setProofFile(null);
      return;
    }

    if (!mimeAllowed || !extAllowed) {
      setError('Receipt must be a JPG, PNG, or PDF file.');
      setProofFile(null);
      return;
    }

    setError('');
    setProofFile(file);
  };

  const handleTurnstileSuccess = (token: string) => {
    console.log('Turnstile token received:', token);
    setCaptchaToken(token);
    setError((currentError) =>
      currentError === 'Please complete the security verification.' ? '' : currentError,
    );
  };

  const handleTurnstileExpire = () => {
    setCaptchaToken(null);
  };

  const handleTurnstileError = () => {
    setCaptchaToken(null);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setError('Please complete the security verification.');
      return;
    }
    if (isSriLankaBankTransfer && !reference.trim()) {
      setError('Enter the bank transfer reference number.');
      return;
    }
    if (isSriLankaBankTransfer && !proofFile) {
      setError('Upload your bank transfer receipt.');
      return;
    }
    if (!reference.trim() && !proofFile) {
      setError('Upload your receipt or enter the bank transfer reference number.');
      return;
    }
    console.log('Submitting payment with token:', captchaToken);
    setProcessing(true);
    try {
      await submitManualPaymentProof({
        invoiceId: invoiceId!,
        clientId: user.id,
        paymentMethod: region === 'lk' ? 'bank_transfer' : method,
        referenceNumber: reference.trim(),
        notes: notes.trim() || undefined,
        proofFile,
        captcha_token: captchaToken,
      });
      navigate(`/dashboard/payment-success?invoiceId=${invoiceId}&manual=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit payment proof.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSimulateOnlinePaid = async () => {
    setProcessing(true);
    try {
      await completeInvoicePayment({
        invoiceId: invoiceId!,
        amount: amountDue,
        paymentMethod: method,
        transactionId: `TEST-${Date.now()}`,
      });
      navigate(`/dashboard/payment-success?invoiceId=${invoiceId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment update failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <SEO
        title="Start Project Checkout | Jawrah Pixel"
        description="Start a secure Jawrah Pixel project checkout, reserve a project slot, request a custom invoice, or begin a deposit payment."
        noIndex
      />
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-mono uppercase text-brand-gray hover:text-white">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      {searchParams.get('cancelled') && (
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-200 text-sm">
          Payment was cancelled. You can try again when ready.
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader className="animate-spin text-brand-cyan" />
        </div>
      ) : invoice ? (
        <>
          <div>
            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest">{invoice.invoice_number}</span>
            <h1 className="text-2xl font-display font-semibold text-white uppercase mt-1">{invoice.title}</h1>
            <p className="text-xs text-brand-gray mt-1">
              {profile?.full_name} • {region.toUpperCase()} • Milestone: {invoice.current_milestone}
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Checkout Summary</h2>
            <InvoiceBillingSummary invoice={invoice} />
            {milestones.length > 0 && (
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-[10px] font-mono uppercase text-brand-gray mb-3 tracking-widest">Milestone Billing</h3>
                <MilestoneProgress milestones={milestones} currency={invoice.currency} region={region} />
              </div>
            )}
          </div>

          {isPaid ? (
            <div className="text-center py-8">
              <p className="text-brand-cyan font-mono uppercase text-sm">This invoice milestone is already paid.</p>
              <Link to="/dashboard" className="inline-block mt-4">
                <Button variant="outline" size="sm">Back To Dashboard</Button>
              </Link>
            </div>
          ) : (
            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-5">
              <h2 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">
                {region === 'lk' ? 'Bank Transfer Verification' : 'Payment Options'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-mono uppercase tracking-wider transition-colors ${
                      method === m.id
                        ? 'border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan'
                        : 'border-white/10 text-brand-gray hover:border-white/20'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {isSriLankaBankTransfer && (
                <>
                  <LkBankTransferCard
                    invoiceNumber={invoice.invoice_number}
                    amountDue={amountDue}
                    currency={invoice.currency}
                    region={region}
                  />

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {['Payment Pending', 'Awaiting Verification', 'Payment Confirmed', 'Project Started'].map((state) => (
                      <div
                        key={state}
                        className={`min-h-[58px] rounded-xl border p-3 flex items-center gap-2 ${
                          lkWorkflowState === state
                            ? 'border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan'
                            : 'border-white/5 bg-white/[0.02] text-brand-gray'
                        }`}
                      >
                        {lkWorkflowState === state ? <CheckCircle size={14} /> : <ShieldCheck size={14} />}
                        <span className="text-[9px] font-mono uppercase tracking-wider leading-snug">{state}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
              )}

              {(method === 'bank_transfer' ||
                method === 'easypaisa' ||
                method === 'jazzcash' ||
                method === 'wise' ||
                method === 'paypal' ||
                method === 'visa' ||
                method === 'mastercard') && (
                <div className="space-y-4">
                  {!isSriLankaBankTransfer && (
                    <div className="p-4 rounded-xl border border-white/5 bg-black/30 space-y-2">
                    <div className="flex items-center gap-2 text-brand-cyan text-xs font-mono uppercase">
                      <Building2 size={14} /> {manual.title}
                    </div>
                    {manual.lines.map((line) => (
                      <p key={line} className="text-xs text-brand-silver">
                        {line}
                      </p>
                    ))}
                    <p className="text-[10px] font-mono text-brand-gray pt-2">
                      Reference format: {invoice.invoice_number}-[YourName]
                    </p>
                    </div>
                  )}

                  {isAwaitingVerification ? (
                    <div className="p-4 rounded-xl border border-brand-cyan/20 bg-brand-cyan/10 flex items-start gap-3">
                      <ShieldCheck size={18} className="text-brand-cyan shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-widest text-white">Awaiting Verification</h3>
                        <p className="text-xs text-brand-silver leading-relaxed mt-1">
                          Your payment confirmation is in the admin verification queue. Our team will approve it, request an updated receipt, or contact you if anything is unclear.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleManualSubmit} className="space-y-3">
                      <Input
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Bank reference / transaction ID"
                        className="h-11 text-xs"
                      />
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Notes (optional)"
                        className="text-xs min-h-[70px]"
                      />
                      <input
                        ref={proofInputRef}
                        type="file"
                        accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleReceiptSelect(e.target.files?.[0] ?? null)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full min-h-[44px] text-xs font-mono uppercase gap-2"
                        onClick={() => proofInputRef.current?.click()}
                      >
                        <UploadCloud size={15} />
                        {proofFile ? proofFile.name : 'Upload Receipt'}
                      </Button>
                      <div className="py-2">
                        <TurnstileCaptcha
                          onSuccess={handleTurnstileSuccess}
                          onExpire={handleTurnstileExpire}
                          onError={handleTurnstileError}
                          theme="dark"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full min-h-[44px] font-mono uppercase tracking-widest text-xs luxury-glow"
                        disabled={processing}
                      >
                        {processing && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Payment Confirmation
                      </Button>
                    </form>
                  )}

                  <a href={`${manual.whatsappLink}${invoice.invoice_number}`} target="_blank" rel="noreferrer">
                    <Button type="button" variant="outline" className="w-full min-h-[44px] text-xs font-mono uppercase gap-2">
                      <MessageCircle size={14} /> WhatsApp Confirmation
                    </Button>
                  </a>
                </div>
              )}

              {profile?.role === 'admin' && region !== 'lk' && (
                <Button variant="ghost" size="sm" className="text-[10px] font-mono" onClick={handleSimulateOnlinePaid}>
                  Admin: Mark milestone paid (test)
                </Button>
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
