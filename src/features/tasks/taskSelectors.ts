import type { Task } from '@/types/task'

export const isArchived = (task: Task): boolean => task.archivedAt !== null

/** Tasks shown in normal views (not archived), keeping their order. */
export function selectActiveTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => !isArchived(task))
}

/** Archived tasks, most recently archived first. */
export function selectArchivedTasks(tasks: Task[]): Task[] {
  return tasks.filter(isArchived).sort((a, b) => (b.archivedAt ?? '').localeCompare(a.archivedAt ?? ''))
}
