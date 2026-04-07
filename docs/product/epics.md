# CompCF Epic Catalog

## 1) Identity & Roles
- **Scope:** authentication, role matrix, permission enforcement baseline.
- **Why it matters:** all execution reliability depends on clean access boundaries.
- **MVP scope:** explicit role matrix + baseline server/client guardrails.
- **Post-MVP scope:** delegated permission sets and policy automation.
- **Out of scope:** SSO enterprise integrations.
- **Main personas:** Admin, Organizer, Staff, Judge.
- **Dependencies:** Admin / Audit / Governance.
- **Success signal:** role-based access defects trend toward zero.

## 2) Organizer Management
- **Scope:** organizer profile, ownership and event-level control.
- **Why it matters:** core customer type is competition organizer.
- **MVP scope:** stable organizer setup flow.
- **Post-MVP scope:** multi-org controls and delegated admin.
- **Out of scope:** invoicing/CRM.
- **Main personas:** Organizer, Admin.
- **Dependencies:** Identity & Roles.
- **Success signal:** organizer setup completed without manual intervention.

## 3) Event Publication
- **Scope:** event creation, publication states, public visibility baseline.
- **Why it matters:** event visibility is top-of-funnel for registrations.
- **MVP scope:** draft/published flow + public listing metadata.
- **Post-MVP scope:** richer media + announcement tools.
- **Out of scope:** sponsorship marketplace.
- **Main personas:** Organizer, Public User.
- **Dependencies:** Organizer Management.
- **Success signal:** organizers can publish events with complete mandatory metadata.

## 4) Divisions / Categories / Pricing
- **Scope:** canonical taxonomy, constraints, pricing tiers.
- **Why it matters:** registration accuracy and fairness depend on this model.
- **MVP scope:** source-of-truth divisions/categories + reliable tier selection.
- **Post-MVP scope:** dynamic policies and rule packs.
- **Out of scope:** country-specific tax logic.
- **Main personas:** Organizer, Individual Athlete, Team Captain.
- **Dependencies:** Event Publication.
- **Success signal:** fewer registration corrections caused by category mismatch.

## 5) Registration
- **Scope:** registration creation + lifecycle state handling.
- **Why it matters:** primary revenue and participant conversion path.
- **MVP scope:** individual/team registration flow + state transitions.
- **Post-MVP scope:** qualification-linked enrollment and waitlist automation.
- **Out of scope:** payment-provider expansion.
- **Main personas:** Individual Athlete, Team Captain, Organizer, Staff.
- **Dependencies:** Divisions / Categories / Pricing.
- **Success signal:** higher successful registration completion ratio.

## 6) Volunteer Recruitment
- **Scope:** application intake and candidate discovery.
- **Why it matters:** event day quality depends on volunteer throughput.
- **MVP scope:** intake form + organizer review queue.
- **Post-MVP scope:** campaign/re-engagement workflows.
- **Out of scope:** external applicant tracking integrations.
- **Main personas:** Volunteer, Organizer.
- **Dependencies:** Public Experience.
- **Success signal:** time-to-first-response for applications decreases.

## 7) Volunteer Onboarding
- **Scope:** qualification, status movement, communication baseline.
- **Why it matters:** recruited volunteers must become operation-ready.
- **MVP scope:** status pipeline + instruction delivery.
- **Post-MVP scope:** onboarding checklists/certification tracking.
- **Out of scope:** LMS implementation.
- **Main personas:** Volunteer, Organizer, Staff.
- **Dependencies:** Volunteer Recruitment.
- **Success signal:** accepted volunteers show up assignment-ready.

## 8) Volunteer Scheduling & Assignments
- **Scope:** shifts, role assignment, replacement handling.
- **Why it matters:** live operations fail without role coverage.
- **MVP scope:** shift creation + assignment matrix + replacements.
- **Post-MVP scope:** optimization/auto-scheduling.
- **Out of scope:** payroll.
- **Main personas:** Organizer, Staff, Volunteer, Judge.
- **Dependencies:** Volunteer Onboarding.
- **Success signal:** fewer uncovered shifts on competition day.

## 9) Judging Live
- **Scope:** judging assignment and live capture workflow.
- **Why it matters:** scoring credibility requires strong judging operations.
- **MVP scope:** judge assignment model + decision capture baseline.
- **Post-MVP scope:** offline mode + validation escalations.
- **Out of scope:** computer vision judging.
- **Main personas:** Judge, Staff, Organizer.
- **Dependencies:** Volunteer Scheduling & Assignments, Scoring & Leaderboard.
- **Success signal:** reduced score submission latency and disputes.

## 10) Care Operations
- **Scope:** athlete care/support shift operations.
- **Why it matters:** athlete experience and safety.
- **MVP scope:** care shift definitions + staffing visibility.
- **Post-MVP scope:** incident capture and post-event reporting.
- **Out of scope:** medical records.
- **Main personas:** Volunteer, Staff, Organizer.
- **Dependencies:** Volunteer Scheduling & Assignments.
- **Success signal:** care stations maintain required coverage.

## 11) Build / Logistics Operations
- **Scope:** setup/teardown and logistics staffing.
- **Why it matters:** venue readiness and transition speed.
- **MVP scope:** build shift assignment and checklist visibility.
- **Post-MVP scope:** asset tracking and logistics analytics.
- **Out of scope:** procurement system.
- **Main personas:** Volunteer, Staff, Organizer.
- **Dependencies:** Volunteer Scheduling & Assignments.
- **Success signal:** setup milestones met on schedule.

## 12) Competition Programming
- **Scope:** WOD/programming management.
- **Why it matters:** competition format quality and fairness.
- **MVP scope:** capture planned placeholder structure.
- **Post-MVP scope:** full workout definition and validation tools.
- **Out of scope:** AI workout generation.
- **Main personas:** Organizer, Staff.
- **Dependencies:** Divisions / Categories / Pricing.
- **Success signal:** published programming aligned to division constraints.

## 13) Scheduling / Heats
- **Scope:** heat planning and timing operations.
- **Why it matters:** day-of flow and judge/volunteer coordination.
- **MVP scope:** roadmap placeholder and dependency mapping.
- **Post-MVP scope:** heat generation and lane assignment workflows.
- **Out of scope:** hardware timing integration.
- **Main personas:** Organizer, Staff, Judge.
- **Dependencies:** Registration, Competition Programming.
- **Success signal:** on-time heat operations with minimal manual reshuffling.

## 14) Scoring & Leaderboard
- **Scope:** scoring engine and leaderboard presentation.
- **Why it matters:** central value proposition for CrossFit competitions.
- **MVP scope:** backlog foundation and quality constraints.
- **Post-MVP scope:** full live scoring computation and rankings.
- **Out of scope:** historical predictive analytics.
- **Main personas:** Judge, Organizer, Public User, Athlete.
- **Dependencies:** Judging Live.
- **Success signal:** trusted, timely leaderboard updates.

## 15) Public Experience
- **Scope:** public event and results consumption.
- **Why it matters:** supports audience growth and participant confidence.
- **MVP scope:** event listing/read-only details baseline.
- **Post-MVP scope:** richer live experience and subscriptions.
- **Out of scope:** social media network features.
- **Main personas:** Public User, Individual Athlete.
- **Dependencies:** Event Publication.
- **Success signal:** increased public event page engagement.

## 16) Admin / Audit / Governance
- **Scope:** auditability, controls, and governance operations.
- **Why it matters:** platform trust for organizers and participants.
- **MVP scope:** baseline audit trail and governance policy docs.
- **Post-MVP scope:** advanced moderation/risk workflows.
- **Out of scope:** legal case management.
- **Main personas:** Admin.
- **Dependencies:** Identity & Roles.
- **Success signal:** critical changes are attributable and reviewable.
