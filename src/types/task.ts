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
}

/** What the user fills in when creating or editing a task. */
export interface NewTaskInput {
  title: string
  description: string
}
