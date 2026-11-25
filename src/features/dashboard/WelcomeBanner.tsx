import { Hand, PartyPopper, Sparkles, Star } from 'lucide-react'
import { completionPercent, getGreeting, getMotivation } from '@/lib/greeting'

interface WelcomeBannerProps {
  pending: number
  completed: number
  /** Injectable clock for tests. */
  now?: Date
}

const dateFormat = new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' })

function ProgressRing({ percent, label }: { percent: number; label: string }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  return (
    <div className="relative size-20 shrink-0 sm:size-32" role="img" aria-label={label}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="10" className="stroke-white/25" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className="stroke-white transition-[stroke-dashoffset] duration-700 ease-out"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span className="font-display text-xl font-extrabold sm:text-3xl">{percent}%</span>
        <span className="text-[10px] font-semibold sm:text-xs">done</span>
      </div>
    </div>
  )
}

/** Big gradient greeting with a completion ring. */
export function WelcomeBanner({ pending, completed, now = new Date() }: WelcomeBannerProps) {
  const percent = completionPercent(pending, completed)
  const total = pending + completed
  const allDone = total > 0 && pending === 0

  return (
    <section
      aria-labelledby="welcome-heading"
      className="bg-gradient-button-animated shadow-glow relative animate-fade-up overflow-hidden rounded-4xl p-6 text-white sm:p-8"
    >
      {/* Decoration */}
      <div aria-hidden="true">
        <div className="absolute -top-16 -right-10 size-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-white/10" />
        <Sparkles className="absolute top-5 right-[38%] size-6 animate-float text-pop-yellow" />
        <Star className="absolute bottom-6 left-[45%] size-4 animate-float-slow fill-white/60 text-white/60" />
        <span className="absolute top-10 left-[60%] size-2 animate-float rounded-full bg-pop-cyan" />
      </div>

      <div className="relative flex items-center justify-between gap-4 sm:gap-6">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{dateFormat.format(now)}</p>
          <h2 id="welcome-heading" className="mt-1 font-display text-2xl font-extrabold sm:text-4xl">
            {getGreeting(now)}!{' '}
            {allDone ? (
              <PartyPopper className="inline size-8 animate-wiggle align-[-4px]" aria-hidden="true" />
            ) : (
              <Hand className="inline size-7 origin-bottom-right animate-wiggle align-[-3px] [animation-iteration-count:3]" aria-hidden="true" />
            )}
          </h2>
          <p className="mt-2 max-w-md text-sm font-medium sm:text-base" data-testid="motivation">
            {getMotivation(pending, completed)}
          </p>
        </div>
        <ProgressRing percent={percent} label={`${completed} of ${total} tasks completed (${percent}%)`} />
      </div>
    </section>
  )
}
