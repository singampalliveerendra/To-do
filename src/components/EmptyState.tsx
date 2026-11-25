import { Sparkles, Star, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  children?: ReactNode
}

/** Friendly, illustrated placeholder shown when a list has nothing in it. */
export function EmptyState({ icon: Icon, title, children }: EmptyStateProps) {
  return (
    <div className="relative flex animate-fade-up flex-col items-center justify-center overflow-hidden rounded-4xl border-2 border-dashed border-brand-200 bg-white/50 px-6 py-14 text-center backdrop-blur-sm">
      {/* Illustration: glowing blob, orbit ring, floating tile and sparkles */}
      <div className="relative mb-6 size-24" aria-hidden="true">
        <div className="bg-gradient-brand absolute -inset-6 rounded-full opacity-25 blur-2xl" />
        <div className="absolute -inset-3 animate-spin-slow rounded-full border-2 border-dashed border-brand-300/70" />
        <div className="shadow-card relative flex size-24 -rotate-6 animate-float items-center justify-center rounded-3xl bg-white">
          <Icon className="size-11 text-brand-500" strokeWidth={1.75} />
        </div>
        <Sparkles className="absolute -top-4 -right-5 size-6 animate-float-slow text-pop-orange" />
        <Star className="absolute -bottom-3 -left-6 size-5 animate-float fill-pop-pink/40 text-pop-pink" />
        <span className="absolute top-3 -left-7 size-2.5 rounded-full bg-pop-cyan" />
        <span className="absolute -right-6 bottom-4 size-2 rounded-full bg-pop-lime" />
      </div>
      <h2 className="font-display text-xl font-bold text-slate-800">{title}</h2>
      {children && <div className="mt-1 max-w-sm text-sm text-slate-600">{children}</div>}
    </div>
  )
}
