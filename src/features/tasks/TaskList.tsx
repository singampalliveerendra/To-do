import { ListTodo, LoaderCircle, type LucideIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EmptyState } from '@/components/EmptyState'
import type { Task } from '@/types/task'
import { EditTaskDialog } from './EditTaskDialog'
import { TaskCard } from './TaskCard'
import { useTasks } from './TasksContext'

interface TaskListProps {
  tasks: Task[]
  /** `active` cards can be edited/archived; `archived` cards can be restored/deleted. */
  variant?: 'active' | 'archived'
  emptyIcon?: LucideIcon
  emptyTitle?: string
  emptyText?: string
}

type PendingConfirm = { kind: 'archive' | 'delete'; task: Task } | null

export function TaskList({
  tasks,
  variant = 'active',
  emptyIcon = ListTodo,
  emptyTitle = 'No tasks yet',
  emptyText = 'Click “New task” to add your first one.',
}: TaskListProps) {
  const { status, error, completeTask, reopenTask, archiveTask, restoreTask, deleteTask } = useTasks()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [confirm, setConfirm] = useState<PendingConfirm>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  // Stable references so dialogs do not re-run their open/focus effects on every render.
  const closeEditor = useCallback(() => setEditingTask(null), [])
  const closeConfirm = useCallback(() => setConfirm(null), [])

  /** Runs a one-click action, showing any error above the list. */
  async function run(action: () => Promise<unknown>, fallback: string) {
    setActionError(null)
    try {
      await action()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : fallback)
    }
  }

  const handleRestore = (task: Task) => run(() => restoreTask(task.id), 'Could not restore the task.')
  const handleToggleComplete = (task: Task) =>
    run(
      () => (task.completedAt ? reopenTask(task.id) : completeTask(task.id)),
      'Could not update the task. Please try again.',
    )

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

  const actions =
    variant === 'active'
      ? {
          onToggleComplete: handleToggleComplete,
          onEdit: setEditingTask,
          onArchive: (task: Task) => setConfirm({ kind: 'archive', task }),
        }
      : { onRestore: handleRestore, onDelete: (task: Task) => setConfirm({ kind: 'delete', task }) }

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
              <TaskCard task={task} {...actions} />
            </li>
          ))}
        </ul>
      )}

      <EditTaskDialog task={editingTask} onClose={closeEditor} />

      <ConfirmDialog
        open={confirm?.kind === 'archive'}
        title="Archive this task?"
        confirmLabel="Archive"
        onCancel={closeConfirm}
        onConfirm={async () => {
          if (confirm) await archiveTask(confirm.task.id)
          closeConfirm()
        }}
      >
        <p>
          <strong className="font-medium break-words text-slate-900">“{confirm?.task.title}”</strong> will move to{' '}
          <strong className="font-medium text-slate-900">Archived</strong>. All its details are kept and you can
          restore it at any time.
        </p>
      </ConfirmDialog>

      <ConfirmDialog
        open={confirm?.kind === 'delete'}
        title="Delete permanently?"
        confirmLabel="Delete permanently"
        tone="danger"
        onCancel={closeConfirm}
        onConfirm={async () => {
          if (confirm) await deleteTask(confirm.task.id)
          closeConfirm()
        }}
      >
        <p>
          <strong className="font-medium break-words text-slate-900">“{confirm?.task.title}”</strong> and all its
          details will be deleted forever.
        </p>
        <p className="font-medium text-status-overdue">This cannot be undone.</p>
      </ConfirmDialog>
    </>
  )
}
