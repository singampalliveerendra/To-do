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

  return (
    <>
      {actionError && (
        <p role="alert" className="mb-3 rounded-lg bg-status-overdue/10 px-4 py-3 text-sm text-status-overdue">
          {actionError}
        </p>
      )}

      {tasks.length === 0 ? (
        <EmptyState icon={emptyIcon} title={emptyTitle}>
          {emptyText}
        </EmptyState>
      ) : (
        <ul className="space-y-3" aria-label="Tasks">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} {...actionsFor(task)} />
            </li>
          ))}
        </ul>
      )}

      {dialogs}
    </>
  )
}
