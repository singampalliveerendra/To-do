import { Link } from 'react-router'
import { NAV_ITEMS } from '@/app/navigation'
import { WelcomeBanner } from '@/features/dashboard/WelcomeBanner'
import { TaskList } from '@/features/tasks/TaskList'
import { useTasks } from '@/features/tasks/TasksContext'
import { selectActiveTasks, selectCompletedTasks, selectPendingTasks } from '@/features/tasks/taskSelectors'
import { cn } from '@/lib/cn'

/** Summary cards link to each status view. */
const SUMMARY_ITEMS = NAV_ITEMS.filter((item) => item.to !== '/' && item.to !== '/archived')

/** Per-card gradient for the icon tile and the glow behind it. */
const CARD_STYLE: Record<string, { gradient: string; hint: string }> = {
  Pending: { gradient: 'from-blue-500 to-sky-400', hint: 'still on time' },
  Overdue: { gradient: 'from-rose-500 to-orange-400', hint: 'past their deadline' },
  Completed: { gradient: 'from-emerald-500 to-lime-400', hint: 'nicely done' },
}

export function DashboardPage() {
  const { tasks: allTasks } = useTasks()
  const tasks = selectActiveTasks(allTasks)
  const pending = selectPendingTasks(allTasks).length
  const completed = selectCompletedTasks(allTasks).length

  // Overdue needs deadlines (Milestone 3) and is wired up in Task 4.2.
  const counts: Record<string, number> = { Pending: pending, Overdue: 0, Completed: completed }

  return (
    <div className="space-y-8">
      <WelcomeBanner pending={pending} completed={completed} />

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Task summary
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SUMMARY_ITEMS.map(({ to, label, icon: Icon }, i) => {
            const style = CARD_STYLE[label]
            return (
              <li key={to} className="animate-fade-up" style={{ animationDelay: `${80 + i * 70}ms` }}>
                <Link
                  to={to}
                  className="group shadow-card relative flex items-center gap-4 overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-glow"
                >
                  <span
                    className={cn(
                      'absolute -top-8 -right-8 size-24 rounded-full bg-gradient-to-br opacity-20 blur-xl transition-transform duration-500 group-hover:scale-150',
                      style.gradient,
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      'relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6',
                      style.gradient,
                    )}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="relative">
                    <span className="block text-sm font-semibold text-slate-600">{label}</span>
                    <span
                      className="block font-display text-4xl leading-tight font-extrabold text-slate-900"
                      data-testid={`count-${label.toLowerCase()}`}
                    >
                      {counts[label] ?? 0}
                    </span>
                    <span className="block text-xs text-slate-500">{style.hint}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="recent-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 id="recent-heading" className="font-display text-xl font-bold">
            Your tasks
          </h2>
          {tasks.length > 0 && (
            <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700">
              {tasks.length} active
            </span>
          )}
        </div>
        <TaskList tasks={tasks} />
      </section>
    </div>
  )
}
