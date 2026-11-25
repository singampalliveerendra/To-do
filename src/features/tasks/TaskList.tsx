import { ListTodo, LoaderCircle, type LucideIcon } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import type { Task } from '@/types/task'
import { TaskCard } from './TaskCard'
import { useTasks } from './TasksContext'
import { useTaskActions } from './useTaskActions'

interface TaskListProps {
  tasks: Task[]
  emptyIcon?: LucideIcon
  emptyTitle?: string
  emptyText?: string
}

/**
 * List of task cards. Active tasks can be completed, edited and archived;
 * archived tasks can be restored or deleted permanently.
 */
export function TaskList({
  tasks,
  emptyIcon = ListTodo,
  emptyTitle = 'No tasks yet',
  emptyText = 'Click “New task” to add your first one.',
}: TaskListProps) {
  const { status, error } = useTasks()
  const { actionsFor, actionError, dialogs } = useTaskActions()

  if (status === 'loading') {
    return (
      <p className="flex items-center gap-2 py-8 text-sm text-brand-500" role="status">
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Loading tasks…
      </p>
    )
  }

  if (status === 'error') {
    return (
      <p role="alert" className="rounded-xl border-2 border-status-overdue bg-status-overdue-soft px-4 py-3 text-sm font-medium text-status-overdue">
        {error}
      </p>
    )
  }

  return (
    <>
      {actionError && (
        <p role="alert" className="mb-3 rounded-xl border-2 border-status-overdue bg-status-overdue-soft px-4 py-3 text-sm font-medium text-status-overdue">
          {actionError}
        </p>
      )}

      {tasks.length === 0 ? (
        <EmptyState icon={emptyIcon} title={emptyTitle}>
          {emptyText}
        </EmptyState>
      ) : (
        <ul className="space-y-3" aria-label="Tasks">
          {tasks.map((task, i) => (
            // Cards slide in one after another (capped so long lists don't wait).
            <li key={task.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}>
              <TaskCard task={task} {...actionsFor(task)} />
            </li>
          ))}
        </ul>
      )}

      {dialogs}
    </>
  )
}
