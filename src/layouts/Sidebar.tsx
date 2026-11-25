import { ListTodo, Users, X } from 'lucide-react'
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
        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r-2 border-ink bg-white lg:w-64',
        'transition-transform duration-200 ease-out lg:translate-x-0',
        // When closed on mobile: slide off-screen and remove from tab order.
        open ? 'translate-x-0 shadow-hard' : 'invisible -translate-x-full lg:visible',
      )}
    >
      <div className="flex h-16 items-center justify-between gap-2 px-5 sm:h-20">
        <NavLink to="/" onClick={onClose} className="group flex items-center gap-3 rounded-xl">
          <span className="flex size-9 items-center justify-center rounded-xl border-2 border-ink bg-accent shadow-hard-xs transition-transform group-hover:-rotate-6">
            <ListTodo className="size-5 text-ink" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-extrabold tracking-tight">To-Do</span>
            <span className="block text-xs font-medium text-brand-500">Make it happen</span>
          </span>
        </NavLink>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-brand-600 hover:bg-paper hover:text-ink lg:hidden"
          aria-label="Close menu"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-3">
        <p className="px-3 pb-2 text-[11px] font-bold tracking-[0.14em] text-brand-500 uppercase">My tasks</p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, iconClass }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    // Transparent border on inactive links keeps every item the same size.
                    'flex items-center gap-3 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-colors',
                    isActive
                      ? 'border-ink bg-accent text-ink shadow-hard-xs'
                      : 'border-transparent text-brand-600 hover:bg-paper hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('size-[18px] shrink-0', isActive ? 'text-ink' : iconClass)} aria-hidden="true" />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <div className="rounded-xl border-2 border-dashed border-brand-300 bg-paper p-4">
          <Users className="mb-2 size-5 text-brand-600" aria-hidden="true" />
          <p className="text-sm font-semibold text-ink">Teams are coming</p>
          <p className="text-xs text-brand-500">Shared workspaces &amp; real-time collaboration.</p>
        </div>
      </div>
    </aside>
  )
}
