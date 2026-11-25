import { ListTodo, X } from 'lucide-react'
import { NavLink } from 'react-router'
import { NAV_ITEMS } from '@/app/navigation'
import { cn } from '@/lib/cn'

interface SidebarProps {
  /** Mobile drawer state. On large screens the sidebar is always visible. */
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <aside
      id="app-sidebar"
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white',
        'transition-transform duration-200 ease-out lg:translate-x-0',
        // When closed on mobile: slide off-screen and remove from tab order.
        open ? 'translate-x-0' : 'invisible -translate-x-full lg:visible',
      )}
    >
      <div className="flex h-16 items-center justify-between gap-2 border-b border-slate-200 px-5">
        <NavLink to="/" onClick={onClose} className="flex items-center gap-2 rounded-md font-semibold">
          <ListTodo className="size-6 text-brand-600" aria-hidden="true" />
          <span className="text-lg tracking-tight">To-Do</span>
        </NavLink>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Close menu"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, iconClass }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  )
                }
              >
                <Icon className={cn('size-5 shrink-0', iconClass)} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <p className="border-t border-slate-200 px-5 py-4 text-xs text-slate-400">
        Workspaces & teams coming soon
      </p>
    </aside>
  )
}
