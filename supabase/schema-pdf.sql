-- Jawrah Pixel Phase 3.3 — Branded PDF storage metadata
-- Safe to run after schema-billing.sql

alter table public.invoices add column if not exists invoice_pdf_path text;
alter table public.invoices add column if not exists latest_receipt_pdf_path text;

alter table public.invoice_payments add column if not exists receipt_number text;
alter table public.invoice_payments add column if not exists receipt_pdf_path text;
alter table public.invoice_payments add column if not exists submission_id text;

create unique index if not exists idx_invoice_payments_receipt_number
  on public.invoice_payments(receipt_number)
  where receipt_number is not null;

create index if not exists idx_invoices_pdf_paths on public.invoices(invoice_pdf_path, latest_receipt_pdf_path);

-- Billing PDFs live under project-files bucket: billing/{client_id}/{invoice_id}/...
