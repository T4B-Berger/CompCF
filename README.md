# CompCF

CompCF is an open-source CrossFit competition platform focused on a practical MVP delivery path.

This repository currently includes:
- a Next.js application shell
- Supabase schema and policy baselines
- organizer publish guardrails
- athlete profile/readiness baseline
- athlete registration flow v1 (with server-side validation)
- planning and delivery documentation used by the GitHub Project workflow

## Current stack
- **Frontend/App**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend/Data**: Supabase (Postgres + Auth + RLS + SQL migrations)
- **CI**: GitHub Actions baseline workflow (`.github/workflows/ci-baseline.yml`)

## Repository layout
- `app/` — application routes and UI pages
- `components/` — reusable UI components
- `lib/` — client helpers (`supabaseClient`, auth/readiness helpers)
- `supabase/migrations/` — schema, constraints, policies, and SQL functions
- `docs/` — product, delivery, and contributor documentation

## What is implemented today (MVP baseline)
- Role/profile baseline with RLS policy scaffolding
- Event + division + category + pricing-tier data foundations
- Publish invariant enforcement on organizer event publication
- Athlete email verification and profile readiness guardrails
- Athlete registration creation flow v1:
  - published event/category discovery
  - active pricing-tier visibility
  - server-side registration creation via SQL function
  - duplicate prevention and readiness/publish checks

## Not implemented yet
- Payment handling
- Team/duo registration flow
- Waitlist promotion flow
- Advanced registration lifecycle/state machine
- Scoring execution runtime and live leaderboard operations

## Local setup
### Prerequisites
- Node.js 20+
- npm
- A Supabase project (for real auth/data flows)

### Install
```bash
npm ci
```

### Run locally
```bash
npm run dev
```

Open `http://localhost:3000`.

### Useful checks
```bash
npm run lint
npm run build
```

## Environment variables
Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

If these are missing, authenticated/runtime data features will not work correctly.

## Documentation entry points
- Contributor onboarding and safety: `docs/contributing.md`
- Database baseline and migration intent: `docs/database-baseline.md`
- Product planning docs: `docs/product/`
- Project model and field conventions: `docs/product/github-project-model.md`
- Execution sequence and readiness queue: `docs/product/execution-plan.md`

## Current state vs planned state
- **Current state** = what is implemented in app code + migrations on `main`
- **Planned state** = backlog/roadmap documentation under `docs/product/*`

When in doubt, treat runtime code and SQL migrations as source of truth, and planning docs as intent.

## Contributing
Please read `docs/contributing.md` before submitting changes.
