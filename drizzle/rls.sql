-- CyberNurdin Row Level Security policies.
-- Run once against the Supabase project: paste into the SQL editor, or
--   psql "$DATABASE_URL" -f drizzle/rls.sql
-- Safe to re-run (uses "drop policy if exists" before each create).

-- Helper: avoids infinite recursion when a policy on `profiles` itself needs
-- to check the caller's role (a normal RLS check on profiles.role from
-- inside a profiles policy would recurse). SECURITY DEFINER runs this
-- function with the privileges of its owner, bypassing RLS for this one
-- narrow lookup only.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============ applications ============
alter table public.applications enable row level security;

drop policy if exists "applications_public_insert" on public.applications;
create policy "applications_public_insert"
  on public.applications for insert
  to anon, authenticated
  with check (true);

drop policy if exists "applications_admin_select" on public.applications;
create policy "applications_admin_select"
  on public.applications for select
  to authenticated
  using (public.is_admin());

drop policy if exists "applications_admin_update" on public.applications;
create policy "applications_admin_update"
  on public.applications for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============ profiles ============
alter table public.profiles enable row level security;

drop policy if exists "profiles_own_select" on public.profiles;
create policy "profiles_own_select"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "profiles_admin_select" on public.profiles;
create policy "profiles_admin_select"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No insert/update policy for regular users: profile rows are only ever
-- created/updated by server-side code using the service role (activation,
-- admin actions), which bypasses RLS entirely. This is what enforces
-- "user cannot update role/access_status".

-- ============ coupons ============
alter table public.coupons enable row level security;
-- Intentionally no policies for anon/authenticated: coupons are only ever
-- read or written by server-side code using the service role. Activation
-- and coupon generation happen exclusively in Server Actions.

-- ============ enrollments ============
alter table public.enrollments enable row level security;

drop policy if exists "enrollments_own_select" on public.enrollments;
create policy "enrollments_own_select"
  on public.enrollments for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "enrollments_admin_all" on public.enrollments;
create policy "enrollments_admin_all"
  on public.enrollments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============ submissions ============
alter table public.submissions enable row level security;

drop policy if exists "submissions_own_select" on public.submissions;
create policy "submissions_own_select"
  on public.submissions for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "submissions_own_insert" on public.submissions;
create policy "submissions_own_insert"
  on public.submissions for insert
  to authenticated
  with check (user_id = auth.uid());

-- No update policy for regular users — mentees cannot approve/reject their
-- own submissions. Only admins (below) or server-side service-role code can.
drop policy if exists "submissions_admin_all" on public.submissions;
create policy "submissions_admin_all"
  on public.submissions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============ mentor_feedback ============
alter table public.mentor_feedback enable row level security;

drop policy if exists "mentor_feedback_own_select" on public.mentor_feedback;
create policy "mentor_feedback_own_select"
  on public.mentor_feedback for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "mentor_feedback_admin_all" on public.mentor_feedback;
create policy "mentor_feedback_admin_all"
  on public.mentor_feedback for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============ course_progress ============
alter table public.course_progress enable row level security;

drop policy if exists "course_progress_own_select" on public.course_progress;
create policy "course_progress_own_select"
  on public.course_progress for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "course_progress_admin_all" on public.course_progress;
create policy "course_progress_admin_all"
  on public.course_progress for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
