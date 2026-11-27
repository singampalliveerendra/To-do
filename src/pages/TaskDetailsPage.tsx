import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  CalendarDays,
  CircleCheckBig,
  FileQuestion,
  LoaderCircle,
  Pencil,
  RotateCcw,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { EmptyState } from '@/components/EmptyState'
import { TaskStatusBadge } from '@/features/tasks/TaskStatusBadge'
import { useTasks } from '@/features/tasks/TasksContext'
import { useTaskActions } from '@/features/tasks/useTaskActions'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/lib/datetime'
import { formatDueDate } from '@/lib/deadline'
import type { Task } from '@/types/task'

/** Where the user came from, so "Back" returns there (set by task card links). */
export interface TaskDetailsLocationState {
  from?: string
}

interface TimelineEntry {
  label: string
  at: string
  className?: string
  /** Dot colour on the timeline */
  dot: string
}

function buildTimeline(task: Task): TimelineEntry[] {
  const entries: TimelineEntry[] = [{ label: 'Created', at: task.createdAt, dot: 'bg-accent' }]
  if (task.updatedAt !== task.createdAt) entries.push({ label: 'Last edited', at: task.updatedAt, dot: 'bg-white' })
  if (task.completedAt)
    entries.push({ label: 'Completed', at: task.completedAt, className: 'text-status-completed', dot: 'bg-status-completed' })
  if (task.archivedAt)
    entries.push({ label: 'Archived', at: task.archivedAt, className: 'text-status-archived', dot: 'bg-status-archived' })
  // Oldest first, so it reads as a history.
  return entries.sort((a, b) => a.at.localeCompare(b.at))
}

function ActionButton({
  icon: Icon,
  children,
  onClick,
  tone = 'default',
}: {
  icon: LucideIcon
  children: string
  onClick: () => void
  tone?: 'default' | 'primary' | 'danger'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'btn-press inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-sm font-semibold',
        tone === 'primary' && 'bg-accent font-bold text-ink',
        tone === 'danger' && 'bg-white text-status-overdue',
        tone === 'default' && 'bg-white text-ink',
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {children}
    </button>
  )
}

export function TaskDetailsPage() {
  const { taskId } = useParams()
  const { tasks, status } = useTasks()
  const location = useLocation()
  const navigate = useNavigate()
  const backTo = (location.state as TaskDetailsLocationState | null)?.from ?? '/'
  const { actionsFor, actionError, dialogs } = useTaskActions({
    onDeleted: () => navigate('/archived', { replace: true }),
  })

  const backLink = (
    <Link
      to={backTo}
      className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-brand-600 hover:text-ink"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Back
    </Link>
  )

  if (status === 'loading') {
    return (
      <p className="flex items-center gap-2 py-8 text-sm text-brand-500" role="status">
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Loading task…
      </p>
    )
  }

  const task = tasks.find((t) => t.id === taskId)

  if (!task) {
    return (
      <div className="space-y-4">
        {backLink}
        <EmptyState icon={FileQuestion} title="Task not found">
          It may have been deleted, or the link is wrong.
        </EmptyState>
        {/* Keep dialogs mounted so a just-finished delete can close cleanly. */}
        {dialogs}
      </div>
    )
  }

  const actions = actionsFor(task)
  const timeline = buildTimeline(task)

  return (
    <div className="space-y-4">
      {backLink}

      <article className="surface overflow-hidden" aria-labelledby="task-title">
        <header className="space-y-3 border-b-2 border-ink p-5 sm:p-7">
          <TaskStatusBadge task={task} />
          <h2
            id="task-title"
            className={cn(
              'font-display text-2xl font-extrabold tracking-tight break-words sm:text-3xl',
              task.completedAt && 'text-brand-500 line-through decoration-brand-400 decoration-2',
            )}
          >
            {task.title}
          </h2>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {actions.onToggleComplete &&
              (task.completedAt ? (
                <ActionButton icon={RotateCcw} onClick={() => actions.onToggleComplete?.(task)}>
                  Reopen
                </ActionButton>
              ) : (
                <ActionButton icon={CircleCheckBig} tone="primary" onClick={() => actions.onToggleComplete?.(task)}>
                  Mark complete
                </ActionButton>
              ))}
            {actions.onEdit && (
              <ActionButton icon={Pencil} onClick={() => actions.onEdit?.(task)}>
                Edit
              </ActionButton>
            )}
            {actions.onArchive && (
              <ActionButton icon={Archive} onClick={() => actions.onArchive?.(task)}>
                Archive
              </ActionButton>
            )}
            {actions.onRestore && (
              <ActionButton icon={ArchiveRestore} onClick={() => actions.onRestore?.(task)}>
                Restore
              </ActionButton>
            )}
            {actions.onDelete && (
              <ActionButton icon={Trash2} tone="danger" onClick={() => actions.onDelete?.(task)}>
                Delete permanently
              </ActionButton>
            )}
          </div>

          {actionError && (
            <p
              role="alert"
              className="rounded-xl border-2 border-status-overdue bg-status-overdue-soft px-3 py-2 text-sm font-medium text-status-overdue"
            >
              {actionError}
            </p>
          )}
        </header>

        <div className="grid gap-8 bg-paper/50 p-5 sm:p-7 md:grid-cols-3">
          <section aria-labelledby="description-heading" className="md:col-span-2">
            <h3 id="description-heading" className="mb-2 text-xs font-bold tracking-[0.12em] text-brand-500 uppercase">
              Description
            </h3>
            {task.description ? (
              <p className="text-[15px] leading-relaxed break-words whitespace-pre-line text-ink">{task.description}</p>
            ) : (
              <p className="text-sm text-brand-500 italic">No description.</p>
            )}
          </section>

          <div className="space-y-8">
            <section aria-labelledby="due-heading">
              <h3 id="due-heading" className="mb-2 text-xs font-bold tracking-[0.12em] text-brand-500 uppercase">
                Target date
              </h3>
              {task.dueAt ? (
                <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                  <CalendarDays className="size-4 text-brand-500" aria-hidden="true" />
                  <time dateTime={task.dueAt}>{formatDueDate(task.dueAt)}</time>
                </p>
              ) : (
                <p className="text-sm text-brand-500 italic">No target date.</p>
              )}
            </section>

            <section aria-labelledby="history-heading">
              <h3 id="history-heading" className="mb-3 text-xs font-bold tracking-[0.12em] text-brand-500 uppercase">
                History
              </h3>
              <ol className="space-y-4 border-l-2 border-dashed border-brand-300 pl-5" aria-label="Task history">
                {timeline.map((entry) => (
                  <li key={entry.label} className="relative">
                    <span
                      className={cn('absolute top-0.5 -left-[29px] size-3.5 rounded-full border-2 border-ink', entry.dot)}
                      aria-hidden="true"
                    />
                    <p className={cn('text-sm font-semibold text-ink', entry.className)}>{entry.label}</p>
                    <time dateTime={entry.at} className="text-xs text-brand-500">
                      {formatDateTime(entry.at)}
                    </time>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </article>

      {dialogs}
    </div>
  )
}
