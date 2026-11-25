# To-Do — Collaborative Task Management

A to-do app with deadlines, progress checkpoints, and team workspaces.
Built with React, Vite, TypeScript, Tailwind CSS and Supabase.

> Work in progress. See [PROJECT_PLAN.md](PROJECT_PLAN.md) and [TASK_TRACKER.md](TASK_TRACKER.md).

## Run locally

Requires Node.js 20.19 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run lint` | Lint with oxlint |
| `npm run typecheck` | TypeScript type check |
| `npm test` | Run unit/component tests (Vitest) |
| `npm run build` | Production build into `dist/` |
| `npm run check` | All of the above (lint + typecheck + test + build) |

## Project structure

```
src/
  app/            App root (later: router and providers)
  components/     Shared, reusable UI pieces (buttons, dialogs, badges)
  features/       One folder per feature, each with its own components, hooks and logic
    tasks/          create / edit / archive / complete tasks
    progress/       progress %, checkpoints and history
    auth/           register, login, session
    teams/          workspaces, invitations, members
  layouts/        Page shells (sidebar + header)
  lib/            Small helpers with no UI (dates, status, class names)
  pages/          One component per route
  types/          Shared TypeScript types
  test/           Test setup
supabase/
  migrations/     SQL migrations (schema, security rules, triggers)
tests/
  e2e/            End-to-end browser tests (Playwright)
```

Import with the `@/` alias, e.g. `import { cn } from '@/lib/cn'`.
Tests live next to the file they test (`cn.ts` → `cn.test.ts`).
