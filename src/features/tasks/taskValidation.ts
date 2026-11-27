import { isIsoTimestamp } from '@/lib/deadline'
import type { NewTaskInput } from '@/types/task'

export const TITLE_MAX_LENGTH = 200
export const DESCRIPTION_MAX_LENGTH = 5000

export type TaskInputErrors = Partial<Record<keyof NewTaskInput, string>>

/** A task input with every field filled in (no optional fields left undefined). */
export type NormalizedTaskInput = Required<NewTaskInput>

/**
 * Trims surrounding whitespace so "  Buy milk  " is saved as "Buy milk",
 * turns a missing deadline into null, and drops `hasDueTime` when there is no deadline.
 */
export function normalizeTaskInput(input: NewTaskInput): NormalizedTaskInput {
  const dueAt = input.dueAt ?? null
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    dueAt,
    hasDueTime: dueAt !== null && (input.hasDueTime ?? false),
  }
}

/** Returns an error message per invalid field. An empty object means the input is valid. */
export function validateTaskInput(input: NewTaskInput): TaskInputErrors {
  const { title, description, dueAt } = normalizeTaskInput(input)
  const errors: TaskInputErrors = {}

  if (title.length === 0) {
    errors.title = 'Title is required.'
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`
  }

  if (dueAt !== null && !isIsoTimestamp(dueAt)) {
    errors.dueAt = 'Target date is not a valid date.'
  }

  return errors
}

export function hasErrors(errors: TaskInputErrors): boolean {
  return Object.keys(errors).length > 0
}

/** Thrown by repositories when input that bypassed the form is invalid. */
export class TaskValidationError extends Error {
  readonly errors: TaskInputErrors

  constructor(errors: TaskInputErrors) {
    super(Object.values(errors).join(' '))
    this.name = 'TaskValidationError'
    this.errors = errors
  }
}
