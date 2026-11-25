import type { LucideIcon } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'

interface TaskViewPageProps {
  icon: LucideIcon
  emptyTitle: string
  emptyText: string
}

/** Placeholder for the Pending / Overdue / Completed / Archived views (filled in Milestones 2–4). */
export function TaskViewPage({ icon, emptyTitle, emptyText }: TaskViewPageProps) {
  return (
    <EmptyState icon={icon} title={emptyTitle}>
      {emptyText}
    </EmptyState>
  )
}
