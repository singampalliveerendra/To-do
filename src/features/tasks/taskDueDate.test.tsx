import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { dateInputToDueAt, formatDueDate } from '@/lib/deadline'
import { renderApp } from '@/test/renderApp'
import { createLocalStorageTaskRepository } from './localStorageTaskRepository'

type User = ReturnType<typeof userEvent.setup>

/** Far enough ahead to stay in the future; the past date is always past. */
const FUTURE = '2099-06-15'
const LATER = '2099-06-20'
const PAST = '2020-01-15'

const dateField = () => screen.getByLabelText(/Target date/)
const storedTasks = () => JSON.parse(window.localStorage.getItem('todo.tasks.v1') ?? '[]') as { dueAt: string | null }[]

async function createTask(user: User, title: string, date?: string) {
  await user.click(screen.getByRole('button', { name: 'New task' }))
  await user.type(screen.getByLabelText(/Title/), title)
  if (date) await user.type(dateField(), date)
  await user.click(screen.getByRole('button', { name: 'Create task' }))
  return screen.findByRole('heading', { name: title })
}

async function seedWithDate(date: string | null) {
  const repo = createLocalStorageTaskRepository({ storage: window.localStorage })
  const task = await repo.create({
    title: 'Write report',
    description: '',
    dueAt: date ? dateInputToDueAt(date) : null,
  })
  return { repo, task }
}

describe('target date', () => {
  it('saves the picked date at 23:59 local time and shows it on the card', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await createTask(user, 'Prepare report', FUTURE)

    const due = dateInputToDueAt(FUTURE)!
    expect(storedTasks()[0].dueAt).toBe(due)
    expect(new Date(due).getHours()).toBe(23)
    expect(new Date(due).getMinutes()).toBe(59)

    const list = screen.getByRole('list', { name: 'Tasks' })
    expect(within(list).getByText(/^Due/)).toHaveTextContent(`Due ${formatDueDate(due)}`)
  })

  it('is optional: tasks without a date have no Due chip', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await createTask(user, 'No deadline')

    expect(storedTasks()[0].dueAt).toBeNull()
    expect(within(screen.getByRole('list', { name: 'Tasks' })).queryByText(/^Due/)).not.toBeInTheDocument()
  })

  it('explains the default time and warns gently about past dates', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.click(screen.getByRole('button', { name: 'New task' }))

    expect(dateField()).toHaveAccessibleDescription('Due by the end of that day (11:59 pm).')
    await user.type(dateField(), PAST)
    expect(dateField()).toHaveAccessibleDescription('This date has already passed.')
  })

  it('can be cleared before saving', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.click(screen.getByRole('button', { name: 'New task' }))
    await user.type(screen.getByLabelText(/Title/), 'Changed my mind')
    await user.type(dateField(), FUTURE)

    await user.click(screen.getByRole('button', { name: 'Clear target date' }))
    expect(dateField()).toHaveValue('')
    expect(dateField()).toHaveFocus()
    expect(screen.queryByRole('button', { name: 'Clear target date' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create task' }))
    await screen.findByRole('heading', { name: 'Changed my mind' })
    expect(storedTasks()[0].dueAt).toBeNull()
  })

  it('rejects a date outside the allowed years and saves nothing', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.click(screen.getByRole('button', { name: 'New task' }))
    await user.type(screen.getByLabelText(/Title/), 'Typo year')
    fireEvent.change(dateField(), { target: { value: '2101-01-01' } })
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(dateField()).toHaveAttribute('aria-invalid', 'true')
    expect(dateField()).toHaveAccessibleDescription('Enter a valid date between 2000 and 2100.')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(window.localStorage.getItem('todo.tasks.v1')).toBeNull()
  })

  describe('when editing', () => {
    it('is pre-filled and can be changed', async () => {
      const { repo } = await seedWithDate(FUTURE)
      const user = userEvent.setup()
      renderApp('/', { repository: repo })
      await user.click(await screen.findByRole('button', { name: 'Edit "Write report"' }))

      expect(dateField()).toHaveValue(FUTURE)
      await user.clear(dateField())
      await user.type(dateField(), LATER)
      await user.click(screen.getByRole('button', { name: 'Save changes' }))

      expect(await screen.findByText(/^Due/)).toHaveTextContent(formatDueDate(dateInputToDueAt(LATER)!))
      expect(storedTasks()[0].dueAt).toBe(dateInputToDueAt(LATER))
    })

    it('can be removed', async () => {
      const { repo } = await seedWithDate(FUTURE)
      const user = userEvent.setup()
      renderApp('/', { repository: repo })
      await user.click(await screen.findByRole('button', { name: 'Edit "Write report"' }))

      await user.click(screen.getByRole('button', { name: 'Clear target date' }))
      await user.click(screen.getByRole('button', { name: 'Save changes' }))

      await screen.findByRole('heading', { name: 'Write report' })
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.queryByText(/^Due/)).not.toBeInTheDocument()
      expect(storedTasks()[0].dueAt).toBeNull()
    })

    it('keeps the exact saved deadline when only the title changes', async () => {
      // A deadline that is not 23:59 local (e.g. saved in another timezone) must not be shifted.
      const repo = createLocalStorageTaskRepository({ storage: window.localStorage })
      await repo.create({ title: 'Write report', description: '', dueAt: '2099-06-15T07:00:00.000Z' })
      const user = userEvent.setup()
      renderApp('/', { repository: repo })
      await user.click(await screen.findByRole('button', { name: 'Edit "Write report"' }))

      await user.type(screen.getByLabelText(/Title/), ' v2')
      await user.click(screen.getByRole('button', { name: 'Save changes' }))

      await screen.findByRole('heading', { name: 'Write report v2' })
      expect(storedTasks()[0].dueAt).toBe('2099-06-15T07:00:00.000Z')
    })
  })

  describe('on the details page', () => {
    it('shows the target date', async () => {
      const { repo, task } = await seedWithDate(FUTURE)
      renderApp(`/tasks/${task.id}`, { repository: repo })

      const section = await screen.findByRole('region', { name: 'Target date' })
      expect(section).toHaveTextContent(formatDueDate(task.dueAt!))
    })

    it('says when there is no target date', async () => {
      const { repo, task } = await seedWithDate(null)
      renderApp(`/tasks/${task.id}`, { repository: repo })

      expect(await screen.findByRole('region', { name: 'Target date' })).toHaveTextContent('No target date.')
    })
  })
})
