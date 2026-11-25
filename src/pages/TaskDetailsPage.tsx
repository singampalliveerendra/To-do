import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
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
import type { Task } from '@/types/task'

/** Where the user came from, so "Back" returns there (set by task card links). */
export interface TaskDetailsLocationState {
  from?: string
}

interface TimelineEntry {
  label: string
  at: string
  className?: string
}

function buildTimeline(task: Task): TimelineEntry[] {
  const entries: TimelineEntry[] = [{ label: 'Created', at: task.createdAt }]
  if (task.updatedAt !== task.createdAt) entries.push({ label: 'Last edited', at: task.updatedAt })
  if (task.completedAt) entries.push({ label: 'Completed', at: task.completedAt, className: 'text-status-completed' })
  if (task.archivedAt) entries.push({ label: 'Archived', at: task.archivedAt, className: 'text-status-archived' })
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
        'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium',
        tone === 'primary' && 'bg-status-completed text-white hover:bg-green-700',
        tone === 'danger' && 'border border-status-overdue/40 text-status-overdue hover:bg-status-overdue/5',
        tone === 'default' && 'border border-slate-300 text-slate-700 hover:bg-slate-50',
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
      className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Back
    </Link>
  )

  if (status === 'loading') {
    return (
      <p className="flex items-center gap-2 py-8 text-sm text-slate-500" role="status">
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

      <article className="rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="task-title">
        <header className="space-y-3 border-b border-slate-100 p-5 sm:p-6">
          <TaskStatusBadge task={task} />
          <h2
            id="task-title"
            className={cn(
              'text-xl font-semibold break-words sm:text-2xl',
              task.completedAt && 'text-slate-500 line-through decoration-slate-400',
            )}
          >
            {task.title}
          </h2>

          <div className="flex flex-wrap gap-2 pt-1">
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
            <p role="alert" className="rounded-lg bg-status-overdue/10 px-3 py-2 text-sm text-status-overdue">
              {actionError}
            </p>
          )}
        </header>

        <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-3">
          <section aria-labelledby="description-heading" className="md:col-span-2">
            <h3 id="description-heading" className="mb-2 text-sm font-semibold text-slate-500">
              Description
            </h3>
            {task.description ? (
              <p className="text-sm leading-relaxed break-words whitespace-pre-line text-slate-800">
                {task.description}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">No description.</p>
            )}
          </section>

          <section aria-labelledby="history-heading">
            <h3 id="history-heading" className="mb-2 text-sm font-semibold text-slate-500">
              History
            </h3>
            <ol className="space-y-3 border-l-2 border-slate-100 pl-4" aria-label="Task history">
              {timeline.map((entry) => (
                <li key={entry.label} className="relative">
                  <span
                    className="absolute top-1.5 -left-[21px] size-2 rounded-full bg-slate-300"
                    aria-hidden="true"
                  />
                  <p className={cn('text-sm font-medium text-slate-700', entry.className)}>{entry.label}</p>
                  <time dateTime={entry.at} className="text-xs text-slate-500">
                    {formatDateTime(entry.at)}
                  </time>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </article>

      {dialogs}
    </div>
  )
}
