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
}

/** Sidebar links, in display order. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, iconClass: 'text-brand-600' },
  { to: '/pending', label: 'Pending', icon: Clock, iconClass: 'text-status-pending' },
  { to: '/overdue', label: 'Overdue', icon: CircleAlert, iconClass: 'text-status-overdue' },
  { to: '/completed', label: 'Completed', icon: CircleCheckBig, iconClass: 'text-status-completed' },
  { to: '/archived', label: 'Archived', icon: Archive, iconClass: 'text-status-archived' },
]
