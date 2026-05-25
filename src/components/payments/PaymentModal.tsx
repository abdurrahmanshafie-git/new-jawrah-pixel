import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader, AlertCircle, MessageCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRegion } from '@/hooks/useRegion';
import type { RegionCode } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import {
  buildPaymentContext,
  getAvailablePaymentMethods,
  isOnlineGatewayAvailable,
  type PaymentProviderId,
} from '@/lib/payments';
import { calculateDeposit, formatMoney, type DepositPercent } from '@/lib/payments/amounts';
import { getManualPaymentInstructions } from '@/lib/payments/instructions';
import { runDepositCheckout } from '@/lib/payments/checkout';
import { updateInvoice } from '@/lib/supabase/api';
import { cn } from '@/lib/utils';

export type PaymentModalIntent = 'start' | 'advance_10' | 'deposit_50' | 'invoice' | 'booking_advance';

export interface PaymentModalOpenPayload {
  serviceName: string;
  totalAmount: number;
  defaultPercent?: DepositPercent;
  intent?: PaymentModalIntent;
  guestEmail?: string;
  guestName?: string;
  lockPercent?: boolean;
  existingInvoiceId?: string;
  existingInvoiceNumber?: string;
  bookingId?: string;
  preselectedProvider?: PaymentProviderId;
  startOnManual?: boolean;
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  payload: PaymentModalOpenPayload | null;
}

type Step = 'form' | 'loading' | 'manual' | 'error';

const DEPOSIT_OPTIONS: DepositPercent[] = [10, 25, 50, 100];

export function PaymentModal({ open, onClose, payload }: PaymentModalProps) {
  const { config, currentRegion, isInternational } = useRegion();
  const { user } = useAuth();
  const activeRegion = currentRegion as RegionCode;
  const paymentContext = buildPaymentContext({ pathRegion: activeRegion });

  const [percent, setPercent] = useState<DepositPercent>(10);
  const [provider, setProvider] = useState<PaymentProviderId>('bank_transfer');
  const [step, setStep] = useState<Step>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const methods = useMemo(() => getAvailablePaymentMethods(activeRegion), [activeRegion]);
  const manualInstructions = getManualPaymentInstructions(activeRegion);
  const whatsappConfirmLink = `${manualInstructions.whatsappLink}&invoice=`;

  useEffect(() => {
    if (!open || !payload) return;
    const initial =
      payload.defaultPercent ??
      (payload.intent === 'deposit_50' ? 50 : payload.intent === 'advance_10' || payload.intent === 'booking_advance' ? 10 : 10);
    setPercent(initial);
    setProvider(payload.preselectedProvider ?? methods[0]?.id ?? 'bank_transfer');
    setStep('form');
    setErrorMsg('');
    setInvoiceNumber('');
    setIsProcessing(false);
  }, [open, payload, methods]);

  if (!payload) return null;

  const totalAmount = payload.totalAmount;
  const depositAmount = calculateDeposit(totalAmount, percent);
  const currency = isInternational ? 'USD' : paymentContext.currency;
  const lockPercent = payload.lockPercent ?? payload.intent === 'booking_advance';

  const handleConfirm = async (providerOverride?: PaymentProviderId) => {
    if (isProcessing) return;
    const activeProvider = providerOverride ?? provider;
    if (!isSupabaseConfigured) {
      setErrorMsg('Payment service is not configured. Please contact us on WhatsApp.');
      setStep('error');
      return;
    }

    const email = payload.guestEmail ?? user?.email;
    if (!user?.id && !email) {
      setErrorMsg('Enter your email in the form before proceeding with payment.');
      setStep('error');
      return;
    }

    setIsProcessing(true);
    setStep('loading');
    setErrorMsg('');

    try {
      const onlineReady = isOnlineGatewayAvailable(activeRegion, activeProvider);
      const result = await runDepositCheckout({
        serviceName: payload.serviceName,
        totalAmount,
        depositPercent: percent,
        currency,
        region: activeRegion,
        provider: activeProvider,
        intent: payload.intent,
        clientId: user?.id ?? null,
        guestEmail: user?.id ? null : email ?? null,
        guestName: payload.guestName ?? null,
        existingInvoiceId: payload.existingInvoiceId,
        existingInvoiceNumber: payload.existingInvoiceNumber,
        bookingId: payload.bookingId,
      });

      setInvoiceNumber(result.invoiceNumber);

      if (!onlineReady || activeProvider === 'bank_transfer') {
        await updateInvoice(result.invoiceId, {
          payment_status: 'manual_review',
          transaction_id: `MANUAL-${result.invoiceNumber}`,
        });
        setStep('manual');
        return;
      }

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
        return;
      }

      setStep('manual');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment could not be started.';
      setErrorMsg(message);
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="relative w-full max-w-lg bg-brand-navy/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-brand-gray hover:text-white z-10"
            >
              <X size={16} />
            </button>

            <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
              <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest font-bold block mb-2">
                Secure Deposit Checkout
              </span>
              <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider mb-1">
                {payload.serviceName}
              </h2>
              <p className="text-xs text-brand-gray font-light mb-6">
                {isInternational ? 'Global Agency Platform' : config.countryName} · {currency} · Invoice generated before payment
              </p>

              {step === 'form' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-brand-black/50 border border-white/5">
                    <div>
                      <span className="text-[9px] font-mono text-brand-gray uppercase block">Project Total</span>
                      <span className="text-sm font-mono text-white font-bold">{formatMoney(totalAmount, currency)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-brand-gray uppercase block">Deposit Due</span>
                      <span className="text-sm font-mono text-brand-cyan font-bold">{formatMoney(depositAmount, currency)}</span>
                    </div>
                  </div>

                  {!lockPercent && (
                    <div>
                      <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest block mb-2">
                        Deposit Percentage
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {DEPOSIT_OPTIONS.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPercent(p)}
                            className={cn(
                              'py-2 rounded-lg border text-[10px] font-mono uppercase transition-all',
                              percent === p
                                ? 'bg-brand-cyan/15 border-brand-cyan/40 text-brand-cyan'
                                : 'border-white/5 text-brand-gray hover:border-white/15',
                            )}
                          >
                            {p}%
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest block mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {methods.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setProvider(m.id)}
                          className={cn(
                            'p-3 rounded-xl border text-left text-[10px] font-mono uppercase transition-all',
                            provider === m.id
                              ? 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan'
                              : 'border-white/5 text-brand-gray hover:border-white/10',
                          )}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isProcessing}
                      onClick={() => void handleConfirm('bank_transfer')}
                      className="text-[9px] font-mono uppercase tracking-wider h-10 border-white/10"
                    >
                      Manual Bank Transfer
                    </Button>
                    <a
                      href={config.whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex"
                      onClick={() => setProvider('bank_transfer')}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full text-[9px] font-mono uppercase tracking-wider h-10 border border-white/10 gap-1"
                      >
                        <MessageCircle size={12} /> WhatsApp Confirmation
                      </Button>
                    </a>
                  </div>

                  <Button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => void handleConfirm()}
                    className="w-full font-mono text-xs uppercase tracking-widest h-11 luxury-glow font-bold"
                  >
                    {isProcessing
                      ? 'Processing...'
                      : payload.intent === 'booking_advance'
                        ? 'Book Slot & Pay 10% Advance'
                        : payload.intent === 'invoice'
                          ? 'Pay Now'
                          : 'Confirm & Pay Deposit'}
                  </Button>
                </div>
              )}

              {step === 'loading' && (
                <div className="py-12 flex flex-col items-center gap-4 text-brand-cyan">
                  <Loader className="animate-spin" size={32} />
                  <p className="text-xs font-mono uppercase tracking-widest text-brand-gray">Creating invoice record...</p>
                </div>
              )}

              {step === 'manual' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex gap-3">
                    <AlertCircle className="text-amber-400 shrink-0" size={18} />
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      Online payment gateway is not connected yet. Please use manual bank transfer or WhatsApp
                      confirmation. Your invoice <strong className="text-white">{invoiceNumber}</strong> is registered as
                      pending review.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-black/50 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-brand-cyan">
                      <Building2 size={14} />
                      <span className="text-[10px] font-mono uppercase tracking-widest">{manualInstructions.title}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {manualInstructions.lines.map((line) => (
                        <li key={line} className="text-[11px] text-brand-silver font-light">
                          • {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={`${whatsappConfirmLink}${encodeURIComponent(invoiceNumber)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button type="button" className="w-full font-mono text-xs uppercase tracking-widest h-11 gap-2">
                      <MessageCircle size={14} /> WhatsApp Payment Confirmation
                    </Button>
                  </a>
                  <Button type="button" variant="outline" onClick={onClose} className="w-full text-[10px] font-mono uppercase">
                    Close
                  </Button>
                </div>
              )}

              {step === 'error' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex gap-3">
                    <AlertCircle className="text-red-400 shrink-0" size={18} />
                    <p className="text-xs text-red-300">{errorMsg}</p>
                  </div>
                  <Button type="button" onClick={() => setStep('form')} className="w-full text-[10px] font-mono uppercase">
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
