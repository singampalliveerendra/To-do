import { cn } from '@/lib/cn'
import type { Task } from '@/types/task'

type BadgeStatus = 'pending' | 'completed' | 'archived'

const STYLES: Record<BadgeStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'border-status-pending/30 bg-status-pending-soft text-status-pending' },
  completed: { label: 'Completed', className: 'border-status-completed/30 bg-status-completed-soft text-status-completed' },
  archived: { label: 'Archived', className: 'border-status-archived/30 bg-status-archived-soft text-status-archived' },
}

/** Overdue / Completed Late are added with deadlines in Milestone 4. */
export function getBadgeStatus(task: Task): BadgeStatus {
  if (task.archivedAt) return 'archived'
  if (task.completedAt) return 'completed'
  return 'pending'
}

export function TaskStatusBadge({ task }: { task: Task }) {
  const { label, className } = STYLES[getBadgeStatus(task)]
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold', className)}
      data-testid="task-status"
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  )
}
