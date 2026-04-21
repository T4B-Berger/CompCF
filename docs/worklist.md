# CompCF Execution Worklist

This worklist is ordered for implementation, not theme grouping. It prioritizes domain correctness before feature surface expansion.

---

## MVP (true execution order)

### 1) Version Supabase schema and policies in-repo
- **Why it matters:** current domain cannot be safely evolved without a versioned DB source of truth.
- **Module:** data platform
- **Type:** database
- **Priority:** P0
- **Estimated complexity:** M
- **Dependencies:** none
- **Recommended implementation order:** 1

### 2) Formalize role matrix (organizer/staff/judge/athlete/team captain/public)
- **Why it matters:** permissions must be explicit before workflow implementation.
- **Module:** auth + authorization
- **Type:** backend
- **Priority:** P0
- **Estimated complexity:** S
- **Dependencies:** item 1
- **Recommended implementation order:** 2

### 3) Implement event divisions and categories source-of-truth
- **Why it matters:** registration is invalid without reliable division/category structure.
- **Module:** competition setup
- **Type:** database
- **Priority:** P0
- **Estimated complexity:** M
- **Dependencies:** items 1, 2
- **Recommended implementation order:** 3

### 4) Implement category pricing tier reliability (windows, priority, capacity hooks)
- **Why it matters:** registration price and eligibility depend on correct tier logic.
- **Module:** pricing
- **Type:** backend
- **Priority:** P0
- **Estimated complexity:** M
- **Dependencies:** item 3
- **Recommended implementation order:** 4

### 5) Organizer setup workflow hardening (event -> division -> category -> pricing -> publish)
- **Why it matters:** ensures published events are structurally valid before athletes register.
- **Module:** organizer dashboard
- **Type:** frontend
- **Priority:** P0
- **Estimated complexity:** M
- **Dependencies:** items 3, 4
- **Recommended implementation order:** 5

### 6) Build athlete registration creation flow with eligibility validation
- **Why it matters:** core product value requires end-to-end registration, not only listing visibility.
- **Module:** registrations
- **Type:** product
- **Priority:** P0
- **Estimated complexity:** M
- **Dependencies:** items 2, 3, 4, 5
- **Recommended implementation order:** 6

### 7) Registration lifecycle states and organizer visibility tooling
- **Why it matters:** organizer needs actionable status management (pending/confirmed/cancelled/etc.).
- **Module:** registrations
- **Type:** backend
- **Priority:** P1
- **Estimated complexity:** M
- **Dependencies:** item 6
- **Recommended implementation order:** 7

### 8) Baseline operational resilience (error UX + guardrails + logging hooks)
- **Why it matters:** current write paths are optimistic and fragile under failure.
- **Module:** shared app behavior
- **Type:** frontend
- **Priority:** P1
- **Estimated complexity:** S
- **Dependencies:** items 5, 6
- **Recommended implementation order:** 8

### 9) CI baseline (lint + build + minimal smoke checks)
- **Why it matters:** sustained iteration needs a regression gate.
- **Module:** repo hygiene
- **Type:** infra
- **Priority:** P1
- **Estimated complexity:** S
- **Dependencies:** none
- **Recommended implementation order:** 9

### 10) Documentation consolidation for contributor onboarding
- **Why it matters:** current duplicated README state slows contributors and increases misalignment.
- **Module:** docs
- **Type:** docs
- **Priority:** P1
- **Estimated complexity:** S
- **Dependencies:** none
- **Recommended implementation order:** 10

---

## Post-MVP

### 11) Workout model and standards (WOD types, units, tie-break fields)
- **Why it matters:** scoring requires canonical workout definition.
- **Module:** competition programming
- **Type:** backend
- **Priority:** P1
- **Estimated complexity:** L
- **Dependencies:** items 1, 3
- **Recommended implementation order:** 11

### 12) Phases, heats, lanes, and assignment workflow
- **Why it matters:** competition-day operations require structured progression.
- **Module:** operations
- **Type:** product
- **Priority:** P1
- **Estimated complexity:** L
- **Dependencies:** item 11
- **Recommended implementation order:** 12

### 13) Judge workflow (assignment, score entry, correction request)
- **Why it matters:** score capture must be role-based and auditable.
- **Module:** judge tooling
- **Type:** frontend
- **Priority:** P1
- **Estimated complexity:** L
- **Dependencies:** items 2, 11, 12
- **Recommended implementation order:** 13

### 14) Scoring engine and leaderboard derivation
- **Why it matters:** core CompCF outcome is reliable rankings.
- **Module:** scoring + leaderboard
- **Type:** backend
- **Priority:** P1
- **Estimated complexity:** L
- **Dependencies:** items 11, 13
- **Recommended implementation order:** 14

### 15) Qualification and cut rules across phases
- **Why it matters:** many CrossFit events depend on phase progression and eliminations.
- **Module:** competition rules
- **Type:** product
- **Priority:** P1
- **Estimated complexity:** L
- **Dependencies:** items 11, 12, 14
- **Recommended implementation order:** 15

### 16) Score governance and dispute/audit tooling
- **Why it matters:** official results need traceable correction history.
- **Module:** governance
- **Type:** database
- **Priority:** P1
- **Estimated complexity:** M
- **Dependencies:** items 13, 14
- **Recommended implementation order:** 16

---

## Out of scope (this pass)

### 17) Stripe/payment integration
- **Why it matters:** important but intentionally deferred until registration model is stable.
- **Module:** payments
- **Type:** backend
- **Priority:** P2
- **Estimated complexity:** L
- **Dependencies:** items 4, 6, 7 stabilized
- **Recommended implementation order:** 17

### 18) Major UI redesign
- **Why it matters:** functional domain completion is higher value than visual redesign now.
- **Module:** design
- **Type:** frontend
- **Priority:** P2
- **Estimated complexity:** L
- **Dependencies:** MVP workflow completion
- **Recommended implementation order:** 18

### 19) Large architecture rewrite
- **Why it matters:** premature before real scale constraints are observed.
- **Module:** architecture
- **Type:** backend
- **Priority:** P2
- **Estimated complexity:** L
- **Dependencies:** production usage evidence
- **Recommended implementation order:** 19

---

## Next 5 best tasks
1. Version Supabase schema + policies in-repo.
2. Formalize and enforce complete role matrix.
3. Make divisions/categories canonical and constrained.
4. Harden pricing tier semantics.
5. Implement organizer setup flow validation before publish.

---

## Safe first implementation candidate for Codex
**Candidate:** Task 2 — formalize role matrix in docs + policy checklist.

**Why this is safe and high leverage:**
- no runtime behavior change required initially
- unblocks predictable permission design for all upcoming modules
- reduces rework risk in organizer, registration, and judge features
