# Repository Baseline Audit — CompCF

## Executive summary
CompCF currently has a **working UI shell** and a **light Supabase-connected MVP skeleton** centered on: published events listing, auth entry points, and role-gated dashboards for athlete/organizer/admin. The codebase is an early-stage monolithic Next.js App Router project without backend API routes, without local database schema/migrations, and without CI configuration in-repo.

This baseline is useful for iterative delivery, but several core CrossFit-competition capabilities described in product intent are either partial or not implemented yet (divisions/categories management UI, registration flow creation, qualification, scoring, leaderboard, heats/schedule, judge tooling).

> Scope note: this audit is based on repository-tracked files and targeted code reads of key modules; it groups repetitive patterns and does not claim exhaustive semantic verification of every JSX branch.

---

## Repository map

### Top-level tracked areas
- `app/` — Next.js App Router pages and global layout/styles.
- `components/` — shared UI building blocks (`marketing`, `events`, `UI`).
- `lib/` — shared utility (`supabaseClient`).
- `public/` — static SVG assets.
- Root configs: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, lockfile.
- Root docs currently include a generic `README.md` and a product-vision-heavy `Readme.md`.

### Route/page inventory (implemented)
- `/` marketing landing page.
- `/events` published events listing with category active pricing lookup.
- `/login` email/password auth UI.
- `/signup` email/password signup UI.
- `/athlete` role-gated athlete dashboard.
- `/organizer` role-gated organizer dashboard.
- `/admin` role-gated admin dashboard.

---

## Current modules identified

### 1) Marketing & navigation module
- Shared `SiteHeader` + `SiteFooter` used on pages.
- Landing page communicates product promise and roles.
- Visual style: Tailwind utility-driven, dark gradient branding.

### 2) Authentication entry module
- Login/signup implemented as client pages using Supabase auth methods:
  - `signInWithPassword`
  - `signUp`
- Redirect behavior on login currently points to `/athlete` from generic login page (no role-aware routing yet).

### 3) Role-gated dashboards module (client side)
- Athlete dashboard:
  - loads profile by current auth user
  - enforces `profile.role === 'athlete'`
  - reads published events
  - reads `registration_details`, then filters client-side by athlete id
- Organizer dashboard:
  - enforces `profile.role === 'organizer'`
  - loads events list
  - creates events (minimal fields)
  - publishes events by status update
  - reads `registration_details` then filters by own event ids
- Admin dashboard:
  - enforces `profile.role === 'admin'`
  - loads profiles/events/registration_details summaries

### 4) Public events module
- Server component queries `events` and `category_pricing_tiers` from Supabase.
- Computes active pricing tier by date window + sort order.
- Renders event cards with category count and active price.

### 5) Shared data access module
- Single exported Supabase client in `lib/supabaseClient.ts` using public env vars.
- No typed database schema bindings generated in-repo.

---

## Implemented vs partial vs scaffolded vs missing

## Implemented (observable in repo)
- App Router project bootstrapped and runnable with Next.js + TypeScript + Tailwind.
- Basic branded UX and multi-page navigation.
- Supabase client configured and actively used in pages.
- Email/password auth entry flows.
- Role checks on athlete/organizer/admin dashboards.
- Public events query + active pricing display logic.
- Organizer ability to create/publish events (basic fields only).

## Partially implemented
- **Registration domain**: dashboard visibility exists via `registration_details`, but no user-facing registration creation workflow in-app.
- **Roles & authorization**: role checks are client-side in page logic; no visible server-side authorization layer in repo.
- **Product docs**: product intent exists in `Readme.md`, but ops/dev docs are minimal and partially duplicated (`README.md` vs `Readme.md`).
- **Data model visibility**: code references tables/views (`profiles`, `events`, `event_categories`, `category_pricing_tiers`, `registration_details`) but schema definitions are not versioned in this repo.

## Scaffolded / placeholder
- `next.config.ts` default placeholder config.
- `README.md` default create-next-app content.
- Some UI routes behave as MVP shell without complete domain actions.

## Missing (for stated platform direction)
- In-repo SQL migrations/schema, seed data, RLS policies, and Supabase config files.
- Qualification workflows.
- Live scoring engine and leaderboard computation/publishing.
- Scheduling/heats/lanes management.
- Judge workflow interfaces.
- Payment/checkout (Stripe intentionally deferred, but no placeholder integration path documented).
- API route layer / service layer for domain writes and secure orchestration.
- Automated tests (unit/integration/e2e) and CI pipelines.
- Deployment/IaC docs (Vercel env governance, preview/prod strategy).

---

## Stack and architecture observations
- **Stack coherence:** declared stack mostly aligns with reference (Next.js/TS/Tailwind/Supabase, GitHub). shadcn/ui is not present in tracked files yet.
- **Architecture shape:** currently page-centric with direct Supabase calls from React components; simple and fast for MVP iteration, but risks coupling UI and data access.
- **Module boundaries:** boundaries are coarse but understandable (`app/`, `components/`, `lib/`). No domain package segmentation yet.
- **Frontend consistency:** design language is coherent and reused through shared header/footer and card patterns.

---

## Supabase / schema observations
- Supabase client exists and is used across core flows.
- Environment variables required:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Repository references multiple tables/views but does not include:
  - migration history
  - canonical schema SQL
  - policy definitions
  - generated type bindings
- Because schema is externalized, repository-only review cannot fully validate data integrity assumptions or authorization safety.

---

## Code quality observations
- Positives:
  - readable TypeScript
  - consistent naming
  - straightforward control flow
  - reusable presentational components
- Risks/debt:
  - repeated auth/profile loading patterns across role pages (duplication)
  - optimistic writes without robust error handling or user feedback in some dashboard actions
  - client-side filtering of potentially broad datasets (`registration_details`) may not scale
  - role enforcement appears primarily UI-level in this repo snapshot
  - mixed documentation quality and duplicate readme naming can confuse contributors

---

## Product alignment observations
- Strong alignment with core promise for:
  - event publication visibility
  - role-separated surfaces
  - category/pricing communication on public events page
- Limited alignment today for:
  - end-to-end registration lifecycle (creation/payment/validation)
  - operational competition execution (heats/scoring/leaderboard)
  - judge-centered workflows

Net: repository is a credible **foundation prototype**, not yet a feature-complete competition platform.

---

## Risks and ambiguities
1. **Schema ownership ambiguity:** no in-repo DB source of truth.
2. **Authorization ambiguity:** absence of visible policy/versioning makes security posture hard to assess.
3. **MVP boundary ambiguity:** product README lists broad capabilities that exceed implemented behavior.
4. **Operational readiness ambiguity:** no tests/CI, so regression risk is high as scope grows.
5. **Data scaling ambiguity:** current query/filter patterns may degrade with production dataset sizes.

---

## What should not be touched yet
To keep momentum and avoid premature architecture churn:
- Do **not** redesign routing architecture right now.
- Do **not** introduce microservices or heavy abstraction layers.
- Do **not** add Stripe/payment integration before core registration workflow is explicitly stabilized.
- Do **not** implement scoring/leaderboard engine before schema and event-programming model are versioned.
- Do **not** perform broad UI refactors before domain workflows and permissions are clarified.
