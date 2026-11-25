import type { Task } from '@/types/task'

export const isArchived = (task: Task): boolean => task.archivedAt !== null
export const isCompleted = (task: Task): boolean => task.completedAt !== null

/** Tasks shown in normal views (not archived), keeping their order. */
export function selectActiveTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => !isArchived(task))
}

/**
 * Pending = active and not completed. Deadlines arrive in Milestone 3; overdue
 * tasks will then be split out of this list in Task 4.2.
 */
export function selectPendingTasks(tasks: Task[]): Task[] {
  return selectActiveTasks(tasks).filter((task) => !isCompleted(task))
}

/** Active completed tasks, most recently completed first. */
export function selectCompletedTasks(tasks: Task[]): Task[] {
  return selectActiveTasks(tasks)
    .filter(isCompleted)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
}

/** Archived tasks, most recently archived first. */
export function selectArchivedTasks(tasks: Task[]): Task[] {
  return tasks.filter(isArchived).sort((a, b) => (b.archivedAt ?? '').localeCompare(a.archivedAt ?? ''))
}
