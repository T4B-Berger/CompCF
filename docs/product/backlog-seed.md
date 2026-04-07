# Backlog Seed (CompCF Product & Delivery)

## Epics
16 epic issues exist in GitHub with `[Epic]` prefix, covering core + volunteer + governance domains.

## MVP seed (required 12)
- Version Supabase schema and policies in-repo
- Formalize role matrix and enforcement baseline
- Implement event divisions source of truth
- Implement event categories source of truth
- Harden pricing tier semantics and reliability
- Organizer setup flow hardening before publish
- Athlete registration creation flow
- Registration lifecycle states
- Organizer registration visibility tooling
- Baseline operational resilience (error UX / guardrails)
- CI baseline (lint + build + smoke checks)
- Documentation consolidation and contributor onboarding

## Volunteer seed (required 12)
- Volunteer application intake flow
- Volunteer profile with skills and availability
- Organizer volunteer review workflow
- Volunteer status pipeline (applied/accepted/rejected/assigned)
- Volunteer role assignment model
- Shift creation for volunteers
- Judging assignment model
- Care shift assignment
- Build shift assignment
- Volunteer communication / instruction baseline
- Replacement and reassignment workflow
- Volunteer roster visibility by event

## Post-MVP seed (required 8)
- Workout model and score units
- Phase model (qualifier / semifinal / final)
- Heat and lane assignment workflow
- Judge score entry flow
- Score correction request flow
- Scoring engine and leaderboard derivation
- Cut rules between phases
- Score governance and dispute audit trail

## Reconciliation note
`docs/repository-baseline-audit.md` and `docs/worklist.md` were not present in this repository snapshot; this seed follows the same GitHub-native delivery direction and avoids contradictory planning semantics.


## Market-signal refinements (competitor-informed, not copied)
The backlog was enriched with targeted post-MVP issues to cover clearly expected competition capabilities while preserving CompCF sequencing:
- #108 Team and duo registration with invite/access code
- #109 Division waitlist and automatic promotion baseline
- #110 Multi-floor schedule planning with pauses and transitions
- #111 Planning-sync contract with scoring and leaderboard publication
- #112 Shareable leaderboard visibility with provisional vs official states
- #113 Athlete feedback collection and organizer post-event insights

These additions are intentionally post-MVP and do not move scoring/leaderboard or volunteer runtime implementation ahead of current foundation priorities.
