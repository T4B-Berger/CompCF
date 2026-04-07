-- Canonical event categories baseline for issue #72
-- Goal: make event_categories a stable source-of-truth object aligned with canonical divisions.

-- 1) Stable machine key per category (event-scoped)
alter table public.event_categories
  add column if not exists slug text;

update public.event_categories
set slug = regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g')
where slug is null and name is not null;

update public.event_categories
set slug = trim(both '-' from slug)
where slug is not null;

-- Fallback for edge cases where sanitization results in empty key.
update public.event_categories
set slug = 'category-' || left(replace(id::text, '-', ''), 8)
where slug = '' or slug is null;

alter table public.event_categories
  alter column slug set not null;

create unique index if not exists uq_event_categories_event_slug
  on public.event_categories(event_id, slug);

-- 2) Explicit category naming and ordering guardrails
alter table public.event_categories
  drop constraint if exists event_categories_name_not_blank;

alter table public.event_categories
  add constraint event_categories_name_not_blank
  check (length(trim(name)) > 0);

alter table public.event_categories
  drop constraint if exists event_categories_sort_order_non_negative;

alter table public.event_categories
  add constraint event_categories_sort_order_non_negative
  check (sort_order >= 0);

create index if not exists idx_event_categories_event_division_sort
  on public.event_categories(event_id, division_id, sort_order, created_at);

comment on column public.event_categories.slug is
  'Canonical event-scoped machine key for categories; stable identifier for pricing and registration dependencies.';
