import { TaskList } from '@/features/tasks/TaskList'
import { useTasks } from '@/features/tasks/TasksContext'
import { selectActiveTasks } from '@/features/tasks/taskSelectors'

/**
 * Pending = not completed and deadline not passed. Tasks have no deadline or
 * completion yet, so every active (non-archived) task is pending. Real filtering arrives in Task 4.1.
 */
export function PendingPage() {
  const tasks = selectActiveTasks(useTasks().tasks)
  return <TaskList tasks={tasks} emptyTitle="No pending tasks" emptyText="Tasks that are still on time will show here." />
}
