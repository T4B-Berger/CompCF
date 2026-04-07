-- Publish invariant enforcement for issue #74 follow-up
-- Enforces server/database-level publish preconditions beyond client-side checks.

create or replace function public.assert_event_publish_invariants(target_event_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  active_divisions_count integer;
  active_categories_count integer;
  active_categories_missing_division integer;
  active_categories_invalid_pricing integer;
begin
  select count(*)
  into active_divisions_count
  from public.event_divisions d
  where d.event_id = target_event_id
    and d.is_active = true;

  if active_divisions_count = 0 then
    raise exception 'Publish invariant failed: at least one active division is required.';
  end if;

  select count(*)
  into active_categories_count
  from public.event_categories c
  where c.event_id = target_event_id
    and c.is_active = true;

  if active_categories_count = 0 then
    raise exception 'Publish invariant failed: at least one active category is required.';
  end if;

  select count(*)
  into active_categories_missing_division
  from public.event_categories c
  where c.event_id = target_event_id
    and c.is_active = true
    and c.division_id is null;

  if active_categories_missing_division > 0 then
    raise exception 'Publish invariant failed: every active category must be linked to a division.';
  end if;

  with active_categories as (
    select c.id
    from public.event_categories c
    where c.event_id = target_event_id
      and c.is_active = true
  ),
  valid_active_tier_counts as (
    select
      ac.id as category_id,
      count(t.id) as valid_active_tier_count
    from active_categories ac
    left join public.category_pricing_tiers t
      on t.category_id = ac.id
     and t.is_active = true
     and (t.starts_at is null or t.starts_at <= now())
     and (t.ends_at is null or t.ends_at >= now())
    group by ac.id
  )
  select count(*)
  into active_categories_invalid_pricing
  from valid_active_tier_counts vt
  where vt.valid_active_tier_count <> 1;

  if active_categories_invalid_pricing > 0 then
    raise exception 'Publish invariant failed: each active category must have exactly one currently valid active pricing tier.';
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
  if new.status = 'published' and coalesce(old.status, '') <> 'published' then
    perform public.assert_event_publish_invariants(new.id);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_event_publish_invariants on public.events;

create trigger trg_enforce_event_publish_invariants
before update of status on public.events
for each row
execute function public.enforce_event_publish_invariants();
