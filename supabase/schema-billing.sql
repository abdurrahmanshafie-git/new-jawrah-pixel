-- Jawrah Pixel Phase 3.1 + 3.2 — Professional invoicing & checkout
-- Safe to run after schema.sql, schema-phase2.sql, and schema-agent-portal.sql

-- ---------------------------------------------------------------------------
-- Invoice billing columns
-- ---------------------------------------------------------------------------

alter table public.invoices add column if not exists project_value numeric(20, 2);
alter table public.invoices add column if not exists deposit_percentage numeric(5, 2) default 10;
alter table public.invoices add column if not exists deposit_amount numeric(20, 2);
alter table public.invoices add column if not exists remaining_balance numeric(20, 2);
alter table public.invoices add column if not exists amount_due_now numeric(20, 2);
alter table public.invoices add column if not exists current_milestone text default 'deposit';
alter table public.invoices add column if not exists region text check (region in ('lk', 'pk', 'int'));
alter table public.invoices add column if not exists payment_reference text;
alter table public.invoices add column if not exists payment_notes text;
alter table public.invoices add column if not exists proof_storage_path text;

alter table public.invoices drop constraint if exists invoices_current_milestone_check;
alter table public.invoices
  add constraint invoices_current_milestone_check check (
    current_milestone in ('deposit', 'development', 'final', 'completed')
  );

alter table public.invoices drop constraint if exists invoices_payment_status_check;
alter table public.invoices
  add constraint invoices_payment_status_check check (
    payment_status in (
      'unpaid', 'pending', 'processing', 'manual_review', 'paid', 'failed', 'refunded', 'cancelled'
    )
  );

-- Backfill legacy rows
update public.invoices
set
  project_value = coalesce(project_value, amount),
  deposit_percentage = coalesce(deposit_percentage, 10),
  deposit_amount = coalesce(deposit_amount, round(amount * 0.10, 2)),
  remaining_balance = coalesce(remaining_balance, greatest(amount - round(amount * 0.10, 2), 0)),
  amount_due_now = coalesce(amount_due_now, amount),
  current_milestone = coalesce(current_milestone, 'deposit')
where project_value is null or amount_due_now is null;

-- ---------------------------------------------------------------------------
-- Milestone lines per invoice
-- ---------------------------------------------------------------------------

create table if not exists public.invoice_billing_milestones (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  milestone_key text not null check (milestone_key in ('deposit', 'development', 'final')),
  label text not null,
  percentage numeric(5, 2) not null check (percentage >= 0 and percentage <= 100),
  amount numeric(20, 2) not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  paid_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (invoice_id, milestone_key)
);

-- ---------------------------------------------------------------------------
-- Payment audit trail
-- ---------------------------------------------------------------------------

create table if not exists public.invoice_payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  client_id uuid references public.profiles(id) on delete set null,
  amount numeric(20, 2) not null check (amount > 0),
  currency text not null default 'LKR',
  payment_method text,
  status text not null default 'pending' check (
    status in ('pending', 'processing', 'manual_review', 'paid', 'failed', 'cancelled')
  ),
  reference_number text,
  proof_storage_path text,
  notes text,
  provider_transaction_id text,
  milestone_key text check (milestone_key in ('deposit', 'development', 'final')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_invoice_billing_milestones_invoice on public.invoice_billing_milestones(invoice_id, sort_order);
create index if not exists idx_invoice_payments_invoice on public.invoice_payments(invoice_id, created_at desc);

drop trigger if exists touch_invoice_payments_updated_at on public.invoice_payments;
create trigger touch_invoice_payments_updated_at before update on public.invoice_payments
  for each row execute function app_private.touch_updated_at();

grant select, insert, update on public.invoice_billing_milestones to authenticated;
grant select, insert, update on public.invoice_payments to authenticated;

alter table public.invoice_billing_milestones enable row level security;
alter table public.invoice_payments enable row level security;

drop policy if exists "invoice_milestones_select" on public.invoice_billing_milestones;
create policy "invoice_milestones_select" on public.invoice_billing_milestones
  for select to authenticated
  using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_id
        and (i.client_id = (select auth.uid()) or app_private.is_team())
    )
  );

drop policy if exists "invoice_milestones_team_write" on public.invoice_billing_milestones;
create policy "invoice_milestones_team_write" on public.invoice_billing_milestones
  for all to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "invoice_payments_select" on public.invoice_payments;
create policy "invoice_payments_select" on public.invoice_payments
  for select to authenticated
  using (
    client_id = (select auth.uid())
    or app_private.is_team()
    or exists (
      select 1 from public.invoices i
      where i.id = invoice_id and i.client_id = (select auth.uid())
    )
  );

drop policy if exists "invoice_payments_insert_own" on public.invoice_payments;
create policy "invoice_payments_insert_own" on public.invoice_payments
  for insert to authenticated
  with check (
    client_id = (select auth.uid())
    or app_private.is_team()
    or exists (
      select 1 from public.invoices i
      where i.id = invoice_id and i.client_id = (select auth.uid())
    )
  );

drop policy if exists "invoice_payments_team_update" on public.invoice_payments;
create policy "invoice_payments_team_update" on public.invoice_payments
  for update to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());
