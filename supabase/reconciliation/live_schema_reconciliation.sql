-- CompCF live schema reconciliation (non-destructive-first)
-- Generated as an operator-reviewed reconciliation package.
-- IMPORTANT: review and execute in stages; do not run blindly in production.

begin;

-- ============================================================================
-- SECTION A: SAFE ADDITIVE CORE PARITY (tables/columns/indexes)
-- ============================================================================

create extension if not exists pgcrypto;

-- Profiles (athlete + admin flows)
alter table if exists public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists date_of_birth date,
  add column if not exists affiliate text,
  add column if not exists city text,
  add column if not exists country text,
  add column if not exists profile_photo_url text;

-- Events/divisions/categories/pricing/registrations parity columns
alter table if exists public.event_divisions
  add column if not exists slug text;

alter table if exists public.event_categories
  add column if not exists slug text;

alter table if exists public.category_pricing_tiers
  add column if not exists sort_order integer,
  add column if not exists max_registrations integer,
  add column if not exists waitlist_enabled boolean;

alter table if exists public.registrations
  add column if not exists pricing_tier_id uuid;

-- Indexes used by current flows
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_events_organizer_id on public.events(organizer_id);
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_event_divisions_event_id on public.event_divisions(event_id);
create index if not exists idx_event_categories_event_id on public.event_categories(event_id);
create index if not exists idx_event_categories_division_id on public.event_categories(division_id);
create index if not exists idx_category_pricing_tiers_category_id on public.category_pricing_tiers(category_id);
create index if not exists idx_category_pricing_tiers_active on public.category_pricing_tiers(is_active);
create index if not exists idx_category_pricing_tiers_category_active_sort
  on public.category_pricing_tiers(category_id, is_active, sort_order);
create index if not exists idx_registrations_event_id on public.registrations(event_id);
create index if not exists idx_registrations_athlete_id on public.registrations(athlete_id);
create index if not exists idx_registrations_pricing_tier_id on public.registrations(pricing_tier_id);

-- ============================================================================
-- SECTION B: COMPATIBILITY VIEW + FUNCTION + TRIGGER PARITY
-- ============================================================================

create or replace view public.registration_details as
select
  r.id,
  r.event_id,
  r.category_id,
  r.pricing_tier_id,
  r.athlete_id,
  r.status,
  r.created_at,
  e.name as event_name,
  e.start_date as event_start_date,
  e.end_date as event_end_date,
  e.status as event_status,
  c.name as category_name,
  t.name as pricing_tier_name,
  t.price_cents as pricing_tier_price_cents,
  p.email as athlete_email
from public.registrations r
join public.events e on e.id = r.event_id
join public.event_categories c on c.id = r.category_id
left join public.category_pricing_tiers t on t.id = r.pricing_tier_id
join public.profiles p on p.id = r.athlete_id;

create or replace function public.create_athlete_registration(
  p_event_id uuid,
  p_category_id uuid
)
returns public.registrations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_now timestamptz := now();
  v_profile public.profiles%rowtype;
  v_email_verified boolean := false;
  v_registration public.registrations;
begin
  if v_user_id is null then raise exception 'AUTH_REQUIRED'; end if;

  select * into v_profile from public.profiles p where p.id = v_user_id;
  if not found or v_profile.role <> 'athlete' then raise exception 'ATHLETE_ONLY'; end if;

  select (u.email_confirmed_at is not null)
    into v_email_verified
  from auth.users u
  where u.id = v_user_id;

  if not coalesce(v_email_verified, false) then raise exception 'EMAIL_NOT_VERIFIED'; end if;
  if coalesce(trim(v_profile.first_name), '') = '' then raise exception 'PROFILE_INCOMPLETE_FIRST_NAME'; end if;
  if coalesce(trim(v_profile.last_name), '') = '' then raise exception 'PROFILE_INCOMPLETE_LAST_NAME'; end if;
  if v_profile.date_of_birth is null then raise exception 'PROFILE_INCOMPLETE_DATE_OF_BIRTH'; end if;
  if coalesce(trim(v_profile.country), '') = '' then raise exception 'PROFILE_INCOMPLETE_COUNTRY'; end if;

  if not exists (
    select 1 from public.events e
    where e.id = p_event_id and e.status = 'published'
  ) then raise exception 'EVENT_NOT_PUBLISHED'; end if;

  if not exists (
    select 1 from public.event_categories c
    where c.id = p_category_id and c.event_id = p_event_id and c.is_active = true
  ) then raise exception 'CATEGORY_NOT_ELIGIBLE'; end if;

  select t.id
    into v_registration.pricing_tier_id
  from public.category_pricing_tiers t
  where t.category_id = p_category_id
    and t.is_active = true
    and (t.starts_at is null or t.starts_at <= v_now)
    and (t.ends_at is null or t.ends_at >= v_now)
  order by t.sort_order asc, t.starts_at asc nulls first, t.created_at asc
  limit 1;

  if v_registration.pricing_tier_id is null then raise exception 'NO_ACTIVE_PRICING_TIER'; end if;

  insert into public.registrations (event_id, category_id, pricing_tier_id, athlete_id, status)
  values (p_event_id, p_category_id, v_registration.pricing_tier_id, v_user_id, 'pending')
  on conflict (event_id, category_id, athlete_id) do nothing
  returning * into v_registration;

  if v_registration.id is null then raise exception 'REGISTRATION_ALREADY_EXISTS'; end if;
  return v_registration;
end;
$$;

revoke all on function public.create_athlete_registration(uuid, uuid) from public;
grant execute on function public.create_athlete_registration(uuid, uuid) to authenticated;

-- Publish invariant functions/trigger
create or replace function public.assert_event_publish_invariants(target_event_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_active_divisions integer;
  v_active_categories integer;
  v_active_categories_without_division integer;
  v_categories_without_pricing integer;
  v_categories_with_multiple_pricing integer;
begin
  select count(*) into v_active_divisions
  from public.event_divisions d
  where d.event_id = target_event_id and d.is_active = true;

  if v_active_divisions = 0 then raise exception 'PUBLISH_BLOCKED: no active division'; end if;

  select count(*) into v_active_categories
  from public.event_categories c
  where c.event_id = target_event_id and c.is_active = true;

  if v_active_categories = 0 then raise exception 'PUBLISH_BLOCKED: no active category'; end if;

  select count(*) into v_active_categories_without_division
  from public.event_categories c
  where c.event_id = target_event_id and c.is_active = true and c.division_id is null;

  if v_active_categories_without_division > 0 then
    raise exception 'PUBLISH_BLOCKED: active category without division';
  end if;

  with active_categories as (
    select c.id
    from public.event_categories c
    where c.event_id = target_event_id and c.is_active = true
  ), valid_pricing as (
    select t.category_id, count(*) as cnt
    from public.category_pricing_tiers t
    join active_categories ac on ac.id = t.category_id
    where t.is_active = true
      and (t.starts_at is null or t.starts_at <= now())
      and (t.ends_at is null or t.ends_at >= now())
    group by t.category_id
  )
  select
    count(*) filter (where coalesce(vp.cnt,0) = 0),
    count(*) filter (where coalesce(vp.cnt,0) > 1)
  into v_categories_without_pricing, v_categories_with_multiple_pricing
  from active_categories ac
  left join valid_pricing vp on vp.category_id = ac.id;

  if v_categories_without_pricing > 0 then
    raise exception 'PUBLISH_BLOCKED: active category without valid active pricing tier';
  end if;
  if v_categories_with_multiple_pricing > 0 then
    raise exception 'PUBLISH_BLOCKED: active category with multiple valid active pricing tiers';
  end if;
end;
$$;

create or replace function public.enforce_event_publish_invariants()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'published' and old.status is distinct from 'published' then
    perform public.assert_event_publish_invariants(new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_event_publish_invariants on public.events;
create trigger trg_enforce_event_publish_invariants
before update of status on public.events
for each row
when (new.status = 'published')
execute function public.enforce_event_publish_invariants();

-- ============================================================================
-- SECTION C: POLICY PARITY (review before execute in strict environments)
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_divisions enable row level security;
alter table public.event_categories enable row level security;
alter table public.category_pricing_tiers enable row level security;
alter table public.registrations enable row level security;

-- profiles policies
 drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin'));

 drop policy if exists "profiles_update_own" on public.profiles;
 drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
  on public.profiles for update
  to authenticated
  using (
    auth.uid() = id
    or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  )
  with check (
    auth.uid() = id
    or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  );

-- events policies
 drop policy if exists "events_select_published_or_privileged" on public.events;
create policy "events_select_published_or_privileged"
  on public.events for select
  to authenticated
  using (
    status = 'published'
    or organizer_id = auth.uid()
    or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  );

 drop policy if exists "events_insert_organizer_or_admin" on public.events;
create policy "events_insert_organizer_or_admin"
  on public.events for insert
  to authenticated
  with check (
    organizer_id = auth.uid()
    or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  );

 drop policy if exists "events_update_owner_or_admin" on public.events;
create policy "events_update_owner_or_admin"
  on public.events for update
  to authenticated
  using (
    organizer_id = auth.uid()
    or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  )
  with check (
    organizer_id = auth.uid()
    or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  );

-- catalog/category/pricing/registration policies (full parity with baseline)
 drop policy if exists "catalog_select_for_published_or_privileged" on public.event_divisions;
create policy "catalog_select_for_published_or_privileged"
  on public.event_divisions for select
  to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id and (
        e.status = 'published'
        or e.organizer_id = auth.uid()
        or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
      )
    )
  );

 drop policy if exists "catalog_manage_for_owner_or_admin_divisions" on public.event_divisions;
create policy "catalog_manage_for_owner_or_admin_divisions"
  on public.event_divisions for all
  to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id and (
        e.organizer_id = auth.uid()
        or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
      )
    )
  )
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_id and (
        e.organizer_id = auth.uid()
        or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
      )
    )
  );

 drop policy if exists "categories_select_for_published_or_privileged" on public.event_categories;
create policy "categories_select_for_published_or_privileged"
  on public.event_categories for select
  to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id and (
        e.status = 'published'
        or e.organizer_id = auth.uid()
        or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
      )
    )
  );

 drop policy if exists "categories_manage_for_owner_or_admin" on public.event_categories;
create policy "categories_manage_for_owner_or_admin"
  on public.event_categories for all
  to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id and (
        e.organizer_id = auth.uid()
        or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
      )
    )
  )
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_id and (
        e.organizer_id = auth.uid()
        or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
      )
    )
  );

 drop policy if exists "pricing_select_for_published_or_privileged" on public.category_pricing_tiers;
create policy "pricing_select_for_published_or_privileged"
  on public.category_pricing_tiers for select
  to authenticated
  using (
    exists (
      select 1
      from public.event_categories c
      join public.events e on e.id = c.event_id
      where c.id = category_id and (
        e.status = 'published'
        or e.organizer_id = auth.uid()
        or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
      )
    )
  );

 drop policy if exists "pricing_manage_for_owner_or_admin" on public.category_pricing_tiers;
create policy "pricing_manage_for_owner_or_admin"
  on public.category_pricing_tiers for all
  to authenticated
  using (
    exists (
      select 1
      from public.event_categories c
      join public.events e on e.id = c.event_id
      where c.id = category_id and (
        e.organizer_id = auth.uid()
        or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
      )
    )
  )
  with check (
    exists (
      select 1
      from public.event_categories c
      join public.events e on e.id = c.event_id
      where c.id = category_id and (
        e.organizer_id = auth.uid()
        or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
      )
    )
  );

 drop policy if exists "registrations_select_actor_scope" on public.registrations;
create policy "registrations_select_actor_scope"
  on public.registrations for select
  to authenticated
  using (
    athlete_id = auth.uid()
    or exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
    or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  );

 drop policy if exists "registrations_insert_athlete_self" on public.registrations;
create policy "registrations_insert_athlete_self"
  on public.registrations for insert
  to authenticated
  with check (athlete_id = auth.uid());

 drop policy if exists "registrations_update_actor_scope" on public.registrations;
create policy "registrations_update_actor_scope"
  on public.registrations for update
  to authenticated
  using (
    athlete_id = auth.uid()
    or exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
    or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  )
  with check (
    athlete_id = auth.uid()
    or exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
    or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  );

-- Storage policy parity for profile photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('athlete-profile-photos', 'athlete-profile-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "athlete_profile_photos_public_read" on storage.objects;
create policy "athlete_profile_photos_public_read"
on storage.objects for select
to public
using (bucket_id = 'athlete-profile-photos');

drop policy if exists "athlete_profile_photos_insert_own" on storage.objects;
create policy "athlete_profile_photos_insert_own"
on storage.objects for insert
to authenticated
with check (bucket_id = 'athlete-profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "athlete_profile_photos_update_own" on storage.objects;
create policy "athlete_profile_photos_update_own"
on storage.objects for update
to authenticated
using (bucket_id = 'athlete-profile-photos' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'athlete-profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "athlete_profile_photos_delete_own" on storage.objects;
create policy "athlete_profile_photos_delete_own"
on storage.objects for delete
to authenticated
using (bucket_id = 'athlete-profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Final schema cache refresh
select pg_notify('pgrst', 'reload schema');

commit;
