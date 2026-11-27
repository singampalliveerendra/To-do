import { isIsoTimestamp } from '@/lib/deadline'
import type { Task } from '@/types/task'
import { TaskNotArchivedError, TaskNotFoundError, type TaskRepository } from './taskRepository'
import { hasErrors, normalizeTaskInput, TaskValidationError, validateTaskInput } from './taskValidation'

export const TASKS_STORAGE_KEY = 'todo.tasks.v1'

interface Options {
  storage?: Storage
  now?: () => Date
  generateId?: () => string
}

/**
 * Turns one stored entry into a Task, or null if it is not a valid task.
 * Fills in fields added after the entry was saved (`archivedAt` from Task 2.3,
 * `completedAt` from Task 2.4, `dueAt` from Task 3.1),
 * so data saved by older versions of the app keeps working.
 */
function parseTask(value: unknown): Task | null {
  if (typeof value !== 'object' || value === null) return null
  const v = value as Record<string, unknown>
  if (
    typeof v.id !== 'string' ||
    typeof v.title !== 'string' ||
    typeof v.description !== 'string' ||
    typeof v.createdAt !== 'string' ||
    typeof v.updatedAt !== 'string'
  ) {
    return null
  }
  return {
    id: v.id,
    title: v.title,
    description: v.description,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
    completedAt: typeof v.completedAt === 'string' ? v.completedAt : null,
    archivedAt: typeof v.archivedAt === 'string' ? v.archivedAt : null,
    dueAt: typeof v.dueAt === 'string' && isIsoTimestamp(v.dueAt) ? v.dueAt : null,
  }
}

const newestFirst = (a: Task, b: Task) => b.createdAt.localeCompare(a.createdAt)

/** Stores tasks in the browser's LocalStorage (per browser, per device). */
export function createLocalStorageTaskRepository({
  storage = window.localStorage,
  now = () => new Date(),
  generateId = () => crypto.randomUUID(),
}: Options = {}): TaskRepository {
  function read(): Task[] {
    const raw = storage.getItem(TASKS_STORAGE_KEY)
    if (!raw) return []
    try {
      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      // Skip anything that isn't a valid task instead of crashing the app.
      return parsed.map(parseTask).filter((task): task is Task => task !== null)
    } catch {
      return []
    }
  }

  function write(tasks: Task[]): void {
    try {
      storage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      throw new Error('Could not save your task. Your browser storage may be full or disabled.')
    }
  }

  /** Applies `change` to one task, saves, and returns the new version. */
  function modify(id: string, change: (task: Task) => Task): Task {
    const tasks = read()
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) throw new TaskNotFoundError(id)
    const changed = change(tasks[index])
    if (changed !== tasks[index]) {
      tasks[index] = changed
      write(tasks)
    }
    return changed
  }

  return {
    async list() {
      return read().sort(newestFirst)
    },

    async create(input) {
      const errors = validateTaskInput(input)
      if (hasErrors(errors)) throw new TaskValidationError(errors)

      const { title, description, dueAt } = normalizeTaskInput(input)
      const timestamp = now().toISOString()
      const task: Task = {
        id: generateId(),
        title,
        description,
        createdAt: timestamp,
        updatedAt: timestamp,
        completedAt: null,
        archivedAt: null,
        dueAt,
      }
      write([task, ...read()])
      return task
    },

    async update(id, input) {
      const errors = validateTaskInput(input)
      if (hasErrors(errors)) throw new TaskValidationError(errors)
      const { title, description, dueAt } = normalizeTaskInput(input)

      return modify(id, (task) =>
        // Nothing changed → keep the original "last updated" time.
        task.title === title && task.description === description && task.dueAt === dueAt
          ? task
          : { ...task, title, description, dueAt, updatedAt: now().toISOString() },
      )
    },

    async complete(id) {
      // Already complete → keep the original completion time.
      return modify(id, (task) => (task.completedAt ? task : { ...task, completedAt: now().toISOString() }))
    },

    async reopen(id) {
      return modify(id, (task) => (task.completedAt ? { ...task, completedAt: null } : task))
    },

    async archive(id) {
      // Already archived → keep the original archive time.
      return modify(id, (task) => (task.archivedAt ? task : { ...task, archivedAt: now().toISOString() }))
    },

    async restore(id) {
      return modify(id, (task) => (task.archivedAt ? { ...task, archivedAt: null } : task))
    },

    async delete(id) {
      const tasks = read()
      const task = tasks.find((t) => t.id === id)
      if (!task) throw new TaskNotFoundError(id)
      if (!task.archivedAt) throw new TaskNotArchivedError(id)
      write(tasks.filter((t) => t.id !== id))
    },
  }
}
