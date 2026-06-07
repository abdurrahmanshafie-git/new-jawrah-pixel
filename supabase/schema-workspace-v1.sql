-- Jawrah Pixel Workspace Foundation
-- Idempotent compatibility patch for profile defaults, workspace tables, and RLS.

alter table public.profiles add column if not exists company_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists whatsapp text;
alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles add column if not exists region text default 'lk';
alter table public.profiles alter column region set default 'lk';
alter table public.profiles alter column role set default 'client';
alter table public.profiles alter column status set default 'active';

alter table public.profiles drop constraint if exists profiles_status_check;
alter table public.profiles
  add constraint profiles_status_check check (status in ('active', 'inactive', 'suspended'));

alter table public.projects add column if not exists slug text;
alter table public.projects add column if not exists description text;
alter table public.projects add column if not exists project_type text;
alter table public.projects add column if not exists start_date date;
alter table public.projects add column if not exists due_date date;

alter table public.proposals add column if not exists scope text;
alter table public.proposals add column if not exists price numeric(20, 2) default 0;
alter table public.proposals add column if not exists client_notes text;
update public.proposals
set scope = coalesce(scope, scope_of_work),
    price = coalesce(price, pricing, 0);

alter table public.invoices add column if not exists subtotal numeric(20, 2) default 0;
alter table public.invoices add column if not exists tax numeric(20, 2) default 0;
alter table public.invoices add column if not exists discount numeric(20, 2) default 0;
alter table public.invoices add column if not exists total numeric(20, 2) default 0;
alter table public.invoices add column if not exists payment_instructions text;
alter table public.invoices add column if not exists pdf_url text;
update public.invoices
set subtotal = coalesce(nullif(subtotal, 0), amount, 0),
    total = coalesce(nullif(total, 0), amount, 0);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete cascade,
  description text,
  quantity numeric(20, 2) default 1,
  unit_price numeric(20, 2) default 0,
  total numeric(20, 2) default 0
);

create table if not exists public.payment_proofs (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete cascade,
  client_id uuid references public.profiles(id) on delete cascade,
  file_url text,
  note text,
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

create table if not exists public.client_files (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  file_name text,
  file_url text,
  file_type text not null default 'other',
  file_size bigint,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles
    where id = uid
      and role = 'admin'
  );
$$;

create or replace function app_private.prevent_profile_lock_changes()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not app_private.is_admin() then
    new.role = old.role;
    new.region = old.region;
    new.status = old.status;
  end if;

  return new;
end;
$$;

drop trigger if exists on_profile_lock_update on public.profiles;
create trigger on_profile_lock_update
  before update on public.profiles
  for each row execute function app_private.prevent_profile_lock_changes();

grant select, insert, update on public.invoice_items, public.payment_proofs, public.client_files to authenticated;
alter table public.invoice_items enable row level security;
alter table public.payment_proofs enable row level security;
alter table public.client_files enable row level security;

drop policy if exists "profiles_insert_own_client" on public.profiles;
create policy "profiles_insert_own_client" on public.profiles
  for insert to authenticated
  with check (
    id = (select auth.uid())
    and coalesce(role, 'client') = 'client'
    and coalesce(region, 'lk') in ('lk', 'pk', 'int')
  );

drop policy if exists "invoice_items_select_client_or_team" on public.invoice_items;
create policy "invoice_items_select_client_or_team" on public.invoice_items
  for select to authenticated
  using (
    app_private.is_team()
    or exists (
      select 1 from public.invoices i
      where i.id = invoice_id
        and i.client_id = (select auth.uid())
    )
  );

drop policy if exists "invoice_items_team_manage" on public.invoice_items;
create policy "invoice_items_team_manage" on public.invoice_items
  for all to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "payment_proofs_select_own_or_team" on public.payment_proofs;
create policy "payment_proofs_select_own_or_team" on public.payment_proofs
  for select to authenticated
  using (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "payment_proofs_insert_own" on public.payment_proofs;
create policy "payment_proofs_insert_own" on public.payment_proofs
  for insert to authenticated
  with check (
    client_id = (select auth.uid())
    and exists (
      select 1 from public.invoices i
      where i.id = invoice_id
        and i.client_id = (select auth.uid())
    )
  );

drop policy if exists "payment_proofs_team_manage" on public.payment_proofs;
create policy "payment_proofs_team_manage" on public.payment_proofs
  for all to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "client_files_select_own_or_team" on public.client_files;
create policy "client_files_select_own_or_team" on public.client_files
  for select to authenticated
  using (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "client_files_insert_own_or_team" on public.client_files;
create policy "client_files_insert_own_or_team" on public.client_files
  for insert to authenticated
  with check (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "client_files_team_manage" on public.client_files;
create policy "client_files_team_manage" on public.client_files
  for update to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "client_files_team_delete" on public.client_files;
create policy "client_files_team_delete" on public.client_files
  for delete to authenticated
  using (app_private.is_team());
