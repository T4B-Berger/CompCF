-- Athlete profile baseline for issue #117
-- Minimal registration-readiness profile fields for MVP progression.

alter table public.profiles
  add column if not exists first_name text;

alter table public.profiles
  add column if not exists last_name text;

alter table public.profiles
  add column if not exists date_of_birth date;

alter table public.profiles
  add column if not exists affiliate text;

alter table public.profiles
  add column if not exists city text;

alter table public.profiles
  add column if not exists country text;

alter table public.profiles
  drop constraint if exists profiles_first_name_not_blank;

alter table public.profiles
  add constraint profiles_first_name_not_blank
  check (first_name is null or length(trim(first_name)) > 0);

alter table public.profiles
  drop constraint if exists profiles_last_name_not_blank;

alter table public.profiles
  add constraint profiles_last_name_not_blank
  check (last_name is null or length(trim(last_name)) > 0);

alter table public.profiles
  drop constraint if exists profiles_country_not_blank;

alter table public.profiles
  add constraint profiles_country_not_blank
  check (country is null or length(trim(country)) > 0);

alter table public.profiles
  drop constraint if exists profiles_date_of_birth_in_past;

alter table public.profiles
  add constraint profiles_date_of_birth_in_past
  check (date_of_birth is null or date_of_birth < current_date);

comment on table public.profiles is
  'Profiles baseline includes minimal athlete registration-readiness fields (name, DOB, affiliate, city, country) without full profile system expansion.';
