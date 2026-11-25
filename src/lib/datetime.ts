const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

/** "25 Nov 2026, 3:40 pm" in the user's own locale and timezone. */
export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso))
}
