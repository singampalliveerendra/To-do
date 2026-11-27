import { describe, expect, it } from 'vitest'
import {
  dateInputToDueAt,
  dueAtToDateInput,
  dueAtToTimeInput,
  formatDueDate,
  isIsoTimestamp,
  parseDateInput,
  parseTimeInput,
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

describe('parseTimeInput', () => {
  it('parses 24-hour times', () => {
    expect(parseTimeInput('00:00')).toEqual({ hour: 0, minute: 0 })
    expect(parseTimeInput('17:05')).toEqual({ hour: 17, minute: 5 })
    expect(parseTimeInput('23:59')).toEqual({ hour: 23, minute: 59 })
  })

  it.each(['', '24:00', '12:60', '9:30', '09:30:00', '5pm'])('rejects %j', (value) => {
    expect(parseTimeInput(value)).toBeNull()
  })
})

describe('dateInputToDueAt with a time', () => {
  it('uses the picked local time', () => {
    const due = new Date(dateInputToDueAt('2026-12-05', '17:30')!)
    expect([due.getDate(), due.getHours(), due.getMinutes()]).toEqual([5, 17, 30])
  })

  it('treats an empty time as 23:59', () => {
    expect(dateInputToDueAt('2026-12-05', '')).toBe(dateInputToDueAt('2026-12-05'))
  })

  it('handles midnight at the start of the day', () => {
    const due = new Date(dateInputToDueAt('2026-12-05', '00:00')!)
    expect([due.getDate(), due.getHours(), due.getMinutes()]).toEqual([5, 0, 0])
  })

  it('returns null for an invalid time', () => {
    expect(dateInputToDueAt('2026-12-05', '25:00')).toBeNull()
  })

  it('is ordered correctly: 1 minute apart stays 1 minute apart', () => {
    const a = Date.parse(dateInputToDueAt('2026-12-05', '17:00')!)
    const b = Date.parse(dateInputToDueAt('2026-12-05', '17:01')!)
    expect(b - a).toBe(60_000)
  })

  it.each([
    ['2026-03-08', '12:00'],
    ['2026-03-29', '12:00'],
    ['2026-10-25', '00:30'],
    ['2026-11-01', '23:15'],
    ['2026-04-05', '18:45'],
  ])('round-trips %s %s on daylight-saving switch days', (date, time) => {
    const due = dateInputToDueAt(date, time)!
    expect(dueAtToDateInput(due)).toBe(date)
    expect(dueAtToTimeInput(due)).toBe(time)
  })
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

  it('includes the time only when one was picked', () => {
    const due = dateInputToDueAt('2026-12-05', '17:30')!
    expect(formatDueDate(due, true)).toMatch(/5:30|17:30/)
    expect(formatDueDate(due, false)).not.toMatch(/5:30|17:30/)
  })
})
