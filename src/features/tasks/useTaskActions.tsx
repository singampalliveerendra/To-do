import { useCallback, useState } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import type { Task } from '@/types/task'
import { EditTaskDialog } from './EditTaskDialog'
import type { TaskCardActions } from './TaskCard'
import { useTasks } from './TasksContext'

type PendingConfirm = { kind: 'archive' | 'delete'; task: Task } | null

interface Options {
  /** Called after a task has been permanently deleted (e.g. to leave its details page). */
  onDeleted?: (task: Task) => void
}

/**
 * Shared task actions (complete/reopen, edit, archive, restore, delete) with
 * their confirmation and edit dialogs, so the task list and the details page
 * behave exactly the same.
 *
 * Render `dialogs` once, and show `actionError` near the actions.
 */
export function useTaskActions({ onDeleted }: Options = {}) {
  const { completeTask, reopenTask, archiveTask, restoreTask, deleteTask } = useTasks()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [confirm, setConfirm] = useState<PendingConfirm>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  // Stable references so dialogs do not re-run their open/focus effects on every render.
  const closeEditor = useCallback(() => setEditingTask(null), [])
  const closeConfirm = useCallback(() => setConfirm(null), [])

  /** Runs a one-click action, keeping any error for display. */
  async function run(action: () => Promise<unknown>, fallback: string) {
    setActionError(null)
    try {
      await action()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : fallback)
    }
  }

  /** The actions that make sense for this task: active tasks vs archived tasks. */
  function actionsFor(task: Task): TaskCardActions {
    if (task.archivedAt) {
      return {
        onRestore: (t) => run(() => restoreTask(t.id), 'Could not restore the task.'),
        onDelete: (t) => setConfirm({ kind: 'delete', task: t }),
      }
    }
    return {
      onToggleComplete: (t) =>
        run(
          () => (t.completedAt ? reopenTask(t.id) : completeTask(t.id)),
          'Could not update the task. Please try again.',
        ),
      onEdit: setEditingTask,
      onArchive: (t) => setConfirm({ kind: 'archive', task: t }),
    }
  }

  const dialogs = (
    <>
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
          <strong className="font-medium break-words text-ink">“{confirm?.task.title}”</strong> will move to{' '}
          <strong className="font-medium text-ink">Archived</strong>. All its details are kept and you can
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
          if (!confirm) return
          await deleteTask(confirm.task.id)
          closeConfirm()
          onDeleted?.(confirm.task)
        }}
      >
        <p>
          <strong className="font-medium break-words text-ink">“{confirm?.task.title}”</strong> and all its
          details will be deleted forever.
        </p>
        <p className="font-medium text-status-overdue">This cannot be undone.</p>
      </ConfirmDialog>
    </>
  )

  return { actionsFor, actionError, dialogs }
}
