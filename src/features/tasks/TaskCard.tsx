import { Archive, ArchiveRestore, Check, Pencil, Trash2, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/lib/datetime'
import type { Task } from '@/types/task'

export interface TaskCardActions {
  /** When set, the card shows a completion checkbox. */
  onToggleComplete?: (task: Task) => Promise<unknown>
  onEdit?: (task: Task) => void
  onArchive?: (task: Task) => void
  onRestore?: (task: Task) => void
  onDelete?: (task: Task) => void
}

interface TaskCardProps extends TaskCardActions {
  task: Task
}

function IconButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label.split(' "')[0]}
      className={cn(
        'rounded-md p-2 text-slate-400 hover:bg-slate-100',
        danger ? 'hover:text-status-overdue' : 'hover:text-slate-700',
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  )
}

export function TaskCard({ task, onToggleComplete, onEdit, onArchive, onRestore, onDelete }: TaskCardProps) {
  const wasEdited = task.updatedAt !== task.createdAt
  const isDone = task.completedAt !== null
  const name = `"${task.title}"`
  const [toggling, setToggling] = useState(false)
  const location = useLocation()

  async function toggle() {
    if (!onToggleComplete || toggling) return
    setToggling(true)
    try {
      await onToggleComplete(task)
    } finally {
      setToggling(false)
    }
  }

  return (
    <article
      className={cn(
        'rounded-xl border bg-white p-4 shadow-sm',
        task.archivedAt ? 'border-dashed border-slate-300' : 'border-slate-200',
      )}
    >
      <div className="flex items-start gap-3">
        {onToggleComplete && (
          <button
            type="button"
            role="checkbox"
            aria-checked={isDone}
            aria-label={isDone ? `Mark ${name} as not complete` : `Mark ${name} as complete`}
            onClick={toggle}
            disabled={toggling}
            className={cn(
              'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors disabled:opacity-50',
              isDone
                ? 'border-status-completed bg-status-completed text-white'
                : 'border-slate-300 text-transparent hover:border-status-completed hover:text-status-completed/40',
            )}
          >
            <Check className="size-3" strokeWidth={3} aria-hidden="true" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              'font-medium break-words',
              isDone && 'text-slate-500 line-through decoration-slate-400',
              !isDone && (task.archivedAt ? 'text-slate-600' : 'text-slate-900'),
            )}
          >
            <Link
              to={`/tasks/${task.id}`}
              state={{ from: location.pathname }}
              className="rounded-sm hover:text-brand-700 hover:underline"
            >
              {task.title}
            </Link>
          </h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm break-words whitespace-pre-line text-slate-600">
              {task.description}
            </p>
          )}
        </div>
        <div className="-mt-1 -mr-1 flex shrink-0">
          {onEdit && <IconButton icon={Pencil} label={`Edit ${name}`} onClick={() => onEdit(task)} />}
          {onArchive && <IconButton icon={Archive} label={`Archive ${name}`} onClick={() => onArchive(task)} />}
          {onRestore && <IconButton icon={ArchiveRestore} label={`Restore ${name}`} onClick={() => onRestore(task)} />}
          {onDelete && (
            <IconButton icon={Trash2} label={`Delete ${name} permanently`} onClick={() => onDelete(task)} danger />
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Created <time dateTime={task.createdAt}>{formatDateTime(task.createdAt)}</time>
        {wasEdited && (
          <>
            {' · '}Edited <time dateTime={task.updatedAt}>{formatDateTime(task.updatedAt)}</time>
          </>
        )}
        {task.completedAt && (
          <>
            {' · '}
            <span className="font-medium text-status-completed">
              Completed <time dateTime={task.completedAt}>{formatDateTime(task.completedAt)}</time>
            </span>
          </>
        )}
        {task.archivedAt && (
          <>
            {' · '}Archived <time dateTime={task.archivedAt}>{formatDateTime(task.archivedAt)}</time>
          </>
        )}
      </p>
    </article>
  )
}
