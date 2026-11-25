import { describe, expect, it } from 'vitest'
import type { Task } from '@/types/task'
import { selectActiveTasks, selectArchivedTasks, selectCompletedTasks, selectPendingTasks } from './taskSelectors'

function task(id: string, overrides: Partial<Task> = {}): Task {
  return {
    id,
    title: id,
    description: '',
    createdAt: '2026-11-25T09:00:00.000Z',
    updatedAt: '2026-11-25T09:00:00.000Z',
    completedAt: null,
    archivedAt: null,
    ...overrides,
  }
}

const open = task('open')
const doneEarly = task('done-early', { completedAt: '2026-11-25T10:00:00.000Z' })
const doneLate = task('done-late', { completedAt: '2026-11-25T11:00:00.000Z' })
const archivedOpen = task('archived-open', { archivedAt: '2026-11-25T12:00:00.000Z' })
const archivedDone = task('archived-done', {
  completedAt: '2026-11-25T10:30:00.000Z',
  archivedAt: '2026-11-25T12:30:00.000Z',
})
const all = [open, doneEarly, doneLate, archivedOpen, archivedDone]

describe('task selectors', () => {
  it('active = everything that is not archived', () => {
    expect(selectActiveTasks(all).map((t) => t.id)).toEqual(['open', 'done-early', 'done-late'])
  })

  it('pending = active and not completed', () => {
    expect(selectPendingTasks(all).map((t) => t.id)).toEqual(['open'])
  })

  it('completed = active and completed, most recently completed first', () => {
    expect(selectCompletedTasks(all).map((t) => t.id)).toEqual(['done-late', 'done-early'])
  })

  it('archived tasks never appear in pending or completed', () => {
    const ids = [...selectPendingTasks(all), ...selectCompletedTasks(all)].map((t) => t.id)
    expect(ids).not.toContain('archived-open')
    expect(ids).not.toContain('archived-done')
  })

  it('archived = archived (completed or not), most recently archived first', () => {
    expect(selectArchivedTasks(all).map((t) => t.id)).toEqual(['archived-done', 'archived-open'])
  })
})
