-- CompCF MVP schema baseline
-- Source: current app Supabase usage in app/{admin,athlete,events,organizer} and lib/supabaseClient.ts
-- This migration is intentionally conservative and idempotent.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('admin', 'organizer', 'athlete')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_date_window check (end_date >= start_date)
);

create index if not exists idx_events_organizer_id on public.events(organizer_id);
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_events_start_date on public.events(start_date);

-- ---------------------------------------------------------------------------
-- event_divisions
-- ---------------------------------------------------------------------------
create table if not exists public.event_divisions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(event_id, name)
);

create index if not exists idx_event_divisions_event_id on public.event_divisions(event_id);

-- ---------------------------------------------------------------------------
-- event_categories
-- ---------------------------------------------------------------------------
create table if not exists public.event_categories (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  division_id uuid references public.event_divisions(id) on delete set null,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(event_id, name)
);

create index if not exists idx_event_categories_event_id on public.event_categories(event_id);
create index if not exists idx_event_categories_division_id on public.event_categories(division_id);

-- ---------------------------------------------------------------------------
-- category_pricing_tiers
-- ---------------------------------------------------------------------------
create table if not exists public.category_pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.event_categories(id) on delete cascade,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pricing_window check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

create index if not exists idx_category_pricing_tiers_category_id on public.category_pricing_tiers(category_id);
create index if not exists idx_category_pricing_tiers_active on public.category_pricing_tiers(is_active);

-- ---------------------------------------------------------------------------
-- registrations
-- ---------------------------------------------------------------------------
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  category_id uuid not null references public.event_categories(id) on delete restrict,
  athlete_id uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_registrations_event_id on public.registrations(event_id);
create index if not exists idx_registrations_athlete_id on public.registrations(athlete_id);
create unique index if not exists uq_registrations_event_category_athlete
  on public.registrations(event_id, category_id, athlete_id);

-- ---------------------------------------------------------------------------
-- registration_details compatibility view
-- ---------------------------------------------------------------------------
create or replace view public.registration_details as
select
  r.id,
  r.event_id,
  r.category_id,
  r.athlete_id,
  r.status,
  r.created_at,
  e.name as event_name,
  e.start_date as event_start_date,
  e.end_date as event_end_date,
  e.status as event_status,
  c.name as category_name,
  p.email as athlete_email
from public.registrations r
join public.events e on e.id = r.event_id
join public.event_categories c on c.id = r.category_id
join public.profiles p on p.id = r.athlete_id;

-- ---------------------------------------------------------------------------
-- RLS baseline
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_divisions enable row level security;
alter table public.event_categories enable row level security;
alter table public.category_pricing_tiers enable row level security;
alter table public.registrations enable row level security;

-- profiles
 drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (
    auth.uid() = id
    or exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.role = 'admin'
    )
  );

 drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- events
 drop policy if exists "events_select_published_or_privileged" on public.events;
create policy "events_select_published_or_privileged"
  on public.events for select
  to authenticated, anon
  using (
    status = 'published'
    or organizer_id = auth.uid()
    or exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.role = 'admin'
    )
  );

 drop policy if exists "events_insert_organizer_or_admin" on public.events;
create policy "events_insert_organizer_or_admin"
  on public.events for insert
  to authenticated
  with check (
    organizer_id = auth.uid()
    and exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.role in ('organizer', 'admin')
    )
  );

 drop policy if exists "events_update_owner_or_admin" on public.events;
create policy "events_update_owner_or_admin"
  on public.events for update
  to authenticated
  using (
    organizer_id = auth.uid()
    or exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.role = 'admin'
    )
  )
  with check (
    organizer_id = auth.uid()
    or exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.role = 'admin'
    )
  );

-- catalog structures (divisions/categories/pricing)
 drop policy if exists "catalog_select_for_published_or_privileged" on public.event_divisions;
create policy "catalog_select_for_published_or_privileged"
  on public.event_divisions for select
  to authenticated, anon
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id
        and (
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
      where e.id = event_id
        and (
          e.organizer_id = auth.uid()
          or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
        )
    )
  )
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_id
        and (
          e.organizer_id = auth.uid()
          or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
        )
    )
  );

 drop policy if exists "categories_select_for_published_or_privileged" on public.event_categories;
create policy "categories_select_for_published_or_privileged"
  on public.event_categories for select
  to authenticated, anon
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id
        and (
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
      where e.id = event_id
        and (
          e.organizer_id = auth.uid()
          or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
        )
    )
  )
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_id
        and (
          e.organizer_id = auth.uid()
          or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
        )
    )
  );

 drop policy if exists "pricing_select_for_published_or_privileged" on public.category_pricing_tiers;
create policy "pricing_select_for_published_or_privileged"
  on public.category_pricing_tiers for select
  to authenticated, anon
  using (
    exists (
      select 1
      from public.event_categories c
      join public.events e on e.id = c.event_id
      where c.id = category_id
        and (
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
      where c.id = category_id
        and (
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
      where c.id = category_id
        and (
          e.organizer_id = auth.uid()
          or exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
        )
    )
  );

-- registrations
 drop policy if exists "registrations_select_actor_scope" on public.registrations;
create policy "registrations_select_actor_scope"
  on public.registrations for select
  to authenticated
  using (
    athlete_id = auth.uid()
    or exists (
      select 1 from public.events e
      where e.id = event_id and e.organizer_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.role = 'admin'
    )
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
    or exists (
      select 1 from public.events e
      where e.id = event_id and e.organizer_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.role = 'admin'
    )
  )
  with check (
    athlete_id = auth.uid()
    or exists (
      select 1 from public.events e
      where e.id = event_id and e.organizer_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.role = 'admin'
    )
  );

-- View access policy note:
-- registration_details reuses underlying table RLS via security_invoker semantics.
-- If your Supabase/Postgres runtime differs, add explicit grants and/or convert to secure function wrappers.
