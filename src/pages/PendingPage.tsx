import { TaskList } from '@/features/tasks/TaskList'
import { useTasks } from '@/features/tasks/TasksContext'

/**
 * Pending = not completed and deadline not passed. Tasks have no deadline or
 * completion yet, so every task is pending. Real filtering arrives in Task 4.1.
 */
export function PendingPage() {
  const { tasks } = useTasks()
  return <TaskList tasks={tasks} emptyTitle="No pending tasks" emptyText="Tasks that are still on time will show here." />
}
