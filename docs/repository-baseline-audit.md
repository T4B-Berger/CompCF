# CompCF Repository Baseline Audit

## Executive summary
CompCF already provides a usable MVP shell for CrossFit events: public event listing, auth entry, and role-gated dashboards for organizer, athlete, and admin. The core gap is not UI polish; it is **domain completeness and operational reliability** for CrossFit competition execution.

This audit keeps technical findings from the previous version and adds explicit domain modeling so implementation can proceed in a controlled order.

---

## Repository map (what is currently present)
- `app/`: Next.js App Router pages (`/`, `/events`, `/login`, `/signup`, `/organizer`, `/athlete`, `/admin`).
- `components/`: marketing shell + event card UI.
- `lib/supabaseClient.ts`: shared Supabase client using public env vars.
- Root config: Next.js, TypeScript, ESLint, Tailwind.
- Docs: default README + product narrative README variant.

Not present in repo:
- SQL migrations/schema history.
- RLS policy definitions.
- CI pipelines.
- automated test suites.

---

## Current modules and maturity

### Implemented
- Branded public pages and navigation.
- Public events page querying `events`, `event_categories`, `category_pricing_tiers`.
- Supabase email/password login and signup.
- Role-gated pages for organizer, athlete, admin.
- Organizer can create and publish basic events.

### Partial
- Registration lifecycle: visibility exists (`registration_details`) but complete creation/validation/payment flow is not modeled in-app.
- Authorization: role checks mostly live at UI level; policy layer is not versioned in repo.
- Product/domain docs: intent exists, but domain rules are not yet formalized enough for consistent implementation.

### Missing (domain-critical)
- Explicit staff and judge operating surfaces.
- Competition execution objects (workouts, heats, lanes, score entry pipeline, leaderboard engine).
- Qualification/cut progression.
- Auditable score correction lifecycle.

---

## Role model (CompCF domain baseline)

### 1) Organizer
- **Purpose:** owns competition setup and publication.
- **MVP permissions:** create/update/publish event; define divisions/categories; define pricing tiers; monitor registrations for own events.
- **Post-MVP permissions:** configure phases/heats; assign staff/judges; approve score corrections; publish official results.

### 2) Staff
- **Purpose:** supports event operations under organizer authority.
- **MVP permissions:** view assigned event operations data (check-in lists, registration status).
- **Post-MVP permissions:** manage heat logistics, lane assignments, athlete check-in status, operational incident notes.

### 3) Judge
- **Purpose:** captures performance data for assigned heats/workouts.
- **MVP permissions:** none (role exists in model but no UI yet).
- **Post-MVP permissions:** submit scores for assigned heat/workout, submit correction requests with reason, lock/unlock status per workflow policy.

### 4) Individual athlete
- **Purpose:** registers and competes as solo participant.
- **MVP permissions:** create account, browse events, register for one category within rules, track own registration status.
- **Post-MVP permissions:** submit qualification scores/media where applicable, view heat assignment and live leaderboard position.

### 5) Team captain
- **Purpose:** manages team composition and team registrations.
- **MVP permissions:** none (role not yet implemented in UI).
- **Post-MVP permissions:** create/manage team roster, register team category, confirm waivers/data for members.

### 6) Public user (spectator)
- **Purpose:** follows competitions without account requirements.
- **MVP permissions:** view published event pages and visible pricing/category info.
- **Post-MVP permissions:** view live schedule, heat status, and leaderboard updates.

---

## Workflow baselines (concrete flows)

### Organizer workflow
1. Create event metadata (name/date/location/status draft).
2. Define event divisions (e.g., RX, Scaled, Masters, Team).
3. Define categories under each division (e.g., RX Men, RX Women, Team of 2).
4. Configure pricing tiers per category (early/regular/late, validity windows, capacity constraints).
5. Publish event.
6. Monitor registrations and category fill rates.
7. (Post-MVP) configure workouts, phases, heats, lanes.
8. (Post-MVP) assign staff/judges and publish live competition artifacts.

### Athlete workflow (individual)
1. Sign up / log in.
2. Browse published events.
3. Select compatible division/category.
4. Confirm active price tier and registration eligibility.
5. Submit registration and receive status.
6. (Post-MVP) submit qualification result if required.
7. (Post-MVP) view heat assignment and final/ongoing leaderboard.

### Judge workflow (post-MVP)
1. Log in with judge role.
2. Open assigned heat/workout queue.
3. Enter score + tie-break value + notes for assigned lane/athlete/team.
4. Submit score; status moves to pending validation/official according to policy.
5. File correction with reason code when needed.
6. Track correction acceptance/rejection outcome.

### Spectator workflow
1. Open published event page.
2. View event structure (divisions/categories/pricing context).
3. (Post-MVP) view schedule/phases/heats.
4. (Post-MVP) follow live leaderboard and result updates.

---

## Data model baseline (implementation-oriented)

## Core entities
- `profiles`: identity + role anchor for authenticated users.
- `events`: competition container.
- `event_divisions`: standardized competitive buckets (RX/Scaled/Masters/Team etc.).
- `event_categories`: registerable categories within a division.
- `category_pricing_tiers`: time/capacity-based pricing windows for a category.
- `registrations`: source of truth for athlete/team registration state.
- Future competition entities:
  - `workouts`
  - `event_phases`
  - `heats`
  - `lanes`
  - `scores`
  - `leaderboards`

## Relationships (minimum expected)
- `events` 1→N `event_divisions`
- `event_divisions` 1→N `event_categories`
- `event_categories` 1→N `category_pricing_tiers`
- `event_categories` 1→N `registrations`
- `events` 1→N `workouts` (or by phase)
- `event_phases` 1→N `heats`
- `heats` 1→N `lanes`
- `scores` belongs to (`workout`, `registration`, optionally `heat/lane`)
- `leaderboards` derived from `scores` (not manually edited)

## Key constraints
- Category must belong to one division and one event.
- Registration must reference one event + one category + one competitor identity (athlete or team).
- One competitor cannot hold duplicate active registrations in same category/event.
- Pricing tier validity windows cannot overlap ambiguously for same category unless explicit priority exists.
- Score changes must be auditable (actor, timestamp, reason).

## Source-of-truth expectations
- Supabase schema + policies must become versioned in-repo.
- Repository documentation must map each domain object to concrete DB tables/views.
- Derived artifacts (leaderboards) must be recomputable from canonical score records.

---

## CrossFit-specific business model requirements (target state)

### WOD types
- Time-for-time, AMRAP, EMOM, Load/1RM, interval/hybrid types.
- Each workout type requires explicit scoring unit rules (time/reps/weight/points).

### Divisions and formats
- Individual and team formats must be first-class.
- Divisions (RX/Scaled/Masters/Adaptive) should be standardized templates with event-level overrides.

### Competition execution objects
- Phases (qualifier/semifinal/final), heats, lanes need explicit progression model.
- Cut rules must support elimination thresholds between phases.

### Scoring and tie-breaks
- Rank-based and points-based systems should both be representable.
- Tie-break fields must be modeled per workout where applicable.
- Leaderboard publication should distinguish provisional vs official states.

---

## Edge cases (realistic operational failures)

### Registration edge cases
- Pricing tier boundary race at cutoff time.
- Category full between selection and submission.
- Duplicate registration attempts by same athlete/team.
- Role mismatch (athlete trying to register restricted category).

### Competition-day edge cases
- Judge submits score to wrong lane/athlete.
- Late score correction after leaderboard already public.
- Athlete no-show / withdrawal / disqualification.
- Heat resequencing due to injury or timing drift.
- Offline/unstable connectivity during score capture.

### Governance edge cases
- Unauthorized user accesses role-only data due to missing policy.
- Conflicting score corrections from judge and head-judge/admin.
- Incomplete audit trail for result disputes.

---

## Product/architecture guidance (do-not-touch-yet)
- Do not redesign the app architecture before domain tables and constraints are stabilized.
- Do not introduce Stripe before registration, pricing, and status transitions are reliable.
- Do not build live leaderboard UX before score model + correction policy are explicit.
- Do not optimize visuals before operational workflows (organizer/staff/judge) are executable.

---

## Biggest current risks
1. No versioned DB schema/policies in repository.
2. Missing explicit data model for divisions/categories/registrations as source-of-truth docs.
3. Security/authorization confidence limited to UI checks in visible code.
4. Competition execution domain (workouts/heats/scores/leaderboards) not yet encoded.
5. No CI/test safety net for iterative delivery.
