# Task Tracker

_Status values: Not Started / In Progress / Testing / Completed_
_Test values: — (not run) / Passed / Failed_
_Priority: P0 = must have, P1 = should have, P2 = nice to have_

## Phase 0 — Inspection & Planning

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| 0.1 | Inspect repo, write PROJECT_PLAN, TASK_TRACKER, DATABASE_SCHEMA, DEVELOPMENT_LOG | P0 | Completed | N/A (docs only) | `a15b015` | `docs(plan): add project plan, task tracker and schema design` | Yes |

## Milestone 1 — Project Setup

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| 1.1 | Initialize React + Vite + TypeScript (strict), oxlint, Vitest + RTL with a smoke test, npm scripts (`lint`, `typecheck`, `test`, `build`, `check`) | P0 | Completed | Passed | `fb82c5d` | `feat(setup): initialize React Vite TypeScript project` | Yes |
| 1.2 | Configure Tailwind CSS, base styles, theme colours, fonts | P0 | Completed | Passed | `7c08e4f` | `feat(ui): configure Tailwind CSS` | Yes |
| 1.3 | Create scalable folder structure (`app`, `features`, `components`, `lib`, `pages`, `types`, `supabase/`) + path aliases | P0 | Completed | Passed | `b578373` | `chore(structure): create scalable project folder structure` | Yes |
| 1.4 | Responsive layout: collapsible sidebar (mobile drawer), header, dashboard page, React Router routes | P0 | Completed | Passed | `c0e33e7` | `feat(ui): implement responsive dashboard layout` | Yes |
| 1.5 | GitHub Actions CI: lint + typecheck + test + build on push/PR | P1 | Completed | Passed (GitHub run ✅) | `54d58c5` | `ci: add GitHub Actions workflow for lint, test and build` | Yes |

## Milestone 2 — Core Task Management

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| 2.1 | Task type, `TaskRepository` interface + LocalStorage implementation, create-task form (title required, description) | P0 | Completed | Passed (GitHub run ✅) | `6d0d59c` | `feat(tasks): implement task creation` | Yes |
| 2.2 | Edit / update existing tasks (modal form, validation) | P0 | Testing | Passed | — | `feat(tasks): add task editing functionality` | No |
| 2.3 | Archive (soft delete, restorable) + permanent delete, both behind a confirmation dialog; Archived view | P0 | Not Started | — | — | `feat(tasks): implement task deletion and archiving` | No |
| 2.4 | Mark task complete / reopen (sets `completedAt`) | P0 | Not Started | — | — | `feat(tasks): add task completion functionality` | No |
| 2.5 | Dashboard: task cards/list, task detail panel, summary counters | P0 | Not Started | — | — | `feat(dashboard): display task details` | No |

## Milestone 3 — Deadlines & Progress Tracking

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| 3.1 | Target completion date picker (stored as `dueAt`, default 23:59 local) | P0 | Not Started | — | — | `feat(deadlines): add task date selection` | No |
| 3.2 | Deadline time picker, combined into `dueAt` with timezone-safe helpers + unit tests | P0 | Not Started | — | — | `feat(deadlines): implement deadline time selection` | No |
| 3.3 | Progress 0–100% (slider + number), 100% auto-completes the task | P0 | Not Started | — | — | `feat(progress): add percentage-based progress tracking` | No |
| 3.4 | Checkpoints: each update stores timestamp + progress % + comment (append-only) | P0 | Not Started | — | — | `feat(comments): implement timestamped progress updates` | No |
| 3.5 | Progress history timeline in task details (newest first, never lost) | P0 | Not Started | — | — | `feat(history): preserve task checkpoint history` | No |

## Milestone 4 — Task Status & Filtering

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| 4.1 | `getTaskStatus(task, now)` helper (date **and** time) + Pending view | P0 | Not Started | — | — | `feat(filters): implement pending task view` | No |
| 4.2 | Overdue view, auto-refresh status every minute | P0 | Not Started | — | — | `feat(filters): implement overdue task detection` | No |
| 4.3 | Completed view with full progress history | P0 | Not Started | — | — | `feat(filters): add completed task history` | No |
| 4.4 | "Completed Late" badge (how late), full task event history | P0 | Not Started | — | — | `feat(tasks): add completed late indicators` | No |

## Milestone 5 — User Authentication

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| 5.0 | Connect owner-provided Supabase project (new account; owner shares URL + anon key), add `supabase-js`, env config (`.env.example`, `.env` git-ignored), initial schema migration | P0 | Not Started | — | — | `feat(database): add Supabase client and initial schema` | No |
| 5.1 | Email + password registration (validation, duplicate email handling) | P0 | Not Started | — | — | `feat(auth): implement email registration` | No |
| 5.2 | Secure login (invalid-credential errors, no user enumeration) | P0 | Not Started | — | — | `feat(auth): implement secure login` | No |
| 5.3 | Logout, session persistence, protected routes | P0 | Not Started | — | — | `feat(auth): add logout and session persistence` | No |
| 5.4 | Supabase task repository, RLS policies, triggers; tasks owned by `auth.uid()` | P0 | Not Started | — | — | `feat(database): associate tasks with authenticated users` | No |
| 5.5 | Integration tests: user A cannot read/update/delete user B's tasks or checkpoints | P0 | Not Started | — | — | `test(auth): verify user data isolation` | No |

## Milestone 6 — Team Workspaces & Collaboration

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| 6.1 | Workspace switcher: My Tasks vs Team Tasks | P0 | Not Started | — | — | `feat(workspaces): separate personal and team tasks` | No |
| 6.2 | Create team workspace (creator becomes Owner) | P0 | Not Started | — | — | `feat(teams): implement team workspace creation` | No |
| 6.3 | Owner invites registered users by email (server-side RPC verifies user exists; handles not-registered / already member / already invited) | P0 | Not Started | — | — | `feat(teams): add email-based invitations` | No |
| 6.4 | Invited user sees pending invites, accepts/declines, joins team; owner manages members | P0 | Not Started | — | — | `feat(teams): implement team member management` | No |
| 6.5 | Team task creation, assign to members, show created-by / updated-by | P0 | Not Started | — | — | `feat(tasks): implement team task assignment` | No |
| 6.6 | Real-time sync of team tasks & checkpoints (Supabase Realtime) | P0 | Not Started | — | — | `feat(realtime): synchronize team task updates` | No |

## Milestone 7 — Final Testing & Local Release (no deployment for now)

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| 7.1 | Playwright E2E: register → create → progress → complete → logout/login → data still there | P0 | Not Started | — | — | `test(app): add end-to-end workflow tests` | No |
| 7.2 | Security tests: cross-user and non-member access, forged user IDs, invite abuse | P0 | Not Started | — | — | `test(security): verify authorization and data isolation` | No |
| 7.3 | Responsive tests on mobile / tablet / desktop viewports; fix layout issues | P0 | Not Started | — | — | `fix(ui): resolve responsive layout issues` | No |
| 7.4 | Bug fixes, error boundary, 404 page, production build check, README with local setup steps (deployment postponed — decide later) | P0 | Not Started | — | — | `chore(release): finalize local production build and docs` | No |

## Milestone 8 — Extras (approved by owner)

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| 8.1 | Priority levels & labels with filter | P2 | Not Started | — | — | `feat(tasks): add priority levels and labels` | No |
| 8.2 | Search and sort | P2 | Not Started | — | — | `feat(filters): add task search and sorting` | No |
| 8.3 | "Due soon" (24h) highlight + sidebar counters | P2 | Not Started | — | — | `feat(deadlines): highlight tasks due soon` | No |
| 8.4 | Dark mode toggle | P2 | Not Started | — | — | `feat(ui): add dark mode` | No |
| 8.5 | Sign in with Google | P2 | Not Started | — | — | `feat(auth): add Google sign-in` | No |
| 8.6 | Team activity feed | P2 | Not Started | — | — | `feat(teams): add team activity feed` | No |
| 8.7 | Undo toast after archiving | P2 | Not Started | — | — | `feat(tasks): add undo for archive` | No |

## Task notes

_Each finished task gets a short entry here: what changed, tests passed/failed, commit, pushed?_

### 0.1 — Planning docs
- Changed: added `PROJECT_PLAN.md`, `TASK_TRACKER.md`, `DATABASE_SCHEMA.md`, `DEVELOPMENT_LOG.md`.
- Tests: not applicable (documentation only).
- Plan approved by owner on 2026-11-25 (Supabase, LocalStorage-first, all extras, single `main` branch, localhost only).
- Commit: `a15b015`. Pushed: Yes (2026-11-25).

### 1.1 — Initialize React + Vite + TypeScript
- Changed: scaffolded with create-vite 9.3.4 (`react-ts`): React 19.3, Vite 8.3, TypeScript 7.0 (strict), oxlint. Removed demo content. Added Vitest 4 + jsdom + React Testing Library + jest-dom, a smoke test, `check` script, `.env` ignore rules, README.
- Tests: `npm run check` → lint passed (0 warnings), typecheck passed, 1/1 tests passed, build passed. Dev server served page on http://localhost:5173.
- Failed: none.
- Commit: `fb82c5d`. Pushed: Yes (2026-11-25).

### 1.2 — Configure Tailwind CSS
- Changed: installed Tailwind CSS 4.3 + `@tailwindcss/vite`; `src/index.css` now holds design tokens (`brand-*` colours, `status-pending/overdue/completed/late/archived`, Inter font) and base styles (page background, text colour, keyboard focus ring, selection colour). Inter loaded from Google Fonts. Placeholder page styled with Tailwind and shows status colour chips.
- Tests: `npm run check` → lint passed, typecheck passed, 2/2 tests passed, build passed. Verified the built CSS contains the theme tokens, responsive utilities and body base styles; dev server served the page with no errors.
- Failed: none.
- Commit: `7c08e4f`. Pushed: Yes (2026-11-25).

### 1.3 — Scalable folder structure
- Changed: created `src/app`, `components`, `features/{tasks,progress,auth,teams}`, `layouts`, `lib`, `pages`, `types`, plus `supabase/migrations` and `tests/e2e` (empty folders kept with `.gitkeep`). Moved `App` into `src/app/`. Added `@/` import alias (Vite + tsconfig), a `cn()` class-name helper in `src/lib/` with tests, a safe root-element check in `main.tsx`, and a "Project structure" section in the README.
- Tests: `npm run check` → lint passed, typecheck passed, 5/5 tests passed (2 files), build passed. Dev server resolved `@/app/App` with no errors.
- Failed: none.
- Commit: `b578373`. Pushed: Yes (2026-11-25).

### 1.4 — Responsive dashboard layout
- Changed: added React Router 7.18 (v8 needs Node 22; we have Node 20) and lucide-react icons. New `AppLayout` (sticky header with page title, skip-to-content link), `Sidebar` (fixed on desktop ≥1024px; slide-out drawer with overlay on mobile/tablet; closes on Escape, overlay click, close button or link click), `navigation.ts` (single list of nav links), routes for `/`, `/pending`, `/overdue`, `/completed`, `/archived` and a 404 page. Dashboard shows summary cards (0 for now) and an empty state. Browser tab title follows the page.
- Tests: `npm run check` → lint passed, typecheck passed, 15/15 tests passed (routing, active link, 404, mobile menu open/close), build passed. Playwright screenshots at 390×844 (mobile), 820×1180 (tablet), 1440×900 (desktop): no horizontal overflow, no console errors.
- Failed: one test expectation was wrong on the first run (expected tab title for the dashboard); fixed the test.
- Commit: `c0e33e7`. Pushed: Yes (2026-11-25).

### 1.5 — GitHub Actions CI
- Changed: added `.github/workflows/ci.yml` (runs on push/PR to `main` and manually; Node 20, npm cache, `npm ci` → lint → typecheck → test → build; read-only permissions; cancels outdated runs; 15-minute timeout). Added CI badge and a CI section to the README.
- Tests: simulated the workflow in a clean clone — `npm ci`, lint, typecheck, 15/15 tests, build all passed; `ci.yml` validated as YAML. First real run on GitHub happens after push.
- Failed: none.
- Commit: `54d58c5`. Pushed: Yes (2026-11-25). First GitHub Actions run passed (all steps ✅, 18 s).

### 2.1 — Task creation
- Changed: `Task` / `NewTaskInput` types; validation (title required, ≤200 chars; description ≤5000; whitespace trimmed); `TaskRepository` interface + LocalStorage implementation (key `todo.tasks.v1`, newest first, ignores corrupted data, friendly error when storage is full); `TasksProvider` + `useTasks`; reusable `Modal` (portal, Escape/backdrop close, focus handling) and `TaskForm` (inline errors, character counter, double-submit guard); "New task" button in the header; task list on Dashboard and Pending page; Pending counter wired.
- Tests: `npm run check` → lint, typecheck, 47/47 tests, build all passed. Browser check (Playwright): created 2 tasks, refreshed page, both still there; no console errors; no horizontal overflow on mobile.
- Failed / fixed: browser screenshots showed the dialog stuck at the top of the screen (header `backdrop-blur` traps `position: fixed`). Fixed by rendering the Modal through a portal into `<body>`; added a regression test.
- Commit: `6d0d59c`. Pushed: Yes (2026-11-25). GitHub Actions run ✅.

### 2.2 — Task editing
- Changed: `TaskRepository.update()` + `TaskNotFoundError`; LocalStorage implementation validates, trims, keeps `createdAt`, bumps `updatedAt` (not bumped when nothing changed), keeps list order. `updateTask` in the tasks context. New `TaskCard` (pencil Edit button, "Edited <time>" label) and `EditTaskDialog` (reuses `TaskForm`, pre-filled, resets each time it opens). Test fakes now spread a real repository so they implement every method.
- Tests: `npm run check` → lint, typecheck, 61/61 tests, build all passed. Browser check (desktop + mobile): edit pre-filled, saved, survived refresh; no console errors; no horizontal overflow.
- Failed: none (two old test fakes needed the new `update` method — fixed).
- Commit: waiting for approval. Pushed: No.
