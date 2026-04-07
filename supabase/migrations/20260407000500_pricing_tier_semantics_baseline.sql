-- Pricing tier semantics hardening baseline for issue #73
-- Goal: make category_pricing_tiers ordering/window semantics explicit and reliable.

create extension if not exists btree_gist;

-- 1) Tier quality and ordering guardrails
alter table public.category_pricing_tiers
  drop constraint if exists category_pricing_tiers_name_not_blank;

alter table public.category_pricing_tiers
  add constraint category_pricing_tiers_name_not_blank
  check (length(trim(name)) > 0);

alter table public.category_pricing_tiers
  drop constraint if exists category_pricing_tiers_sort_order_non_negative;

alter table public.category_pricing_tiers
  add constraint category_pricing_tiers_sort_order_non_negative
  check (sort_order >= 0);

create unique index if not exists uq_category_pricing_tiers_category_sort
  on public.category_pricing_tiers(category_id, sort_order);

create unique index if not exists uq_category_pricing_tiers_category_name
  on public.category_pricing_tiers(category_id, lower(trim(name)));

-- 2) Capacity/readiness hooks (no waitlist behavior implementation yet)
alter table public.category_pricing_tiers
  add column if not exists max_registrations integer;

alter table public.category_pricing_tiers
  add column if not exists waitlist_enabled boolean not null default false;

alter table public.category_pricing_tiers
  drop constraint if exists category_pricing_tiers_max_registrations_non_negative;

alter table public.category_pricing_tiers
  add constraint category_pricing_tiers_max_registrations_non_negative
  check (max_registrations is null or max_registrations >= 0);

-- 3) Active-tier window disambiguation per category
-- Prevent overlapping active windows inside the same category.
alter table public.category_pricing_tiers
  drop constraint if exists category_pricing_tiers_active_window_no_overlap;

alter table public.category_pricing_tiers
  add constraint category_pricing_tiers_active_window_no_overlap
  exclude using gist (
    category_id with =,
    tstzrange(
      coalesce(starts_at, '-infinity'::timestamptz),
      coalesce(ends_at, 'infinity'::timestamptz),
      '[]'
    ) with &&
  )
  where (is_active);

create index if not exists idx_category_pricing_tiers_category_active_sort
  on public.category_pricing_tiers(category_id, is_active, sort_order, starts_at, ends_at);

comment on table public.category_pricing_tiers is
  'Canonical category pricing tiers: deterministic ordering, non-overlapping active windows per category, and capacity hook fields for future registration controls.';
