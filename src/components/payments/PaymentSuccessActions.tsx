import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PaymentModal, type PaymentModalOpenPayload } from './PaymentModal';
import { useRegion } from '@/hooks/useRegion';
import { MessageCircle, FileText } from 'lucide-react';

interface PaymentSuccessActionsProps {
  serviceName: string;
  totalAmount: number;
  guestEmail?: string;
  guestName?: string;
}

export function PaymentSuccessActions({
  serviceName,
  totalAmount,
  guestEmail,
  guestName,
}: PaymentSuccessActionsProps) {
  const { config } = useRegion();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPayload, setModalPayload] = useState<PaymentModalOpenPayload | null>(null);

  const open = (payload: PaymentModalOpenPayload) => {
    setModalPayload({ ...payload, guestEmail, guestName });
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center pt-4 max-w-lg mx-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-mono text-[10px] uppercase tracking-widest border-white/10 gap-1.5"
          onClick={() => open({ serviceName, totalAmount, intent: 'invoice', defaultPercent: 100 })}
        >
          <FileText size={12} /> Request Invoice
        </Button>
        <Button
          type="button"
          size="sm"
          className="font-mono text-[10px] uppercase tracking-widest luxury-glow font-bold"
          onClick={() =>
            open({
              serviceName,
              totalAmount,
              intent: 'advance_10',
              defaultPercent: 10,
              lockPercent: true,
              preselectedProvider: 'bank_transfer',
            })
          }
        >
          Confirm With 10% Advance
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-mono text-[10px] uppercase tracking-widest border-white/10"
          onClick={() =>
            open({ serviceName, totalAmount, intent: 'invoice', defaultPercent: 100, lockPercent: true })
          }
        >
          Pay Now
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-mono text-[10px] uppercase tracking-widest border-brand-cyan/30 text-brand-cyan"
          onClick={() =>
            open({ serviceName, totalAmount, intent: 'deposit_50', defaultPercent: 50, lockPercent: true })
          }
        >
          Confirm Project With 50% Deposit
        </Button>
        <a href={config.whatsappLink} target="_blank" rel="noreferrer" className="inline-flex">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="font-mono text-[10px] uppercase tracking-widest border border-white/10 w-full gap-1.5"
          >
            <MessageCircle size={12} /> Chat on WhatsApp
          </Button>
        </a>
      </div>

      <PaymentModal open={modalOpen} onClose={() => setModalOpen(false)} payload={modalPayload} />
    </>
  );
}
