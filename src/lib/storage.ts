import type { CardReleaseEntry } from '../types'
import seedData from '../data/seed.json'

const STORAGE_KEY = 'pct.entries.v1'
const SCHEMA_VERSION = 1

interface StoragePayload {
  version: number
  entries: CardReleaseEntry[]
}

function migrate(raw: unknown): CardReleaseEntry[] {
  if (!raw || typeof raw !== 'object') return []

  // v1 schema
  const payload = raw as StoragePayload
  if (payload.version === SCHEMA_VERSION && Array.isArray(payload.entries)) {
    // Add game field to entries missing it (migration from pre-game era)
    return payload.entries.map((e: CardReleaseEntry) => ({
      ...e,
      game: e.game ?? 'pokemon',
    }))
  }

  // Legacy: flat array without versioning
  if (Array.isArray(raw)) {
    return (raw as CardReleaseEntry[]).map((e) => ({
      ...e,
      game: e.game ?? 'pokemon',
    }))
  }

  return []
}

export function loadEntries(): CardReleaseEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      const seed = seedData as CardReleaseEntry[]
      saveEntries(seed)
      return seed
    }
    const parsed: unknown = JSON.parse(raw)
    return migrate(parsed)
  } catch {
    return seedData as CardReleaseEntry[]
  }
}

export function saveEntries(entries: CardReleaseEntry[]): void {
  const payload: StoragePayload = {
    version: SCHEMA_VERSION,
    entries,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function resetToSeed(): CardReleaseEntry[] {
  const seed = seedData as CardReleaseEntry[]
  saveEntries(seed)
  return seed
}

export function exportEntries(entries: CardReleaseEntry[]): void {
  const json = JSON.stringify(entries, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `card-tracker-export-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
