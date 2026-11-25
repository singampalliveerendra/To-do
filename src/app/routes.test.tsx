import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'

const renderAt = (path: string) => renderApp(path).router

const pageHeading = () => screen.getByRole('heading', { level: 1 })

describe('app routes and layout', () => {
  it('shows the dashboard with summary cards at "/"', async () => {
    renderAt('/')
    expect(pageHeading()).toHaveTextContent('Dashboard')
    expect(screen.getByTestId('count-pending')).toHaveTextContent('0')
    expect(screen.getByTestId('count-overdue')).toHaveTextContent('0')
    expect(screen.getByTestId('count-completed')).toHaveTextContent('0')
    expect(await screen.findByText('No tasks yet')).toBeInTheDocument()
    expect(document.title).toBe('Dashboard · To-Do')
  })

  it('renders every sidebar link', () => {
    renderAt('/')
    const nav = screen.getByRole('navigation', { name: 'Main' })
    const labels = within(nav).getAllByRole('link').map((link) => link.textContent)
    expect(labels).toEqual(['Dashboard', 'Pending', 'Overdue', 'Completed', 'Archived'])
  })

  it.each([
    ['/pending', 'Pending', 'No pending tasks'],
    ['/overdue', 'Overdue', 'Nothing overdue'],
    ['/completed', 'Completed', 'No completed tasks'],
    ['/archived', 'Archived', 'No archived tasks'],
  ])('renders %s with title "%s"', async (path, title, emptyText) => {
    renderAt(path)
    expect(pageHeading()).toHaveTextContent(title)
    expect(await screen.findByText(emptyText)).toBeInTheDocument()
    expect(document.title).toBe(`${title} · To-Do`)
  })

  it('navigates with the sidebar and marks the active link', async () => {
    const user = userEvent.setup()
    const router = renderAt('/')
    const nav = screen.getByRole('navigation', { name: 'Main' })

    await user.click(within(nav).getByRole('link', { name: 'Overdue' }))

    expect(router.state.location.pathname).toBe('/overdue')
    expect(pageHeading()).toHaveTextContent('Overdue')
    expect(within(nav).getByRole('link', { name: 'Overdue' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
  })

  it('navigates from a dashboard summary card', async () => {
    const user = userEvent.setup()
    const router = renderAt('/')
    const main = screen.getByRole('main')

    await user.click(within(main).getByRole('link', { name: /Completed/ }))

    expect(router.state.location.pathname).toBe('/completed')
  })

  it('shows a 404 page for unknown routes with a way back', async () => {
    const user = userEvent.setup()
    const router = renderAt('/does-not-exist')
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(pageHeading()).toHaveTextContent('Page not found')

    await user.click(screen.getByRole('link', { name: 'Back to dashboard' }))
    expect(router.state.location.pathname).toBe('/')
  })
})

describe('mobile menu', () => {
  it('opens with the menu button and closes with Escape', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const menuButton = screen.getByRole('button', { name: 'Open menu' })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument()

    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByTestId('sidebar-overlay')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes when the overlay or the close button is clicked', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const menuButton = screen.getByRole('button', { name: 'Open menu' })

    await user.click(menuButton)
    await user.click(screen.getByTestId('sidebar-overlay'))
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(menuButton)
    await user.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes after choosing a page', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const menuButton = screen.getByRole('button', { name: 'Open menu' })

    await user.click(menuButton)
    const nav = screen.getByRole('navigation', { name: 'Main' })
    await user.click(within(nav).getByRole('link', { name: 'Pending' }))

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(pageHeading()).toHaveTextContent('Pending')
  })
})
