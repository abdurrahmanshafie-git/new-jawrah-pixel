export interface BillingPdfData {
  documentType: 'invoice' | 'receipt';
  invoiceNumber: string;
  receiptNumber?: string;
  submissionId?: string;
  clientName: string;
  clientEmail: string;
  region: string;
  projectName: string;
  projectValue: number;
  depositPercentage: number;
  depositAmount: number;
  amountPaid?: number;
  amountDueNow: number;
  remainingBalance: number;
  paymentMethod?: string;
  paymentStatus: string;
  paymentDate: string;
  currency: string;
  currentMilestone?: string;
  milestones?: Array<{
    label: string;
    percentage: number;
    amount: number;
    status: string;
  }>;
}
