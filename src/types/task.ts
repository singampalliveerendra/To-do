/** A to-do task. Dates are ISO 8601 strings (UTC), e.g. "2026-11-25T10:30:00.000Z". */
export interface Task {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

/** What the user fills in when creating a task. */
export interface NewTaskInput {
  title: string
  description: string
}
