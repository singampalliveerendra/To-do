import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'
import { createLocalStorageTaskRepository } from './localStorageTaskRepository'
import type { TaskRepository } from './taskRepository'

type User = ReturnType<typeof userEvent.setup>

/** A repository with predictable times: each save is 1 minute after the previous one. */
function seededRepo() {
  let time = new Date('2026-11-25T10:00:00.000Z').getTime()
  return createLocalStorageTaskRepository({
    storage: window.localStorage,
    now: () => new Date((time += 60_000)),
  })
}

async function setup(repository: TaskRepository = seededRepo()) {
  await repository.create({ title: 'Write report', description: 'Q4 numbers' })
  const user = userEvent.setup()
  const view = renderApp('/', { repository })
  await screen.findByRole('heading', { name: 'Write report' })
  return { user, ...view }
}

async function openEditor(user: User, title = 'Write report') {
  await user.click(screen.getByRole('button', { name: `Edit "${title}"` }))
  return screen.getByRole('dialog', { name: 'Edit task' })
}

describe('editing a task', () => {
  it('opens the editor pre-filled with the current values', async () => {
    const { user } = await setup()
    const dialog = await openEditor(user)

    expect(within(dialog).getByLabelText(/Title/)).toHaveValue('Write report')
    expect(within(dialog).getByLabelText(/Description/)).toHaveValue('Q4 numbers')
    expect(within(dialog).getByLabelText(/Title/)).toHaveFocus()
  })

  it('saves changes, updates the card and shows an "Edited" time', async () => {
    const { user } = await setup()
    await openEditor(user)

    const title = screen.getByLabelText(/Title/)
    await user.clear(title)
    await user.type(title, 'Write final report')
    const description = screen.getByLabelText(/Description/)
    await user.clear(description)
    await user.type(description, 'Q4 numbers + summary')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Write final report' })).toBeInTheDocument()
    expect(screen.getByText('Q4 numbers + summary')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Write report' })).not.toBeInTheDocument()
    expect(screen.getByText(/Edited/)).toBeInTheDocument()
    // Still one task, not a copy.
    expect(within(screen.getByRole('list', { name: 'Tasks' })).getAllByRole('listitem')).toHaveLength(1)
  })

  it('keeps the edit after a page refresh', async () => {
    const { user, unmount } = await setup()
    await openEditor(user)
    await user.clear(screen.getByLabelText(/Title/))
    await user.type(screen.getByLabelText(/Title/), 'Edited title')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    await screen.findByRole('heading', { name: 'Edited title' })
    unmount()

    renderApp('/')
    expect(await screen.findByRole('heading', { name: 'Edited title' })).toBeInTheDocument()
  })

  it('does not save when the title is cleared', async () => {
    const { user } = await setup()
    await openEditor(user)
    await user.clear(screen.getByLabelText(/Title/))
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(screen.getByText('Title is required.')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    const stored = await createLocalStorageTaskRepository({ storage: window.localStorage }).list()
    expect(stored[0].title).toBe('Write report')
  })

  it('discards changes on Cancel', async () => {
    const { user } = await setup()
    await openEditor(user)
    await user.clear(screen.getByLabelText(/Title/))
    await user.type(screen.getByLabelText(/Title/), 'Not saved')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Write report' })).toBeInTheDocument()
    expect(screen.queryByText(/Edited/)).not.toBeInTheDocument()
    // Focus goes back to the Edit button.
    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit "Write report"' })).toHaveFocus())
  })

  it('starts fresh each time it opens (no leftover typing from a cancelled edit)', async () => {
    const { user } = await setup()
    await openEditor(user)
    await user.type(screen.getByLabelText(/Title/), ' leftover')
    await user.keyboard('{Escape}')

    await openEditor(user)
    expect(screen.getByLabelText(/Title/)).toHaveValue('Write report')
  })

  it('edits the right task when there are several', async () => {
    const repository = seededRepo()
    await repository.create({ title: 'Buy milk', description: '' })
    const { user } = await setup(repository)

    await openEditor(user, 'Buy milk')
    await user.clear(screen.getByLabelText(/Title/))
    await user.type(screen.getByLabelText(/Title/), 'Buy oat milk')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(screen.getByRole('heading', { name: 'Buy oat milk' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Write report' })).toBeInTheDocument()
  })

  it('shows an error if the task was deleted elsewhere', async () => {
    const { user } = await setup()
    await openEditor(user)
    window.localStorage.clear() // e.g. deleted in another browser tab

    await user.type(screen.getByLabelText(/Title/), '!')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/no longer exists/)
  })
})
