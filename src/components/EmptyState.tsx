import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  children?: ReactNode
}

/** Quiet placeholder for an empty list: one outlined icon tile, a title, a hint. */
export function EmptyState({ icon: Icon, title, children }: EmptyStateProps) {
  return (
    <div className="flex animate-fade-up flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-300 bg-white/70 px-6 py-12 text-center">
      <div className="relative mb-5" aria-hidden="true">
        {/* A second tile peeking out behind gives a little depth without decoration */}
        <span className="absolute inset-0 translate-x-2 translate-y-1 rotate-6 rounded-2xl border-2 border-ink bg-paper-deep" />
        <span className="relative flex size-16 -rotate-3 items-center justify-center rounded-2xl border-2 border-ink bg-accent-soft">
          <Icon className="size-8 text-ink" strokeWidth={1.75} />
        </span>
      </div>
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      {children && <div className="mt-1 max-w-sm text-sm text-brand-600">{children}</div>}
    </div>
  )
}
