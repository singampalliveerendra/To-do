import {
  Archive,
  CircleAlert,
  CircleCheckBig,
  Clock,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Tailwind text colour for the icon */
  iconClass: string
  /** Tailwind classes for the soft coloured bubble behind the icon */
  bubbleClass: string
}

/** Sidebar links, in display order. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, iconClass: 'text-brand-600', bubbleClass: 'bg-brand-100' },
  { to: '/pending', label: 'Pending', icon: Clock, iconClass: 'text-status-pending', bubbleClass: 'bg-blue-100' },
  { to: '/overdue', label: 'Overdue', icon: CircleAlert, iconClass: 'text-status-overdue', bubbleClass: 'bg-rose-100' },
  {
    to: '/completed',
    label: 'Completed',
    icon: CircleCheckBig,
    iconClass: 'text-status-completed',
    bubbleClass: 'bg-emerald-100',
  },
  { to: '/archived', label: 'Archived', icon: Archive, iconClass: 'text-status-archived', bubbleClass: 'bg-slate-100' },
]
