# Project Plan — Collaborative To-Do Management App

_Status: APPROVED by owner on 2026-11-25_
_Last updated: 2026-11-25_

## 1. Phase 0 inspection results

| Item | Finding |
|---|---|
| GitHub repo | `singampalliveerendra/To-do` — public, **empty** (no commits, no branches) |
| Local folder | `/home/veerendra/To-do` (fresh clone, its own git repo, branch `main`) |
| Existing code / framework | None. Nothing to overwrite. |
| Node.js | v20.20.2 |
| Package managers | npm 10.8.2, pnpm 10.28.2 (no yarn / bun) |
| Git / GitHub CLI | git 2.43.0, gh 2.101.0 (logged in as `singampalliveerendra`) |
| Docker | **Not available** in WSL → we cannot run the local Supabase stack; use a hosted Supabase dev project instead |
| Supabase account | Connected; 1 existing project (`yff-staging`, unrelated — **will not be touched**) |
| Environment notes | WSL: Node 20 network calls may need `NODE_OPTIONS=--no-network-family-autoselection` |

> Note: `/home/veerendra` itself is a separate git repo. The To-do app lives in its own nested repo, so the two never mix.

## 2. Recommended architecture

### Frontend
- **React 19 + Vite 8 + TypeScript 7** (strict mode) — latest versions from `create-vite`
- **Tailwind CSS** for responsive styling
- **React Router** for pages (`/`, `/pending`, `/overdue`, `/completed`, `/archived`, `/teams/:id`, `/login`, `/register`)
- **TanStack Query** for server-data caching and refresh (added in Milestone 5)
- **date-fns** for date/time maths
- **Vitest + React Testing Library** for unit/component tests; **Playwright** for end-to-end tests (Milestone 7)
- **npm** as the package manager (already installed, simplest)

### Backend & database — recommendation: **Supabase** (hosted PostgreSQL)

Why Supabase is the best fit for these requirements:

| Requirement | How Supabase handles it |
|---|---|
| Email + password auth, no plaintext passwords | Supabase Auth (GoTrue) stores **bcrypt** hashes; handles sessions, refresh tokens, duplicate-email errors |
| "Never trust frontend user IDs" | Postgres **Row Level Security (RLS)** uses `auth.uid()` from the signed JWT — the database itself rejects other users' rows |
| Data isolation (personal vs team) | RLS policies + `SECURITY DEFINER` helper functions (`is_team_member`, `is_team_owner`) |
| Verify invited users really exist | Invite runs in a database function (RPC) that looks the email up in `profiles` server-side |
| Real-time collaboration | **Supabase Realtime** (Postgres change streams) — still filtered by RLS |
| Full history / checkpoints | Normal relational tables, append-only by policy (no UPDATE/DELETE allowed) |
| Runs on localhost | App runs locally with `npm run dev` (http://localhost:5173); only the database/auth lives in a free Supabase cloud project (no Docker needed). Hosting decided later. |

Alternatives considered (briefly): a custom Node/Express + Prisma API gives more control but means writing auth, sessions, websockets and authorization by hand — more code, more security risk. Firebase works but its security rules + NoSQL make relational team/assignment queries and history harder.

### Data-layer strategy (important)
Milestones 2–4 come **before** auth (Milestone 5), as you ordered. To avoid throwaway work:
- All task reads/writes go through a `TaskRepository` interface.
- Milestones 2–4 use a **LocalStorage repository** (works offline, fully testable).
- Milestone 5 adds a **Supabase repository** with the same interface and switches to it. Business logic and UI don't change.

### Deadline & status rules (single source of truth)
- Deadline is stored as one UTC timestamp `due_at` (date + time combined in the user's local timezone).
- If only a date is chosen, time defaults to **23:59 local**.
- A pure function `getTaskStatus(task, now)` decides the status — unit-tested with edge cases (1 minute before/after, midnight, timezone):
  - **Archived**: `archived_at` is set
  - **Completed**: `completed_at` set and (`due_at` null or `completed_at <= due_at`)
  - **Completed Late**: `completed_at > due_at`
  - **Overdue**: not completed and `now > due_at`
  - **Pending**: not completed and (`due_at` null or `now <= due_at`)
- Progress reaching 100% sets `completed_at` automatically (in the app, and enforced by a database trigger in Milestone 5).

## 3. Folder structure (created in Task 1.3)

```
src/
  app/            # App root, router, providers
  components/     # Shared UI (Button, Modal, ConfirmDialog, ...)
  features/
    tasks/        # task components, hooks, repository
    progress/     # checkpoints & history
    auth/         # login/register/session
    teams/        # workspaces, invites, members
  layouts/        # AppLayout (sidebar + header)
  lib/            # date/status helpers, supabase client
  pages/          # route pages
  types/          # shared TypeScript types
  test/           # test setup & helpers
supabase/
  migrations/     # SQL migrations (schema, RLS, triggers, RPCs)
tests/
  e2e/            # Playwright tests
```

## 4. Milestones

| # | Milestone | Outcome |
|---|---|---|
| 0 | Inspection & planning | These 4 docs (this phase) |
| 1 | Project setup | Vite app, Tailwind, structure, responsive layout, CI |
| 2 | Core task management | Create / edit / archive / delete / complete tasks |
| 3 | Deadlines & progress | Date + time, 0–100% progress, timestamped checkpoints, history |
| 4 | Status & filtering | Pending / Overdue / Completed / Completed Late views |
| 5 | Authentication | Supabase Auth, RLS, tasks linked to real user IDs, isolation tests |
| 6 | Teams & collaboration | Team workspaces, invites, assignment, real-time sync |
| 7 | Final testing & local release | E2E, security, responsive, bug fixes, README to run locally. **No deployment for now** — decided later |
| 8 | Suggested extras (optional) | See section 6 — only if you approve |

Full task list: see `TASK_TRACKER.md`. Database design: see `DATABASE_SCHEMA.md`.

## 5. Testing strategy

| Level | Tool | Used for |
|---|---|---|
| Lint / types | oxlint (Vite's default linter) + `tsc -b` | every task |
| Unit | Vitest | status/deadline logic, repositories, reducers |
| Component | React Testing Library | forms, dialogs, views |
| Database security | Vitest integration tests with 2–3 real test users against the Supabase **dev** project | RLS, RPCs, isolation (Milestones 5–6) |
| End-to-end | Playwright (Chromium; mobile/tablet/desktop viewports) | main workflows (Milestone 7) |
| Build | `vite build` | every task |

Every task runs `npm run check` (= lint + typecheck + test + build) before asking for commit approval.

## 6. My suggested extra features (optional — Milestone 8)

These are improvements on top of your requirements. I'll only build the ones you approve:

1. **GitHub Actions CI** (Task 1.5) — runs lint, tests and build on every push, so broken code is caught automatically. _(Recommended — added to Milestone 1.)_
2. **Priority levels & labels** — Low / Medium / High / Urgent, coloured badges, filter by priority.
3. **Search, sort & quick filters** — search titles/descriptions; sort by deadline, priority, progress.
4. **"Due soon" highlight** — tasks due within 24 hours get an amber badge; overdue count shown in sidebar.
5. **Dark mode** — follows system setting with a toggle.
6. **Sign in with Google** — matches your "Google email address" invite idea; optional on top of email/password.
7. **Activity feed per team** — "Ravi moved *Report* to 60%" style timeline (built on the `task_events` table).
8. **Undo toast for archive** — 5-second undo after archiving.

## 7. Git workflow (agreed rules)

- One task = one commit, conventional commit messages, only that task's files staged (never blind `git add .`).
- I show changes + test results, suggest the message, and **wait for your approval** before every commit.
- I ask **separately** before every push. No force-push, no `reset --hard`, no amending.
- Single branch: all work is committed on `main` (owner decision, 2026-11-25).
- Deployment: none for now — app runs on localhost only.

## 8. Decisions (approved by owner on 2026-11-25)

1. **Backend/database:** Supabase (Auth + Postgres RLS + Realtime). App runs on localhost only.
2. **Data layer:** LocalStorage repository for Milestones 2–4, switched to Supabase in Milestone 5.
3. **Extras:** all suggestions approved — Task 1.5 (CI) plus Milestone 8 (tasks 8.1–8.7).
4. **Branching:** single branch `main`.
5. **Supabase account:** the owner will create a **new Supabase account** (new email) and share the project URL + anon key when we reach Milestone 5. Until then, no Supabase project is created and the existing `yff-staging` project is never touched.
