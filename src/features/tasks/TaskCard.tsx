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

/** Confetti directions for the completion burst (px offsets). */
const BURST = [
  { dx: 0, dy: -30, color: 'bg-pop-pink' },
  { dx: 21, dy: -21, color: 'bg-pop-yellow' },
  { dx: 30, dy: 0, color: 'bg-pop-cyan' },
  { dx: 21, dy: 21, color: 'bg-pop-lime' },
  { dx: 0, dy: 30, color: 'bg-pop-orange' },
  { dx: -21, dy: 21, color: 'bg-brand-400' },
  { dx: -30, dy: 0, color: 'bg-pop-fuchsia' },
  { dx: -21, dy: -21, color: 'bg-pop-sky' },
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
        'rounded-xl p-2 text-slate-500 transition hover:scale-110 hover:bg-white',
        danger ? 'hover:text-status-overdue' : 'hover:text-brand-700',
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
  // Increments on each completion to replay the confetti burst.
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

  const accent = task.archivedAt
    ? 'bg-slate-300'
    : isDone
      ? 'bg-gradient-to-b from-emerald-400 to-lime-400'
      : 'bg-gradient-to-b from-brand-500 via-pop-fuchsia to-pop-orange'

  return (
    <article
      className={cn(
        'group shadow-card relative overflow-hidden rounded-3xl border p-4 pl-6 backdrop-blur-md transition duration-300',
        'hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-glow',
        task.archivedAt ? 'border-dashed border-slate-300 bg-white/50' : 'border-white/70 bg-white/70',
      )}
    >
      {/* Status colour strip */}
      <span className={cn('absolute inset-y-0 left-0 w-1.5', accent)} aria-hidden="true" data-testid="card-accent" />

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
                'flex size-6 items-center justify-center rounded-full border-2 transition duration-200 hover:scale-110 active:scale-90 disabled:opacity-60',
                isDone
                  ? 'border-transparent bg-gradient-to-br from-emerald-500 to-lime-500 text-white shadow-md shadow-emerald-500/30'
                  : 'border-brand-300 bg-white text-transparent hover:border-emerald-500 hover:text-emerald-500/50',
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
                    className={cn('absolute top-1/2 left-1/2 -mt-1.25 -ml-1.25 size-2.5 animate-burst rounded-full', color)}
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
              'font-display text-[17px] font-bold break-words',
              isDone && 'text-slate-500 line-through decoration-emerald-400 decoration-2',
              !isDone && (task.archivedAt ? 'text-slate-600' : 'text-slate-900'),
            )}
          >
            <Link
              to={`/tasks/${task.id}`}
              state={{ from: location.pathname }}
              className="rounded-sm transition-colors hover:text-brand-700"
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
        <div className="-mt-1 -mr-1 flex shrink-0 opacity-80 transition-opacity group-hover:opacity-100">
          {onEdit && <IconButton icon={Pencil} label={`Edit ${name}`} onClick={() => onEdit(task)} />}
          {onArchive && <IconButton icon={Archive} label={`Archive ${name}`} onClick={() => onArchive(task)} />}
          {onRestore && <IconButton icon={ArchiveRestore} label={`Restore ${name}`} onClick={() => onRestore(task)} />}
          {onDelete && (
            <IconButton icon={Trash2} label={`Delete ${name} permanently`} onClick={() => onDelete(task)} danger />
          )}
        </div>
      </div>
      <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500">
        <span>
          Created <time dateTime={task.createdAt}>{formatDateTime(task.createdAt)}</time>
        </span>
        {wasEdited && (
          <span>
            · Edited <time dateTime={task.updatedAt}>{formatDateTime(task.updatedAt)}</time>
          </span>
        )}
        {task.completedAt && (
          <span className="rounded-full bg-emerald-50 px-2 font-semibold text-status-completed">
            Completed <time dateTime={task.completedAt}>{formatDateTime(task.completedAt)}</time>
          </span>
        )}
        {task.archivedAt && (
          <span className="rounded-full bg-slate-100 px-2 font-semibold text-status-archived">
            Archived <time dateTime={task.archivedAt}>{formatDateTime(task.archivedAt)}</time>
          </span>
        )}
      </p>
    </article>
  )
}
