/**
 * Deadline helpers. A deadline is stored as one UTC timestamp (`dueAt`), built
 * from what the user picked in their own timezone. When only a date is picked,
 * the time defaults to 23:59 local (see PROJECT_PLAN "Deadline & status rules").
 *
 * Date inputs use the browser's `YYYY-MM-DD` format. All conversions use the
 * local `Date` constructor/getters, so daylight-saving changes are handled by
 * the browser instead of by hand-written offset maths.
 */

export const DEFAULT_DUE_HOUR = 23
export const DEFAULT_DUE_MINUTE = 59

/** Sensible bounds that also catch typos such as a 5-digit year. */
export const MIN_DUE_YEAR = 2000
export const MAX_DUE_YEAR = 2100
export const MIN_DATE_INPUT = `${MIN_DUE_YEAR}-01-01`
export const MAX_DATE_INPUT = `${MAX_DUE_YEAR}-12-31`

const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const TIME_INPUT_PATTERN = /^(\d{2}):(\d{2})$/

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Parses a `YYYY-MM-DD` value into its parts, or returns null when it is not a
 * real calendar date (e.g. 2026-02-30) or is outside the allowed years.
 */
export function parseDateInput(value: string): { year: number; month: number; day: number } | null {
  const match = DATE_INPUT_PATTERN.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (year < MIN_DUE_YEAR || year > MAX_DUE_YEAR) return null
  // Let Date roll over invalid days (Feb 30 → Mar 2), then check it didn't.
  const probe = new Date(year, month - 1, day)
  if (probe.getFullYear() !== year || probe.getMonth() !== month - 1 || probe.getDate() !== day) return null
  return { year, month, day }
}

/** Parses an `HH:MM` (24-hour) time input value, or returns null when it is not a real time. */
export function parseTimeInput(value: string): { hour: number; minute: number } | null {
  const match = TIME_INPUT_PATTERN.exec(value)
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) return null
  return { hour, minute }
}

/**
 * Turns a picked date (and optional time) into the stored deadline, as a UTC
 * ISO string. No time (or '') means 23:59 local. Returns null when the date is
 * empty/invalid or a given time is invalid.
 *
 * A time that does not exist locally (skipped by a daylight-saving jump) is
 * moved forward by the browser, e.g. 02:30 → 03:30.
 */
export function dateInputToDueAt(date: string, time = ''): string | null {
  const parts = parseDateInput(date)
  if (!parts) return null
  const clock = time === '' ? { hour: DEFAULT_DUE_HOUR, minute: DEFAULT_DUE_MINUTE } : parseTimeInput(time)
  if (!clock) return null
  return new Date(parts.year, parts.month - 1, parts.day, clock.hour, clock.minute).toISOString()
}

/** The local time of a stored deadline, as an `HH:MM` input value. */
export function dueAtToTimeInput(dueAt: string): string {
  const d = new Date(dueAt)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** The local calendar date of a stored deadline, as a `YYYY-MM-DD` input value. */
export function dueAtToDateInput(dueAt: string): string {
  const d = new Date(dueAt)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Today's local date as a `YYYY-MM-DD` input value. */
export function todayDateInput(now: Date = new Date()): string {
  return dueAtToDateInput(now.toISOString())
}

/** True for a canonical UTC ISO timestamp, exactly as `Date#toISOString()` writes it. */
export function isIsoTimestamp(value: string): boolean {
  const time = Date.parse(value)
  return !Number.isNaN(time) && new Date(time).toISOString() === value
}

const dueDateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const dueDateTimeFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

/**
 * "Fri, 28 Nov 2026" in the user's own locale and timezone — plus the time
 * ("Fri, 28 Nov 2026, 5:00 pm") when the user picked one.
 */
export function formatDueDate(dueAt: string, hasDueTime = false): string {
  return (hasDueTime ? dueDateTimeFormat : dueDateFormat).format(new Date(dueAt))
}
