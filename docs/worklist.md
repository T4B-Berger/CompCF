# CompCF Worklist (Baseline-driven)

This worklist is intentionally pragmatic and based on what is verifiably present in the repository today.

---

## MVP

### 1) Establish database source of truth in-repo
- **Why it matters:** current Supabase tables/views are referenced but not versioned in codebase; this blocks safe evolution.
- **Module:** data platform / Supabase
- **Type:** database
- **Priority:** P0
- **Estimated complexity:** M
- **Dependencies:** none
- **Recommended implementation order:** 1

### 2) Document and enforce auth/role model (profiles + access rules)
- **Why it matters:** role-gated pages exist, but durable security requires explicit policy documentation and enforcement plan.
- **Module:** auth & authorization
- **Type:** backend
- **Priority:** P0
- **Estimated complexity:** M
- **Dependencies:** item 1
- **Recommended implementation order:** 2

### 3) Implement registration creation flow (athlete -> event/category)
- **Why it matters:** registrations are displayed but not created through a visible user flow in repo.
- **Module:** registrations
- **Type:** product
- **Priority:** P0
- **Estimated complexity:** M
- **Dependencies:** items 1, 2
- **Recommended implementation order:** 3

### 4) Organizer event/category management hardening
- **Why it matters:** organizer can create/publish events, but category/division management is missing for standardized publishing.
- **Module:** organizer dashboard
- **Type:** frontend
- **Priority:** P0
- **Estimated complexity:** M
- **Dependencies:** items 1, 2
- **Recommended implementation order:** 4

### 5) Pricing tier CRUD and validation rules
- **Why it matters:** public events read active pricing tiers; organizer-side maintenance is needed to make feature complete.
- **Module:** pricing
- **Type:** backend
- **Priority:** P0
- **Estimated complexity:** M
- **Dependencies:** items 1, 4
- **Recommended implementation order:** 5

### 6) Error handling and UX feedback pass on data writes
- **Why it matters:** create/publish actions lack robust feedback/retry patterns, hurting reliability perception.
- **Module:** shared UX patterns
- **Type:** frontend
- **Priority:** P1
- **Estimated complexity:** S
- **Dependencies:** none
- **Recommended implementation order:** 6

### 7) Add baseline automated checks (lint + smoke test workflow)
- **Why it matters:** no CI means regressions are likely as multiple contributors iterate.
- **Module:** repo hygiene
- **Type:** infra
- **Priority:** P1
- **Estimated complexity:** S
- **Dependencies:** none
- **Recommended implementation order:** 7

### 8) Consolidate repository docs (single authoritative README + setup)
- **Why it matters:** dual README files create confusion and onboarding friction.
- **Module:** documentation
- **Type:** docs
- **Priority:** P1
- **Estimated complexity:** S
- **Dependencies:** none
- **Recommended implementation order:** 8

### 9) Introduce typed Supabase schema bindings
- **Why it matters:** reduces runtime query mismatch risk and improves developer velocity.
- **Module:** data access
- **Type:** backend
- **Priority:** P1
- **Estimated complexity:** S
- **Dependencies:** item 1
- **Recommended implementation order:** 9

### 10) Add lightweight data-access boundary layer
- **Why it matters:** direct queries in pages are fast for MVP but increase coupling and duplication.
- **Module:** application architecture
- **Type:** backend
- **Priority:** P1
- **Estimated complexity:** M
- **Dependencies:** items 1, 9
- **Recommended implementation order:** 10

---

## Post-MVP

### 11) Qualification workflow foundation
- **Why it matters:** explicitly part of product trajectory after core publication/registration.
- **Module:** qualification
- **Type:** product
- **Priority:** P1
- **Estimated complexity:** L
- **Dependencies:** items 1, 2, 3, 4
- **Recommended implementation order:** 11

### 12) Competition programming model (WOD definitions + standards)
- **Why it matters:** prerequisite for scoring and schedule coherence.
- **Module:** event programming
- **Type:** backend
- **Priority:** P1
- **Estimated complexity:** L
- **Dependencies:** items 1, 4
- **Recommended implementation order:** 12

### 13) Schedule/heats/lanes management
- **Why it matters:** core operational feature for event-day execution.
- **Module:** operations
- **Type:** product
- **Priority:** P1
- **Estimated complexity:** L
- **Dependencies:** items 1, 12
- **Recommended implementation order:** 13

### 14) Judge workflows for score input and correction
- **Why it matters:** enables controlled, accountable score capture.
- **Module:** judge tooling
- **Type:** frontend
- **Priority:** P1
- **Estimated complexity:** L
- **Dependencies:** items 2, 12, 13
- **Recommended implementation order:** 14

### 15) Live leaderboard pipeline and publication
- **Why it matters:** key product value for spectators and athletes.
- **Module:** scoring/leaderboard
- **Type:** backend
- **Priority:** P1
- **Estimated complexity:** L
- **Dependencies:** items 12, 14
- **Recommended implementation order:** 15

### 16) Audit trail/version history for score updates
- **Why it matters:** essential for trust and dispute resolution.
- **Module:** governance
- **Type:** database
- **Priority:** P1
- **Estimated complexity:** M
- **Dependencies:** items 1, 14
- **Recommended implementation order:** 16

---

## Out of scope (this phase)

### 17) Payment processing integration (Stripe)
- **Why it matters:** monetization and paid registrations are important, but intentionally deferred.
- **Module:** payments
- **Type:** backend
- **Priority:** P2
- **Estimated complexity:** L
- **Dependencies:** item 3 stabilization + pricing rules clarity
- **Recommended implementation order:** 17

### 18) Major visual redesign
- **Why it matters:** current UI is coherent enough for functional MVP iteration.
- **Module:** design system
- **Type:** frontend
- **Priority:** P2
- **Estimated complexity:** L
- **Dependencies:** product workflow stabilization
- **Recommended implementation order:** 18

### 19) Large architectural rewrite (service decomposition)
- **Why it matters:** premature for current scope/size and would slow delivery.
- **Module:** architecture
- **Type:** backend
- **Priority:** P2
- **Estimated complexity:** L
- **Dependencies:** proven scale constraints
- **Recommended implementation order:** 19

---

## Next 5 best tasks
1. Establish DB schema/migrations and policy baseline in-repo (Item 1).
2. Document + enforce auth/role model tied to DB policies (Item 2).
3. Implement athlete registration creation flow end-to-end (Item 3).
4. Add organizer category/division management to support standardization (Item 4).
5. Implement pricing tier management + constraints (Item 5).

---

## Safe first implementation candidate for Codex
**Candidate:** Item 8 — Consolidate repository docs (single authoritative README + setup).

**Why safe first:**
- documentation-only
- zero production behavior change
- reduces contributor confusion immediately
- low coupling with uncertain schema/auth decisions

**Suggested small deliverable:**
- keep one canonical README
- add setup/env section for Supabase public vars
- add explicit current capability matrix (implemented vs planned)
