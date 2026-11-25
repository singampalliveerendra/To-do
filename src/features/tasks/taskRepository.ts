import type { NewTaskInput, Task } from '@/types/task'

/**
 * Where tasks are stored. The UI only talks to this interface, so the
 * LocalStorage version (Milestones 2–4) can be swapped for Supabase
 * (Milestone 5) without changing any components.
 */
export interface TaskRepository {
  /** All tasks, newest first. */
  list(): Promise<Task[]>
  /** Validates, saves and returns the new task. */
  create(input: NewTaskInput): Promise<Task>
}
