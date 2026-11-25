import { ListTodo } from 'lucide-react'
import { Link } from 'react-router'
import { NAV_ITEMS } from '@/app/navigation'
import { EmptyState } from '@/components/EmptyState'
import { cn } from '@/lib/cn'

/** Summary cards link to each status view. Counts are wired up in Milestone 2. */
const SUMMARY_ITEMS = NAV_ITEMS.filter((item) => item.to !== '/' && item.to !== '/archived')

export function DashboardPage() {
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
                    0
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
        <EmptyState icon={ListTodo} title="No tasks yet">
          Tasks you create will appear here.
        </EmptyState>
      </section>
    </div>
  )
}
