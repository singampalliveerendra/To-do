import { Archive } from 'lucide-react'
import { TaskList } from '@/features/tasks/TaskList'
import { useTasks } from '@/features/tasks/TasksContext'
import { selectArchivedTasks } from '@/features/tasks/taskSelectors'

export function ArchivedPage() {
  const { tasks } = useTasks()
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Archived tasks keep all their details. Restore a task to bring it back, or delete it permanently.
      </p>
      <TaskList
        tasks={selectArchivedTasks(tasks)}
        variant="archived"
        emptyIcon={Archive}
        emptyTitle="No archived tasks"
        emptyText="Tasks you archive can be restored from here."
      />
    </div>
  )
}
