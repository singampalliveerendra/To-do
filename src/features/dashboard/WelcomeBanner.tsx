import { Hand, PartyPopper } from 'lucide-react'
import { completionPercent, getGreeting, getMotivation } from '@/lib/greeting'

interface WelcomeBannerProps {
  pending: number
  completed: number
  /** Injectable clock for tests. */
  now?: Date
}

const dateFormat = new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' })

/** Calm greeting card with an overall progress bar. */
export function WelcomeBanner({ pending, completed, now = new Date() }: WelcomeBannerProps) {
  const percent = completionPercent(pending, completed)
  const total = pending + completed
  const allDone = total > 0 && pending === 0
  const summary = `${completed} of ${total} tasks completed (${percent}%)`

  return (
    <section aria-labelledby="welcome-heading" className="surface animate-fade-up p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-brand-500">{dateFormat.format(now)}</p>
          <h2 id="welcome-heading" className="mt-0.5 flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {getGreeting(now)}
            {allDone ? (
              <PartyPopper className="size-6 shrink-0 text-ink" aria-hidden="true" />
            ) : (
              <Hand className="size-6 shrink-0 text-ink" aria-hidden="true" />
            )}
          </h2>
          <p className="mt-1 text-sm text-brand-600 sm:text-base" data-testid="motivation">
            {getMotivation(pending, completed)}
          </p>
        </div>
        <p className="shrink-0 text-right" aria-hidden="true">
          <span className="block font-display text-3xl leading-none font-extrabold sm:text-4xl">{percent}%</span>
          <span className="text-xs font-semibold text-brand-500">done</span>
        </p>
      </div>

      <div className="mt-5">
        <div
          role="progressbar"
          aria-label="Tasks completed"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={summary}
          className="h-3.5 overflow-hidden rounded-full border-2 border-ink bg-paper"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-brand-500">
          <span className="font-semibold text-ink">{completed}</span> of {total} done
        </p>
      </div>
    </section>
  )
}
