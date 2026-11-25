import { Archive, ArchiveRestore, Pencil, Trash2, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/lib/datetime'
import type { Task } from '@/types/task'

export interface TaskCardActions {
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

export function TaskCard({ task, onEdit, onArchive, onRestore, onDelete }: TaskCardProps) {
  const wasEdited = task.updatedAt !== task.createdAt
  const name = `"${task.title}"`

  return (
    <article
      className={cn(
        'rounded-xl border bg-white p-4 shadow-sm',
        task.archivedAt ? 'border-dashed border-slate-300' : 'border-slate-200',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className={cn('font-medium break-words', task.archivedAt ? 'text-slate-600' : 'text-slate-900')}>
            {task.title}
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
        {task.archivedAt && (
          <>
            {' · '}Archived <time dateTime={task.archivedAt}>{formatDateTime(task.archivedAt)}</time>
          </>
        )}
      </p>
    </article>
  )
}
