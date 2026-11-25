import { ListTodo, LoaderCircle } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { formatDateTime } from '@/lib/datetime'
import type { Task } from '@/types/task'
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
    <ul className="space-y-3" aria-label="Tasks">
      {tasks.map((task) => (
        <li key={task.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-medium break-words text-slate-900">{task.title}</h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm break-words whitespace-pre-line text-slate-600">
              {task.description}
            </p>
          )}
          <p className="mt-2 text-xs text-slate-400">
            Created <time dateTime={task.createdAt}>{formatDateTime(task.createdAt)}</time>
          </p>
        </li>
      ))}
    </ul>
  )
}
