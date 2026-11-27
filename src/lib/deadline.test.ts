import { describe, expect, it } from 'vitest'
import {
  dateInputToDueAt,
  dueAtToDateInput,
  formatDueDate,
  isIsoTimestamp,
  parseDateInput,
  todayDateInput,
} from './deadline'

describe('parseDateInput', () => {
  it('parses a real calendar date', () => {
    expect(parseDateInput('2026-12-05')).toEqual({ year: 2026, month: 12, day: 5 })
    expect(parseDateInput('2028-02-29')).toEqual({ year: 2028, month: 2, day: 29 })
  })

  it.each(['', '2026-12', '05/12/2026', '2026-1-5', '2026-02-30', '2027-02-29', '2026-13-01', '2026-00-10'])(
    'rejects %j',
    (value) => {
      expect(parseDateInput(value)).toBeNull()
    },
  )

  it('rejects years outside 2000–2100 (catches typos)', () => {
    expect(parseDateInput('1999-12-31')).toBeNull()
    expect(parseDateInput('2101-01-01')).toBeNull()
    expect(parseDateInput('2000-01-01')).not.toBeNull()
    expect(parseDateInput('2100-12-31')).not.toBeNull()
  })
})

describe('dateInputToDueAt', () => {
  it('returns null for an empty or invalid date', () => {
    expect(dateInputToDueAt('')).toBeNull()
    expect(dateInputToDueAt('2026-02-30')).toBeNull()
  })

  it('defaults the time to 23:59 local on the picked day', () => {
    const due = new Date(dateInputToDueAt('2026-12-05')!)
    expect(due.getFullYear()).toBe(2026)
    expect(due.getMonth()).toBe(11)
    expect(due.getDate()).toBe(5)
    expect(due.getHours()).toBe(23)
    expect(due.getMinutes()).toBe(59)
    expect(due.getSeconds()).toBe(0)
  })

  it('stores a canonical UTC ISO timestamp', () => {
    expect(isIsoTimestamp(dateInputToDueAt('2026-12-05')!)).toBe(true)
  })

  // Daylight-saving switch days (EU/US/southern hemisphere) and year/leap boundaries.
  it.each(['2026-03-08', '2026-03-29', '2026-04-05', '2026-10-04', '2026-10-25', '2026-11-01', '2026-12-31', '2028-02-29'])(
    'round-trips %s back to the same local date',
    (value) => {
      expect(dueAtToDateInput(dateInputToDueAt(value)!)).toBe(value)
    },
  )
})

describe('todayDateInput', () => {
  it('formats the local date with zero padding', () => {
    expect(todayDateInput(new Date(2026, 0, 7, 9, 30))).toBe('2026-01-07')
    expect(todayDateInput(new Date(2026, 10, 26, 23, 59))).toBe('2026-11-26')
  })
})

describe('isIsoTimestamp', () => {
  it('accepts only canonical toISOString output', () => {
    expect(isIsoTimestamp('2026-12-05T18:29:00.000Z')).toBe(true)
    expect(isIsoTimestamp('2026-12-05')).toBe(false)
    expect(isIsoTimestamp('2026-12-05T18:29:00Z')).toBe(false)
    expect(isIsoTimestamp('2026-02-30T10:00:00.000Z')).toBe(false)
    expect(isIsoTimestamp('nonsense')).toBe(false)
  })
})

describe('formatDueDate', () => {
  it('shows the local day, not the UTC day', () => {
    const due = dateInputToDueAt('2026-12-05')!
    expect(formatDueDate(due)).toMatch(/5/)
    expect(formatDueDate(due)).toMatch(/2026/)
    expect(formatDueDate(due)).not.toMatch(/23:59|11:59/)
  })
})
