-- Registration flow v1 guardrails for issue #75
-- Goal: keep creation path minimal while enforcing server-side integrity.

alter table public.registrations
  add column if not exists pricing_tier_id uuid references public.category_pricing_tiers(id) on delete restrict;

create index if not exists idx_registrations_pricing_tier_id
  on public.registrations(pricing_tier_id);

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
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into v_profile
  from public.profiles p
  where p.id = v_user_id;

  if not found or v_profile.role <> 'athlete' then
    raise exception 'ATHLETE_ONLY';
  end if;

  select (u.email_confirmed_at is not null)
  into v_email_verified
  from auth.users u
  where u.id = v_user_id;

  if not coalesce(v_email_verified, false) then
    raise exception 'EMAIL_NOT_VERIFIED';
  end if;

  if coalesce(trim(v_profile.first_name), '') = '' then
    raise exception 'PROFILE_INCOMPLETE_FIRST_NAME';
  end if;

  if coalesce(trim(v_profile.last_name), '') = '' then
    raise exception 'PROFILE_INCOMPLETE_LAST_NAME';
  end if;

  if v_profile.date_of_birth is null then
    raise exception 'PROFILE_INCOMPLETE_DATE_OF_BIRTH';
  end if;

  if coalesce(trim(v_profile.country), '') = '' then
    raise exception 'PROFILE_INCOMPLETE_COUNTRY';
  end if;

  if not exists (
    select 1
    from public.events e
    where e.id = p_event_id
      and e.status = 'published'
  ) then
    raise exception 'EVENT_NOT_PUBLISHED';
  end if;

  if not exists (
    select 1
    from public.event_categories c
    where c.id = p_category_id
      and c.event_id = p_event_id
      and c.is_active = true
  ) then
    raise exception 'CATEGORY_NOT_ELIGIBLE';
  end if;

  select t.id
  into v_registration.pricing_tier_id
  from public.category_pricing_tiers t
  where t.category_id = p_category_id
    and t.is_active = true
    and (t.starts_at is null or t.starts_at <= v_now)
    and (t.ends_at is null or t.ends_at >= v_now)
  order by t.sort_order asc, t.starts_at asc nulls first, t.created_at asc
  limit 1;

  if v_registration.pricing_tier_id is null then
    raise exception 'NO_ACTIVE_PRICING_TIER';
  end if;

  insert into public.registrations (
    event_id,
    category_id,
    pricing_tier_id,
    athlete_id,
    status
  )
  values (
    p_event_id,
    p_category_id,
    v_registration.pricing_tier_id,
    v_user_id,
    'pending'
  )
  on conflict (event_id, category_id, athlete_id) do nothing
  returning *
  into v_registration;

  if v_registration.id is null then
    raise exception 'REGISTRATION_ALREADY_EXISTS';
  end if;

  return v_registration;
end;
$$;

revoke all on function public.create_athlete_registration(uuid, uuid) from public;
grant execute on function public.create_athlete_registration(uuid, uuid) to authenticated;
