import { describe, expect, it } from 'vitest'
import { createLocalStorageTaskRepository, TASKS_STORAGE_KEY } from './localStorageTaskRepository'
import { TaskNotArchivedError, TaskNotFoundError } from './taskRepository'
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
      completedAt: null,
      archivedAt: null,
      dueAt: null,
    })
  })

  it('saves a target date', async () => {
    const task = await makeRepo().create({ title: 'Report', description: '', dueAt: '2026-12-05T18:29:00.000Z' })
    expect(task.dueAt).toBe('2026-12-05T18:29:00.000Z')
    const afterRefresh = createLocalStorageTaskRepository({ storage: window.localStorage })
    expect((await afterRefresh.list())[0].dueAt).toBe('2026-12-05T18:29:00.000Z')
  })

  it('rejects a malformed target date and saves nothing', async () => {
    const repo = makeRepo()
    await expect(repo.create({ title: 'Report', description: '', dueAt: 'next friday' })).rejects.toBeInstanceOf(
      TaskValidationError,
    )
    expect(await repo.list()).toEqual([])
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
      completedAt: null,
      archivedAt: null,
      dueAt: '2026-11-30T18:29:00.000Z',
    }
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([valid, { id: 1 }, null, 'text']))
    expect(await makeRepo().list()).toEqual([valid])
  })

  it('ignores a corrupted stored target date instead of dropping the task', async () => {
    const stored = {
      id: 'bad-date',
      title: 'Keep me',
      description: '',
      createdAt: '2026-11-25T09:00:00.000Z',
      updatedAt: '2026-11-25T09:00:00.000Z',
      dueAt: 'not a date',
    }
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([stored]))
    expect(await makeRepo().list()).toEqual([{ ...stored, completedAt: null, archivedAt: null, dueAt: null }])
  })

  it('loads tasks saved by older versions as active and not complete', async () => {
    const legacy = {
      id: 'old',
      title: 'Saved by v2.2',
      description: '',
      createdAt: '2026-11-25T09:00:00.000Z',
      updatedAt: '2026-11-25T09:00:00.000Z',
    }
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([legacy]))
    expect(await makeRepo().list()).toEqual([{ ...legacy, completedAt: null, archivedAt: null, dueAt: null }])
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

    it('sets, changes and clears the target date', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'Report', description: '' })

      const withDate = await repo.update(created.id, {
        title: 'Report',
        description: '',
        dueAt: '2026-12-05T18:29:00.000Z',
      })
      expect(withDate.dueAt).toBe('2026-12-05T18:29:00.000Z')
      expect(withDate.updatedAt).toBe('2026-11-25T10:02:00.000Z')

      const moved = await repo.update(created.id, { title: 'Report', description: '', dueAt: '2026-12-06T18:29:00.000Z' })
      expect(moved.dueAt).toBe('2026-12-06T18:29:00.000Z')

      const cleared = await repo.update(created.id, { title: 'Report', description: '', dueAt: null })
      expect(cleared.dueAt).toBeNull()
    })

    it('keeps updatedAt when the target date is unchanged', async () => {
      const repo = makeRepo()
      const due = '2026-12-05T18:29:00.000Z'
      const created = await repo.create({ title: 'Same', description: '', dueAt: due })
      const result = await repo.update(created.id, { title: 'Same', description: '', dueAt: due })
      expect(result.updatedAt).toBe(created.updatedAt)
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

  describe('archive, restore and delete', () => {
    it('archive sets archivedAt and keeps every other detail', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'Old task', description: 'keep this' })

      const archived = await repo.archive(created.id)

      expect(archived).toEqual({ ...created, archivedAt: '2026-11-25T10:02:00.000Z' })
      // Still stored (soft delete), not removed.
      expect(await repo.list()).toEqual([archived])
    })

    it('archiving twice keeps the first archive time', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'x', description: '' })
      const first = await repo.archive(created.id)
      const second = await repo.archive(created.id)
      expect(second.archivedAt).toBe(first.archivedAt)
    })

    it('restore clears archivedAt and keeps every other detail', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'Back again', description: 'notes' })
      await repo.archive(created.id)

      expect(await repo.restore(created.id)).toEqual(created)
    })

    it('archive/restore survive a refresh', async () => {
      const repo = makeRepo()
      const a = await repo.create({ title: 'A', description: '' })
      await repo.archive(a.id)

      const afterRefresh = createLocalStorageTaskRepository({ storage: window.localStorage })
      expect((await afterRefresh.list())[0].archivedAt).not.toBeNull()
    })

    it('refuses to delete a task that is not archived', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'Active', description: '' })

      await expect(repo.delete(created.id)).rejects.toBeInstanceOf(TaskNotArchivedError)
      expect(await repo.list()).toHaveLength(1)
    })

    it('permanently deletes an archived task and nothing else', async () => {
      const repo = makeRepo()
      const keep = await repo.create({ title: 'Keep', description: '' })
      const remove = await repo.create({ title: 'Remove', description: '' })
      await repo.archive(remove.id)

      await repo.delete(remove.id)

      expect(await repo.list()).toEqual([keep])
      const afterRefresh = createLocalStorageTaskRepository({ storage: window.localStorage })
      expect(await afterRefresh.list()).toEqual([keep])
    })

    it.each(['archive', 'restore', 'delete'] as const)('%s throws TaskNotFoundError for an unknown id', async (method) => {
      await expect(makeRepo()[method]('missing')).rejects.toBeInstanceOf(TaskNotFoundError)
    })
  })

  describe('complete and reopen', () => {
    it('complete records the exact completion time and keeps every other detail', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'Send invoice', description: 'to client' })

      const done = await repo.complete(created.id)

      expect(done).toEqual({ ...created, completedAt: '2026-11-25T10:02:00.000Z' })
      // Completing is not an edit: the "Edited" time does not change.
      expect(done.updatedAt).toBe(created.updatedAt)
    })

    it('completing twice keeps the first completion time', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'x', description: '' })
      const first = await repo.complete(created.id)
      const second = await repo.complete(created.id)
      expect(second.completedAt).toBe(first.completedAt)
    })

    it('reopen clears completedAt', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'Oops', description: '' })
      await repo.complete(created.id)

      expect(await repo.reopen(created.id)).toEqual(created)
    })

    it('completion survives a refresh', async () => {
      const repo = makeRepo()
      const created = await repo.create({ title: 'Persist me', description: '' })
      await repo.complete(created.id)

      const afterRefresh = createLocalStorageTaskRepository({ storage: window.localStorage })
      expect((await afterRefresh.list())[0].completedAt).toBe('2026-11-25T10:02:00.000Z')
    })

    it('loads a saved completion time', async () => {
      window.localStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify([
          {
            id: 'a',
            title: 'Done before',
            description: '',
            createdAt: '2026-11-25T09:00:00.000Z',
            updatedAt: '2026-11-25T09:00:00.000Z',
            completedAt: '2026-11-25T09:30:00.000Z',
            archivedAt: null,
          },
        ]),
      )
      expect((await makeRepo().list())[0].completedAt).toBe('2026-11-25T09:30:00.000Z')
    })

    it.each(['complete', 'reopen'] as const)('%s throws TaskNotFoundError for an unknown id', async (method) => {
      await expect(makeRepo()[method]('missing')).rejects.toBeInstanceOf(TaskNotFoundError)
    })
  })
})
