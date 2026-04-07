# AGENTS.md

## Mission

CompCF is an open source web platform dedicated exclusively to CrossFit competitions.

The product must preserve this core value at all times:
- standardized publication of CrossFit events
- registrations for individual athletes and teams
- division and category management
- pricing tier management
- optional qualification workflows
- competition-day operations
- live scoring and leaderboards

Every change must strengthen the product as a real, credible, extensible web platform. Do not turn it into an internal-only admin dashboard.

---

## Non-negotiable product scope

Always design and implement with these priorities:

1. standardization over free-form customization
2. explicit business rules over implicit logic
3. operational robustness over technical novelty
4. modularity over coupling
5. MVP discipline over premature complexity

Preserve the platform focus:
- CrossFit competitions only
- no generic event platform drift
- no marketplace drift
- no social network drift
- no unrelated community features

---

## Stack constraints

Do not replace or challenge the chosen stack unless explicitly asked.

Current reference stack:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- Vercel
- GitHub
- Stripe later when payment is activated

Explicitly avoid in MVP:
- microservices
- Kubernetes
- GraphQL
- heavy infra abstraction
- unnecessary background systems
- large dependency additions without strong justification

Prefer simple, production-credible implementations.

---

## Delivery framing

Always distinguish in reasoning and implementation impact:
- MVP
- post-MVP
- out of scope

Default behavior:
- implement only MVP unless the task explicitly asks otherwise
- do not sneak post-MVP abstractions into MVP code
- do not add speculative extensibility that increases complexity without current value

---

## Mandatory domain model awareness

Every relevant feature must preserve explicit modeling for:

### Roles
- organizer
- staff
- judge
- individual athlete
- team captain
- public user

### Competition concepts
- event
- division
- category
- individual registration
- team registration
- pricing tier
- qualification phase
- competition phase
- workout / WOD
- workout type
- score
- score submission
- score validation
- leaderboard
- heat
- lane
- cut
- tie-break

### CrossFit-specific concepts that must remain explicit
- workout types: for time, AMRAP, max load, max reps, intervals, multi-part
- competition formats: individual, team, mixed team
- divisions: RX, scaled, masters, teens, adaptive if added later
- scoring styles: rank-based, points-based, tie-break aware
- event structure: phases, heats, lanes, cuts, final rankings

Do not collapse these concepts into vague generic entities.

---

## Mandatory module boundaries

Keep modules conceptually independent, API-exposed, and replaceable.

Invariant modules:
1. Identity & roles
2. Organizer management
3. Event creation & publication
4. Divisions & categories
5. Registration & payments
6. Qualification system
7. Competition programming (WODs)
8. Scheduling & heats
9. Scoring engine
10. Leaderboards
11. Public pages
12. Notifications
13. Admin & audit
14. Analytics

Do not mix responsibilities across modules.
Examples of anti-patterns:
- scoring rules embedded inside UI-only code
- registration quotas enforced only visually
- leaderboard calculations duplicated in multiple layers
- organizer settings mixed with public event rendering logic

---

## Source of truth rules

There must be one source of truth for:
- registrations
- scores
- rankings
- capacities / quotas
- pricing selection actually used for a registration

Do not create uncontrolled duplication.
Derived values must be recomputed from canonical data or clearly marked as cached projections.

---

## Actor expectations and permissions

Always preserve role-aware behavior.

### Organizer
Can:
- create and manage organizer profile
- create draft events
- configure divisions, categories, pricing tiers
- publish and unpublish events
- manage registrations
- configure workouts, schedule, heats
- correct scores with audit trail
- manage staff and judges

### Staff
Can:
- access operational event management according to granted permissions
- manage check-in, heat assignment, schedule support, registration support
- never exceed organizer-granted scope

### Judge
Can:
- access only assigned event / workout / heat contexts
- submit scores
- edit score submissions only if allowed
- never bypass validation and audit requirements

### Individual athlete
Can:
- browse public events
- register individually where allowed
- pay if payment is enabled
- view own registration and competition information

### Team captain
Can:
- create or manage a team registration where allowed
- invite or manage teammates according to rules
- complete team registration flow
- view team status and event info

### Public user
Can:
- browse published events
- view public event pages
- view public leaderboards if enabled

Never assume permission inheritance implicitly. Make access explicit.

---

## Workflow expectations

When implementing features, think in concrete workflows, not abstract CRUD.

### Organizer workflow
Typical organizer journey:
1. create organizer profile
2. create draft event
3. define divisions / categories
4. define pricing tiers
5. publish event
6. monitor registrations
7. optionally run qualification
8. configure workouts
9. build schedule and heats
10. run live scoring
11. publish results
12. process corrections with audit trail

### Athlete workflow
Typical athlete journey:
1. discover event
2. view event details and divisions
3. choose eligible division
4. register
5. pay if required
6. receive confirmation
7. follow qualification or competition instructions
8. view schedule, heats, and results

### Judge workflow
Typical judge journey:
1. authenticate
2. open assigned competition context
3. access assigned workout / heat / lane
4. submit score
5. confirm submission
6. handle correction flow if permitted

### Public spectator workflow
Typical public journey:
1. browse event page
2. see schedule and divisions
3. follow live leaderboard if available
4. view final rankings and event information

Do not implement features that break these real workflows.

---

## Data modeling rules

Whenever a task changes the data layer, preserve:
- clear entity boundaries
- explicit foreign keys
- explicit constraints
- nullable fields only when justified
- auditable changes for critical competition data

Expected discipline:
- model real business entities, not UI shortcuts
- use explicit enums or checked values for stable business categories where appropriate
- keep naming consistent and descriptive
- prefer additive migrations over destructive schema changes unless explicitly required

Critical constraints must be enforced in the backend / database when relevant:
- registration capacity
- pricing tier availability
- registration eligibility
- one canonical score state per athlete/team per workout version
- audit history for score corrections

Do not rely only on frontend validation for business safety.

---

## Supabase and database rules

If a task touches Supabase or database behavior:

1. preserve relational integrity
2. preserve RLS intent
3. avoid unsafe broad policies
4. make migrations explicit
5. mention data impact clearly in the final summary

When modifying schema:
- provide a migration
- update dependent types if relevant
- update server-side logic accordingly
- check whether existing data could break
- call out backfill requirements if any

When handling concurrency-sensitive logic:
- prefer transactional or server-enforced approaches
- never trust client-only quota enforcement
- be careful with race conditions on registrations, capacities, and score corrections

---

## Frontend rules

The UI must feel like a real product, not a placeholder admin tool.

Expectations:
- clean, credible, operational design
- consistent terminology
- role-aware navigation
- no fake data left behind unless clearly intentional and isolated
- no misleading UI suggesting unsupported features

Prefer:
- explicit states for loading, empty, error, success
- simple and legible forms
- predictable layout and navigation
- reusable UI patterns when already present in the codebase

Do not:
- add unnecessary visual complexity
- add trendy animations that reduce clarity
- hide domain rules behind vague labels
- create beautiful but operationally unclear screens

---

## Backend and API rules

Keep backend logic explicit and testable.

Prefer:
- server-side enforcement for business rules
- thin handlers calling clear domain logic
- predictable payload shapes
- idempotent thinking where relevant
- explicit error messages for operational flows

Do not:
- scatter business logic across many files without structure
- duplicate ranking logic in multiple endpoints
- encode critical rules only in client components
- bury domain rules in utility functions with vague names

---

## Scoring and leaderboard rules

Any change related to scoring must be extremely careful.

Always preserve:
- score traceability
- correction history
- deterministic ranking behavior
- explicit tie-break handling
- clear athlete/team association
- workout version awareness if rules change

Do not implement scoring shortcuts that lose auditability.

If score editing is introduced or changed:
- retain previous value history
- retain actor and timestamp
- retain reason when possible
- make recalculation behavior explicit

---

## Realtime and operational robustness

Critical competition-day features must be designed for real operational use.

Always consider:
- concurrent updates
- partial failure
- delayed submissions
- correction after validation
- stale leaderboard risk
- judge-side mistakes
- organizer override flows

Do not assume perfect connectivity or perfect user behavior.

---

## Edge-case discipline

Always think through edge cases before finishing work.

Common edge cases include:
- event unpublished after registrations exist
- division removed while registrations exist
- pricing tier expired during registration
- pricing tier quota reached concurrently
- athlete switches division
- team registration incomplete
- duplicate registration attempts
- score submitted twice
- score correction after leaderboard publication
- tie conditions
- athlete withdrawal or no-show
- heat reassignment after schedule publication

Do not leave critical edge cases implicit.

---

## Anti-patterns to avoid

Never introduce:
- premature abstraction
- hidden business logic
- over-engineering in MVP
- generic event-platform modeling that weakens CrossFit specificity
- mixed responsibilities between event, registration, and scoring domains
- duplicated ranking or score truth
- database-important rules enforced only in UI
- broad refactors unrelated to the task

Keep PRs focused.

---

## Working method for agent tasks

Before making changes:
1. inspect existing structure
2. identify the smallest coherent change set
3. preserve current architecture unless it is clearly broken for the task
4. prefer incremental edits over broad rewrites

When requirements are ambiguous:
- choose the simplest MVP-safe interpretation
- document assumptions in the final summary
- do not invent major new systems unless explicitly requested

When touching an existing pattern:
- follow the project’s current conventions if they are reasonable
- improve consistency, not novelty

---

## Validation requirements

Before considering work complete:

1. run the project’s package-manager-appropriate install if needed
2. run lint if configured
3. run typecheck if configured
4. run tests if present and relevant
5. verify changed pages or flows still make sense
6. summarize exactly what changed
7. call out remaining risks, assumptions, and limitations

Use the package manager already implied by the repo lockfile and scripts.
Do not switch package manager casually.

If commands fail:
- report the exact failure
- do not pretend validation passed
- separate completed work from unverified work

---

## PR expectations

PRs must be:
- small enough to review
- scoped to one coherent goal
- explicit about schema impact
- explicit about business-rule impact

PR summary should include:
- what changed
- why it changed
- impacted modules
- migration impact if any
- validation performed
- remaining caveats

Use clear commit and PR titles.
Avoid vague titles like:
- update stuff
- fixes
- misc changes

Prefer titles such as:
- feat: add organizer event draft creation flow
- fix: enforce pricing tier quota on registration
- refactor: isolate leaderboard ranking service

---

## Expected final response format from the agent

At the end of a task, provide:
1. concise summary
2. files changed
3. migrations changed if any
4. validation run
5. risks or follow-ups

Be concrete. Do not give generic completion messages.

---

## Default decision rule

If a choice appears between:
- more abstraction vs more clarity
- more flexibility vs more standardization
- more cleverness vs more robustness
- more scope vs MVP discipline

Choose:
- clarity
- standardization
- robustness
- MVP discipline