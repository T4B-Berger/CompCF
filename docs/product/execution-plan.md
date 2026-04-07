# CompCF Execution Plan (Sprint 0 + Sprint 1)

## 1) Current project state summary
- Active project: **CompCF Product & Delivery** (`/users/T4B-Berger/projects/1`).
- Existing epics: **#53 to #68**.
- Existing seeded stories/tasks: **#69 to #100**.
- Status model is normalized (`Backlog`, `Ready`, `In Progress`, `In Review`, `Blocked`, `Done`).
- Planning docs and taxonomy already exist in `docs/product/*`.

## 2) Sprint 0 selection and rationale
Sprint 0 is intentionally foundational and short.

### Sprint 0 (5 items)
- #69 Task: Version Supabase schema and policies in-repo
- #70 Story: Role matrix and enforcement baseline
- #79 Task: CI baseline (lint + build + smoke checks)
- #80 Task: Documentation consolidation and contributor onboarding
- #74 Story: Organizer setup flow hardening before publish

### Rationale
- Establish source-of-truth and permission baseline first.
- Reduce execution risk via CI + contributor hygiene.
- De-risk organizer workflow before broad athlete/registration expansion.

## 3) Sprint 1 selection and rationale
Sprint 1 is the first coherent product-value slice after Sprint 0.

### Sprint 1 (5 items)
- #71 Story: Canonical event divisions source of truth
- #72 Story: Canonical event categories source of truth
- #73 Task: Pricing tier semantics hardening
- #74 Story: Organizer setup flow hardening before publish (carry-over if needed)
- #75 Story: Athlete registration creation flow (v1)

### Rationale
- Enforces divisions/categories/pricing reliability before registration scale-out.
- Preserves implementation order: organizer reliability before athlete workflow depth.

## 4) Ready-for-codex queue
Ranked queue (small, coherent, low-coordination work packets):
1. #70 Story: Role matrix and enforcement baseline
2. #71 Story: Canonical event divisions source of truth
3. #72 Story: Canonical event categories source of truth
4. #73 Task: Pricing tier semantics hardening
5. #74 Story: Organizer setup flow hardening before publish
6. #75 Story: Athlete registration creation flow (v1)
7. #76 Task: Registration lifecycle state model
8. #77 Story: Organizer registration visibility tooling
9. #79 Task: CI baseline (lint + build + smoke checks)
10. #80 Task: Documentation consolidation and contributor onboarding

All queue items should keep `ready-for-codex` label and project metadata aligned.

## 5) Dependency notes
- #70 blocks confidence for downstream workflow expansion.
- #71 and #72 should complete before #73 and before expanding registration behavior.
- #73 and #74 should be stable before deepening #75-#77.
- #79 should remain active to avoid quality regression during execution.

## 6) Sequencing principles
- Source of truth before feature sprawl.
- Roles/permissions before workflow expansion.
- Divisions/categories/pricing before registration depth.
- Organizer setup reliability before athlete workflow breadth.
- Keep GitHub Issues + Project metadata as the execution source of truth.

## 7) Explicitly not started yet
- Scoring/leaderboard runtime implementation.
- Volunteer runtime feature expansion.
- Stripe integration.
- Post-MVP phase work (#93+), unless specifically re-prioritized by humans.

## 8) Top unresolved decisions needing human input
1. Final v1 acceptance boundary for #75 (registration scope depth).
2. Exact role-policy strictness for organizer/staff/admin transitions.
3. Whether #74 is Sprint 0-complete or intentionally split across Sprint 0/1.
4. Preferred test gate strictness for #79 on contributor branches.
5. Release cadence expectation (weekly vs milestone-based) for Sprint review.

## Auth/profile backlog refinement (registration dependency clarity)
- Added focused backlog items #115-#118 to prevent auth/profile improvisation late in registration delivery:
  - Email verification baseline
  - Auth UX hardening
  - Athlete profile baseline
  - Registration readiness guardrails
- Sequencing intent: keep #70, #72, #73, #74 as foundations and use #115-#118 to make #75 (athlete registration flow) realistically completable.


## Market-signal refinement note
Competitor-visible expectations were reviewed and represented as focused post-MVP backlog enrichments (#108-#113) without changing current Sprint 0/Sprint 1 sequencing.

### Intentionally not pulled forward
- Scoring/leaderboard runtime delivery into MVP
- Volunteer runtime expansion ahead of core MVP foundations
- Stripe/payment scope
