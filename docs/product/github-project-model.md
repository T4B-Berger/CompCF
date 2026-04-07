# CompCF GitHub Project Model

## Purpose
GitHub is the single operational surface for product planning and execution at CompCF:
- planning in Issues + Project fields
- delivery in PR-linked issues
- roadmap in date-based project views

Primary project target: **CompCF Product & Delivery**.

## Custom fields (target model)
- Status: Backlog, Ready, In Progress, In Review, Blocked, Done
- Type: Epic, Story, Task, Bug, Spike
- Domain: Identity & Roles, Organizer Management, Event Publication, Divisions / Categories / Pricing, Registration, Volunteer Recruitment, Volunteer Onboarding, Volunteer Scheduling, Judging Live, Care Operations, Build / Logistics, Competition Programming, Scheduling / Heats, Scoring & Leaderboard, Public Experience, Admin / Audit / Governance, Documentation, Infrastructure
- Persona: Organizer, Staff, Judge, Individual Athlete, Team Captain, Volunteer, Public User, Admin
- Phase: MVP, Post-MVP, Later
- Priority: P0, P1, P2
- Size: XS, S, M, L, XL
- Risk: Low, Medium, High
- Sprint: Sprint 0-3 (or iteration field where supported)
- Start Date (date)
- Target Date (date)
- Parent issue + Sub-issue progress (when supported)

## Status conventions
- **Backlog:** not yet groomed
- **Ready:** groomed with acceptance criteria and dependencies
- **In Progress:** active implementation
- **In Review:** open PR or review pending
- **Blocked:** external dependency or unresolved decision
- **Done:** merged and validated

## View conventions
- **Master Backlog (Table):** full triage and sorting
- **Delivery Board (Board by Status):** execution flow
- **MVP by Domain (Board):** focus MVP work by domain
- **Roadmap (Roadmap):** Start Date to Target Date planning
- **Volunteer Domain (Table):** volunteer-specific workstream
- **Epics (Table):** only Type=Epic for decomposition checks
- **Current Sprint (Table):** active sprint and not done

## Item type conventions
- **Epic:** value stream slice, decomposed into stories/tasks.
- **Story:** persona-driven deliverable with clear acceptance criteria.
- **Task:** implementation/ops work with no direct persona outcome.
- **Bug:** defect in expected behavior.
- **Spike:** time-boxed investigation reducing uncertainty.

## PR linkage rules
- Every PR references issue(s) in body using `Closes #<issue>` or `Refs #<issue>`.
- If work is partial, use `Refs` and keep issue open.
- If done, use `Closes` for automatic issue closure.

## Sub-issue conventions
- Use Epic issue as parent.
- Create Story issues as children.
- If GitHub sub-issue feature is unavailable, include a child checklist in parent issue body and a `Parent Epic: #id` line in child issues.

## Dependency conventions
Use issue dependencies only when sequencing materially impacts delivery clarity:
- hard technical prerequisites
- policy/governance blockers
- shared domain model dependencies

## Codex work selection heuristic
1. Pick **Ready + P0/P1 + MVP** first.
2. Prefer items with no unresolved dependencies.
3. In ties, choose smaller item size first (XS/S/M).
4. Keep one active item per domain unless explicit parallelization is needed.
5. Ensure PR links issue and updates project status.
