import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from 'pdf-lib';
import type { BillingPdfData } from './types.js';

const BG = rgb(0.02, 0.02, 0.04);
const CARD = rgb(0.06, 0.08, 0.12);
const CYAN = rgb(0.024, 0.714, 0.831);
const PURPLE = rgb(0.49, 0.23, 0.93);
const WHITE = rgb(0.95, 0.97, 1);
const MUTED = rgb(0.58, 0.64, 0.72);
const AMBER = rgb(0.98, 0.75, 0.14);

function formatMoney(amount: number, currency: string): string {
  const safe = Math.max(0, Number(amount) || 0);
  if (currency === 'USD') return `USD $${safe.toLocaleString('en-US')}`;
  return `${currency} ${safe.toLocaleString('en-US')}`;
}

function regionLabel(region: string): string {
  if (region === 'lk') return 'Sri Lanka';
  if (region === 'pk') return 'Pakistan';
  if (region === 'int') return 'International';
  return region.toUpperCase();
}

function drawAccentBar(page: PDFPage, y: number, width: number) {
  page.drawRectangle({ x: 40, y, width: width - 80, height: 3, color: CYAN });
  page.drawRectangle({ x: 40, y: y - 1, width: (width - 80) * 0.35, height: 1, color: PURPLE });
}

function drawRow(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  y: number,
  label: string,
  value: string,
  width: number,
) {
  page.drawText(label.toUpperCase(), {
    x: 52,
    y,
    size: 8,
    font: bold,
    color: MUTED,
  });
  page.drawText(value, {
    x: 52,
    y: y - 14,
    size: 11,
    font,
    color: WHITE,
    maxWidth: width - 104,
  });
}

async function createBrandedDocument(data: BillingPdfData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({ x: 0, y: 0, width, height, color: BG });

  page.drawRectangle({
    x: 32,
    y: height - 120,
    width: width - 64,
    height: 88,
    color: CARD,
    borderColor: rgb(0.18, 0.2, 0.26),
    borderWidth: 1,
  });
  page.drawText('JAWRAH PIXEL', { x: 48, y: height - 62, size: 22, font: bold, color: CYAN });
  page.drawText('Premium Digital Experiences', { x: 48, y: height - 82, size: 10, font, color: MUTED });

  const docTitle = data.documentType === 'receipt' ? 'PAYMENT RECEIPT' : 'PROFESSIONAL INVOICE';
  page.drawText(docTitle, {
    x: width - 48 - bold.widthOfTextAtSize(docTitle, 14),
    y: height - 62,
    size: 14,
    font: bold,
    color: WHITE,
  });

  drawAccentBar(page, height - 132, width);

  let y = height - 168;
  const rows: Array<[string, string]> = [
    ['Invoice Number', data.invoiceNumber],
    ...(data.receiptNumber ? [['Receipt Number', data.receiptNumber] as [string, string]] : []),
    ...(data.submissionId ? [['Submission ID', data.submissionId] as [string, string]] : []),
    ['Client Name', data.clientName],
    ['Client Email', data.clientEmail],
    ['Region', regionLabel(data.region)],
    ['Project Name', data.projectName],
    ['Project Value', formatMoney(data.projectValue, data.currency)],
    ['Deposit Required', `${data.depositPercentage}%`],
    ['Deposit Amount', formatMoney(data.depositAmount, data.currency)],
  ];

  if (data.documentType === 'receipt' && data.amountPaid !== undefined) {
    rows.push(['Amount Paid', formatMoney(data.amountPaid, data.currency)]);
  }

  rows.push(
    ['Amount Due Now', formatMoney(data.amountDueNow, data.currency)],
    ['Remaining Balance', formatMoney(data.remainingBalance, data.currency)],
    ['Payment Method', data.paymentMethod || 'Pending'],
    ['Payment Status', data.paymentStatus],
    ['Payment Date', data.paymentDate],
  );

  if (data.currentMilestone) {
    rows.push(['Current Milestone', data.currentMilestone.replace('_', ' ')]);
  }

  page.drawRectangle({ x: 40, y: y - rows.length * 34 - 24, width: width - 80, height: rows.length * 34 + 32, color: CARD, borderColor: rgb(0.1, 0.1, 0.15), borderWidth: 1 });

  for (const [label, value] of rows) {
    drawRow(page, font, bold, y, label, value, width);
    y -= 34;
  }

  if (data.milestones?.length) {
    y -= 20;
    page.drawText('MILESTONE BILLING', { x: 52, y, size: 9, font: bold, color: CYAN });
    y -= 16;
    for (const m of data.milestones) {
      const mark = m.status === 'paid' ? '[PAID]' : '[ ]';
      const line = `${mark} ${m.label} — ${m.percentage}% — ${formatMoney(m.amount, data.currency)}`;
      page.drawText(line, { x: 52, y, size: 9, font, color: m.status === 'paid' ? CYAN : MUTED, maxWidth: width - 104 });
      y -= 14;
    }
  }

  page.drawRectangle({ x: 40, y: 72, width: width - 80, height: 48, color: rgb(0.02, 0.12, 0.14), borderColor: CYAN, borderWidth: 1 });
  page.drawText('Thank you for partnering with Jawrah Pixel.', { x: 52, y: 98, size: 10, font, color: WHITE });
  page.drawText('jawrahpixel.com  •  jawrahpixel@gmail.com', { x: 52, y: 82, size: 9, font, color: MUTED });

  page.drawText('Confidential billing document. Generated by Jawrah Pixel Studio.', {
    x: 52,
    y: 48,
    size: 7,
    font,
    color: AMBER,
  });

  return doc.save();
}

export async function buildInvoicePdf(data: BillingPdfData): Promise<Uint8Array> {
  return createBrandedDocument({ ...data, documentType: 'invoice' });
}

export async function buildReceiptPdf(data: BillingPdfData): Promise<Uint8Array> {
  return createBrandedDocument({
    ...data,
    documentType: 'receipt',
    amountPaid: data.amountPaid ?? data.amountDueNow,
  });
}
