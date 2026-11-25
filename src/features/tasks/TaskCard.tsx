import { Archive, ArchiveRestore, Check, Pencil, Trash2, type LucideIcon } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
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

/** A small, quiet confetti pop when a task is completed (px offsets). */
const BURST = [
  { dx: 0, dy: -18, color: 'bg-accent' },
  { dx: 16, dy: -8, color: 'bg-status-completed' },
  { dx: 14, dy: 12, color: 'bg-ink' },
  { dx: -2, dy: 18, color: 'bg-accent' },
  { dx: -16, dy: 8, color: 'bg-status-completed' },
  { dx: -14, dy: -12, color: 'bg-ink' },
]

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
        'rounded-lg p-2 text-brand-500 transition-colors hover:bg-paper',
        danger ? 'hover:text-status-overdue' : 'hover:text-ink',
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
  // Increments on each completion to replay the confetti pop.
  const [burst, setBurst] = useState(0)
  const location = useLocation()

  async function toggle() {
    if (!onToggleComplete || toggling) return
    const completing = !isDone
    setToggling(true)
    try {
      await onToggleComplete(task)
      if (completing) setBurst((n) => n + 1)
    } finally {
      setToggling(false)
    }
  }

  return (
    <article
      className={cn(
        'group relative rounded-[14px] border-2 p-4 transition duration-150 sm:px-5',
        task.archivedAt
          ? 'border-dashed border-brand-400 bg-paper'
          : 'border-ink bg-white shadow-hard-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-hard',
      )}
    >
      <div className="flex items-start gap-3">
        {onToggleComplete && (
          <div className="relative mt-0.5 shrink-0">
            <button
              type="button"
              role="checkbox"
              aria-checked={isDone}
              aria-label={isDone ? `Mark ${name} as not complete` : `Mark ${name} as complete`}
              onClick={toggle}
              disabled={toggling}
              className={cn(
                'flex size-6 items-center justify-center rounded-full border-2 border-ink transition-colors duration-150 disabled:opacity-60',
                isDone
                  ? 'bg-status-completed text-white'
                  : 'bg-white text-transparent hover:bg-status-completed-soft hover:text-status-completed',
              )}
            >
              <Check
                key={isDone ? 'done' : 'open'}
                className={cn('size-3.5', isDone && 'animate-pop-in')}
                strokeWidth={3.5}
                aria-hidden="true"
              />
            </button>
            {burst > 0 && isDone && (
              <span key={burst} className="pointer-events-none absolute inset-0" aria-hidden="true" data-testid="burst">
                {BURST.map(({ dx, dy, color }, i) => (
                  <span
                    key={i}
                    className={cn('absolute top-1/2 left-1/2 -mt-1 -ml-1 size-2 animate-burst rounded-full', color)}
                    style={{ '--dx': `${dx}px`, '--dy': `${dy}px` } as CSSProperties}
                  />
                ))}
              </span>
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              'text-base leading-snug font-bold break-words',
              isDone ? 'text-brand-500 line-through decoration-brand-400 decoration-2' : 'text-ink',
            )}
          >
            <Link
              to={`/tasks/${task.id}`}
              state={{ from: location.pathname }}
              className="rounded-sm underline-offset-4 hover:underline"
            >
              {task.title}
            </Link>
          </h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed break-words whitespace-pre-line text-brand-600">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-brand-500">
            {task.completedAt && (
              <span className="rounded-full border border-status-completed/30 bg-status-completed-soft px-2 py-0.5 font-semibold text-status-completed">
                Completed <time dateTime={task.completedAt}>{formatDateTime(task.completedAt)}</time>
              </span>
            )}
            {task.archivedAt && (
              <span className="rounded-full border border-status-archived/30 bg-status-archived-soft px-2 py-0.5 font-semibold text-status-archived">
                Archived <time dateTime={task.archivedAt}>{formatDateTime(task.archivedAt)}</time>
              </span>
            )}
            <span>
              Created <time dateTime={task.createdAt}>{formatDateTime(task.createdAt)}</time>
            </span>
            {wasEdited && (
              <span>
                · Edited <time dateTime={task.updatedAt}>{formatDateTime(task.updatedAt)}</time>
              </span>
            )}
          </div>
        </div>

        {/* Quiet until hover/focus on larger screens; always visible on touch screens */}
        <div className="-mt-1.5 -mr-2 flex shrink-0 transition-opacity sm:opacity-60 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
          {onEdit && <IconButton icon={Pencil} label={`Edit ${name}`} onClick={() => onEdit(task)} />}
          {onArchive && <IconButton icon={Archive} label={`Archive ${name}`} onClick={() => onArchive(task)} />}
          {onRestore && <IconButton icon={ArchiveRestore} label={`Restore ${name}`} onClick={() => onRestore(task)} />}
          {onDelete && (
            <IconButton icon={Trash2} label={`Delete ${name} permanently`} onClick={() => onDelete(task)} danger />
          )}
        </div>
      </div>
    </article>
  )
}
