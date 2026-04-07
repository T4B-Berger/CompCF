-- Canonical event divisions baseline for issue #71
-- Goal: make event_divisions a stable source-of-truth object for downstream category/pricing work.

-- 1) Stable machine key per division (event-scoped)
alter table public.event_divisions
  add column if not exists slug text;

update public.event_divisions
set slug = regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g')
where slug is null and name is not null;

update public.event_divisions
set slug = trim(both '-' from slug)
where slug is not null;

-- Fallback for edge cases where sanitization results in empty key.
update public.event_divisions
set slug = 'division-' || left(replace(id::text, '-', ''), 8)
where slug = '' or slug is null;

alter table public.event_divisions
  alter column slug set not null;

create unique index if not exists uq_event_divisions_event_slug
  on public.event_divisions(event_id, slug);

-- 2) Explicit naming quality guardrail
alter table public.event_divisions
  drop constraint if exists event_divisions_name_not_blank;

alter table public.event_divisions
  add constraint event_divisions_name_not_blank
  check (length(trim(name)) > 0);

-- 3) Cross-table integrity: category division must belong to same event
-- Add supporting unique key for composite FK target.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'uq_event_divisions_event_id_id'
      and conrelid = 'public.event_divisions'::regclass
  ) then
    alter table public.event_divisions
      add constraint uq_event_divisions_event_id_id unique (event_id, id);
  end if;
end $$;

alter table public.event_categories
  drop constraint if exists event_categories_event_division_fk;

alter table public.event_categories
  add constraint event_categories_event_division_fk
  foreign key (event_id, division_id)
  references public.event_divisions(event_id, id)
  on delete set null;

comment on column public.event_divisions.slug is
  'Canonical event-scoped machine key for divisions; stable source-of-truth identifier for downstream category/pricing/registration dependencies.';
