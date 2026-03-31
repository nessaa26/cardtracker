import type { CardReleaseEntry } from '../types'
import seedData from '../data/seed.json'
import communityData from '../data/community.json'

const STORAGE_KEY = 'pct.entries.v1'
const SCHEMA_VERSION = 1
const COMMUNITY_URL = 'https://raw.githubusercontent.com/nessaa26/cardtracker/main/src/data/community.json'

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

function mergeById(local: CardReleaseEntry[], remote: CardReleaseEntry[]): CardReleaseEntry[] {
  const map = new Map<string, CardReleaseEntry>()
  for (const e of local) map.set(e.id, e)
  for (const e of remote) {
    const existing = map.get(e.id)
    if (!existing || e.updatedAt > existing.updatedAt) {
      map.set(e.id, { ...e, game: e.game ?? 'pokemon' })
    }
  }
  return Array.from(map.values())
}

export function loadEntries(): CardReleaseEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      // First run: merge seed + bundled community data
      const seed = seedData as CardReleaseEntry[]
      const community = communityData as CardReleaseEntry[]
      const merged = mergeById(seed, community)
      saveEntries(merged)
      return merged
    }
    const parsed: unknown = JSON.parse(raw)
    const local = migrate(parsed)
    // Also merge bundled community data
    const community = communityData as CardReleaseEntry[]
    return mergeById(local, community)
  } catch {
    return seedData as CardReleaseEntry[]
  }
}

export async function fetchCommunityUpdates(): Promise<CardReleaseEntry[]> {
  try {
    const res = await fetch(COMMUNITY_URL, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data.map((e: CardReleaseEntry) => ({ ...e, game: e.game ?? 'pokemon' }))
  } catch {
    return []
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
  const community = communityData as CardReleaseEntry[]
  const merged = mergeById(seed, community)
  saveEntries(merged)
  return merged
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
