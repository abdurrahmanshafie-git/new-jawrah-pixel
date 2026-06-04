import React, { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { fetchInvoiceForCheckout } from '@/lib/supabase/billing-api';
import { completeInvoicePayment } from '@/lib/supabase/billing-api';
import { formatCurrencyAmount } from '@/lib/billing/format';
import { trackEvent, ANALYTICS_EVENTS, trackPurchase } from '@/lib/analytics';
import { SEO } from '@/components/layout/SEO';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');
  const isManual = searchParams.get('manual') === '1';
  const { user, profile, loading: authLoading } = useAuth();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoiceId || !user) return;

    const finalize = async () => {
      if (!isManual && searchParams.get('payhere') !== '0') {
        try {
          const checkout = await fetchInvoiceForCheckout(invoiceId, user.id, profile?.role === 'admin');
          if (checkout.data?.invoice && checkout.data.invoice.payment_status !== 'paid') {
            const inv = checkout.data.invoice;
            if (!(inv.region === 'lk' && inv.payment_method === 'bank_transfer')) {
              await completeInvoicePayment({
                invoiceId,
                amount: Number(inv.amount_due_now ?? inv.amount),
                paymentMethod: 'payhere',
                transactionId: searchParams.get('payment_id') ?? undefined,
              });
            }
          }
        } catch {
          /* PayHere return may already be processed */
        }
      }

      const res = await fetchInvoiceForCheckout(invoiceId, user.id, profile?.role === 'admin');
      const inv = res.data?.invoice;
      setInvoice(inv);

      if (inv) {
        const amount = Number(inv.amount_due_now ?? inv.amount ?? 0);
        if (isManual) {
          trackEvent(ANALYTICS_EVENTS.PAYMENT_SUBMITTED, {
            invoice_id: invoiceId,
            amount,
            method: 'manual'
          });
        } else {
          trackPurchase(invoiceId, amount, inv.currency);
          trackEvent(ANALYTICS_EVENTS.PAYMENT_SUBMITTED, {
            invoice_id: invoiceId,
            amount,
            method: 'online'
          });
        }
      }

      setLoading(false);
    };

    void finalize();
  }, [invoiceId, user, profile?.role, isManual, searchParams]);

  if (authLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader className="animate-spin text-brand-cyan" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!invoiceId) return <Navigate to="/dashboard" replace />;

  const amount = Number(invoice?.amount_due_now ?? invoice?.amount ?? 0);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-6">
      <SEO
        title="Payment Confirmation | Jawrah Pixel"
        description="Secure Jawrah Pixel payment confirmation page for client invoices and project milestones."
        noIndex
      />
      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
        <CheckCircle size={32} />
      </div>
      <h1 className="text-2xl font-display font-semibold text-white uppercase">
        {isManual ? 'Payment Submitted' : 'Payment Successful'}
      </h1>
      <p className="text-sm text-brand-gray">
        {isManual
          ? 'Your payment proof has been sent for manual review. We will confirm within 24–48 hours.'
          : 'Thank you. Your payment has been recorded successfully.'}
      </p>

      {loading ? (
        <Loader className="animate-spin text-brand-cyan mx-auto" />
      ) : invoice ? (
        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] text-left space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-gray font-mono text-[10px] uppercase">Invoice</span>
            <span className="text-white font-mono">{invoice.invoice_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-gray font-mono text-[10px] uppercase">Amount</span>
            <span className="text-brand-cyan font-bold">
              {formatCurrencyAmount(amount, invoice.currency, invoice.region)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-gray font-mono text-[10px] uppercase">Date</span>
            <span className="text-white">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-gray font-mono text-[10px] uppercase">Project Status</span>
            <span className="text-white capitalize">{invoice.current_milestone || invoice.payment_status}</span>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Link to="/dashboard">
          <Button className="w-full sm:w-auto font-mono text-xs uppercase">Back To Dashboard</Button>
        </Link>
        {invoiceId && (
          <Link to={`/dashboard/checkout/${invoiceId}`}>
            <Button variant="outline" className="w-full sm:w-auto font-mono text-xs uppercase">
              View Invoice
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
