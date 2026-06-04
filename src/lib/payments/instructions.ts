import type { PaymentRegion } from './config';
import { appEnv } from '@/lib/env';

export interface ManualPaymentInstructions {
  title: string;
  lines: string[];
  whatsappLink: string;
}

export function getManualPaymentInstructions(region: PaymentRegion): ManualPaymentInstructions {
  const whatsappLink = appEnv.contactWhatsapp
    ? `https://wa.me/${appEnv.contactWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        'Hi Jawrah Pixel - I have completed a manual payment and would like to confirm my deposit.',
      )}`
    : '#';

  if (region === 'pk') {
    return {
      title: 'Pakistan Manual Payment',
      lines: [
        'Bank transfer (IBAN) - details provided on your invoice email.',
        'Easypaisa / JazzCash - send to the account shared by your account manager.',
        'Include your invoice number in the payment reference.',
        'After paying, confirm via WhatsApp with your receipt screenshot.',
      ],
      whatsappLink,
    };
  }

  if (region === 'lk') {
    return {
      title: 'Sri Lanka Bank Transfer',
      lines: [
        'Bank transfer is the active payment method for Sri Lanka invoices.',
        'Bank details are shown inside the secure invoice payment area after quotation acceptance.',
        'Include your invoice number in the transfer reference.',
        'After paying, upload the receipt or submit the transfer reference for verification.',
      ],
      whatsappLink,
    };
  }

  return {
    title: 'International Manual Payment',
    lines: [
      'PayPal or Wise transfer details are provided on your USD invoice.',
      'International bank transfer details are provided for wire payments.',
      'Visa and Mastercard checkout will appear when card rails are connected.',
      'Reference your invoice number on all transfers.',
      'Confirm payment via WhatsApp or email with proof of transfer.',
    ],
    whatsappLink,
  };
}
