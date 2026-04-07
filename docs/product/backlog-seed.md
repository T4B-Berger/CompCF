# CompCF Backlog Seed

Legend: `Type | Epic | Domain | Persona | Phase | Priority | Size`

## Top 12 MVP Stories
1. **Version Supabase schema and policies in-repo**  
   `Story | Identity & Roles | Infrastructure | Admin | MVP | P0 | M`  
   Story: As an admin, I need schema/policy versioning in repo so access rules are traceable.  
   AC summary: migration baseline committed; policy diff review pattern documented; rollback notes included.  
   Dependencies: none.
2. **Formalize role matrix and enforcement baseline**  
   `Story | Identity & Roles | Identity & Roles | Admin | MVP | P0 | M`  
   Story: As admin, I need a canonical role matrix so permissions are predictable.  
   AC: matrix documented; route/action mapping defined; deny-by-default gaps listed.  
   Dependencies: #1.
3. **Canonical divisions/categories source of truth**  
   `Story | Divisions / Categories / Pricing | Divisions / Categories / Pricing | Organizer | MVP | P0 | S`  
   Story: As organizer, I need one canonical taxonomy to avoid invalid registrations.  
   AC: single source table/file; allowed combinations documented; validation examples present.  
   Dependencies: Event Publication baseline.
4. **Pricing tier reliability baseline**  
   `Story | Divisions / Categories / Pricing | Divisions / Categories / Pricing | Organizer | MVP | P0 | M`  
   Story: As organizer, I need predictable tier behavior so checkout totals are trusted.  
   AC: tier model documented; transition rules clear; test matrix listed.  
   Dependencies: #3.
5. **Organizer setup flow hardening**  
   `Story | Organizer Management | Organizer Management | Organizer | MVP | P0 | M`  
   Story: As organizer, I want setup to complete without manual admin fixes.  
   AC: setup steps defined; required fields identified; error states and recovery paths listed.  
   Dependencies: #2.
6. **Athlete registration creation flow**  
   `Story | Registration | Registration | Individual Athlete | MVP | P0 | M`  
   Story: As athlete, I need a clear registration flow to successfully enter an event.  
   AC: minimal path mapped; success/failure states captured; required profile checks listed.  
   Dependencies: #3, #4.
7. **Registration lifecycle states**  
   `Story | Registration | Registration | Staff | MVP | P0 | S`  
   Story: As staff, I need consistent lifecycle states so support actions are deterministic.  
   AC: states defined; transition rules documented; invalid transitions blocked in spec.  
   Dependencies: #6.
8. **Organizer registration visibility**  
   `Story | Registration | Organizer Management | Organizer | MVP | P1 | S`  
   Story: As organizer, I need registration visibility to manage readiness and capacity.  
   AC: required views listed; key filters defined; minimum audit columns documented.  
   Dependencies: #6, #7.
9. **Baseline operational resilience**  
   `Story | Admin / Audit / Governance | Infrastructure | Admin | MVP | P1 | M`  
   Story: As admin, I need failure-mode baselines so event-day ops remain stable.  
   AC: risk checklist defined; backup/recovery expectations documented; incident severity rubric set.  
   Dependencies: #1.
10. **CI baseline for quality gates**  
   `Story | Admin / Audit / Governance | Infrastructure | Staff | MVP | P1 | S`  
   Story: As contributor, I need CI checks so regressions are caught before merge.  
   AC: minimum checks listed; branch protection assumptions documented; failure triage owner defined.  
   Dependencies: none.
11. **Docs consolidation for product + delivery**  
   `Story | Public Experience | Documentation | Staff | MVP | P1 | S`  
   Story: As team member, I need centralized docs so execution decisions are aligned.  
   AC: product docs index exists; stale docs marked; contribution conventions added.  
   Dependencies: none.
12. **Project setup and contributor onboarding**  
   `Story | Organizer Management | Documentation | Volunteer | MVP | P1 | S`  
   Story: As new contributor, I need onboarding steps to start executing backlog items quickly.  
   AC: local setup steps; issue-to-PR conventions; first-task guidance defined.  
   Dependencies: #10.

## Top 12 Volunteer-Domain Stories
1. **Volunteer application intake form + storage**  
   `Story | Volunteer Recruitment | Volunteer Recruitment | Volunteer | MVP | P0 | M`  
   AC: required fields defined; submission state tracked; organizer visibility baseline.  
   Dependencies: Identity baseline.
2. **Volunteer profile: skills and availability**  
   `Story | Volunteer Recruitment | Volunteer Recruitment | Volunteer | MVP | P0 | M`  
   AC: skills taxonomy defined; availability slots captured; update rules documented.  
   Dependencies: #1.
3. **Organizer volunteer review workflow**  
   `Story | Volunteer Recruitment | Volunteer Recruitment | Organizer | MVP | P0 | S`  
   AC: review queue states; reviewer notes field; decision timestamps.  
   Dependencies: #1.
4. **Volunteer status pipeline (applied/accepted/rejected/assigned)**  
   `Story | Volunteer Onboarding | Volunteer Onboarding | Staff | MVP | P0 | S`  
   AC: canonical statuses; transition ownership; audit expectation.  
   Dependencies: #3.
5. **Role-based volunteer assignment baseline**  
   `Story | Volunteer Scheduling & Assignments | Volunteer Scheduling | Organizer | MVP | P0 | M`  
   AC: role-to-skill mapping; assignment constraints; conflict handling notes.  
   Dependencies: #2, #4.
6. **Shift creation for volunteer operations**  
   `Story | Volunteer Scheduling & Assignments | Volunteer Scheduling | Staff | MVP | P0 | S`  
   AC: shift schema; time/location fields; coverage target definition.  
   Dependencies: #4.
7. **Judging assignment model for volunteer judges**  
   `Story | Judging Live | Judging Live | Judge | MVP | P0 | M`  
   AC: assignment unit defined; judge eligibility rules; handoff protocol.  
   Dependencies: #5, #6.
8. **Care shift assignment workflow**  
   `Story | Care Operations | Care Operations | Volunteer | MVP | P1 | S`  
   AC: care role definitions; escalation owner; fill-rate target.  
   Dependencies: #5, #6.
9. **Build shift assignment workflow**  
   `Story | Build / Logistics Operations | Build / Logistics | Volunteer | MVP | P1 | S`  
   AC: setup/teardown shift types; required capability tags; completion flag.  
   Dependencies: #5, #6.
10. **Volunteer communication and instructions baseline**  
   `Story | Volunteer Onboarding | Volunteer Onboarding | Volunteer | MVP | P1 | S`  
   AC: instruction template; pre-shift reminder timing; owner by shift.  
   Dependencies: #4.
11. **Volunteer replacement workflow**  
   `Story | Volunteer Scheduling & Assignments | Volunteer Scheduling | Staff | MVP | P1 | M`  
   AC: replacement trigger states; replacement candidate shortlist; audit notes.  
   Dependencies: #5, #6.
12. **Volunteer roster visibility by role and shift**  
   `Story | Volunteer Scheduling & Assignments | Volunteer Scheduling | Organizer | MVP | P1 | S`  
   AC: roster filters; assignment status columns; unfilled-role alerts.  
   Dependencies: #5, #6.

## 8 Post-MVP Stories
1. Qualification submission and review pipeline (`Registration`, `Post-MVP`, `P1`, `L`).
2. Programming builder for WOD definitions (`Competition Programming`, `Post-MVP`, `P1`, `L`).
3. Heat/lane auto-generation with manual override (`Scheduling / Heats`, `Post-MVP`, `P1`, `L`).
4. Live scoring calculation engine (`Scoring & Leaderboard`, `Post-MVP`, `P0`, `XL`).
5. Public live leaderboard experience (`Public Experience`, `Post-MVP`, `P1`, `L`).
6. Judge offline capture and sync strategy (`Judging Live`, `Post-MVP`, `P1`, `L`).
7. Volunteer certification and repeat-preference profile (`Volunteer Onboarding`, `Post-MVP`, `P2`, `M`).
8. Admin governance automation and risk rules (`Admin / Audit / Governance`, `Post-MVP`, `P1`, `M`).
