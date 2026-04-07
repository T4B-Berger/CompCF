# GitHub Project Operating Model (CompCF)

Project URL: https://github.com/users/T4B-Berger/projects/1

## Fields
- Status (currently API-available options: `Todo`, `In Progress`, `Done`; `Todo` is used as Backlog)
- Type (Epic, Story, Task, Bug, Spike)
- Domain
- Persona
- Phase (MVP, Post-MVP, Later)
- Priority (P0, P1, P2)
- Effort (XS, S, M, L, XL)
- Risk (Low, Medium, High)
- Sprint (Sprint 0..3)
- Start Date
- Target Date
- Epic (for explicit epic name tracking)

## Label conventions
- `domain:*` for product/workstream ownership.
- `type:*` for artifact type.
- `priority:*` and `phase:*` for planning posture.
- Support labels: `blocked`, `needs-spec`, `ready-for-codex`, `good-first-pr`.

## Issue conventions
- Epic issue title: `[Epic] <name>`
- Story/task issues use concise implementation-oriented titles.
- Every non-epic issue references parent epic in Dependencies.

## Hierarchy conventions
- Use explicit parent epic reference in issue body.
- If API parent/sub-issue linking is insufficient, maintain epic child checklist manually in epic issue body.

## Dependency conventions
- Add dependencies only when they materially affect execution order.
- Prefer minimal graph complexity for small-team operation.

## Intended manual UI views (API creation unavailable)
1. Master Backlog (table)
2. Delivery Board (group by Status)
3. MVP by Domain
4. Volunteer Domain
5. Epics
6. Roadmap (Start Date/Target Date)
7. Current Sprint
