export type JawrahEmailCategory =
  | 'lead_confirmation'
  | 'lead_admin'
  | 'account_welcome'
  | 'booking_confirmation'
  | 'invoice_created'
  | 'invoice_paid'
  | 'proposal_sent'
  | 'contract_sent'
  | 'support_ticket'
  | 'team_message'
  | 'file_upload_notice';

export interface JawrahEmailMetadata {
  category: JawrahEmailCategory;
  userId?: string;
  submissionId?: string;
  region?: string;
  platform?: string;
}

/** Shared metadata shape for future invoice, contract, portal, and support email flows. */
export type FutureEmailPayload = JawrahEmailMetadata & Record<string, string | undefined>;
