import { ListTodo, Rocket, X } from 'lucide-react'
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
        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col lg:w-64',
        // Frosted glass: more solid as a mobile drawer, lighter when docked on desktop.
        'border-r border-white/70 bg-white/85 shadow-2xl shadow-brand-900/10 backdrop-blur-xl backdrop-saturate-150',
        'lg:bg-white/55 lg:shadow-none',
        'transition-transform duration-300 ease-out lg:translate-x-0',
        // When closed on mobile: slide off-screen and remove from tab order.
        open ? 'translate-x-0' : 'invisible -translate-x-full lg:visible',
      )}
    >
      <div className="flex h-20 items-center justify-between gap-2 px-5">
        <NavLink to="/" onClick={onClose} className="group flex items-center gap-3 rounded-xl">
          <span className="bg-gradient-brand shadow-glow flex size-10 items-center justify-center rounded-2xl text-white transition-transform group-hover:animate-wiggle">
            <ListTodo className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-extrabold tracking-tight">To-Do</span>
            <span className="block text-xs font-medium text-slate-500">Make it happen ✦</span>
          </span>
        </NavLink>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-slate-500 transition hover:rotate-90 hover:bg-white/80 hover:text-slate-900 lg:hidden"
          aria-label="Close menu"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-3 pb-2 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">My tasks</p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, iconClass, bubbleClass }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-2xl px-2.5 py-2 text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-gradient-button shadow-glow text-white'
                      : 'text-slate-600 hover:translate-x-1 hover:bg-white/80 hover:text-slate-900',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
                        isActive ? 'bg-white/20' : bubbleClass,
                      )}
                    >
                      <Icon className={cn('size-4', isActive ? 'text-white' : iconClass)} aria-hidden="true" />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/60 p-4">
          <div className="bg-gradient-brand absolute -top-6 -right-6 size-16 rounded-full opacity-20 blur-xl" aria-hidden="true" />
          <Rocket className="mb-2 size-5 animate-float text-brand-600" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-800">Teams are coming</p>
          <p className="text-xs text-slate-500">Shared workspaces & real-time collaboration.</p>
        </div>
      </div>
    </aside>
  )
}
