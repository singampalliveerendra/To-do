import { Link } from 'react-router'
import { NAV_ITEMS } from '@/app/navigation'
import { TaskList } from '@/features/tasks/TaskList'
import { useTasks } from '@/features/tasks/TasksContext'
import { selectActiveTasks, selectCompletedTasks, selectPendingTasks } from '@/features/tasks/taskSelectors'
import { cn } from '@/lib/cn'

/** Summary cards link to each status view. */
const SUMMARY_ITEMS = NAV_ITEMS.filter((item) => item.to !== '/' && item.to !== '/archived')

export function DashboardPage() {
  const { tasks: allTasks } = useTasks()
  const tasks = selectActiveTasks(allTasks)

  // Overdue needs deadlines (Milestone 3) and is wired up in Task 4.2.
  const counts: Record<string, number> = {
    Pending: selectPendingTasks(allTasks).length,
    Overdue: 0,
    Completed: selectCompletedTasks(allTasks).length,
  }

  return (
    <div className="space-y-6">
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Task summary
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SUMMARY_ITEMS.map(({ to, label, icon: Icon, iconClass }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow"
              >
                <span className="rounded-lg bg-slate-50 p-2.5">
                  <Icon className={cn('size-6', iconClass)} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-slate-500">{label}</span>
                  <span className="block text-2xl font-semibold" data-testid={`count-${label.toLowerCase()}`}>
                    {counts[label] ?? 0}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="recent-heading" className="space-y-3">
        <h2 id="recent-heading" className="text-base font-semibold">
          Your tasks
        </h2>
        <TaskList tasks={tasks} />
      </section>
    </div>
  )
}
