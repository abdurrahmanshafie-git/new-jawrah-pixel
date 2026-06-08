-- Partner Network extensions (safe to run after schema-agent-portal.sql)
alter table public.agent_profiles add column if not exists partner_id text unique;
alter table public.agent_profiles add column if not exists referral_code_customized boolean not null default false;
alter table public.agent_profiles add column if not exists partner_application_id uuid;
alter table public.agent_profiles add column if not exists partner_type text;
alter table public.agent_profiles add column if not exists network_size text;
alter table public.agent_profiles add column if not exists business_types text[] not null default '{}';
alter table public.agent_profiles add column if not exists admin_notes text;

alter table public.profiles drop constraint if exists profiles_agent_status_check;
alter table public.profiles
  add constraint profiles_agent_status_check check (
    agent_status is null
    or agent_status in ('pending', 'under_review', 'interview', 'approved', 'rejected', 'suspended')
  );

alter table public.agent_profiles drop constraint if exists agent_profiles_status_check;
alter table public.agent_profiles
  add constraint agent_profiles_status_check check (
    status in ('pending', 'under_review', 'interview', 'approved', 'rejected', 'suspended')
  );

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  name text not null check (length(trim(name)) >= 2),
  email text not null,
  whatsapp text not null,
  country text not null,
  city text not null,
  region text not null check (region in ('lk', 'pk', 'int')),
  profile_link text,
  partner_type text not null,
  experience_level text not null,
  network_size text not null,
  business_types text[] not null default '{}',
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'under_review', 'approved', 'rejected')),
  captcha_token text,
  admin_notes text,
  partner_tier text not null default 'starter' check (partner_tier in ('starter', 'growth', 'elite')),
  dashboard_enabled boolean not null default false,
  referral_tracking_enabled boolean not null default false,
  commission_ledger jsonb not null default '[]'::jsonb,
  payout_history jsonb not null default '[]'::jsonb,
  approved_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.agent_applications add column if not exists user_id uuid references public.profiles(id) on delete cascade;
alter table public.agent_applications add column if not exists partner_application_id uuid references public.partner_applications(id) on delete set null;
alter table public.agent_applications add column if not exists country text;
alter table public.agent_applications add column if not exists city text;
alter table public.agent_applications add column if not exists partner_type text;
alter table public.agent_applications add column if not exists network_size text;
alter table public.agent_applications add column if not exists business_types text[] not null default '{}';
alter table public.agent_applications add column if not exists captcha_token text;
alter table public.agent_applications drop constraint if exists agent_applications_status_check;
alter table public.agent_applications
  add constraint agent_applications_status_check check (
    status in ('pending', 'under_review', 'interview', 'approved', 'rejected', 'suspended')
  );

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'agent_profiles_partner_application_id_fkey'
      and conrelid = 'public.agent_profiles'::regclass
  ) then
    alter table public.agent_profiles
      add constraint agent_profiles_partner_application_id_fkey
      foreign key (partner_application_id) references public.partner_applications(id) on delete set null;
  end if;
end $$;

create index if not exists idx_agent_profiles_partner_id on public.agent_profiles(partner_id) where partner_id is not null;
create index if not exists idx_agent_profiles_partner_application on public.agent_profiles(partner_application_id) where partner_application_id is not null;
create index if not exists idx_partner_applications_status_region on public.partner_applications(status, region, created_at desc);
create index if not exists idx_partner_applications_email on public.partner_applications(lower(email));
create unique index if not exists idx_partner_applications_active_user on public.partner_applications(user_id)
  where status in ('pending', 'under_review', 'approved');

drop trigger if exists touch_partner_applications_updated_at on public.partner_applications;
create trigger touch_partner_applications_updated_at before update on public.partner_applications
  for each row execute function app_private.touch_updated_at();

grant select, insert, update on public.partner_applications to authenticated;
grant all on public.partner_applications to service_role;

alter table public.partner_applications enable row level security;

drop policy if exists "partner_applications_select_own_or_admin" on public.partner_applications;
create policy "partner_applications_select_own_or_admin" on public.partner_applications
  for select to authenticated
  using (user_id = (select auth.uid()) or app_private.is_admin());

drop policy if exists "partner_applications_insert_own" on public.partner_applications;
create policy "partner_applications_insert_own" on public.partner_applications
  for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "partner_applications_admin_update" on public.partner_applications;
create policy "partner_applications_admin_update" on public.partner_applications
  for update to authenticated
  using (app_private.is_admin())
  with check (app_private.is_admin());
