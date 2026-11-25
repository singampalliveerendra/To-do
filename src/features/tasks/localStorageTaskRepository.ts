import type { Task } from '@/types/task'
import type { TaskRepository } from './taskRepository'
import { hasErrors, normalizeTaskInput, TaskValidationError, validateTaskInput } from './taskValidation'

export const TASKS_STORAGE_KEY = 'todo.tasks.v1'

interface Options {
  storage?: Storage
  now?: () => Date
  generateId?: () => string
}

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.title === 'string' &&
    typeof v.description === 'string' &&
    typeof v.createdAt === 'string' &&
    typeof v.updatedAt === 'string'
  )
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
      // Ignore anything that isn't a valid task instead of crashing the app.
      return Array.isArray(parsed) ? parsed.filter(isTask) : []
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

  return {
    async list() {
      return read().sort(newestFirst)
    },

    async create(input) {
      const errors = validateTaskInput(input)
      if (hasErrors(errors)) throw new TaskValidationError(errors)

      const { title, description } = normalizeTaskInput(input)
      const timestamp = now().toISOString()
      const task: Task = {
        id: generateId(),
        title,
        description,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      write([task, ...read()])
      return task
    },
  }
}
