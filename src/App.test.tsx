import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the app heading without crashing', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'To-Do' })).toBeInTheDocument()
  })

  it('shows the four task status labels', () => {
    render(<App />)
    const list = screen.getByRole('list', { name: 'Task statuses' })
    const labels = within(list).getAllByRole('listitem').map((li) => li.textContent)
    expect(labels).toEqual(['Pending', 'Overdue', 'Completed', 'Completed Late'])
  })
})
