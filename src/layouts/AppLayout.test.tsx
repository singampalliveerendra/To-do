import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'

describe('app layout (redesign)', () => {
  it('renders the decorative background hidden from screen readers and clicks', () => {
    renderApp('/')
    const decor = screen.getByTestId('background-decor')
    expect(decor).toHaveAttribute('aria-hidden', 'true')
    expect(decor).toHaveClass('pointer-events-none')
    // Nothing inside the decoration is focusable.
    expect(decor.querySelectorAll('a, button, input, [tabindex]')).toHaveLength(0)
  })

  it('shows the brand name and tagline in the sidebar', () => {
    renderApp('/')
    const sidebar = document.getElementById('app-sidebar')!
    expect(within(sidebar).getByText('To-Do')).toBeInTheDocument()
    expect(within(sidebar).getByText(/Make it happen/)).toBeInTheDocument()
  })

  it('keeps each nav link name exactly its label (icons are hidden from screen readers)', () => {
    renderApp('/')
    const nav = screen.getByRole('navigation', { name: 'Main' })
    for (const label of ['Dashboard', 'Pending', 'Overdue', 'Completed', 'Archived']) {
      expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('has a skip link to the main content', () => {
    renderApp('/')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })
})
