/** Friendly greeting for the time of day (uses the user's local clock). */
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 22) return 'Good evening'
  return 'Hello, night owl'
}

/** Short encouraging line based on how much is left to do. */
export function getMotivation(pending: number, completed: number): string {
  if (pending === 0 && completed === 0) return 'A fresh start! Add your first task and let’s get rolling.'
  if (pending === 0) return 'Everything is done. You’re on fire!'
  if (completed === 0) return `${pending} ${pending === 1 ? 'task is' : 'tasks are'} waiting. Let’s knock out the first one!`
  return `${pending} to go, ${completed} done. Keep the momentum going!`
}

/** Percentage of finished tasks, rounded (0 when there are no tasks). */
export function completionPercent(pending: number, completed: number): number {
  const total = pending + completed
  return total === 0 ? 0 : Math.round((completed / total) * 100)
}
