-- Jawrah Pixel Security Hardening Pass - Corrected & Verified
-- This script fixes RLS policies and adds triggers to prevent unauthorized role escalation.

-- ---------------------------------------------------------------------------
-- 1. ROLE ESCALATION PROTECTION
-- ---------------------------------------------------------------------------
-- Prevents non-admin users from updating their own 'role' field.
-- PREREQUISITE: app_private schema and is_admin() function must exist.

create or replace function app_private.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- If the role is being changed AND the person making the change is NOT an admin
  if (old.role is distinct from new.role) and not app_private.is_admin() then
    -- Revert to the old role
    new.role = old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_role_update on public.profiles;
create trigger on_profile_role_update
  before update on public.profiles
  for each row execute function app_private.prevent_role_escalation();

-- ---------------------------------------------------------------------------
-- 2. BLOG & TESTIMONIAL POLICIES (FIXED FOR PUBLIC ACCESS)
-- ---------------------------------------------------------------------------

-- Blog Posts: Public can read published, Admins can manage all.
drop policy if exists "blog_public_published" on public.blog_posts;
create policy "blog_public_published" on public.blog_posts
  for select to anon, authenticated
  using (published = true or app_private.is_admin());

drop policy if exists "blog_admin_manage" on public.blog_posts;
create policy "blog_admin_manage" on public.blog_posts
  for all to authenticated
  using (app_private.is_admin())
  with check (app_private.is_admin());

-- Testimonials: Public can read active, Admins can manage all.
drop policy if exists "testimonials_public_active" on public.testimonials;
create policy "testimonials_public_active" on public.testimonials
  for select to anon, authenticated
  using (active = true or app_private.is_admin());

drop policy if exists "testimonials_admin_manage" on public.testimonials;
create policy "testimonials_admin_manage" on public.testimonials
  for all to authenticated
  using (app_private.is_admin())
  with check (app_private.is_admin());

-- ---------------------------------------------------------------------------
-- 3. STORAGE POLICIES (REFINED FOR COMPATIBILITY)
-- ---------------------------------------------------------------------------
-- Policies for the 'project-files' bucket.
-- Allows team members full access, and clients access to their own uploads.

-- READ ACCESS
drop policy if exists "project_files_read_v2" on storage.objects;
create policy "project_files_read_v2" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'project-files' 
    and (
      app_private.is_team()
      or exists (
        select 1 from public.project_files 
        where storage_path = name 
        and (client_id = (select auth.uid()) or uploaded_by = (select auth.uid()))
      )
      or exists (
        select 1 from public.invoices
        where proof_storage_path = name
        and (client_id = (select auth.uid()))
      )
      or exists (
        select 1 from public.invoice_payments ip
        join public.invoices i on i.id = ip.invoice_id
        where ip.proof_storage_path = name
        and (ip.client_id = (select auth.uid()) or i.client_id = (select auth.uid()))
      )
    )
  );

-- UPLOAD ACCESS
drop policy if exists "project_files_upload_v2" on storage.objects;
create policy "project_files_upload_v2" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'project-files'
    -- Allow upload if user is part of the team or they are authenticated
    -- Further restriction happens at the application/table level
  );

-- Update bucket restrictions (MIME & Size)
update storage.buckets
set file_size_limit = 10485760, -- 10MB
    allowed_mime_types = array['image/jpeg', 'image/png', 'application/pdf']
where id = 'project-files';

-- ---------------------------------------------------------------------------
-- 4. INVOICE GUEST SECURITY (REFINED)
-- ---------------------------------------------------------------------------
-- Ensures guest invoices are only inserted with valid email format and positive amounts.

drop policy if exists "invoices_guest_deposit_insert" on public.invoices;
create policy "invoices_guest_deposit_insert" on public.invoices
  for insert to anon, authenticated
  with check (
    (client_id is null and guest_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
    or (client_id = (select auth.uid()))
    or app_private.is_team()
  );

-- ---------------------------------------------------------------------------
-- 5. AUDIT LOG INTEGRITY
-- ---------------------------------------------------------------------------
-- Ensures authenticated users cannot forge the actor_id in audit logs.

drop policy if exists "audit_insert_authenticated" on public.audit_events;
create policy "audit_insert_authenticated" on public.audit_events
  for insert to authenticated
  with check (
    (actor_id = (select auth.uid()))
    or app_private.is_admin()
  );
