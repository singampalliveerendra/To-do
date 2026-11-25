import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'
import { createLocalStorageTaskRepository } from './localStorageTaskRepository'
import type { TaskRepository } from './taskRepository'

const storedTasks = () => createLocalStorageTaskRepository({ storage: window.localStorage }).list()

async function setup(path = '/', { archived = false, repository }: { archived?: boolean; repository?: TaskRepository } = {}) {
  const repo = repository ?? createLocalStorageTaskRepository({ storage: window.localStorage })
  await repo.create({ title: 'Buy milk', description: '' })
  const task = await repo.create({ title: 'Old report', description: 'Q3 numbers' })
  if (archived) await repo.archive(task.id)
  const user = userEvent.setup()
  const view = renderApp(path, { repository: repo })
  await screen.findByRole('list', { name: 'Tasks' })
  return { user, task, ...view }
}

describe('archiving a task', () => {
  it('asks for confirmation, with Cancel focused so Enter cannot archive by accident', async () => {
    const { user } = await setup()
    await user.click(screen.getByRole('button', { name: 'Archive "Old report"' }))

    const dialog = screen.getByRole('dialog', { name: 'Archive this task?' })
    expect(within(dialog).getByText(/Old report/)).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  it('does nothing when cancelled', async () => {
    const { user } = await setup()
    await user.click(screen.getByRole('button', { name: 'Archive "Old report"' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Old report' })).toBeInTheDocument()
    expect((await storedTasks()).every((t) => t.archivedAt === null)).toBe(true)
  })

  it('moves the task to Archived after confirming, keeping its details', async () => {
    const { user, router } = await setup()
    expect(screen.getByTestId('count-pending')).toHaveTextContent('2')

    await user.click(screen.getByRole('button', { name: 'Archive "Old report"' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Archive' }))

    // Gone from the dashboard and the pending count.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Old report' })).not.toBeInTheDocument()
    expect(screen.getByTestId('count-pending')).toHaveTextContent('1')

    // Shown on the Archived page with all details.
    await router.navigate('/archived')
    const card = (await screen.findByRole('heading', { name: 'Old report' })).closest('article')!
    expect(within(card).getByText('Q3 numbers')).toBeInTheDocument()
    expect(within(card).getByText(/Archived/)).toBeInTheDocument()

    // Saved (survives refresh).
    const archived = (await storedTasks()).find((t) => t.title === 'Old report')
    expect(archived?.archivedAt).not.toBeNull()
  })

  it('is hidden from the Pending page', async () => {
    const { user } = await setup('/pending')
    await user.click(screen.getByRole('button', { name: 'Archive "Old report"' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Archive' }))

    expect(screen.queryByRole('heading', { name: 'Old report' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Buy milk' })).toBeInTheDocument()
  })

  it('active tasks have Edit and Archive but no Delete button', async () => {
    await setup()
    expect(screen.getByRole('button', { name: 'Edit "Old report"' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Archive "Old report"' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Delete "Old report"/ })).not.toBeInTheDocument()
  })
})

describe('Archived page', () => {
  it('shows only archived tasks, with Restore and Delete but no Edit', async () => {
    await setup('/archived', { archived: true })
    expect(screen.getByRole('heading', { name: 'Old report' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Buy milk' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restore "Old report"' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete "Old report" permanently' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit "Old report"' })).not.toBeInTheDocument()
  })

  it('restores a task back to the active views', async () => {
    const { user, router } = await setup('/archived', { archived: true })
    await user.click(screen.getByRole('button', { name: 'Restore "Old report"' }))

    expect(await screen.findByText('No archived tasks')).toBeInTheDocument()
    await router.navigate('/')
    expect(await screen.findByRole('heading', { name: 'Old report' })).toBeInTheDocument()
    expect(screen.getByTestId('count-pending')).toHaveTextContent('2')
  })

  it('asks for confirmation before deleting permanently, warning it cannot be undone', async () => {
    const { user } = await setup('/archived', { archived: true })
    await user.click(screen.getByRole('button', { name: 'Delete "Old report" permanently' }))

    const dialog = screen.getByRole('dialog', { name: 'Delete permanently?' })
    expect(within(dialog).getByText('This cannot be undone.')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  it('keeps the task when delete is cancelled', async () => {
    const { user } = await setup('/archived', { archived: true })
    await user.click(screen.getByRole('button', { name: 'Delete "Old report" permanently' }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Old report' })).toBeInTheDocument()
    expect(await storedTasks()).toHaveLength(2)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Delete "Old report" permanently' })).toHaveFocus())
  })

  it('deletes permanently after confirming', async () => {
    const { user } = await setup('/archived', { archived: true })
    await user.click(screen.getByRole('button', { name: 'Delete "Old report" permanently' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete permanently' }))

    expect(await screen.findByText('No archived tasks')).toBeInTheDocument()
    const remaining = await storedTasks()
    expect(remaining.map((t) => t.title)).toEqual(['Buy milk'])
  })

  it('shows an error and keeps the dialog open if deleting fails', async () => {
    const real = createLocalStorageTaskRepository({ storage: window.localStorage })
    const failing: TaskRepository = {
      ...real,
      delete: async () => {
        throw new Error('Could not save your task. Your browser storage may be full or disabled.')
      },
    }
    const { user } = await setup('/archived', { archived: true, repository: failing })
    await user.click(screen.getByRole('button', { name: 'Delete "Old report" permanently' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete permanently' }))

    expect(await within(screen.getByRole('dialog')).findByRole('alert')).toHaveTextContent(/browser storage/)
    expect(screen.getByRole('heading', { name: 'Old report' })).toBeInTheDocument()
  })
})
