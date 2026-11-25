import { CircleCheckBig } from 'lucide-react'
import { TaskList } from '@/features/tasks/TaskList'
import { useTasks } from '@/features/tasks/TasksContext'
import { selectCompletedTasks } from '@/features/tasks/taskSelectors'

export function CompletedPage() {
  const { tasks } = useTasks()
  return (
    <TaskList
      tasks={selectCompletedTasks(tasks)}
      emptyIcon={CircleCheckBig}
      emptyTitle="No completed tasks"
      emptyText="Tick a task’s circle to mark it complete. It will show here."
    />
  )
}
