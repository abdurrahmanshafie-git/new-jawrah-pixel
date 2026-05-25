-- Jawrah Pixel Supabase production schema
-- Execute this file in the Supabase SQL editor for a clean install.

create extension if not exists pgcrypto;

create schema if not exists app_private;
grant usage on schema app_private to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'client' check (role in ('client', 'admin', 'agent')),
  avatar_url text,
  region text check (region in ('lk', 'pk')),
  country text,
  currency text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text,
  business_name text,
  project_type text not null,
  budget text,
  preferred_date date,
  preferred_time text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'rejected')),
  region text default 'lk' check (region in ('lk', 'pk')),
  country text default 'Sri Lanka',
  currency text default 'LKR',
  source text default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  whatsapp text,
  project_type text not null,
  budget text,
  preferred_date date,
  preferred_time text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  region text default 'lk' check (region in ('lk', 'pk')),
  country text default 'Sri Lanka',
  currency text default 'LKR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  service_type text,
  status text not null default 'planning' check (status in ('planning', 'design', 'development', 'review', 'completed', 'ongoing')),
  budget text,
  deadline date,
  description text,
  progress integer default 0 check (progress between 0 and 100),
  region text default 'lk' check (region in ('lk', 'pk')),
  country text default 'Sri Lanka',
  currency text default 'LKR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'queued' check (status in ('queued', 'active', 'review', 'approved', 'complete')),
  due_date date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.revision_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  detail text not null,
  status text not null default 'submitted' check (status in ('submitted', 'in_review', 'integrating', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  invoice_number text unique not null,
  title text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'LKR',
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue', 'void')),
  due_date date,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  file_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company text,
  rating integer check (rating between 1 and 5),
  message text not null,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text,
  excerpt text,
  content text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text default 'website',
  created_at timestamptz not null default now()
);

create table if not exists public.chatbot_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_type text,
  country text,
  project_type text,
  budget_range text,
  whatsapp text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_table text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Performance indexes
-- ---------------------------------------------------------------------------

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_inquiries_status_created on public.inquiries(status, created_at desc);
create index if not exists idx_inquiries_region_created on public.inquiries(region, created_at desc);
create index if not exists idx_bookings_user_created on public.bookings(user_id, created_at desc);
create index if not exists idx_bookings_status_date on public.bookings(status, preferred_date);
create index if not exists idx_projects_client_updated on public.projects(client_id, updated_at desc);
create index if not exists idx_projects_status_region on public.projects(status, region);
create index if not exists idx_project_milestones_project_order on public.project_milestones(project_id, sort_order);
create index if not exists idx_revision_requests_client_created on public.revision_requests(client_id, created_at desc);
create index if not exists idx_support_tickets_client_status on public.support_tickets(client_id, status);
create index if not exists idx_invoices_client_status on public.invoices(client_id, status);
create index if not exists idx_notifications_user_read on public.notifications(user_id, read_at);
create index if not exists idx_chatbot_leads_status_created on public.chatbot_leads(status, created_at desc);

-- ---------------------------------------------------------------------------
-- Private authorization helpers and triggers
-- Security-definer functions live outside the exposed public schema.
-- ---------------------------------------------------------------------------

create or replace function app_private.touch_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function app_private.has_role(required_role text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = required_role
  );
$$;

create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select app_private.has_role('admin');
$$;

create or replace function app_private.is_agent()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select app_private.has_role('agent');
$$;

create or replace function app_private.is_team()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select app_private.is_admin() or app_private.is_agent();
$$;

create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  selected_region text := new.raw_user_meta_data ->> 'region';
  selected_country text;
  selected_currency text;
begin
  if selected_region not in ('lk', 'pk') then
    selected_region := null;
  end if;

  selected_country := case selected_region
    when 'pk' then 'Pakistan'
    when 'lk' then 'Sri Lanka'
    else null
  end;

  selected_currency := case selected_region
    when 'pk' then 'PKR'
    when 'lk' then 'LKR'
    else null
  end;

  insert into public.profiles (id, full_name, email, role, region, country, currency)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    'client',
    selected_region,
    coalesce(new.raw_user_meta_data ->> 'country', selected_country),
    coalesce(new.raw_user_meta_data ->> 'currency', selected_currency)
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name),
        region = coalesce(excluded.region, public.profiles.region),
        country = coalesce(excluded.country, public.profiles.country),
        currency = coalesce(excluded.currency, public.profiles.currency),
        updated_at = now();
  return new;
end;
$$;

grant execute on function app_private.has_role(text) to anon, authenticated;
grant execute on function app_private.is_admin() to anon, authenticated;
grant execute on function app_private.is_agent() to anon, authenticated;
grant execute on function app_private.is_team() to anon, authenticated;
grant execute on function app_private.touch_updated_at() to authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function app_private.handle_new_user();

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at before update on public.profiles
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_inquiries_updated_at on public.inquiries;
create trigger touch_inquiries_updated_at before update on public.inquiries
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_bookings_updated_at on public.bookings;
create trigger touch_bookings_updated_at before update on public.bookings
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_projects_updated_at on public.projects;
create trigger touch_projects_updated_at before update on public.projects
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_project_milestones_updated_at on public.project_milestones;
create trigger touch_project_milestones_updated_at before update on public.project_milestones
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_revision_requests_updated_at on public.revision_requests;
create trigger touch_revision_requests_updated_at before update on public.revision_requests
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_support_tickets_updated_at on public.support_tickets;
create trigger touch_support_tickets_updated_at before update on public.support_tickets
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_invoices_updated_at on public.invoices;
create trigger touch_invoices_updated_at before update on public.invoices
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_testimonials_updated_at on public.testimonials;
create trigger touch_testimonials_updated_at before update on public.testimonials
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_blog_posts_updated_at on public.blog_posts;
create trigger touch_blog_posts_updated_at before update on public.blog_posts
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_chatbot_leads_updated_at on public.chatbot_leads;
create trigger touch_chatbot_leads_updated_at before update on public.chatbot_leads
  for each row execute function app_private.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Data API grants
-- RLS remains the source of truth for row visibility.
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.profiles to authenticated;
grant insert on public.inquiries, public.bookings, public.newsletter_subscribers, public.chatbot_leads to anon, authenticated;
grant select, update, delete on public.inquiries, public.bookings, public.chatbot_leads to authenticated;
grant select, insert, update, delete on public.projects, public.project_milestones, public.revision_requests, public.support_tickets, public.invoices, public.project_files, public.notifications to authenticated;
grant select on public.testimonials, public.blog_posts to anon, authenticated;
grant insert, update, delete on public.testimonials, public.blog_posts to authenticated;
grant select on public.newsletter_subscribers to authenticated;
grant select, insert on public.audit_events to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security policies
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.inquiries enable row level security;
alter table public.bookings enable row level security;
alter table public.projects enable row level security;
alter table public.project_milestones enable row level security;
alter table public.revision_requests enable row level security;
alter table public.support_tickets enable row level security;
alter table public.invoices enable row level security;
alter table public.project_files enable row level security;
alter table public.notifications enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.chatbot_leads enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "profiles_select_own_or_team" on public.profiles;
create policy "profiles_select_own_or_team" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id or app_private.is_team());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id or app_private.is_admin())
  with check ((select auth.uid()) = id or app_private.is_admin());

drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin" on public.profiles
  for insert to authenticated
  with check (app_private.is_admin());

drop policy if exists "inquiries_insert_public" on public.inquiries;
create policy "inquiries_insert_public" on public.inquiries
  for insert to anon, authenticated
  with check (true);

drop policy if exists "inquiries_team_read" on public.inquiries;
create policy "inquiries_team_read" on public.inquiries
  for select to authenticated
  using (app_private.is_team());

drop policy if exists "inquiries_team_update" on public.inquiries;
create policy "inquiries_team_update" on public.inquiries
  for update to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "bookings_insert_public" on public.bookings;
create policy "bookings_insert_public" on public.bookings
  for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "bookings_select_own_or_team" on public.bookings;
create policy "bookings_select_own_or_team" on public.bookings
  for select to authenticated
  using (user_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "bookings_update_own_or_team" on public.bookings;
create policy "bookings_update_own_or_team" on public.bookings
  for update to authenticated
  using (user_id = (select auth.uid()) or app_private.is_team())
  with check (user_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "projects_select_client_or_team" on public.projects;
create policy "projects_select_client_or_team" on public.projects
  for select to authenticated
  using (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "projects_team_insert" on public.projects;
create policy "projects_team_insert" on public.projects
  for insert to authenticated
  with check (app_private.is_team());

drop policy if exists "projects_team_update" on public.projects;
create policy "projects_team_update" on public.projects
  for update to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "projects_admin_delete" on public.projects;
create policy "projects_admin_delete" on public.projects
  for delete to authenticated
  using (app_private.is_admin());

drop policy if exists "milestones_project_access" on public.project_milestones;
create policy "milestones_project_access" on public.project_milestones
  for select to authenticated
  using (
    app_private.is_team()
    or exists (
      select 1 from public.projects
      where projects.id = project_milestones.project_id
        and projects.client_id = (select auth.uid())
    )
  );

drop policy if exists "milestones_team_manage" on public.project_milestones;
create policy "milestones_team_manage" on public.project_milestones
  for all to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "revision_select_own_or_team" on public.revision_requests;
create policy "revision_select_own_or_team" on public.revision_requests
  for select to authenticated
  using (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "revision_insert_own_or_team" on public.revision_requests;
create policy "revision_insert_own_or_team" on public.revision_requests
  for insert to authenticated
  with check (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "revision_update_team" on public.revision_requests;
create policy "revision_update_team" on public.revision_requests
  for update to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "tickets_select_own_or_team" on public.support_tickets;
create policy "tickets_select_own_or_team" on public.support_tickets
  for select to authenticated
  using (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "tickets_insert_own_or_team" on public.support_tickets;
create policy "tickets_insert_own_or_team" on public.support_tickets
  for insert to authenticated
  with check (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "tickets_update_team" on public.support_tickets;
create policy "tickets_update_team" on public.support_tickets
  for update to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "invoices_select_client_or_team" on public.invoices;
create policy "invoices_select_client_or_team" on public.invoices
  for select to authenticated
  using (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "invoices_team_manage" on public.invoices;
create policy "invoices_team_manage" on public.invoices
  for all to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "files_select_client_or_team" on public.project_files;
create policy "files_select_client_or_team" on public.project_files
  for select to authenticated
  using (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "files_insert_client_or_team" on public.project_files;
create policy "files_insert_client_or_team" on public.project_files
  for insert to authenticated
  with check (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "files_team_delete" on public.project_files;
create policy "files_team_delete" on public.project_files
  for delete to authenticated
  using (app_private.is_team());

drop policy if exists "notifications_select_own_or_team" on public.notifications;
create policy "notifications_select_own_or_team" on public.notifications
  for select to authenticated
  using (user_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "notifications_team_insert" on public.notifications;
create policy "notifications_team_insert" on public.notifications
  for insert to authenticated
  with check (app_private.is_team());

drop policy if exists "testimonials_public_active" on public.testimonials;
create policy "testimonials_public_active" on public.testimonials
  for select to anon, authenticated
  using (active = true or app_private.is_admin());

drop policy if exists "testimonials_admin_manage" on public.testimonials;
create policy "testimonials_admin_manage" on public.testimonials
  for all to authenticated
  using (app_private.is_admin())
  with check (app_private.is_admin());

drop policy if exists "blog_public_published" on public.blog_posts;
create policy "blog_public_published" on public.blog_posts
  for select to anon, authenticated
  using (published = true or app_private.is_admin());

drop policy if exists "blog_admin_manage" on public.blog_posts;
create policy "blog_admin_manage" on public.blog_posts
  for all to authenticated
  using (app_private.is_admin())
  with check (app_private.is_admin());

drop policy if exists "newsletter_insert_public" on public.newsletter_subscribers;
create policy "newsletter_insert_public" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (true);

drop policy if exists "newsletter_admin_select" on public.newsletter_subscribers;
create policy "newsletter_admin_select" on public.newsletter_subscribers
  for select to authenticated
  using (app_private.is_admin());

drop policy if exists "chatbot_insert_public" on public.chatbot_leads;
create policy "chatbot_insert_public" on public.chatbot_leads
  for insert to anon, authenticated
  with check (true);

drop policy if exists "chatbot_team_read_update" on public.chatbot_leads;
create policy "chatbot_team_read_update" on public.chatbot_leads
  for all to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "audit_team_read" on public.audit_events;
create policy "audit_team_read" on public.audit_events
  for select to authenticated
  using (app_private.is_team());

drop policy if exists "audit_insert_authenticated" on public.audit_events;
create policy "audit_insert_authenticated" on public.audit_events
  for insert to authenticated
  with check (actor_id = (select auth.uid()) or app_private.is_team());
