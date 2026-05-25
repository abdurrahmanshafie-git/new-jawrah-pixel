import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PaymentModal, type PaymentModalOpenPayload } from './PaymentModal';
import { parsePriceAmount } from '@/lib/payments/amounts';
import { useRegion } from '@/hooks/useRegion';
import { cn } from '@/lib/utils';
import type { PaymentProviderId } from '@/lib/payments';

interface PaymentCTAGroupProps {
  serviceName: string;
  priceLabel: string;
  compact?: boolean;
  className?: string;
}

export function PaymentCTAGroup({ serviceName, priceLabel, compact, className }: PaymentCTAGroupProps) {
  const { config, isInternational } = useRegion();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPayload, setModalPayload] = useState<PaymentModalOpenPayload | null>(null);

  const totalAmount =
    parsePriceAmount(priceLabel) || (isInternational ? 8_000 : config.id === 'pk' ? 450_000 : 500_000);

  const openPayment = (payload: PaymentModalOpenPayload) => {
    setModalPayload(payload);
    setModalOpen(true);
  };

  const btnClass = compact
    ? 'text-[9px] sm:text-[10px] h-8 sm:h-9 font-mono uppercase tracking-wider'
    : 'text-[10px] sm:text-xs h-9 sm:h-10 font-mono uppercase tracking-wider';

  const openWithProvider = (provider: PaymentProviderId, percent: 10 | 50 | 100, intent: PaymentModalOpenPayload['intent']) => {
    openPayment({
      serviceName,
      totalAmount,
      intent,
      defaultPercent: percent,
      lockPercent: percent !== 100,
      preselectedProvider: provider,
    });
  };

  return (
    <>
      <div className={cn('flex flex-col gap-2', className)}>
        <Button
          type="button"
          variant="default"
          className={cn('w-full font-bold luxury-glow', btnClass)}
          onClick={() => openPayment({ serviceName, totalAmount, intent: 'start', defaultPercent: 10 })}
        >
          Start Project
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn('w-full border-brand-cyan/30 text-brand-cyan', btnClass)}
          onClick={() => openPayment({ serviceName, totalAmount, intent: 'invoice', defaultPercent: 100, lockPercent: true })}
        >
          Pay Now
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className={cn('w-full border-white/10', btnClass)}
            onClick={() => openWithProvider('bank_transfer', 10, 'advance_10')}
          >
            Pay 10% Advance
          </Button>
          <Button
            type="button"
            variant="outline"
            className={cn('w-full border-white/10', btnClass)}
            onClick={() => openWithProvider('bank_transfer', 50, 'deposit_50')}
          >
            Confirm Project With 50% Deposit
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="ghost"
            className={cn('w-full border border-white/10 hover:bg-white/5', btnClass)}
            onClick={() => openPayment({ serviceName, totalAmount, intent: 'invoice', defaultPercent: 100 })}
          >
            Request Invoice
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={cn('w-full border border-white/10 hover:bg-white/5', btnClass)}
            onClick={() => openWithProvider('bank_transfer', 100, 'invoice')}
          >
            Manual Bank Transfer
          </Button>
        </div>
        <a href={config.whatsappLink} target="_blank" rel="noreferrer" className="block">
          <Button
            type="button"
            variant="ghost"
            className={cn('w-full border border-white/10 text-brand-cyan', btnClass)}
            onClick={() => openWithProvider('bank_transfer', 10, 'advance_10')}
          >
            WhatsApp Payment Confirmation
          </Button>
        </a>
      </div>

      <PaymentModal open={modalOpen} onClose={() => setModalOpen(false)} payload={modalPayload} />
    </>
  );
}
