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

/**
 * Turns a picked date into the stored deadline: that date at 23:59 local time,
 * as a UTC ISO string. Returns null for an empty or invalid value.
 */
export function dateInputToDueAt(value: string): string | null {
  const parts = parseDateInput(value)
  if (!parts) return null
  return new Date(parts.year, parts.month - 1, parts.day, DEFAULT_DUE_HOUR, DEFAULT_DUE_MINUTE).toISOString()
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

/** "Fri, 28 Nov 2026" in the user's own locale and timezone. */
export function formatDueDate(dueAt: string): string {
  return dueDateFormat.format(new Date(dueAt))
}
