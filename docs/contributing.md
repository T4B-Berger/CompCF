# Contributing to CompCF

This guide is the contributor onboarding baseline for this repository.

## 1) Before you start
- Read the root `README.md` for current product scope and local setup.
- Treat implemented app code + SQL migrations as source of truth.
- Treat `docs/product/*` as planning intent unless already implemented.

## 2) Branching and PR hygiene
- Create a focused branch per issue/task.
- Keep PRs reviewable and scoped (avoid mixed concerns).
- Prefer incremental changes over broad redesigns.

## 3) Local workflow
1. Install dependencies:
   ```bash
   npm ci
   ```
2. Run locally:
   ```bash
   npm run dev
   ```
3. Run checks before opening PR:
   ```bash
   npm run lint
   npm run build
   ```

## 4) Database and schema changes
- Additive migrations go in `supabase/migrations/` using ordered timestamps.
- Do not silently rewrite migration history that is already merged.
- Keep server-side invariants in SQL when business integrity matters.

## 5) Documentation expectations
- Update docs whenever behavior, setup, or scope assumptions change.
- Keep docs concrete and consistent with current repository reality.
- Prefer consolidation over creating parallel docs with overlapping purpose.

## 6) Product planning docs
- GitHub Project model and field/label conventions: `docs/product/github-project-model.md`
- Active execution sequencing: `docs/product/execution-plan.md`
- Backlog seed and epics: `docs/product/backlog-seed.md`, `docs/product/epics.md`

## 7) Scope guardrails for MVP work
- Avoid adding payment/team/waitlist/scoring features unless issue scope explicitly asks for them.
- Avoid broad dashboard redesigns for narrowly scoped implementation issues.
- Preserve existing issue metadata conventions in project updates.
