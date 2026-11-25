import type { NewTaskInput, Task } from '@/types/task'

/**
 * Where tasks are stored. The UI only talks to this interface, so the
 * LocalStorage version (Milestones 2–4) can be swapped for Supabase
 * (Milestone 5) without changing any components.
 */
export interface TaskRepository {
  /** All tasks (active and archived), newest first. */
  list(): Promise<Task[]>
  /** Validates, saves and returns the new task. */
  create(input: NewTaskInput): Promise<Task>
  /**
   * Validates and saves new title/description for an existing task.
   * Throws `TaskNotFoundError` if the task no longer exists.
   */
  update(id: string, input: NewTaskInput): Promise<Task>
  /** Marks a task as finished, recording the exact completion time. */
  complete(id: string): Promise<Task>
  /** Marks a finished task as not finished again (e.g. ticked by mistake). */
  reopen(id: string): Promise<Task>
  /** Soft-deletes a task: it is hidden from active views but all its data is kept. */
  archive(id: string): Promise<Task>
  /** Brings an archived task back to the active views. */
  restore(id: string): Promise<Task>
  /**
   * Permanently removes a task. Only archived tasks can be deleted
   * (throws `TaskNotArchivedError` otherwise) — a second safety step.
   */
  delete(id: string): Promise<void>
}

export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`This task no longer exists (it may have been deleted). [${id}]`)
    this.name = 'TaskNotFoundError'
  }
}

export class TaskNotArchivedError extends Error {
  constructor(id: string) {
    super(`Only archived tasks can be deleted. Archive the task first. [${id}]`)
    this.name = 'TaskNotArchivedError'
  }
}
