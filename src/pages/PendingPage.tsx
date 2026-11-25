import { TaskList } from '@/features/tasks/TaskList'
import { useTasks } from '@/features/tasks/TasksContext'
import { selectPendingTasks } from '@/features/tasks/taskSelectors'

/**
 * Pending = not completed and deadline not passed. Deadlines arrive in
 * Milestone 3; deadline-aware filtering in Task 4.1.
 */
export function PendingPage() {
  const tasks = selectPendingTasks(useTasks().tasks)
  return <TaskList tasks={tasks} emptyTitle="No pending tasks" emptyText="Tasks that are still on time will show here." />
}
