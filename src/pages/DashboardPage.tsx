import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { NAV_ITEMS } from '@/app/navigation'
import { WelcomeBanner } from '@/features/dashboard/WelcomeBanner'
import { TaskList } from '@/features/tasks/TaskList'
import { useTasks } from '@/features/tasks/TasksContext'
import { selectActiveTasks, selectCompletedTasks, selectPendingTasks } from '@/features/tasks/taskSelectors'
import { cn } from '@/lib/cn'

/** Summary cards link to each status view. */
const SUMMARY_ITEMS = NAV_ITEMS.filter((item) => item.to !== '/' && item.to !== '/archived')

/** Soft tinted icon tile per status filter. */
const CARD_STYLE: Record<string, { tile: string; icon: string }> = {
  Pending: { tile: 'bg-status-pending-soft', icon: 'text-status-pending' },
  Overdue: { tile: 'bg-status-overdue-soft', icon: 'text-status-overdue' },
  Completed: { tile: 'bg-status-completed-soft', icon: 'text-status-completed' },
}

export function DashboardPage() {
  const { tasks: allTasks } = useTasks()
  const tasks = selectActiveTasks(allTasks)
  const pending = selectPendingTasks(allTasks).length
  const completed = selectCompletedTasks(allTasks).length

  // Overdue needs deadlines (Milestone 3) and is wired up in Task 4.2.
  const counts: Record<string, number> = { Pending: pending, Overdue: 0, Completed: completed }

  return (
    <div className="space-y-6 sm:space-y-8">
      <WelcomeBanner pending={pending} completed={completed} />

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Task summary
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {SUMMARY_ITEMS.map(({ to, label, icon: Icon }, i) => {
            const style = CARD_STYLE[label]
            return (
              <li key={to} className="animate-fade-up" style={{ animationDelay: `${60 + i * 50}ms` }}>
                <Link
                  to={to}
                  className="surface group flex items-center gap-4 p-4 transition duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-hard sm:p-5"
                >
                  <span
                    className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl border-2 border-ink', style.tile)}
                  >
                    <Icon className={cn('size-5', style.icon)} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-brand-600">{label}</span>
                    <span
                      className="block font-display text-3xl leading-tight font-extrabold text-ink"
                      data-testid={`count-${label.toLowerCase()}`}
                    >
                      {counts[label] ?? 0}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="ml-auto size-5 shrink-0 text-brand-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="recent-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 id="recent-heading" className="font-display text-xl font-extrabold tracking-tight">
            Your tasks
          </h2>
          {tasks.length > 0 && (
            <span className="rounded-full border-2 border-ink bg-white px-2.5 py-0.5 text-xs font-bold text-ink">
              {tasks.length} active
            </span>
          )}
        </div>
        <TaskList tasks={tasks} />
      </section>
    </div>
  )
}
