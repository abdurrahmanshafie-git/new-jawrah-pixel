-- Jawrah Pixel Agent Portal — Phase 3
-- Safe to run after schema.sql and schema-phase2.sql

-- ---------------------------------------------------------------------------
-- Profile extensions
-- ---------------------------------------------------------------------------

alter table public.profiles add column if not exists agent_code text unique;
alter table public.profiles add column if not exists agent_status text;

alter table public.profiles drop constraint if exists profiles_agent_status_check;
alter table public.profiles
  add constraint profiles_agent_status_check check (
    agent_status is null
    or agent_status in ('pending', 'interview', 'approved', 'rejected', 'suspended')
  );

create index if not exists idx_profiles_agent_code on public.profiles(agent_code) where agent_code is not null;
create index if not exists idx_profiles_agent_status on public.profiles(agent_status) where agent_status is not null;

-- Referral attribution on core lead tables
alter table public.inquiries add column if not exists agent_code text;
alter table public.inquiries add column if not exists agent_id uuid references public.profiles(id) on delete set null;
alter table public.inquiries add column if not exists referral_source text;

alter table public.projects add column if not exists agent_code text;
alter table public.projects add column if not exists agent_id uuid references public.profiles(id) on delete set null;
alter table public.projects add column if not exists referral_source text;

-- Extend agent_applications statuses (interview + suspended path via agent_profiles)
alter table public.agent_applications drop constraint if exists agent_applications_status_check;
alter table public.agent_applications
  add constraint agent_applications_status_check check (
    status in ('pending', 'interview', 'approved', 'rejected', 'suspended')
  );

-- ---------------------------------------------------------------------------
-- Agent portal tables
-- ---------------------------------------------------------------------------

create table if not exists public.agent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  application_id uuid references public.agent_applications(id) on delete set null,
  region text not null check (region in ('lk', 'pk', 'int')),
  status text not null default 'pending' check (
    status in ('pending', 'interview', 'approved', 'rejected', 'suspended')
  ),
  tier text not null default 'bronze' check (
    tier in ('bronze', 'silver', 'gold', 'platinum', 'elite')
  ),
  completed_paid_projects integer not null default 0 check (completed_paid_projects >= 0),
  commission_rate numeric(5, 4) not null default 0.08 check (commission_rate >= 0 and commission_rate <= 1),
  whatsapp text,
  experience text,
  profile_link text,
  bio text,
  approved_at timestamptz,
  region_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_leads (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.profiles(id) on delete cascade,
  client_name text not null,
  client_email text,
  client_phone text,
  company text,
  service_interested text,
  project_value numeric(20, 2) default 0 check (project_value >= 0),
  currency text not null default 'LKR',
  region text check (region in ('lk', 'pk', 'int')),
  status text not null default 'submitted' check (
    status in (
      'submitted', 'reviewing', 'qualified', 'proposal_sent',
      'won', 'lost', 'paid', 'cancelled'
    )
  ),
  commission_estimate numeric(20, 2) default 0 check (commission_estimate >= 0),
  commission_status text default 'pending' check (
    commission_status in ('pending', 'approved', 'paid', 'rejected')
  ),
  inquiry_id uuid references public.inquiries(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  notes text,
  referral_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_commissions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.profiles(id) on delete cascade,
  agent_lead_id uuid references public.agent_leads(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  project_amount numeric(20, 2) not null default 0 check (project_amount >= 0),
  commission_rate numeric(5, 4) not null default 0.08,
  commission_amount numeric(20, 2) not null default 0 check (commission_amount >= 0),
  currency text not null default 'LKR',
  tier text check (tier in ('bronze', 'silver', 'gold', 'platinum', 'elite')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'rejected')),
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  paid_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_payouts (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(20, 2) not null check (amount > 0),
  currency text not null default 'LKR',
  method text,
  reference text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  notes text,
  paid_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_referrals (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.profiles(id) on delete cascade,
  agent_code text not null,
  visitor_session text,
  landing_path text,
  region text check (region in ('lk', 'pk', 'int')),
  converted boolean not null default false,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_tier_history (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.profiles(id) on delete cascade,
  previous_tier text,
  new_tier text not null,
  completed_projects integer not null default 0,
  commission_rate numeric(5, 4) not null,
  created_at timestamptz not null default now()
);

-- Agent ↔ Admin messaging (extends message_threads)
alter table public.message_threads add column if not exists thread_type text default 'client';
alter table public.message_threads add column if not exists agent_id uuid references public.profiles(id) on delete cascade;

alter table public.message_threads drop constraint if exists message_threads_thread_type_check;
alter table public.message_threads
  add constraint message_threads_thread_type_check check (thread_type in ('client', 'agent'));

alter table public.message_threads alter column client_id drop not null;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function app_private.agent_tier_for_count(p_count integer)
returns table (tier text, rate numeric)
language sql
immutable
as $$
  select case
    when coalesce(p_count, 0) >= 26 then 'elite'::text
    when coalesce(p_count, 0) >= 16 then 'platinum'::text
    when coalesce(p_count, 0) >= 9 then 'gold'::text
    when coalesce(p_count, 0) >= 4 then 'silver'::text
    else 'bronze'::text
  end,
  case
    when coalesce(p_count, 0) >= 26 then 0.18::numeric
    when coalesce(p_count, 0) >= 16 then 0.15::numeric
    when coalesce(p_count, 0) >= 9 then 0.12::numeric
    when coalesce(p_count, 0) >= 4 then 0.10::numeric
    else 0.08::numeric
  end;
$$;

create or replace function app_private.generate_agent_code()
returns text
language plpgsql
as $$
declare
  candidate text;
begin
  loop
    candidate := 'JP' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    exit when not exists (select 1 from public.profiles where agent_code = candidate);
  end loop;
  return candidate;
end;
$$;

create or replace function public.resolve_agent_referral(p_code text)
returns table (agent_id uuid, agent_code text, region text)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select p.id, p.agent_code, p.region
  from public.profiles p
  where p.agent_code = upper(trim(p_code))
    and p.role in ('agent', 'admin', 'superadmin')
    and p.agent_status = 'approved'
  limit 1;
$$;

grant execute on function public.resolve_agent_referral(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists idx_agent_profiles_user on public.agent_profiles(user_id);
create index if not exists idx_agent_profiles_status_region on public.agent_profiles(status, region);
create index if not exists idx_agent_leads_agent_status on public.agent_leads(agent_id, status);
create index if not exists idx_agent_commissions_agent_status on public.agent_commissions(agent_id, status);
create index if not exists idx_agent_payouts_agent on public.agent_payouts(agent_id, created_at desc);
create index if not exists idx_agent_referrals_agent on public.agent_referrals(agent_id, created_at desc);
create index if not exists idx_message_threads_agent on public.message_threads(agent_id) where thread_type = 'agent';

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

drop trigger if exists touch_agent_profiles_updated_at on public.agent_profiles;
create trigger touch_agent_profiles_updated_at before update on public.agent_profiles
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_agent_leads_updated_at on public.agent_leads;
create trigger touch_agent_leads_updated_at before update on public.agent_leads
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_agent_commissions_updated_at on public.agent_commissions;
create trigger touch_agent_commissions_updated_at before update on public.agent_commissions
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_agent_payouts_updated_at on public.agent_payouts;
create trigger touch_agent_payouts_updated_at before update on public.agent_payouts
  for each row execute function app_private.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant select, insert, update, delete on public.agent_profiles to authenticated;
grant select, insert, update, delete on public.agent_leads to authenticated;
grant select, insert, update, delete on public.agent_commissions to authenticated;
grant select, insert, update, delete on public.agent_payouts to authenticated;
grant select, insert on public.agent_referrals to anon, authenticated;
grant select on public.agent_tier_history to authenticated;
grant insert on public.agent_tier_history to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.agent_profiles enable row level security;
alter table public.agent_leads enable row level security;
alter table public.agent_commissions enable row level security;
alter table public.agent_payouts enable row level security;
alter table public.agent_referrals enable row level security;
alter table public.agent_tier_history enable row level security;

-- agent_profiles
drop policy if exists "agent_profiles_select_own_or_admin" on public.agent_profiles;
create policy "agent_profiles_select_own_or_admin" on public.agent_profiles
  for select to authenticated
  using (user_id = (select auth.uid()) or app_private.is_admin());

drop policy if exists "agent_profiles_insert_own_or_admin" on public.agent_profiles;
create policy "agent_profiles_insert_own_or_admin" on public.agent_profiles
  for insert to authenticated
  with check (user_id = (select auth.uid()) or app_private.is_admin());

drop policy if exists "agent_profiles_update_own_or_admin" on public.agent_profiles;
create policy "agent_profiles_update_own_or_admin" on public.agent_profiles
  for update to authenticated
  using (user_id = (select auth.uid()) or app_private.is_admin())
  with check (user_id = (select auth.uid()) or app_private.is_admin());

-- agent_leads
drop policy if exists "agent_leads_select_own_or_admin" on public.agent_leads;
create policy "agent_leads_select_own_or_admin" on public.agent_leads
  for select to authenticated
  using (agent_id = (select auth.uid()) or app_private.is_admin());

drop policy if exists "agent_leads_insert_own_or_admin" on public.agent_leads;
create policy "agent_leads_insert_own_or_admin" on public.agent_leads
  for insert to authenticated
  with check (agent_id = (select auth.uid()) or app_private.is_admin());

drop policy if exists "agent_leads_update_admin" on public.agent_leads;
create policy "agent_leads_update_admin" on public.agent_leads
  for update to authenticated
  using (app_private.is_admin())
  with check (app_private.is_admin());

drop policy if exists "agent_leads_update_own_draft" on public.agent_leads;
create policy "agent_leads_update_own_draft" on public.agent_leads
  for update to authenticated
  using (agent_id = (select auth.uid()) and status = 'submitted')
  with check (agent_id = (select auth.uid()));

-- agent_commissions
drop policy if exists "agent_commissions_select_own_or_admin" on public.agent_commissions;
create policy "agent_commissions_select_own_or_admin" on public.agent_commissions
  for select to authenticated
  using (agent_id = (select auth.uid()) or app_private.is_admin());

drop policy if exists "agent_commissions_admin_write" on public.agent_commissions;
create policy "agent_commissions_admin_write" on public.agent_commissions
  for all to authenticated
  using (app_private.is_admin())
  with check (app_private.is_admin());

-- agent_payouts
drop policy if exists "agent_payouts_select_own_or_admin" on public.agent_payouts;
create policy "agent_payouts_select_own_or_admin" on public.agent_payouts
  for select to authenticated
  using (agent_id = (select auth.uid()) or app_private.is_admin());

drop policy if exists "agent_payouts_admin_write" on public.agent_payouts;
create policy "agent_payouts_admin_write" on public.agent_payouts
  for all to authenticated
  using (app_private.is_admin())
  with check (app_private.is_admin());

-- agent_referrals (agents read own; public insert for tracking)
drop policy if exists "agent_referrals_select_own_or_admin" on public.agent_referrals;
create policy "agent_referrals_select_own_or_admin" on public.agent_referrals
  for select to authenticated
  using (agent_id = (select auth.uid()) or app_private.is_admin());

drop policy if exists "agent_referrals_insert_public" on public.agent_referrals;
create policy "agent_referrals_insert_public" on public.agent_referrals
  for insert to anon, authenticated
  with check (true);

-- agent_tier_history
drop policy if exists "agent_tier_history_select_own_or_admin" on public.agent_tier_history;
create policy "agent_tier_history_select_own_or_admin" on public.agent_tier_history
  for select to authenticated
  using (agent_id = (select auth.uid()) or app_private.is_admin());

drop policy if exists "agent_tier_history_admin_insert" on public.agent_tier_history;
create policy "agent_tier_history_admin_insert" on public.agent_tier_history
  for insert to authenticated
  with check (app_private.is_admin());

-- Agent message threads (extend message_threads policies)
drop policy if exists "message_threads_select" on public.message_threads;
create policy "message_threads_select" on public.message_threads
  for select to authenticated
  using (
    (thread_type = 'client' and client_id = (select auth.uid()))
    or (thread_type = 'agent' and agent_id = (select auth.uid()))
    or app_private.is_admin()
    or (thread_type = 'client' and app_private.is_team())
  );

drop policy if exists "message_threads_insert" on public.message_threads;
create policy "message_threads_insert" on public.message_threads
  for insert to authenticated
  with check (
    (thread_type = 'client' and client_id = (select auth.uid()))
    or (thread_type = 'agent' and agent_id = (select auth.uid()))
    or app_private.is_admin()
    or (thread_type = 'client' and app_private.is_team())
  );

drop policy if exists "message_threads_update" on public.message_threads;
create policy "message_threads_update" on public.message_threads
  for update to authenticated
  using (
    (thread_type = 'client' and client_id = (select auth.uid()))
    or (thread_type = 'agent' and agent_id = (select auth.uid()))
    or app_private.is_admin()
    or (thread_type = 'client' and app_private.is_team())
  )
  with check (
    (thread_type = 'client' and client_id = (select auth.uid()))
    or (thread_type = 'agent' and agent_id = (select auth.uid()))
    or app_private.is_admin()
    or (thread_type = 'client' and app_private.is_team())
  );

drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages
  for select to authenticated
  using (
    exists (
      select 1 from public.message_threads t
      where t.id = thread_id
        and (
          (t.thread_type = 'client' and t.client_id = (select auth.uid()))
          or (t.thread_type = 'agent' and t.agent_id = (select auth.uid()))
          or app_private.is_admin()
          or (t.thread_type = 'client' and app_private.is_team())
        )
    )
  );

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages
  for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and exists (
      select 1 from public.message_threads t
      where t.id = thread_id
        and (
          (t.thread_type = 'client' and t.client_id = (select auth.uid()))
          or (t.thread_type = 'agent' and t.agent_id = (select auth.uid()))
          or app_private.is_admin()
          or (t.thread_type = 'client' and app_private.is_team())
        )
    )
  );

drop policy if exists "messages_update_read" on public.messages;
create policy "messages_update_read" on public.messages
  for update to authenticated
  using (
    exists (
      select 1 from public.message_threads t
      where t.id = thread_id
        and (
          (t.thread_type = 'client' and t.client_id = (select auth.uid()))
          or (t.thread_type = 'agent' and t.agent_id = (select auth.uid()))
          or app_private.is_admin()
          or (t.thread_type = 'client' and app_private.is_team())
        )
    )
  );
