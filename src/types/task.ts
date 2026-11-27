/** A to-do task. Dates are ISO 8601 strings (UTC), e.g. "2026-11-25T10:30:00.000Z". */
export interface Task {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  /** When the task was marked complete, or null if it is not finished. */
  completedAt: string | null
  /** When the task was archived (soft-deleted), or null if it is active. */
  archivedAt: string | null
  /** Target completion time (UTC), or null when the task has no deadline. */
  dueAt: string | null
  /** False when the user picked only a date (the time defaulted to 23:59 local). */
  hasDueTime: boolean
}

/** What the user fills in when creating or editing a task. */
export interface NewTaskInput {
  title: string
  description: string
  /** Target completion time (UTC ISO string). Omitted or null = no deadline. */
  dueAt?: string | null
  /** True when the user picked a time as well as a date. Ignored without `dueAt`. */
  hasDueTime?: boolean
}
