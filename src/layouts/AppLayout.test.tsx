import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'

describe('app layout (Paper & Ink)', () => {
  it('has no decorative floating background any more', () => {
    renderApp('/')
    expect(screen.queryByTestId('background-decor')).not.toBeInTheDocument()
  })

  it('shows the brand name and tagline in the sidebar', () => {
    renderApp('/')
    const sidebar = document.getElementById('app-sidebar')!
    expect(within(sidebar).getByText('To-Do')).toBeInTheDocument()
    expect(within(sidebar).getByText('Make it happen')).toBeInTheDocument()
  })

  it('keeps each nav link name exactly its label and marks the current page', () => {
    renderApp('/pending')
    const nav = screen.getByRole('navigation', { name: 'Main' })
    for (const label of ['Dashboard', 'Pending', 'Overdue', 'Completed', 'Archived']) {
      expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument()
    }
    const active = within(nav).getByRole('link', { name: 'Pending' })
    expect(active).toHaveAttribute('aria-current', 'page')
    expect(active).toHaveClass('bg-accent')
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).not.toHaveClass('bg-accent')
  })

  it('header shows the page title and a pressable New task button', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
    expect(screen.getByRole('button', { name: 'New task' })).toHaveClass('btn-press')
  })

  it('has a skip link to the main content', () => {
    renderApp('/')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })
})
