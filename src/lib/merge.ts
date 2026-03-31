import type { CardReleaseEntry } from '../types'

/**
 * Merges incoming entries into the existing entries:
 * - If an incoming item's id matches an existing one, replace only if updatedAt is newer.
 * - If the id is new, add it.
 */
export function mergeEntries(
  existing: CardReleaseEntry[],
  incoming: CardReleaseEntry[],
): CardReleaseEntry[] {
  const map = new Map<string, CardReleaseEntry>()
  for (const entry of existing) {
    map.set(entry.id, entry)
  }
  for (const entry of incoming) {
    const current = map.get(entry.id)
    if (!current || entry.updatedAt > current.updatedAt) {
      map.set(entry.id, entry)
    }
  }
  return [...map.values()]
}

/**
 * Validates that a value is an array of CardReleaseEntry-shaped objects.
 */
export function validateImport(data: unknown): CardReleaseEntry[] {
  if (!Array.isArray(data)) {
    throw new Error('Import file must contain a JSON array.')
  }
  for (const item of data) {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof (item as Record<string, unknown>).id !== 'string' ||
      typeof (item as Record<string, unknown>).productName !== 'string'
    ) {
      throw new Error('Each entry must have at least "id" and "productName" string fields.')
    }
  }
  return data as CardReleaseEntry[]
}
