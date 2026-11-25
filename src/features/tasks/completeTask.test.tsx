import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'
import { createLocalStorageTaskRepository } from './localStorageTaskRepository'
import type { TaskRepository } from './taskRepository'

const storedTasks = () => createLocalStorageTaskRepository({ storage: window.localStorage }).list()

async function setup(
  path = '/',
  { completed = false, repository }: { completed?: boolean; repository?: TaskRepository } = {},
) {
  const repo = repository ?? createLocalStorageTaskRepository({ storage: window.localStorage })
  await repo.create({ title: 'Buy milk', description: '' })
  const task = await repo.create({ title: 'Send invoice', description: '' })
  if (completed) await repo.complete(task.id)
  const user = userEvent.setup()
  const view = renderApp(path, { repository: repo })
  await screen.findByRole('list', { name: 'Tasks' })
  return { user, ...view }
}

const checkbox = (title: string) =>
  screen.getByRole('checkbox', { name: new RegExp(`Mark "${title}" as (not )?complete`) })

describe('completing a task', () => {
  it('shows an unticked checkbox on active tasks', async () => {
    await setup()
    expect(checkbox('Send invoice')).toHaveAttribute('aria-checked', 'false')
    expect(checkbox('Send invoice')).toHaveAccessibleName('Mark "Send invoice" as complete')
  })

  it('marks the task complete, records the time and updates the counters', async () => {
    const { user } = await setup()
    expect(screen.getByTestId('count-pending')).toHaveTextContent('2')
    expect(screen.getByTestId('count-completed')).toHaveTextContent('0')

    await user.click(checkbox('Send invoice'))

    expect(checkbox('Send invoice')).toHaveAttribute('aria-checked', 'true')
    const card = screen.getByRole('heading', { name: 'Send invoice' }).closest('article')!
    expect(within(card).getByText(/Completed/)).toBeInTheDocument()
    expect(screen.getByTestId('count-pending')).toHaveTextContent('1')
    expect(screen.getByTestId('count-completed')).toHaveTextContent('1')

    const saved = (await storedTasks()).find((t) => t.title === 'Send invoice')
    expect(saved?.completedAt).toEqual(expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/))
  })

  it('moves a completed task from Pending to Completed', async () => {
    const { user, router } = await setup('/pending')
    await user.click(checkbox('Send invoice'))

    expect(screen.queryByRole('heading', { name: 'Send invoice' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Buy milk' })).toBeInTheDocument()

    await router.navigate('/completed')
    expect(await screen.findByRole('heading', { name: 'Send invoice' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Buy milk' })).not.toBeInTheDocument()
  })

  it('stays completed after a page refresh', async () => {
    const { user, unmount } = await setup()
    await user.click(checkbox('Send invoice'))
    unmount()

    renderApp('/completed')
    expect(await screen.findByRole('heading', { name: 'Send invoice' })).toBeInTheDocument()
  })

  it('can be reopened from the Completed page and returns to Pending', async () => {
    const { user, router } = await setup('/completed', { completed: true })
    expect(checkbox('Send invoice')).toHaveAccessibleName('Mark "Send invoice" as not complete')

    await user.click(checkbox('Send invoice'))

    expect(await screen.findByText('No completed tasks')).toBeInTheDocument()
    await router.navigate('/pending')
    expect(await screen.findByRole('heading', { name: 'Send invoice' })).toBeInTheDocument()
    expect((await storedTasks()).every((t) => t.completedAt === null)).toBe(true)
  })

  it('archived tasks have no checkbox', async () => {
    const repo = createLocalStorageTaskRepository({ storage: window.localStorage })
    const t = await repo.create({ title: 'Archived one', description: '' })
    await repo.complete(t.id)
    await repo.archive(t.id)
    renderApp('/archived', { repository: repo })

    const card = (await screen.findByRole('heading', { name: 'Archived one' })).closest('article')!
    expect(within(card).queryByRole('checkbox')).not.toBeInTheDocument()
    // History is still visible.
    expect(within(card).getByText(/Completed/)).toBeInTheDocument()
  })

  it('shows an error and leaves the task unchanged if saving fails', async () => {
    const real = createLocalStorageTaskRepository({ storage: window.localStorage })
    const failing: TaskRepository = {
      ...real,
      complete: async () => {
        throw new Error('Could not save your task. Your browser storage may be full or disabled.')
      },
    }
    const { user } = await setup('/', { repository: failing })
    await user.click(checkbox('Send invoice'))

    expect(await screen.findByRole('alert')).toHaveTextContent(/browser storage/)
    expect(checkbox('Send invoice')).toHaveAttribute('aria-checked', 'false')
  })
})
