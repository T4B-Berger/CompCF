-- Role matrix baseline alignment for issue #70
-- Expands accepted role values while preserving current MVP enforcement behavior.

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (
    role in (
      'admin',
      'organizer',
      'athlete',
      'staff',
      'judge',
      'team_captain',
      'public_user'
    )
  );

comment on column public.profiles.role is
  'CompCF role baseline: admin, organizer, athlete, staff, judge, team_captain, public_user. MVP enforcement currently grants elevated access to admin/organizer/athlete only.';
