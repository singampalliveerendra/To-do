import { Pencil } from 'lucide-react'
import { formatDateTime } from '@/lib/datetime'
import type { Task } from '@/types/task'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const wasEdited = task.updatedAt !== task.createdAt

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium break-words text-slate-900">{task.title}</h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm break-words whitespace-pre-line text-slate-600">
              {task.description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="-mt-1 -mr-1 shrink-0 rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label={`Edit "${task.title}"`}
          title="Edit"
        >
          <Pencil className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Created <time dateTime={task.createdAt}>{formatDateTime(task.createdAt)}</time>
        {wasEdited && (
          <>
            {' · '}Edited <time dateTime={task.updatedAt}>{formatDateTime(task.updatedAt)}</time>
          </>
        )}
      </p>
    </article>
  )
}
