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
| 2.2 | Edit / update existing tasks (modal form, validation) | P0 | Completed | Passed (GitHub run ✅) | `9b98e34` | `feat(tasks): add task editing functionality` | Yes |
| 2.3 | Archive (soft delete, restorable) + permanent delete, both behind a confirmation dialog; Archived view | P0 | Completed | Passed (GitHub run ✅) | `ef4208d` | `feat(tasks): implement task deletion and archiving` | Yes |
| 2.4 | Mark task complete / reopen (sets `completedAt`) | P0 | Completed | Passed (GitHub run ✅) | `fd69879` | `feat(tasks): add task completion functionality` | Yes |
| 2.5 | Dashboard: task cards/list, task detail panel, summary counters | P0 | Completed | Passed (GitHub run ✅) | `a8c883e` | `feat(dashboard): display task details` | Yes |

## Milestone R — UI Redesign (requested by owner, 2026-11-25)

_Goal: attractive, energetic, playful, premium UI — bold gradients, vibrant colours, glassmorphism, floating elements, micro-interactions — while keeping usability, responsiveness and accessibility (WCAG AA contrast, reduced-motion support, keyboard focus)._

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| R.1 | Design system: fonts (Bricolage Grotesque + Plus Jakarta Sans), vibrant violet/fuchsia/orange palette, AA-contrast status colours, gradient/glass/glow utilities, animation keyframes, pastel mesh background, reduced-motion support | P1 | Completed | Passed (GitHub run ✅) | `bcc2e01` | `feat(ui): add vibrant design system tokens and animations` | Yes |
| R.2 | Layout: glass sidebar with gradient logo, colourful nav, glass header, floating animated background blobs | P1 | Completed | Passed (GitHub run ✅) | `861e5a6` | `feat(ui): redesign app layout with glass and floating elements` | Yes |
| R.3 | Dashboard & task cards: gradient hero/greeting, vibrant stat cards, playful empty-state illustrations, animated cards and checkbox micro-interactions | P1 | Completed | Passed (GitHub run ✅) | `59d24b4` | `feat(ui): redesign dashboard and task cards` | Yes |
| R.4 | ~~Dialogs, forms, details page and 404 (vibrant style)~~ — superseded by Milestone S | — | Cancelled | — | — | — | — |

## Milestone S — "Paper & Ink" redesign (requested by owner, 2026-11-25)

_Goal: calm, minimal, premium UI inspired by the comic look of the SNACCOON template — cream paper, crisp ink outlines, small hard offset shadows, one sunny accent — without clutter. Clear task hierarchy, smooth spacing, subtle colours, excellent usability and mobile layout. Replaces the vibrant violet/glass direction of R.1–R.3._

| ID | Task | Priority | Status | Tests | Commit hash | Commit message | Pushed |
|---|---|---|---|---|---|---|---|
| S.1 | Design system: paper/ink/accent tokens, calm charcoal brand scale, deeper AA status colours + soft chip backgrounds, `surface` / `btn-press` / hard-shadow / `paper-dots` utilities, legacy vibrant utilities re-pointed to calm equivalents | P1 | Completed | Passed (GitHub run ✅) | `dffb965` | `feat(ui): introduce paper and ink design system` | Yes |
| S.2 | Layout: sidebar, header, page background (remove floating blobs) | P1 | Testing | Passed | — | `feat(ui): restyle layout with paper and ink` | No |
| S.3 | Dashboard, progress card, filters/status views and task cards | P1 | Not Started | — | — | `feat(ui): restyle dashboard, progress and task cards` | No |
| S.4 | Add-task flow (dialog + form), details page, 404, mobile polish; remove legacy vibrant utilities | P1 | Not Started | — | — | `feat(ui): restyle task forms, details and dialogs` | No |

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
- Commit: `9b98e34`. Pushed: Yes (2026-11-25). GitHub Actions run ✅.

### 2.3 — Archiving and deletion
- Changed: `Task.archivedAt`; old saved tasks load as active (`archivedAt: null`). Repository `archive` (soft delete, keeps all details, keeps first archive time), `restore`, and `delete` (only for archived tasks — `TaskNotArchivedError` otherwise). Context actions `archiveTask` / `restoreTask` / `deleteTask`. New `ConfirmDialog` (Cancel focused first, busy state, error stays visible). `Modal` honours `data-autofocus`. `TaskCard` shows Edit + Archive for active tasks, Restore + Delete for archived ones, plus an "Archived <time>" label. New Archived page; Dashboard/Pending show only active tasks.
- Tests: `npm run check` → lint, typecheck, 82/82 tests, build all passed. Browser check (desktop + mobile): archive → confirm → Archived page after reload → delete → confirm → still gone after refresh; no console errors; no overflow.
- Failed / fixed: two existing tests compared whole task objects without the new `archivedAt` field — updated them and added a test for loading older saved data.
- Commit: `ef4208d`. Pushed: Yes (2026-11-25). GitHub Actions run ✅.

### 2.4 — Task completion
- Changed: `Task.completedAt` (older saved tasks load as not complete). Repository `complete` (records exact time, keeps first time if repeated, does not change `updatedAt`) and `reopen`. Context `completeTask` / `reopenTask`. Selectors `selectPendingTasks` / `selectCompletedTasks` (archived tasks excluded). Round checkbox on active task cards (accessible `role="checkbox"`, disabled while saving); completed cards show a struck-through title and a green "Completed <time>" label. New Completed page; Pending page shows only unfinished tasks; Dashboard Pending/Completed counters wired.
- Tests: `npm run check` → lint, typecheck, 101/101 tests, build all passed. Browser check (desktop + mobile): complete → refresh → still complete, counters 2/1, Completed page correct; no console errors; no overflow.
- Failed / fixed: three repository tests compared whole task objects without `completedAt` — updated. (A shell quoting slip in my own edit script was caught before any test ran; edits redone with the editor.)
- Commit: `fd69879`. Pushed: Yes (2026-11-25). GitHub Actions run ✅.

### 2.5 — Task details
- Changed: new route `/tasks/:taskId` with `TaskDetailsPage`: status badge, full description (line breaks kept, placeholder when empty), History timeline (created / last edited / completed / archived, oldest first), action buttons (Mark complete / Reopen, Edit, Archive, Restore, Delete permanently), Back link that returns to the page the task was opened from, "Task not found" state, and a redirect to Archived after deleting. Task card titles are now links. Extracted shared `useTaskActions` hook (actions + edit/confirm dialogs) used by both the list and the details page; `TaskList` no longer needs a `variant` prop. New `TaskStatusBadge`.
- Tests: `npm run check` → lint, typecheck, 112/112 tests, build all passed (all 101 earlier tests still green after the refactor). Browser check (desktop + mobile): open from card, mark complete, refresh on the details URL; no console errors; no overflow.
- Failed / fixed: my browser script waited on the hidden mobile sidebar link instead of the status badge — script fixed, app unchanged.
- Commit: `a8c883e`. Pushed: Yes (2026-11-25). GitHub Actions run ✅. **Milestone 2 complete.**

### R.1 — Design system
- Changed: `src/index.css` rewritten as a design system — display font Bricolage Grotesque for headings, Plus Jakarta Sans for body (loaded in `index.html`); electric-violet brand scale (50–900); pop colours (pink, fuchsia, orange, yellow, lime, cyan, sky) for decoration; status colours re-tuned so each is ≥ 4.5:1 on white; utilities `bg-gradient-brand`, `bg-gradient-brand-animated`, `text-gradient-brand`, `glass`, `glass-strong`, `shadow-glow`, `shadow-card`; animations `float`, `float-slow`, `blob`, `pop-in`, `fade-up`, `wiggle`, `gradient-pan`; pastel mesh page background; all motion disabled under `prefers-reduced-motion`.
- Tests: new `src/test/designTokens.test.ts` computes WCAG contrast for every status colour and for white text on brand-600/700/800, and checks fonts, utilities and the reduced-motion rule. `npm run check` → lint, typecheck, 128/128 tests, build passed. Browser: both fonts load, no console errors.
- Failed / fixed: Vitest returns CSS imports (even `?raw`) as an empty string, so the token test first failed to find any tokens — it now reads `src/index.css` from disk.
- Commit: `bcc2e01`. Pushed: Yes (2026-11-25). GitHub Actions run ✅.

### R.2 — Layout redesign
- Changed: new `BackgroundDecor` (four slowly drifting blurred colour blobs + six small floating shapes; `aria-hidden`, `pointer-events-none`). Sidebar: frosted glass, gradient logo badge that wiggles on hover, tagline, "My tasks" label, colourful icon bubbles per link, gradient pill + glow for the active page, slide-on-hover, "Teams are coming" card. Header: frosted glass, taller, page title in gradient text, animated gradient "New task" button with glow, lift and rotating plus icon. Mobile overlay blurred. Added `bg-gradient-button` / `bg-gradient-button-animated` and deep pop colours so white text on gradients stays ≥ 4.5:1; gradient heading text now uses the deep stops too.
- Tests: new `src/layouts/AppLayout.test.tsx` (decor hidden from screen readers/clicks, brand, nav link names, skip link); `designTokens.test.ts` now checks every stop of the button gradient and gradient text for contrast. `npm run check` → lint, typecheck, 136/136 tests, build passed. Browser: desktop, tablet, mobile and open mobile menu — no overflow, no console errors; with reduced motion the blob animation duration is ~0.
- Failed / fixed: (1) white text on the orange end of the original gradient was only ~2.3:1 — added AA-safe button gradient; (2) the header title gradient spanned the whole header so short titles looked plain violet — gradient now wraps just the text.
- Commit: `861e5a6`. Pushed: Yes (2026-11-25). GitHub Actions run ✅.

### R.3 — Dashboard and task cards
- Changed: new `WelcomeBanner` (animated AA-safe gradient, date, time-of-day greeting with waving-hand icon, motivational line, SVG completion ring with an accessible label, floating sparkles; party popper when all done) backed by tested helpers in `src/lib/greeting.ts`. Stat cards: glass, gradient icon tiles, big display numbers, hint text, glow blob that grows on hover, lift on hover, staggered entrance. "Your tasks" header with active-count chip. `EmptyState` is now an illustration (glowing blob, slowly spinning dashed orbit, tilted floating tile, sparkles and dots). `TaskCard`: glass, rounded-3xl, status colour strip (gradient for open, green for done, grey for archived), lift + glow on hover, bigger gradient checkbox with pop-in tick and an 8-dot confetti burst on completion, status chips for Completed/Archived times, meta text darkened to slate-500 for AA contrast. Task lists slide in with a staggered fade-up. New `burst` and `spin-slow` animations.
- Tests: new `greeting.test.ts`, `WelcomeBanner.test.tsx`, and completion micro-interaction tests (burst only on completing, banner progress updates). `npm run check` → lint, typecheck, 161/161 tests, build passed. Browser (desktop + mobile, empty and full): no overflow, no console errors.
- Failed / fixed from screenshots: (1) 👋 emoji rendered as an empty box where no emoji font exists — replaced with a Lucide icon (and removed the 🔥 from the message); (2) mobile banner stacked the ring above the text — now side by side with a smaller ring; (3) confetti was hard to see — bigger dots, longer animation.
- Commit: `59d24b4`. Pushed: Yes (2026-11-25). GitHub Actions run ✅.

### R.4 — cancelled
- Owner asked for a calmer, minimal "Paper & Ink" direction instead (Milestone S).

### S.1 — Paper & Ink design system
- Changed: `src/index.css` — new tokens `paper`, `paper-deep`, `ink`, `accent` (#FFD60A), `accent-soft`; brand scale re-tuned from violet to warm charcoal; status colours deepened (pending #1d4ed8, overdue #be123c, late #92400e, archived #52606d) with new `status-*-soft` chip backgrounds; utilities `shadow-hard-xs/sm`, `shadow-hard`, `surface`, `btn-press`, `paper-dots`; page background is dotted cream paper; ink focus ring; yellow text selection. The old vibrant utilities (gradients, glass, glow) now map to calm equivalents until S.4 removes them.
- Tests: `designTokens.test.ts` extended — ink ≥ 7:1 on paper/white/accent, every status text ≥ 4.5:1 on its soft chip, brand is low-saturation, new utilities exist, hard shadows. `npm run check` → lint, typecheck, 173/173 tests, build passed. Browser: desktop + mobile, no overflow, no console errors.
- Failed / fixed: the new test showed 4 status colours were below 4.5:1 on their soft chips — deepened them (all now 5.2–6.2:1).
- Commit: `dffb965`. Pushed: Yes (2026-11-25). GitHub Actions run ✅.

### S.2 — Layout restyle
- Changed: removed `BackgroundDecor` (floating blobs/shapes). Sidebar: white sheet with 2px ink edge, yellow logo tile, small-caps "My tasks" label, plain status-coloured icons, active page = yellow pill with ink outline + hard shadow (inactive links keep a transparent border so nothing shifts), dashed "Teams are coming" note. Header: paper background with 2px ink bottom rule (no blur), bold display title, pressable menu button. "New task" is a yellow `btn-press` button. Mobile overlay is a plain dim. Removed the unused `bubbleClass` from nav items.
- Tests: `AppLayout.test.tsx` rewritten (no decor, brand + tagline, nav labels + active yellow pill, pressable New task, skip link). `npm run check` → lint, typecheck, 174/174 tests, build passed. Browser: desktop, mobile, mobile menu — no overflow, no console errors. Grey helper text 5.2–5.6:1.
- Failed: none.
- Commit: waiting for approval. Pushed: No.
