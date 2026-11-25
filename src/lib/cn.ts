type ClassValue = string | false | null | undefined

/**
 * Joins CSS class names, skipping empty/false values.
 * Example: cn('btn', isActive && 'btn-active') → 'btn btn-active'
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
