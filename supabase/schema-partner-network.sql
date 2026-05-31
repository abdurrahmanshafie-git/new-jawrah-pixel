-- Partner Network extensions (safe to run after schema-agent-portal.sql)
alter table public.agent_profiles add column if not exists partner_id text unique;
alter table public.agent_profiles add column if not exists referral_code_customized boolean not null default false;

create index if not exists idx_agent_profiles_partner_id on public.agent_profiles(partner_id) where partner_id is not null;
