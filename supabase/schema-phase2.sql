-- Jawrah Pixel Phase 2 — Business Ecosystem Expansion
-- Run after schema.sql in Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- Project lifecycle migration
-- ---------------------------------------------------------------------------

alter table public.projects drop constraint if exists projects_status_check;

update public.projects set status = case status
  when 'new lead' then 'lead'
  when 'contacted' then 'discovery'
  when 'proposal sent' then 'planning'
  when 'payment pending' then 'planning'
  when 'project active' then 'development'
  when 'delivered' then 'completed'
  when 'maintenance' then 'completed'
  else coalesce(status, 'lead')
end;

alter table public.projects
  add constraint projects_status_check check (status in (
    'lead', 'discovery', 'planning', 'design', 'development',
    'testing', 'revision', 'deployment', 'completed'
  ));

alter table public.projects add column if not exists assigned_to uuid references public.profiles(id) on delete set null;
alter table public.projects add column if not exists estimated_completion date;

-- ---------------------------------------------------------------------------
-- CRM pipeline migration
-- ---------------------------------------------------------------------------

alter table public.inquiries drop constraint if exists inquiries_status_check;

update public.inquiries set status = case status
  when 'contacted' then 'qualified'
  when 'closed' then 'won'
  when 'rejected' then 'lost'
  else status
end;

alter table public.inquiries
  add constraint inquiries_status_check check (status in (
    'new', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'
  ));

alter table public.inquiries add column if not exists company text;
alter table public.inquiries add column if not exists phone text;

-- ---------------------------------------------------------------------------
-- Invoice pending status alias
-- ---------------------------------------------------------------------------

alter table public.invoices drop constraint if exists invoices_status_check;

update public.invoices set status = case
  when status = 'sent' then 'pending'
  else status
end;

alter table public.invoices
  add constraint invoices_status_check check (status in (
    'draft', 'pending', 'paid', 'overdue', 'void'
  ));

-- ---------------------------------------------------------------------------
-- Phase 2 tables
-- ---------------------------------------------------------------------------

create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  status text not null,
  progress integer default 0 check (progress between 0 and 100),
  title text not null,
  body text,
  assigned_to uuid references public.profiles(id) on delete set null,
  estimated_completion date,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  proposal_number text unique not null,
  client_id uuid references public.profiles(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  title text not null,
  scope_of_work text,
  timeline text,
  deliverables text,
  pricing numeric(20, 2) default 0 check (pricing >= 0),
  currency text not null default 'LKR',
  terms text,
  status text not null default 'draft' check (status in ('draft', 'sent', 'viewed', 'accepted', 'rejected')),
  region text check (region in ('lk', 'pk', 'int')),
  sent_at timestamptz,
  viewed_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  subject text not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  attachment_path text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_applications (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid references public.inquiries(id) on delete set null,
  applicant_name text not null,
  applicant_email text not null,
  whatsapp text,
  region text check (region in ('lk', 'pk', 'int')),
  experience text,
  profile_link text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'interview', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_files add column if not exists file_category text default 'project';
alter table public.project_files drop constraint if exists project_files_file_category_check;
alter table public.project_files add constraint project_files_file_category_check
  check (file_category in ('project', 'contract', 'invoice', 'proposal', 'asset'));

alter table public.chatbot_leads add column if not exists region text check (region in ('lk', 'pk', 'int'));

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists idx_project_updates_project_created on public.project_updates(project_id, created_at desc);
create index if not exists idx_proposals_client_status on public.proposals(client_id, status);
create index if not exists idx_proposals_region_created on public.proposals(region, created_at desc);
create index if not exists idx_message_threads_client_updated on public.message_threads(client_id, updated_at desc);
create index if not exists idx_messages_thread_created on public.messages(thread_id, created_at asc);
create index if not exists idx_agent_applications_status on public.agent_applications(status, created_at desc);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

drop trigger if exists touch_proposals_updated_at on public.proposals;
create trigger touch_proposals_updated_at before update on public.proposals
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_message_threads_updated_at on public.message_threads;
create trigger touch_message_threads_updated_at before update on public.message_threads
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_agent_applications_updated_at on public.agent_applications;
create trigger touch_agent_applications_updated_at before update on public.agent_applications
  for each row execute function app_private.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Storage bucket for project files
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-files',
  'project-files',
  false,
  52428800,
  array['image/jpeg','image/png','image/webp','image/gif','application/pdf','application/zip','text/plain','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant select, insert, update, delete on public.project_updates to authenticated;
grant select, insert, update, delete on public.proposals to authenticated;
grant select, insert, update, delete on public.message_threads to authenticated;
grant select, insert, update, delete on public.messages to authenticated;
grant select, insert, update, delete on public.agent_applications to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.project_updates enable row level security;
alter table public.proposals enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.agent_applications enable row level security;

drop policy if exists "project_updates_select" on public.project_updates;
create policy "project_updates_select" on public.project_updates
  for select to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and (p.client_id = (select auth.uid()) or app_private.is_team())
    )
  );

drop policy if exists "project_updates_team_write" on public.project_updates;
create policy "project_updates_team_write" on public.project_updates
  for all to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "proposals_select_own_or_team" on public.proposals;
create policy "proposals_select_own_or_team" on public.proposals
  for select to authenticated
  using (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "proposals_team_write" on public.proposals;
create policy "proposals_team_write" on public.proposals
  for all to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "proposals_client_accept" on public.proposals;
create policy "proposals_client_accept" on public.proposals
  for update to authenticated
  using (client_id = (select auth.uid()))
  with check (client_id = (select auth.uid()));

drop policy if exists "message_threads_select" on public.message_threads;
create policy "message_threads_select" on public.message_threads
  for select to authenticated
  using (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "message_threads_insert" on public.message_threads;
create policy "message_threads_insert" on public.message_threads
  for insert to authenticated
  with check (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "message_threads_update" on public.message_threads;
create policy "message_threads_update" on public.message_threads
  for update to authenticated
  using (client_id = (select auth.uid()) or app_private.is_team())
  with check (client_id = (select auth.uid()) or app_private.is_team());

drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages
  for select to authenticated
  using (
    exists (
      select 1 from public.message_threads t
      where t.id = thread_id
        and (t.client_id = (select auth.uid()) or app_private.is_team())
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
        and (t.client_id = (select auth.uid()) or app_private.is_team())
    )
  );

drop policy if exists "messages_update_read" on public.messages;
create policy "messages_update_read" on public.messages
  for update to authenticated
  using (
    exists (
      select 1 from public.message_threads t
      where t.id = thread_id
        and (t.client_id = (select auth.uid()) or app_private.is_team())
    )
  );

drop policy if exists "agent_applications_team" on public.agent_applications;
create policy "agent_applications_team" on public.agent_applications
  for all to authenticated
  using (app_private.is_team())
  with check (app_private.is_team());

drop policy if exists "agent_applications_insert_public" on public.agent_applications;
create policy "agent_applications_insert_public" on public.agent_applications
  for insert to authenticated
  with check (true);

-- Storage policies
drop policy if exists "project_files_upload" on storage.objects;
create policy "project_files_upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-files');

drop policy if exists "project_files_read" on storage.objects;
create policy "project_files_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'project-files');

drop policy if exists "project_files_delete_team" on storage.objects;
create policy "project_files_delete_team" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-files' and app_private.is_team());
