# Task Tracker

_Status values: Not Started / In Progress / Testing / Completed_
_Test values: — (not run) / Passed / Failed_
_Priority: P0 = must have, P1 = should have, P2 = nice to have_

## Phase 0 — Inspection & Planning

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| 0.1 | Inspect repo, write PROJECT_PLAN, TASK_TRACKER, DATABASE_SCHEMA, DEVELOPMENT_LOG | P0 | Completed | N/A (docs only) | — | `docs(plan): add project plan, task tracker and schema design` | No |

## Milestone 1 — Project Setup

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| 1.1 | Initialize React + Vite + TypeScript (strict), ESLint, Vitest + RTL with a smoke test, npm scripts (`lint`, `typecheck`, `test`, `build`) | P0 | Not Started | — | — | `feat(setup): initialize React Vite TypeScript project` | No |
| 1.2 | Configure Tailwind CSS, base styles, theme colours, fonts | P0 | Not Started | — | — | `feat(ui): configure Tailwind CSS` | No |
| 1.3 | Create scalable folder structure (`app`, `features`, `components`, `lib`, `pages`, `types`, `supabase/`) + path aliases | P0 | Not Started | — | — | `chore(structure): create scalable project folder structure` | No |
| 1.4 | Responsive layout: collapsible sidebar (mobile drawer), header, dashboard page, React Router routes | P0 | Not Started | — | — | `feat(ui): implement responsive dashboard layout` | No |
| 1.5 | GitHub Actions CI: lint + typecheck + test + build on push/PR | P1 | Not Started | — | — | `ci: add GitHub Actions workflow for lint, test and build` | No |

## Milestone 2 — Core Task Management

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| 2.1 | Task type, `TaskRepository` interface + LocalStorage implementation, create-task form (title required, description) | P0 | Not Started | — | — | `feat(tasks): implement task creation` | No |
| 2.2 | Edit / update existing tasks (modal form, validation) | P0 | Not Started | — | — | `feat(tasks): add task editing functionality` | No |
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
- Commit hash recorded in the table by the next task's commit. Pushed: No.
