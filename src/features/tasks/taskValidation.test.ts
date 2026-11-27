import { describe, expect, it } from 'vitest'
import {
  DESCRIPTION_MAX_LENGTH,
  hasErrors,
  normalizeTaskInput,
  TITLE_MAX_LENGTH,
  validateTaskInput,
} from './taskValidation'

describe('validateTaskInput', () => {
  it('accepts a title with an empty description', () => {
    expect(validateTaskInput({ title: 'Buy milk', description: '' })).toEqual({})
  })

  it.each(['', '   ', '\n\t'])('requires a non-blank title (%j)', (title) => {
    expect(validateTaskInput({ title, description: '' }).title).toBe('Title is required.')
  })

  it('accepts a title of exactly the maximum length', () => {
    expect(validateTaskInput({ title: 'a'.repeat(TITLE_MAX_LENGTH), description: '' })).toEqual({})
  })

  it('rejects a title over the maximum length', () => {
    const errors = validateTaskInput({ title: 'a'.repeat(TITLE_MAX_LENGTH + 1), description: '' })
    expect(errors.title).toMatch(/200 characters or fewer/)
  })

  it('rejects a description over the maximum length', () => {
    const errors = validateTaskInput({ title: 'ok', description: 'a'.repeat(DESCRIPTION_MAX_LENGTH + 1) })
    expect(errors.description).toMatch(/5000 characters or fewer/)
    expect(hasErrors(errors)).toBe(true)
  })

  it('accepts no target date, null, or a valid UTC timestamp', () => {
    expect(validateTaskInput({ title: 'ok', description: '', dueAt: null })).toEqual({})
    expect(validateTaskInput({ title: 'ok', description: '', dueAt: '2026-12-05T18:29:00.000Z' })).toEqual({})
  })

  it.each(['', 'tomorrow', '2026-12-05', '2026-02-30T23:59:00.000Z'])('rejects a malformed target date (%j)', (dueAt) => {
    expect(validateTaskInput({ title: 'ok', description: '', dueAt }).dueAt).toBe('Target date is not a valid date.')
  })

  it('measures length after trimming spaces', () => {
    const padded = `  ${'a'.repeat(TITLE_MAX_LENGTH)}  `
    expect(validateTaskInput({ title: padded, description: '' })).toEqual({})
  })
})

describe('normalizeTaskInput', () => {
  it('trims title and description', () => {
    expect(normalizeTaskInput({ title: '  Report  ', description: '\n notes \n' })).toEqual({
      title: 'Report',
      description: 'notes',
      dueAt: null,
    })
  })

  it('keeps a given target date', () => {
    expect(normalizeTaskInput({ title: 'R', description: '', dueAt: '2026-12-05T18:29:00.000Z' }).dueAt).toBe(
      '2026-12-05T18:29:00.000Z',
    )
  })
})
