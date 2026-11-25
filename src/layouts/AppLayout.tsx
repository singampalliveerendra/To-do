import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useMatches } from 'react-router'
import { NewTaskButton } from '@/features/tasks/NewTaskButton'
import { Sidebar } from './Sidebar'

/** Optional data a route can attach via `handle`, e.g. `{ title: 'Pending' }`. */
export interface RouteHandle {
  title?: string
}

function usePageTitle(): string {
  const matches = useMatches()
  for (let i = matches.length - 1; i >= 0; i--) {
    const title = (matches[i].handle as RouteHandle | undefined)?.title
    if (title) return title
  }
  return 'To-Do'
}

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const title = usePageTitle()

  // Browser tab title follows the current page.
  useEffect(() => {
    document.title = title === 'To-Do' ? 'To-Do · Collaborative Tasks' : `${title} · To-Do`
  }, [title])

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-xl focus:border-2 focus:border-ink focus:bg-accent focus:px-3 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>

      <Sidebar open={menuOpen} onClose={closeMenu} />

      {/* Dimmed overlay behind the mobile drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          onClick={closeMenu}
          data-testid="sidebar-overlay"
          aria-hidden="true"
        />
      )}

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b-2 border-ink bg-paper px-4 sm:h-20 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="btn-press -ml-1 bg-white p-2 text-ink lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="app-sidebar"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <h1 className="min-w-0 flex-1 truncate py-1 font-display text-xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
          <NewTaskButton />
        </header>

        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
