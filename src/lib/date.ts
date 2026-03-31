/**
 * Format an ISO date string (yyyy-mm-dd) as a human-readable date.
 */
export function formatDate(iso: string): string {
  if (!iso) return '—'
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Returns today as an ISO date string (yyyy-mm-dd).
 */
export function today(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Returns now as an ISO datetime string.
 */
export function nowISO(): string {
  return new Date().toISOString()
}

/**
 * Returns true if a is after b (both ISO date strings).
 */
export function isAfter(a: string, b: string): boolean {
  return a > b
}
