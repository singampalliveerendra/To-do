# Development Log

Short chronological history of the project. Newest entries at the bottom.

## 2026-11-25 — Phase 0: Inspection & Planning
- Inspected GitHub repo `singampalliveerendra/To-do`: public and empty (no commits).
- Cloned it to `/home/veerendra/To-do` (separate from the home-folder git repo).
- Environment: Node v20.20.2, npm 10.8.2, pnpm 10.28.2, git 2.43.0, gh 2.101.0 (logged in). No Docker → will use a hosted Supabase dev project.
- Chose the proposed stack: React + Vite + TypeScript + Tailwind, Supabase (Auth + Postgres RLS + Realtime).
- Wrote `PROJECT_PLAN.md`, `TASK_TRACKER.md`, `DATABASE_SCHEMA.md`, `DEVELOPMENT_LOG.md`.
- No code written, no commits, nothing pushed. Waiting for owner approval of the plan.
- Owner decision: **no deployment for now** — app runs on localhost only. Hosting will be decided later. Updated plan and Task 7.4 accordingly.
- Owner approved the plan: Supabase backend, LocalStorage-first for Milestones 2–4, all suggested extras (Task 1.5 + Milestone 8), single `main` branch. Owner will create a new Supabase account and share keys at Milestone 5.
- Committed Phase 0 docs (`a15b015`).

## 2026-11-25 — Task 1.1: Initialize React + Vite + TypeScript
- Scaffolded with create-vite 9.3.4 (React 19, Vite 8, TypeScript 7 strict, oxlint). Removed demo assets.
- Added Vitest + React Testing Library with a smoke test, `npm run check` script, `.env` ignore rules, README.
- `npm run check` all green; dev server verified on localhost:5173.
- Committed and pushed Task 1.1 (`fb82c5d`). Pushed Phase 0 docs (`a15b015`).

## 2026-11-25 — Task 1.2: Configure Tailwind CSS
- Added Tailwind CSS 4.3 via the Vite plugin, theme tokens (brand + task status colours), Inter font, and base styles.
- `npm run check` all green (2 tests); built CSS verified.
- Committed and pushed Task 1.2 (`7c08e4f`).

## 2026-11-25 — Task 1.3: Scalable folder structure
- Created feature-based folder layout, moved App to `src/app/`, added `@/` alias and `cn()` helper with tests, documented structure in README.
- `npm run check` all green (5 tests).
- Committed and pushed Task 1.3 (`b578373`).

## 2026-11-25 — Task 1.4: Responsive dashboard layout
- Added React Router 7 (v8 requires Node 22), lucide-react icons, app layout with sidebar/mobile drawer, header, dashboard, status view placeholders and 404 page.
- 15 tests green; verified with Playwright screenshots on mobile, tablet and desktop (no overflow, no console errors).
- Committed and pushed Task 1.4 (`c0e33e7`).

## 2026-11-25 — Task 1.5: GitHub Actions CI
- Added CI workflow (lint, typecheck, test, build on Node 20) and README badge.
- Simulated the pipeline in a clean clone: all steps passed.
- Committed and pushed Task 1.5 (`54d58c5`); first GitHub Actions run green. **Milestone 1 complete.**

## 2026-11-25 — Task 2.1: Task creation
- Added task type, validation, LocalStorage repository, tasks context, Modal, TaskForm, header "New task" button, task list on Dashboard/Pending.
- Browser check found the dialog trapped inside the header (backdrop-blur containing block); fixed with a portal + regression test.
- 47 tests green; tasks survive page refresh.
- Committed and pushed Task 2.1 (`6d0d59c`); CI green.

## 2026-11-25 — Task 2.2: Task editing
- Added repository `update`, Edit button on each task card, pre-filled edit dialog, "Edited" timestamp.
- 61 tests green; browser check on desktop and mobile passed.
- Committed and pushed Task 2.2 (`9b98e34`); CI green.

## 2026-11-25 — Task 2.3: Archiving and deletion
- Two-step safety: tasks are archived first (soft delete, restorable); only archived tasks can be permanently deleted. Both actions ask for confirmation with Cancel focused.
- Archived page with Restore / Delete permanently. Older saved data migrates automatically.
- 82 tests green; browser check on desktop and mobile passed.
- Committed and pushed Task 2.3 (`ef4208d`); CI green.

## 2026-11-25 — Task 2.4: Task completion
- Added completion checkbox, `completedAt` with exact time, reopen, Completed page, Pending/Completed counters.
- 101 tests green; browser check on desktop and mobile passed.
- Committed and pushed Task 2.4 (`fd69879`); CI green.

## 2026-11-25 — Task 2.5: Task details
- Added task details page (`/tasks/:id`) with status badge, full description, history timeline and all actions; card titles link to it.
- Refactored task actions into a shared `useTaskActions` hook used by list and details page.
- 112 tests green; browser check on desktop and mobile passed. Owner given the local URL (http://localhost:5173) to review.
- Committed and pushed Task 2.5 (`a8c883e`); CI green. **Milestone 2 complete.**

## 2026-11-25 — Milestone R: UI redesign requested
- Owner asked for a bold, playful, premium redesign. Split into 4 tasks (R.1 design system, R.2 layout, R.3 dashboard & cards, R.4 dialogs/forms/details), each committed separately, before Milestone 3.

## 2026-11-25 — Task R.1: Design system
- New fonts, vibrant palette, AA-contrast status colours, gradient/glass/glow utilities, animation keyframes, pastel mesh background, reduced-motion support.
- Automated WCAG contrast test for the design tokens. 128 tests green.
- Committed and pushed Task R.1 (`bcc2e01`); CI green.

## 2026-11-25 — Task R.2: Layout redesign
- Glass sidebar and header, gradient logo and active pill, animated gradient New task button, drifting background blobs and floating shapes.
- Caught and fixed two contrast/visual issues via screenshots and the token test (AA-safe button gradient; gradient title sizing). 136 tests green.
- Committed and pushed Task R.2 (`861e5a6`); CI green.

## 2026-11-25 — Task R.3: Dashboard and task cards
- Gradient welcome banner with greeting and completion ring, vibrant glass stat cards, illustrated empty states, glass task cards with status strip, confetti burst on completion, staggered entrance animations.
- Screenshot review caught an emoji rendering issue, a cramped mobile banner and a too-subtle burst — all fixed. 161 tests green.
- Committed and pushed Task R.3 (`59d24b4`); CI green. R.4 cancelled in favour of a calmer direction.
- (Side project, separate repo: `~/memecoin-template` — SNACCOON comic landing page. Not part of this repo.)

## 2026-11-25 — Milestone S: "Paper & Ink" redesign
- Owner asked for a clean, minimal, premium look inspired by the comic template (outlines, hard shadows, paper, one accent) without clutter. Split into S.1–S.4.

## 2026-11-25 — Task S.1: Paper & Ink design system
- New paper/ink/accent tokens, charcoal brand, deeper AA status colours + soft chips, surface/press/hard-shadow utilities; legacy vibrant utilities mapped to calm equivalents.
- Contrast test caught 4 status colours below AA on soft chips — fixed. 173 tests green.
- Committed and pushed Task S.1 (`dffb965`); CI green.

## 2026-11-25 — Task S.2: Layout restyle
- Calm sidebar and header in Paper & Ink; floating background decoration removed; yellow pressable New task button.
- 174 tests green.
- Committed and pushed Task S.2 (`1bec9b6`); CI green.

## 2026-11-25 — Task S.3: Dashboard, progress and task cards
- Calm progress card with accessible progress bar, outlined filter cards with soft status tiles, cleaner task cards with soft chips and quiet actions, simpler empty state.
- 174 tests green.
- Committed and pushed Task S.3 (`3542c77`); CI green.

## 2026-11-25 — Task S.4: Forms, dialogs, details and clean-up
- Paper & Ink dialogs (mobile bottom sheet), outlined form fields with yellow focus, calm confirmations, restyled details page and 404. Removed every legacy vibrant style.
- 171 tests green. **Milestone S complete** once committed. Next: Milestone 3 (deadlines).
