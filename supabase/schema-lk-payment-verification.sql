-- Jawrah Pixel LK payment verification workflow
-- Run after schema.sql, schema-phase2.sql, schema-billing.sql, and schema-pdf.sql.

create or replace function app_private.can_manage_lk_payment_proofs()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('admin', 'superadmin', 'founder', 'co-founder')
  );
$$;

grant execute on function app_private.can_manage_lk_payment_proofs() to anon, authenticated;

alter table public.invoices drop constraint if exists invoices_payment_status_check;
alter table public.invoices
  add constraint invoices_payment_status_check check (
    payment_status in (
      'unpaid',
      'pending',
      'processing',
      'manual_review',
      'awaiting_verification',
      'confirmed',
      'paid',
      'failed',
      'rejected',
      'update_requested',
      'refunded',
      'cancelled'
    )
  );

alter table public.invoice_payments add column if not exists project_id uuid references public.projects(id) on delete set null;
alter table public.invoice_payments add column if not exists client_name text;
alter table public.invoice_payments add column if not exists client_email text;
alter table public.invoice_payments add column if not exists client_phone text;
alter table public.invoice_payments add column if not exists project_name text;
alter table public.invoice_payments add column if not exists invoice_number text;
alter table public.invoice_payments add column if not exists amount_paid numeric(20, 2);
alter table public.invoice_payments add column if not exists region text check (region in ('lk', 'pk', 'int'));
alter table public.invoice_payments add column if not exists bank_reference text;
alter table public.invoice_payments add column if not exists receipt_storage_path text;
alter table public.invoice_payments add column if not exists receipt_file_name text;
alter table public.invoice_payments add column if not exists receipt_file_type text;
alter table public.invoice_payments add column if not exists receipt_file_size bigint;
alter table public.invoice_payments add column if not exists captcha_verified boolean not null default false;
alter table public.invoice_payments add column if not exists submitted_at timestamptz;
alter table public.invoice_payments add column if not exists confirmed_at timestamptz;
alter table public.invoice_payments add column if not exists confirmed_by uuid references public.profiles(id) on delete set null;
alter table public.invoice_payments add column if not exists rejected_at timestamptz;
alter table public.invoice_payments add column if not exists rejected_by uuid references public.profiles(id) on delete set null;
alter table public.invoice_payments add column if not exists admin_note text;

update public.invoice_payments
set
  amount_paid = coalesce(public.invoice_payments.amount_paid, public.invoice_payments.amount),
  region = coalesce(public.invoice_payments.region, i.region),
  bank_reference = coalesce(public.invoice_payments.bank_reference, public.invoice_payments.reference_number),
  receipt_storage_path = coalesce(public.invoice_payments.receipt_storage_path, public.invoice_payments.proof_storage_path),
  submitted_at = coalesce(public.invoice_payments.submitted_at, public.invoice_payments.created_at),
  invoice_number = coalesce(public.invoice_payments.invoice_number, i.invoice_number),
  project_id = coalesce(public.invoice_payments.project_id, i.project_id),
  project_name = coalesce(public.invoice_payments.project_name, i.title)
from public.invoices i
where i.id = public.invoice_payments.invoice_id;

alter table public.invoice_payments drop constraint if exists invoice_payments_status_check;
alter table public.invoice_payments
  add constraint invoice_payments_status_check check (
    status in (
      'pending',
      'processing',
      'manual_review',
      'pending_verification',
      'confirmed',
      'rejected',
      'update_requested',
      'paid',
      'failed',
      'cancelled'
    )
  );

alter table public.invoice_payments drop constraint if exists invoice_payments_lk_required_fields_check;
alter table public.invoice_payments
  add constraint invoice_payments_lk_required_fields_check check (
    region is distinct from 'lk'
    or payment_method is distinct from 'bank_transfer'
    or status not in ('pending_verification', 'confirmed')
    or (
      bank_reference is not null
      and length(trim(bank_reference)) > 0
      and receipt_storage_path is not null
      and captcha_verified = true
    )
  );

create index if not exists idx_invoice_payments_lk_queue
  on public.invoice_payments(region, status, submitted_at desc)
  where region = 'lk';

create index if not exists idx_invoice_payments_client_status
  on public.invoice_payments(client_id, status, created_at desc);

grant select, insert, update on public.invoice_payments to authenticated;

alter table public.invoice_payments enable row level security;

drop policy if exists "invoice_payments_select" on public.invoice_payments;
create policy "invoice_payments_select" on public.invoice_payments
  for select to authenticated
  using (
    public.invoice_payments.client_id = (select auth.uid())
    or exists (
      select 1 from public.invoices i
      where i.id = public.invoice_payments.invoice_id
        and i.client_id = (select auth.uid())
    )
    or (
      coalesce(public.invoice_payments.region, 'lk') = 'lk'
      and app_private.can_manage_lk_payment_proofs()
    )
    or (
      coalesce(public.invoice_payments.region, 'lk') <> 'lk'
      and app_private.is_team()
    )
  );

drop policy if exists "invoice_payments_insert_own" on public.invoice_payments;
create policy "invoice_payments_insert_own" on public.invoice_payments
  for insert to authenticated
  with check (
    public.invoice_payments.client_id = (select auth.uid())
    or exists (
      select 1 from public.invoices i
      where i.id = public.invoice_payments.invoice_id
        and i.client_id = (select auth.uid())
    )
    or app_private.can_manage_lk_payment_proofs()
  );

drop policy if exists "invoice_payments_team_update" on public.invoice_payments;
create policy "invoice_payments_team_update" on public.invoice_payments
  for update to authenticated
  using (
    case
      when coalesce(public.invoice_payments.region, 'lk') = 'lk' then app_private.can_manage_lk_payment_proofs()
      else app_private.is_admin()
    end
  )
  with check (
    case
      when coalesce(public.invoice_payments.region, 'lk') = 'lk' then app_private.can_manage_lk_payment_proofs()
      else app_private.is_admin()
    end
  );

create or replace function app_private.guard_lk_bank_transfer_verification()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if coalesce(new.region, old.region) = 'lk' and not app_private.can_manage_lk_payment_proofs() then
    if
      old.client_id = (select auth.uid())
      and new.payment_status in ('manual_review', 'awaiting_verification')
      and old.payment_status in ('unpaid', 'pending', 'failed', 'rejected', 'update_requested', 'cancelled')
      and new.status = 'pending'
    then
      return new;
    end if;

    if
      new.payment_status is distinct from old.payment_status
      or new.status is distinct from old.status
      or new.paid_at is distinct from old.paid_at
    then
      raise exception 'Sri Lanka bank transfer verification requires admin approval.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists guard_lk_bank_transfer_verification on public.invoices;
create trigger guard_lk_bank_transfer_verification
  before update on public.invoices
  for each row execute function app_private.guard_lk_bank_transfer_verification();

drop policy if exists "project_files_upload" on storage.objects;
create policy "project_files_upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'project-files'
    and (
      name not like 'payment-receipts/%'
      or name like ('payment-receipts/' || (select auth.uid())::text || '/%')
      or app_private.can_manage_lk_payment_proofs()
    )
  );

drop policy if exists "project_files_read" on storage.objects;
create policy "project_files_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'project-files'
    and (
      name not like 'payment-receipts/%'
      or app_private.can_manage_lk_payment_proofs()
      or exists (
        select 1
        from public.invoice_payments p
        where p.receipt_storage_path = storage.objects.name
          and p.client_id = (select auth.uid())
      )
    )
  );

drop policy if exists "project_files_delete_team" on storage.objects;
create policy "project_files_delete_team" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-files' and app_private.is_team());