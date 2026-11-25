import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createLocalStorageTaskRepository } from '@/features/tasks/localStorageTaskRepository'
import { renderApp } from '@/test/renderApp'

const DESCRIPTION = 'Line one of the notes.\nLine two.\nLine three.\nLine four is long enough to be cut off on a card.'

/** Seeds one task with predictable times (each save 1 minute after the last). */
async function seed() {
  let time = new Date('2026-11-25T10:00:00.000Z').getTime()
  const repo = createLocalStorageTaskRepository({
    storage: window.localStorage,
    now: () => new Date((time += 60_000)),
  })
  const task = await repo.create({ title: 'Prepare project report', description: DESCRIPTION })
  return { repo, task }
}

const history = () => within(screen.getByRole('list', { name: 'Task history' }))
const historyLabels = () => history().getAllByRole('listitem').map((li) => li.querySelector('p')?.textContent)

describe('task details page', () => {
  it('opens from a task card title and shows the full details', async () => {
    const { repo } = await seed()
    const user = userEvent.setup()
    const { router } = renderApp('/', { repository: repo })

    await user.click(await screen.findByRole('link', { name: 'Prepare project report' }))

    expect(router.state.location.pathname).toMatch(/^\/tasks\//)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Task details')
    expect(screen.getByRole('heading', { level: 2, name: 'Prepare project report' })).toBeInTheDocument()
    expect(screen.getByTestId('task-status')).toHaveTextContent('Pending')
    // Full description (not cut off), line breaks kept.
    const description = screen.getByRole('region', { name: 'Description' })
    expect(description.querySelector('p')?.textContent).toBe(DESCRIPTION)
    expect(historyLabels()).toEqual(['Created'])
  })

  it('works when opened directly by URL (e.g. after a refresh)', async () => {
    const { task } = await seed()
    renderApp(`/tasks/${task.id}`)
    expect(await screen.findByRole('heading', { level: 2, name: 'Prepare project report' })).toBeInTheDocument()
  })

  it('"Back" returns to the page the task was opened from', async () => {
    const { repo } = await seed()
    const user = userEvent.setup()
    const { router } = renderApp('/pending', { repository: repo })

    await user.click(await screen.findByRole('link', { name: 'Prepare project report' }))
    await user.click(screen.getByRole('link', { name: 'Back' }))

    expect(router.state.location.pathname).toBe('/pending')
  })

  it('"Back" goes to the dashboard when opened directly', async () => {
    const { task } = await seed()
    const user = userEvent.setup()
    const { router } = renderApp(`/tasks/${task.id}`)
    await user.click(await screen.findByRole('link', { name: 'Back' }))
    expect(router.state.location.pathname).toBe('/')
  })

  it('marks complete and reopens, updating badge and history', async () => {
    const { task } = await seed()
    const user = userEvent.setup()
    renderApp(`/tasks/${task.id}`)

    await user.click(await screen.findByRole('button', { name: 'Mark complete' }))
    expect(screen.getByTestId('task-status')).toHaveTextContent('Completed')
    expect(historyLabels()).toEqual(['Created', 'Completed'])

    await user.click(screen.getByRole('button', { name: 'Reopen' }))
    expect(screen.getByTestId('task-status')).toHaveTextContent('Pending')
    expect(historyLabels()).toEqual(['Created'])
  })

  it('edits the task and adds "Last edited" to the history', async () => {
    const { task } = await seed()
    const user = userEvent.setup()
    renderApp(`/tasks/${task.id}`)

    await user.click(await screen.findByRole('button', { name: 'Edit' }))
    const title = screen.getByLabelText(/Title/)
    await user.clear(title)
    await user.type(title, 'Prepare final report')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(screen.getByRole('heading', { level: 2, name: 'Prepare final report' })).toBeInTheDocument()
    expect(historyLabels()).toEqual(['Created', 'Last edited'])
  })

  it('archives (with confirmation), then offers Restore and Delete', async () => {
    const { task } = await seed()
    const user = userEvent.setup()
    renderApp(`/tasks/${task.id}`)

    await user.click(await screen.findByRole('button', { name: 'Archive' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Archive' }))

    expect(screen.getByTestId('task-status')).toHaveTextContent('Archived')
    expect(historyLabels()).toEqual(['Created', 'Archived'])
    expect(screen.getByRole('button', { name: 'Restore' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete permanently' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mark complete' })).not.toBeInTheDocument()
  })

  it('deleting permanently (after confirmation) returns to the Archived page', async () => {
    const { repo, task } = await seed()
    await repo.archive(task.id)
    const user = userEvent.setup()
    const { router } = renderApp(`/tasks/${task.id}`, { repository: repo })

    await user.click(await screen.findByRole('button', { name: 'Delete permanently' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete permanently' }))

    expect(router.state.location.pathname).toBe('/archived')
    expect(await screen.findByText('No archived tasks')).toBeInTheDocument()
    expect(await repo.list()).toEqual([])
  })

  it('shows "Task not found" for an unknown id', async () => {
    renderApp('/tasks/does-not-exist')
    expect(await screen.findByText('Task not found')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back' })).toBeInTheDocument()
  })

  it('lists history in time order: created, edited, completed, archived', async () => {
    const { repo, task } = await seed()
    await repo.update(task.id, { title: 'Edited', description: '' })
    await repo.complete(task.id)
    await repo.archive(task.id)
    renderApp(`/tasks/${task.id}`, { repository: repo })

    await screen.findByRole('list', { name: 'Task history' })
    expect(historyLabels()).toEqual(['Created', 'Last edited', 'Completed', 'Archived'])
  })

  it('shows a placeholder when there is no description', async () => {
    const repo = createLocalStorageTaskRepository({ storage: window.localStorage })
    const task = await repo.create({ title: 'No notes', description: '' })
    renderApp(`/tasks/${task.id}`, { repository: repo })
    expect(await screen.findByText('No description.')).toBeInTheDocument()
  })
})
