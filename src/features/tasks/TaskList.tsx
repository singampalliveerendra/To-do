import { ListTodo, LoaderCircle } from 'lucide-react'
import { useCallback, useState } from 'react'
import { EmptyState } from '@/components/EmptyState'
import type { Task } from '@/types/task'
import { EditTaskDialog } from './EditTaskDialog'
import { TaskCard } from './TaskCard'
import { useTasks } from './TasksContext'

interface TaskListProps {
  tasks: Task[]
  emptyTitle?: string
  emptyText?: string
}

export function TaskList({
  tasks,
  emptyTitle = 'No tasks yet',
  emptyText = 'Click “New task” to add your first one.',
}: TaskListProps) {
  const { status, error } = useTasks()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  // Stable reference so the dialog does not re-run its open/focus effect on every render.
  const closeEditor = useCallback(() => setEditingTask(null), [])

  if (status === 'loading') {
    return (
      <p className="flex items-center gap-2 py-8 text-sm text-slate-500" role="status">
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Loading tasks…
      </p>
    )
  }

  if (status === 'error') {
    return (
      <p role="alert" className="rounded-lg bg-status-overdue/10 px-4 py-3 text-sm text-status-overdue">
        {error}
      </p>
    )
  }

  if (tasks.length === 0) {
    return (
      <EmptyState icon={ListTodo} title={emptyTitle}>
        {emptyText}
      </EmptyState>
    )
  }

  return (
    <>
      <ul className="space-y-3" aria-label="Tasks">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard task={task} onEdit={setEditingTask} />
          </li>
        ))}
      </ul>
      <EditTaskDialog task={editingTask} onClose={closeEditor} />
    </>
  )
}
