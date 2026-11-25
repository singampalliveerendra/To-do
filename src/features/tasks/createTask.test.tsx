import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/test/renderApp'
import { createLocalStorageTaskRepository } from './localStorageTaskRepository'
import type { TaskRepository } from './taskRepository'

async function openNewTaskDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'New task' }))
  return screen.getByRole('dialog', { name: 'New task' })
}

describe('creating a task', () => {
  it('opens the dialog with the title field focused', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await openNewTaskDialog(user)
    expect(screen.getByLabelText(/Title/)).toHaveFocus()
  })

  it('creates a task and shows it on the dashboard', async () => {
    const user = userEvent.setup()
    renderApp('/')
    expect(await screen.findByText('No tasks yet')).toBeInTheDocument()

    await openNewTaskDialog(user)
    await user.type(screen.getByLabelText(/Title/), 'Prepare project report')
    await user.type(screen.getByLabelText(/Description/), 'Include Q4 numbers')
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const list = await screen.findByRole('list', { name: 'Tasks' })
    expect(within(list).getByRole('heading', { name: 'Prepare project report' })).toBeInTheDocument()
    expect(within(list).getByText('Include Q4 numbers')).toBeInTheDocument()
    expect(within(list).getByText(/Created/)).toBeInTheDocument()
    expect(screen.getByTestId('count-pending')).toHaveTextContent('1')
  })

  it('keeps tasks after a page refresh', async () => {
    const user = userEvent.setup()
    const first = renderApp('/')
    await openNewTaskDialog(user)
    await user.type(screen.getByLabelText(/Title/), 'Saved task')
    await user.click(screen.getByRole('button', { name: 'Create task' }))
    await screen.findByRole('heading', { name: 'Saved task' })
    first.unmount()

    renderApp('/')
    expect(await screen.findByRole('heading', { name: 'Saved task' })).toBeInTheDocument()
  })

  it('shows new tasks on the Pending page', async () => {
    const user = userEvent.setup()
    renderApp('/pending')
    expect(await screen.findByText('No pending tasks')).toBeInTheDocument()

    await openNewTaskDialog(user)
    await user.type(screen.getByLabelText(/Title/), 'Call the bank')
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(await screen.findByRole('heading', { name: 'Call the bank' })).toBeInTheDocument()
  })

  it('requires a title and does not save an empty task', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await openNewTaskDialog(user)

    await user.type(screen.getByLabelText(/Title/), '    ')
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(screen.getByText('Title is required.')).toBeInTheDocument()
    expect(screen.getByLabelText(/Title/)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(window.localStorage.getItem('todo.tasks.v1')).toBeNull()
  })

  it('creates only one task when Create is clicked twice quickly', async () => {
    const user = userEvent.setup()
    const repo = createLocalStorageTaskRepository({ storage: window.localStorage })
    let release!: () => void
    const gate = new Promise<void>((resolve) => (release = resolve))
    const slowRepo: TaskRepository = {
      ...repo,
      create: vi.fn(async (input) => {
        await gate // simulate a slow save
        return repo.create(input)
      }),
    }
    renderApp('/', { repository: slowRepo })
    await openNewTaskDialog(user)
    await user.type(screen.getByLabelText(/Title/), 'Only once')

    const submit = screen.getByRole('button', { name: 'Create task' })
    await user.click(submit)
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Saving…' }))
    release()

    await screen.findByRole('heading', { name: 'Only once' })
    expect(slowRepo.create).toHaveBeenCalledTimes(1)
    expect(await repo.list()).toHaveLength(1)
  })

  it('shows an error and keeps the dialog open when saving fails', async () => {
    const user = userEvent.setup()
    const failingRepo: TaskRepository = {
      ...createLocalStorageTaskRepository({ storage: window.localStorage }),
      create: async () => {
        throw new Error('Could not save your task. Your browser storage may be full or disabled.')
      },
    }
    renderApp('/', { repository: failingRepo })
    await openNewTaskDialog(user)
    await user.type(screen.getByLabelText(/Title/), 'Will fail')
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/browser storage may be full/)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // The user can try again.
    expect(screen.getByRole('button', { name: 'Create task' })).toBeEnabled()
  })

  it.each([
    ['Cancel button', async (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: 'Cancel' }))],
    ['close (X) button', async (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: 'Close dialog' }))],
    ['Escape key', async (user: ReturnType<typeof userEvent.setup>) => user.keyboard('{Escape}')],
    ['backdrop click', async (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByTestId('modal-backdrop'))],
  ])('closes without saving via the %s', async (_name, closeAction) => {
    const user = userEvent.setup()
    renderApp('/')
    await openNewTaskDialog(user)
    await user.type(screen.getByLabelText(/Title/), 'Draft')

    await closeAction(user)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(await screen.findByText('No tasks yet')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('button', { name: 'New task' })).toHaveFocus())
  })
})
