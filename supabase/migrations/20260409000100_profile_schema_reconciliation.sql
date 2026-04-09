-- Reconcile live profile schema drift for athlete profile save.
-- Ensures athlete profile baseline fields exist in environments that missed earlier migration(s).

alter table public.profiles
  add column if not exists date_of_birth date;

alter table public.profiles
  add column if not exists affiliate text;

alter table public.profiles
  add column if not exists city text;

alter table public.profiles
  add column if not exists country text;

-- Ensure PostgREST sees the updated columns immediately in live environments.
select pg_notify('pgrst', 'reload schema');
