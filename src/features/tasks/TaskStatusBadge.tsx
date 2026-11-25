import { cn } from '@/lib/cn'
import type { Task } from '@/types/task'

type BadgeStatus = 'pending' | 'completed' | 'archived'

const STYLES: Record<BadgeStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-status-pending/10 text-status-pending' },
  completed: { label: 'Completed', className: 'bg-status-completed/10 text-status-completed' },
  archived: { label: 'Archived', className: 'bg-status-archived/10 text-status-archived' },
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
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', className)}
      data-testid="task-status"
    >
      {label}
    </span>
  )
}
