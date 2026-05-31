import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  downloadBillingPdf,
  requestBillingPdfGeneration,
  viewBillingPdf,
} from '@/lib/pdf/billingPdfClient';
import { FileText, Download, Send, Eye } from 'lucide-react';

interface BillingPdfActionsProps {
  invoiceId: string;
  compact?: boolean;
  showView?: boolean;
  showResend?: boolean;
  onToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function BillingPdfActions({
  invoiceId,
  compact,
  showView,
  showResend,
  onToast,
}: BillingPdfActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const btnClass = compact
    ? 'text-[9px] font-mono uppercase'
    : 'text-[10px] font-mono uppercase tracking-widest';

  const run = async (label: string, fn: () => Promise<void>) => {
    setLoading(label);
    try {
      await fn();
      onToast?.('PDF ready.', 'success');
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'PDF action failed.', 'error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {showView && (
        <>
          <Button
            size="sm"
            variant="ghost"
            className={btnClass}
            disabled={!!loading}
            onClick={() => run('view-invoice', () => viewBillingPdf(invoiceId, 'invoice'))}
          >
            <Eye size={12} className="mr-1" />
            {loading === 'view-invoice' ? 'Loading...' : 'View Invoice'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={btnClass}
            disabled={!!loading}
            onClick={() => run('view-receipt', () => viewBillingPdf(invoiceId, 'receipt'))}
          >
            <Eye size={12} className="mr-1" />
            {loading === 'view-receipt' ? 'Loading...' : 'View Receipt'}
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="outline"
        className={btnClass}
        disabled={!!loading}
        onClick={() => run('invoice', () => downloadBillingPdf(invoiceId, 'invoice'))}
      >
        <Download size={12} className="mr-1" />
        {loading === 'invoice' ? 'Loading...' : compact ? 'Invoice PDF' : 'Download Invoice PDF'}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className={btnClass}
        disabled={!!loading}
        onClick={() => run('receipt', () => downloadBillingPdf(invoiceId, 'receipt'))}
      >
        <FileText size={12} className="mr-1" />
        {loading === 'receipt' ? 'Loading...' : compact ? 'Receipt PDF' : 'Download Receipt PDF'}
      </Button>
      {showResend && (
        <Button
          size="sm"
          variant="ghost"
          className={btnClass}
          disabled={!!loading}
          onClick={() =>
            run('resend', async () => {
              const result = await requestBillingPdfGeneration({
                invoiceId,
                includeInvoice: true,
                includeReceipt: true,
                sendEmails: true,
              });
              if (!result.ok) throw new Error(result.error);
            })
          }
        >
          <Send size={12} className="mr-1" />
          {loading === 'resend' ? 'Sending...' : 'Send Again'}
        </Button>
      )}
    </div>
  );
}
