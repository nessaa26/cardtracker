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
    return payload.entries
  }

  // Legacy: flat array without versioning
  if (Array.isArray(raw)) {
    return raw as CardReleaseEntry[]
  }

  return []
}

export function loadEntries(): CardReleaseEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      // First run: seed localStorage
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
  a.download = `pct-export-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
