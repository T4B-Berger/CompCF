# CompCF Role Matrix and Enforcement Baseline (Issue #70)

## 1) Roles
- `admin`
- `organizer`
- `athlete` (individual athlete)
- `staff`
- `judge`
- `team_captain`
- `public_user`

## 2) Purpose of each role
- **admin:** platform-level governance, operations oversight, and high-trust support access.
- **organizer:** owns event setup/publication and organizer-side event operations.
- **athlete:** manages own account context and competition participation records.
- **staff:** operational support role for event execution (future scoped rollout).
- **judge:** judging-specific operational role (future scoped rollout).
- **team_captain:** team coordination role for team registrations (future scoped rollout).
- **public_user:** read-oriented non-operational role for public-facing surfaces.

## 3) MVP permissions
Current enforced MVP baseline is intentionally narrow:
- **admin**
  - broad operational access in current RLS baseline.
- **organizer**
  - manage own events and related catalog data.
  - view/manage registrations scoped to own events.
- **athlete**
  - access own profile and own registrations.
- **staff / judge / team_captain / public_user**
  - role values are now formalized in schema, but elevated permissions are not granted by default in MVP baseline.

## 4) Post-MVP permissions (planned direction)
- **staff:** controlled event-operations access (non-admin) for assigned events.
- **judge:** assignment-scoped judging and score entry permissions.
- **team_captain:** team roster and team registration control boundaries.
- **public_user:** durable public-read surfaces without authenticated operational access.

## 5) Enforcement boundary notes
- Source of truth for role values is `public.profiles.role`.
- Role enforcement is primarily via Supabase RLS policies on domain tables.
- Client-side route gating (admin/organizer/athlete pages) remains a UX guard and is **not** the primary security boundary.
- Unknown or unsupported role values are denied by schema constraint.

## 6) Current limitations
1. `staff`, `judge`, `team_captain`, and `public_user` do not yet have dedicated policy sets.
2. No assignment-based authorization model is introduced in this baseline.
3. No fine-grained permission matrix for sub-actions (publish vs edit vs audit) yet.
4. Existing runtime pages remain focused on `admin` / `organizer` / `athlete` experience.

## 7) Next enforcement priorities
1. Add assignment-aware policies for `staff` and `judge` once corresponding MVP runtime flows exist.
2. Add team-scoped policy boundaries for `team_captain` when team registration workflows are in scope.
3. Split broad admin powers into clearer policy groups where needed.
4. Add policy validation tests (SQL-level) for allow/deny role scenarios.
