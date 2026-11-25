import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  children?: ReactNode
}

/** Friendly placeholder shown when a list has nothing in it. */
export function EmptyState({ icon: Icon, title, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <Icon className="mb-3 size-10 text-slate-300" aria-hidden="true" />
      <h2 className="font-semibold text-slate-800">{title}</h2>
      {children && <div className="mt-1 max-w-sm text-sm text-slate-500">{children}</div>}
    </div>
  )
}
