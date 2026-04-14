# CompCF Live-vs-Repository Supabase Reconciliation Audit

Date: 2026-04-14 (UTC)

## Scope
This audit covers repository-expected schema for active product flows and attempted live inspection of the linked Supabase project.

## 1) Repository expected schema (current)
Source migrations (ordered):
- `20260407000100_schema_baseline.sql`
- `20260407000200_role_matrix_baseline.sql`
- `20260407000300_canonical_event_divisions.sql`
- `20260407000400_canonical_event_categories.sql`
- `20260407000500_pricing_tier_semantics_baseline.sql`
- `20260407000600_publish_invariant_enforcement.sql`
- `20260407000700_athlete_profile_baseline.sql`
- `20260407000800_registration_flow_v1_guardrails.sql`
- `20260407000900_athlete_profile_photo_upload.sql`
- `20260407001000_admin_profile_editing_policy.sql`
- `20260409000100_profile_schema_reconciliation.sql`

Expected core runtime objects include:
- Tables: `public.profiles`, `public.events`, `public.event_divisions`, `public.event_categories`, `public.category_pricing_tiers`, `public.registrations`
- View: `public.registration_details` (with pricing tier fields)
- Functions/triggers:
  - `public.create_athlete_registration(uuid, uuid)`
  - `public.assert_event_publish_invariants(uuid)`
  - `public.enforce_event_publish_invariants()` + trigger on `events`
- Policies: RLS policies for profiles/events/divisions/categories/pricing/registrations + storage policies for `athlete-profile-photos`

## 2) Live schema audit attempt (linked project)
Attempted management/API and CLI inspection for linked project ref `aahrssjijghypfprqthr`:
- `npx supabase login --token "$SUPABASE_ACCESS_TOKEN"` -> success
- `npx supabase link --project-ref "$SUPABASE_PROJECT_REF" --yes` -> **Forbidden**
- `npx supabase migration list` -> cannot proceed (project not linked)
- `npx supabase db diff --linked` -> cannot proceed (project not linked)
- `curl -i -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_REF"` -> HTTP 403 (proxy/connect forbidden in this runtime)

### Result
Live object-by-object introspection could not be completed from this execution environment.

## 3) Drift summary (what is known vs unknown)

### Known drift (confirmed by runtime behavior)
1. `public.profiles.affiliate` missing from runtime API schema cache in production path.
   - Severity: **Critical** (breaks athlete profile save)
   - Auto-reconcile safety: **Safe additive** (`ADD COLUMN IF NOT EXISTS`)

### Probable drift (high likelihood, not directly queried here)
2. Other athlete profile columns potentially missing where drift exists (`date_of_birth`, `city`, `country`, `profile_photo_url`).
   - Severity: **High**
   - Auto-reconcile safety: **Safe additive**

### Unknown (requires direct live inspection)
3. Constraint/index/policy/function/trigger completeness against migrations.
   - Severity: **High** (security and runtime integrity)
   - Auto-reconcile safety: **Mixed** (review required for policy/function rewrites)

## 4) Highest-risk mismatches to review first
1. `profiles` column parity (`affiliate` first, then remaining athlete columns).
2. `registration_details` view shape parity (pricing-tier fields expected by app).
3. `create_athlete_registration` function parity (guardrails + pricing tier selection).
4. publish invariant trigger/functions parity (event publication safety).
5. policy parity, especially `profiles_update_own_or_admin` and registration access policies.

## 5) Reconciliation package provided
- SQL script: `supabase/reconciliation/live_schema_reconciliation.sql`
- This script is **non-destructive by default**, additive/idempotent where possible.
- Risky/non-additive areas are called out for manual review.

## 6) Operator runbook (safe order)

### 6.1 Back up first
1. Take a full logical backup of the target DB.
2. Export `pg_dump --schema-only` snapshot for before/after diff.
3. Capture current migration status and object inventory.

### 6.2 Manual pre-checks
1. Confirm production app project ref equals migration target project ref.
2. Confirm you are using a token with management + database access.
3. Validate current schema with read-only queries before applying anything.

### 6.3 Apply order
1. Preferred authoritative path:
   - `supabase migration list`
   - `supabase db push`
   - `supabase db diff --linked`
2. If drift remains, run additive reconciliation script sections in this order:
   - Section A (columns/indexes)
   - Section B (view/function/trigger compatibility)
   - Section C (policy parity)
3. Refresh schema visibility if needed:
   - `select pg_notify('pgrst', 'reload schema');`

### 6.4 Post-run verification queries
1. Verify required profile columns exist:
```sql
select column_name, data_type
from information_schema.columns
where table_schema='public'
  and table_name='profiles'
  and column_name in ('date_of_birth','affiliate','city','country','profile_photo_url')
order by column_name;
```
2. Verify expected functions/triggers/views exist:
```sql
select routine_name from information_schema.routines
where routine_schema='public'
  and routine_name in ('create_athlete_registration','assert_event_publish_invariants','enforce_event_publish_invariants');

select trigger_name from information_schema.triggers
where event_object_schema='public'
  and event_object_table='events';

select table_name from information_schema.views
where table_schema='public' and table_name='registration_details';
```
3. Verify key policies:
```sql
select schemaname, tablename, policyname
from pg_policies
where schemaname='public'
  and tablename in ('profiles','events','event_divisions','event_categories','category_pricing_tiers','registrations')
order by tablename, policyname;
```

### 6.5 App-level validation
After reconciliation:
- Athlete profile save (country + known box + custom box + independent + photo URL)
- Registration creation via `create_athlete_registration`
- Organizer publish path (invariant enforcement)
- Admin registration correction flows

## 7) What was (not) applied live in this task
No live schema changes were applied from this run.
This task produced a reviewable reconciliation package only.
