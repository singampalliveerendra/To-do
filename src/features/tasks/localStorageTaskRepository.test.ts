import { describe, expect, it } from 'vitest'
import { createLocalStorageTaskRepository, TASKS_STORAGE_KEY } from './localStorageTaskRepository'
import { TaskNotFoundError } from './taskRepository'
import { TaskValidationError } from './taskValidation'

function makeRepo(start = new Date('2026-11-25T10:00:00.000Z')) {
  let time = start.getTime()
  let id = 0
  return createLocalStorageTaskRepository({
    storage: window.localStorage,
    now: () => new Date((time += 60_000)), // each call is 1 minute later
    generateId: () => `task-${++id}`,
  })
}

describe('createLocalStorageTaskRepository', () => {
  it('starts empty', async () => {
    expect(await makeRepo().list()).toEqual([])
  })

  it('creates a task with id and timestamps, trimming input', async () => {
    const repo = makeRepo()
    const task = await repo.create({ title: '  Write report ', description: ' Q4 numbers ' })

    expect(task).toEqual({
      id: 'task-1',
      title: 'Write report',
      description: 'Q4 numbers',
      createdAt: '2026-11-25T10:01:00.000Z',
      updatedAt: '2026-11-25T10:01:00.000Z',
    })
  })

  it('persists tasks so a new instance (page refresh) still sees them', async () => {
    await makeRepo().create({ title: 'Survives refresh', description: '' })

    const afterRefresh = createLocalStorageTaskRepository({ storage: window.localStorage })
    const tasks = await afterRefresh.list()
    expect(tasks.map((t) => t.title)).toEqual(['Survives refresh'])
  })

  it('lists newest first', async () => {
    const repo = makeRepo()
    await repo.create({ title: 'First', description: '' })
    await repo.create({ title: 'Second', description: '' })
    await repo.create({ title: 'Third', description: '' })

    expect((await repo.list()).map((t) => t.title)).toEqual(['Third', 'Second', 'First'])
  })

  it('gives every task a unique id', async () => {
    const repo = createLocalStorageTaskRepository({ storage: window.localStorage })
    const a = await repo.create({ title: 'Same title', description: '' })
    const b = await repo.create({ title: 'Same title', description: '' })
    expect(a.id).not.toBe(b.id)
  })

  it('rejects invalid input and saves nothing', async () => {
    const repo = makeRepo()
    await expect(repo.create({ title: '   ', description: '' })).rejects.toBeInstanceOf(TaskValidationError)
    expect(await repo.list()).toEqual([])
  })

  it('recovers from corrupted storage instead of crashing', async () => {
    window.localStorage.setItem(TASKS_STORAGE_KEY, '{not valid json')
    expect(await makeRepo().list()).toEqual([])
  })

  it('skips entries that are not valid tasks', async () => {
    const valid = {
      id: 'ok',
      title: 'Valid',
      description: '',
      createdAt: '2026-11-25T09:00:00.000Z',
      updatedAt: '2026-11-25T09:00:00.000Z',
    }
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([valid, { id: 1 }, null, 'text']))
    expect(await makeRepo().list()).toEqual([valid])
  })

  it('reports a friendly error when storage is full', async () => {
    const fullStorage = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('quota', 'QuotaExceededError')
      },
    } as unknown as Storage
    const repo = createLocalStorageTaskRepository({ storage: fullStorage })
    await expect(repo.create({ title: 'x', description: '' })).rejects.toThrow(/browser storage may be full/)
  })

  describe('update', () => {
    it('changes title and description, bumps updatedAt and keeps createdAt', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'Draft', description: 'old notes' })

      const updated = await repo.update(created.id, { title: '  Final report ', description: ' new notes ' })

      expect(updated).toEqual({
        ...created,
        title: 'Final report',
        description: 'new notes',
        updatedAt: '2026-11-25T10:02:00.000Z',
      })
      expect(updated.createdAt).toBe('2026-11-25T10:01:00.000Z')
    })

    it('persists the change across a refresh', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'Before', description: '' })
      await repo.update(created.id, { title: 'After', description: '' })

      const afterRefresh = createLocalStorageTaskRepository({ storage: window.localStorage })
      expect((await afterRefresh.list()).map((t) => t.title)).toEqual(['After'])
    })

    it('does not touch other tasks or change list order', async () => {
      const repo = makeRepo()
      const first = await repo.create({ title: 'First', description: '' })
      await repo.create({ title: 'Second', description: '' })

      await repo.update(first.id, { title: 'First (edited)', description: '' })

      expect((await repo.list()).map((t) => t.title)).toEqual(['Second', 'First (edited)'])
    })

    it('keeps updatedAt when nothing actually changed', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'Same', description: 'text' })
      const result = await repo.update(created.id, { title: ' Same ', description: 'text' })
      expect(result.updatedAt).toBe(created.updatedAt)
    })

    it('rejects invalid input and leaves the task unchanged', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'Keep me', description: '' })

      await expect(repo.update(created.id, { title: ' ', description: '' })).rejects.toBeInstanceOf(TaskValidationError)
      expect(await repo.list()).toEqual([created])
    })

    it('throws TaskNotFoundError for an unknown id', async () => {
      await expect(makeRepo().update('missing', { title: 'x', description: '' })).rejects.toBeInstanceOf(
        TaskNotFoundError,
      )
    })
  })
})
