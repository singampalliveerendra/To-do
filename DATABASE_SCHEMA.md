# Database Schema (Supabase / PostgreSQL)

_Status: DESIGN — tables are created in Milestone 5 (personal) and Milestone 6 (teams) via SQL migrations in `supabase/migrations/`._
_During Milestones 2–4 the same shape is stored in LocalStorage (camelCase fields)._

## Entity overview

```
auth.users (managed by Supabase Auth — bcrypt password hashes)
   │ 1:1
profiles ──────────────┐
   │ owner             │ member
teams ── team_members ─┘
   │          
   │ team_invitations (team → invited profile)
   │
tasks (personal: team_id NULL | team: team_id set)
   ├── task_checkpoints (append-only progress + comment history)
   └── task_events      (append-only audit: created, edited, archived, ...)
```

## Tables

### `profiles`
Public info for each registered user. Row is created automatically by a trigger when a user signs up.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | = `auth.users.id`, `ON DELETE CASCADE` |
| email | citext UNIQUE NOT NULL | lower-case-insensitive, copied from auth |
| display_name | text | |
| created_at | timestamptz | default `now()` |

### `teams`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | `gen_random_uuid()` |
| name | text NOT NULL | 1–80 chars |
| owner_id | uuid NOT NULL → profiles.id | set from `auth.uid()` by trigger |
| created_at | timestamptz | |

### `team_members`
| Column | Type | Notes |
|---|---|---|
| team_id | uuid → teams.id | `ON DELETE CASCADE` |
| user_id | uuid → profiles.id | `ON DELETE CASCADE` |
| role | enum `team_role` ('owner','member') | |
| joined_at | timestamptz | |
| | PK (team_id, user_id) | prevents duplicate membership |

### `team_invitations`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| team_id | uuid → teams.id | |
| invited_user_id | uuid → profiles.id | resolved **server-side** from email |
| invited_email | citext | what the owner typed |
| invited_by | uuid → profiles.id | = `auth.uid()` |
| status | enum ('pending','accepted','declined','revoked') | |
| created_at / responded_at | timestamptz | |
| | UNIQUE (team_id, invited_user_id) WHERE status='pending' | no duplicate pending invites |

### `tasks`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| team_id | uuid NULL → teams.id | NULL = personal task |
| created_by | uuid NOT NULL → profiles.id | forced to `auth.uid()` by trigger |
| updated_by | uuid → profiles.id | forced to `auth.uid()` by trigger |
| assignee_id | uuid NULL → profiles.id | must be a team member (trigger check) |
| title | text NOT NULL | 1–200 chars |
| description | text | max 5000 chars |
| due_at | timestamptz NULL | combined deadline date + time (UTC) |
| has_due_time | boolean | false = user picked only a date (time defaulted to 23:59) |
| progress | smallint NOT NULL default 0 | CHECK 0–100 |
| completed_at | timestamptz NULL | set when progress hits 100 / marked done |
| archived_at | timestamptz NULL | soft delete |
| created_at / updated_at | timestamptz | `updated_at` maintained by trigger |

Indexes: `(created_by) WHERE team_id IS NULL`, `(team_id)`, `(assignee_id)`, `(due_at)`.

### `task_checkpoints` (append-only)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| task_id | uuid → tasks.id | `ON DELETE CASCADE` |
| author_id | uuid → profiles.id | forced to `auth.uid()` |
| progress | smallint NOT NULL | CHECK 0–100 |
| comment | text | max 2000 chars |
| created_at | timestamptz | server time — never from the client |

A trigger copies the checkpoint's progress into `tasks.progress` (and sets `completed_at` at 100).

### `task_events` (append-only audit)
| Column | Type | Notes |
|---|---|---|
| id | bigint identity PK | |
| task_id | uuid → tasks.id | |
| actor_id | uuid → profiles.id | |
| type | text | `created`, `edited`, `completed`, `reopened`, `archived`, `restored`, `assigned` |
| details | jsonb | changed fields (old → new) |
| created_at | timestamptz | |

## Computed status (not stored)
Status is **calculated**, not saved, so it can never go stale:

```
archived_at IS NOT NULL                       → archived
completed_at IS NOT NULL AND due_at IS NOT NULL
      AND completed_at > due_at               → completed_late
completed_at IS NOT NULL                      → completed
due_at IS NOT NULL AND now() > due_at         → overdue
otherwise                                     → pending
```
Same logic in TypeScript (`getTaskStatus`) and, if needed, as a SQL view.

## Security (Row Level Security)

RLS is **enabled on every table**. The app never sends a user ID for authorization — the database reads `auth.uid()` from the signed JWT.

Helper functions (`SECURITY DEFINER`, `search_path` locked) to avoid recursive policies:
- `is_team_member(team uuid) → boolean`
- `is_team_owner(team uuid) → boolean`
- `can_access_task(task uuid) → boolean`

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | self, or people who share a team with you | trigger only | self (display_name only) | none |
| teams | members | any signed-in user (becomes owner) | owner | owner |
| team_members | members of that team | via `accept_invitation` RPC / owner trigger only | owner (role) | owner, or self (leave team) |
| team_invitations | team owner, or the invited user | via `invite_member` RPC only | via RPCs only | owner (revoke) |
| tasks | personal: `created_by = auth.uid()`; team: `is_team_member(team_id)` | personal: self; team: member | same as select | personal: creator; team: owner or creator |
| task_checkpoints | if `can_access_task` | if `can_access_task` | **none** (history is permanent) | **none** |
| task_events | if `can_access_task` | trigger only | none | none |

## Server-side functions (RPC)

| Function | What it does | Errors |
|---|---|---|
| `invite_member(team_id, email)` | Caller must be owner. Looks up `profiles` by email (so only **registered** users can be invited), creates a pending invite. | `NOT_OWNER`, `USER_NOT_REGISTERED`, `ALREADY_MEMBER`, `ALREADY_INVITED`, `CANNOT_INVITE_SELF` |
| `accept_invitation(invite_id)` | Caller must be the invited user; adds membership atomically. | `INVITE_NOT_FOUND`, `INVITE_NOT_PENDING` |
| `decline_invitation(invite_id)` | Caller must be the invited user. | same |

## Realtime
`tasks` and `task_checkpoints` are added to the `supabase_realtime` publication. Clients subscribe filtered by `team_id`; Supabase applies RLS to every change event, so non-members receive nothing.
