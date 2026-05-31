import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Loader, MessageCircle, Building2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { InvoiceBillingSummary } from '@/components/billing/InvoiceBillingSummary';
import { MilestoneProgress } from '@/components/billing/MilestoneProgress';
import { fetchInvoiceForCheckout, submitManualPaymentProof } from '@/lib/supabase/billing-api';
import { completeInvoicePayment } from '@/lib/supabase/billing-api';
import { getAvailablePaymentMethods, type PaymentProviderId } from '@/lib/payments';
import { getManualPaymentInstructions } from '@/lib/payments/instructions';
import { formatPayButtonLabel } from '@/lib/billing/format';
import { redirectToPayHere } from '@/lib/payments/payhereClient';
import type { RegionCode } from '@/types';

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
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const region = (invoice?.region ?? profile?.region ?? 'lk') as RegionCode;
  const methods = useMemo(() => getAvailablePaymentMethods(region), [region]);
  const manual = getManualPaymentInstructions(region);
  const isPaid = invoice?.payment_status === 'paid' || invoice?.status === 'paid';
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

  if (!user) return <Navigate to="/login" replace />;
  if (!invoiceId) return <Navigate to="/dashboard" replace />;

  if (!loading && error && !invoice) {
    return <Navigate to="/dashboard" replace />;
  }

  const handlePayHere = async () => {
    setProcessing(true);
    setError('');
    const result = await redirectToPayHere({
      invoiceId: invoiceId!,
      invoiceNumber: invoice.invoice_number,
      amount: amountDue,
      currency: invoice.currency,
      customerEmail: profile?.email ?? undefined,
      customerName: profile?.full_name ?? undefined,
    });
    if (!result.ok) setError(result.message || 'Could not start PayHere checkout.');
    setProcessing(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) {
      setError('Enter your bank transfer reference number.');
      return;
    }
    setProcessing(true);
    try {
      await submitManualPaymentProof({
        invoiceId: invoiceId!,
        clientId: user.id,
        paymentMethod: method,
        referenceNumber: reference.trim(),
        notes: notes.trim() || undefined,
        proofFile,
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
              <h2 className="text-sm font-mono uppercase tracking-widest text-brand-cyan">Payment Options</h2>

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

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
              )}

              {method === 'payhere' && region === 'lk' && (
                <Button
                  className="w-full luxury-glow font-mono uppercase tracking-widest text-xs"
                  disabled={processing}
                  onClick={handlePayHere}
                >
                  {formatPayButtonLabel(amountDue, invoice.currency, region)}
                </Button>
              )}

              {(method === 'bank_transfer' ||
                method === 'easypaisa' ||
                method === 'jazzcash' ||
                method === 'wise' ||
                method === 'paypal' ||
                method === 'visa' ||
                method === 'mastercard') && (
                <div className="space-y-4">
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

                  <form onSubmit={handleManualSubmit} className="space-y-3">
                    <Input
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Bank reference / transaction ID"
                      className="h-10 text-xs"
                      required
                    />
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Notes (optional)"
                      className="text-xs min-h-[70px]"
                    />
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                      className="text-xs"
                    />
                    <Button
                      type="submit"
                      className="w-full font-mono uppercase tracking-widest text-xs"
                      disabled={processing}
                    >
                      Submit Payment Proof
                    </Button>
                  </form>

                  <a href={`${manual.whatsappLink}${invoice.invoice_number}`} target="_blank" rel="noreferrer">
                    <Button type="button" variant="outline" className="w-full text-xs font-mono uppercase gap-2">
                      <MessageCircle size={14} /> WhatsApp Confirmation
                    </Button>
                  </a>
                </div>
              )}

              {profile?.role === 'admin' && (
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
