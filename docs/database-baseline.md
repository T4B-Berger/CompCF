# CompCF Database Baseline (Issue #69)

## 1) Source of truth statement
This baseline captures the database objects currently used by the application code as the repository source of truth, based on Supabase usage in:
- `app/admin/page.tsx`
- `app/athlete/page.tsx`
- `app/events/page.tsx`
- `app/organizer/page.tsx`
- `lib/supabaseClient.ts`

The baseline is intentionally conservative and MVP-focused.

## 2) Included objects
Migration file: `supabase/migrations/20260407000100_schema_baseline.sql`

Included tables/views:
- `profiles`
- `events`
- `event_divisions`
- `event_categories`
- `category_pricing_tiers`
- `registrations`
- `registration_details` (compatibility view)

## 3) Intentionally excluded objects
Excluded on purpose in this baseline:
- scoring/leaderboard/heats/judging runtime tables
- volunteer runtime flow tables
- Stripe/payment tables
- speculative post-MVP objects not clearly used by current app code

## 4) Relationships
- `profiles.id -> auth.users.id`
- `events.organizer_id -> profiles.id`
- `event_divisions.event_id -> events.id`
- `event_categories.event_id -> events.id`
- `event_categories.division_id -> event_divisions.id` (nullable)
- `category_pricing_tiers.category_id -> event_categories.id`
- `registrations.event_id -> events.id`
- `registrations.category_id -> event_categories.id`
- `registrations.athlete_id -> profiles.id`
- `registration_details` joins `registrations + events + event_categories + profiles`

## 5) Key constraints
- role guardrail: `profiles.role in ('admin', 'organizer', 'athlete', 'staff', 'judge', 'team_captain', 'public_user')`
- event lifecycle: `events.status in ('draft', 'published', 'archived')`
- registration lifecycle: `registrations.status in ('pending', 'confirmed', 'cancelled')`
- date checks:
  - `events.end_date >= events.start_date`
  - pricing window validity for `category_pricing_tiers`
- uniqueness:
  - `profiles.email` unique
  - per-event division/category name uniqueness
  - one registration per `(event_id, category_id, athlete_id)`

## 6) Policy notes
RLS baseline is included for all listed tables with scope aligned to current app roles:
- Athlete: own profile + own registrations
- Organizer: own events and related catalog/registration scope
- Admin: broad read/write operational scope
- Public/anon read for published event and catalog surfaces

Because current runtime authenticates from client-side Supabase auth, policies are designed to preserve expected read/write paths while staying conservative.

## 7) Known ambiguities
1. Live Supabase project could already contain schema/policies that differ from this baseline; this migration is the repo-owned first reference point.
2. `registration_details` is treated as compatibility view based on app queries; if live object is materialized differently, align in follow-up migration.
3. Exact organizer/admin policy boundaries may need tightening after role matrix hardening (#70).
4. Trigger-based `updated_at` automation is not introduced yet to avoid accidental drift from live setup.


## Division source-of-truth baseline
- `event_divisions` now has a canonical event-scoped machine key: `slug`.
- `event_categories` enforces `(event_id, division_id)` integrity to prevent cross-event division linkage drift.
- This keeps divisions explicit and reliable for upcoming category canonicalization (#72).


## Category source-of-truth baseline
- `event_categories` now has a canonical event-scoped machine key: `slug`.
- Category naming and ordering guardrails are explicit (`name` not blank, `sort_order >= 0`).
- Canonical category identity is now stable for downstream pricing semantics (#73).


## Pricing tier semantics baseline
- Pricing tiers now enforce deterministic per-category ordering (`sort_order`) and normalized name uniqueness.
- Active pricing windows are constrained to avoid overlap per category.
- Capacity hook fields (`max_registrations`, `waitlist_enabled`) are added for future readiness without implementing waitlist runtime behavior in this step.


## Publish invariant enforcement baseline
- Event publication now has a database-backed invariant gate via trigger/function on `events.status`.
- The invariant requires: active division, active category, category->division link completeness, and exactly one currently valid active pricing tier per active category.
- Client-side checks remain for UX clarity, but publish integrity no longer depends on client logic alone.


## Athlete profile baseline
- `profiles` includes minimal athlete onboarding fields for registration readiness: `first_name`, `last_name`, `date_of_birth`, `affiliate`, `city`, `country`.
- This is intentionally a minimal MVP profile baseline (no social/community profile expansion).

## 8) Next migration priorities
1. Reconcile this baseline against a direct production/staging schema snapshot and record deltas.
2. Add safe `updated_at` triggers if confirmed compatible with live behavior.
3. Tighten role policy semantics alongside issue #70 implementation.
4. Add explicit grants/tests for `registration_details` behavior if environment-specific differences appear.
