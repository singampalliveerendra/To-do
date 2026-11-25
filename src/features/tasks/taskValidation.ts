import type { NewTaskInput } from '@/types/task'

export const TITLE_MAX_LENGTH = 200
export const DESCRIPTION_MAX_LENGTH = 5000

export type TaskInputErrors = Partial<Record<keyof NewTaskInput, string>>

/** Trims surrounding whitespace so "  Buy milk  " is saved as "Buy milk". */
export function normalizeTaskInput(input: NewTaskInput): NewTaskInput {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
  }
}

/** Returns an error message per invalid field. An empty object means the input is valid. */
export function validateTaskInput(input: NewTaskInput): TaskInputErrors {
  const { title, description } = normalizeTaskInput(input)
  const errors: TaskInputErrors = {}

  if (title.length === 0) {
    errors.title = 'Title is required.'
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`
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
