import { useState, useCallback } from 'react'
import type { CardReleaseEntry, FilterState, ToastMessage } from '../types'
import { loadEntries, saveEntries } from '../lib/storage'
import { filterAndSort, getUniqueRetailers } from '../lib/filters'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { generateId } from '../lib/id'
import { nowISO } from '../lib/date'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import CardTable from '../components/CardTable'
import CardDetailModal from '../components/CardDetailModal'
import CardFormModal from '../components/CardFormModal'
import EmptyState from '../components/EmptyState'
import ToastContainer from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'

const DEFAULT_FILTERS: FilterState = {
  search: '',
  game: '',
  region: '',
  retailer: '',
  status: '',
  sortField: 'releaseDate',
  sortDirection: 'desc',
}

export default function HomePage() {
  const [entries, setEntries] = useState<CardReleaseEntry[]>(() => loadEntries())
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [viewEntry, setViewEntry] = useState<CardReleaseEntry | null>(null)
  const [editEntry, setEditEntry] = useState<CardReleaseEntry | null | undefined>(undefined)
  const [deleteEntry, setDeleteEntry] = useState<CardReleaseEntry | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const debouncedSearch = useDebouncedValue(filters.search)
  const effectiveFilters = { ...filters, search: debouncedSearch }
  const filtered = filterAndSort(entries, effectiveFilters)
  const retailers = getUniqueRetailers(entries)
  const hasFilters = !!(filters.search || filters.game || filters.region || filters.retailer || filters.status)

  const pokemonCount = entries.filter(e => e.game === 'pokemon').length
  const onePieceCount = entries.filter(e => e.game === 'one_piece').length

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = generateId()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  function persist(updated: CardReleaseEntry[]) {
    setEntries(updated)
    saveEntries(updated)
  }

  function handleSave(entry: CardReleaseEntry) {
    const exists = entries.some((e) => e.id === entry.id)
    let updated: CardReleaseEntry[]
    if (exists) {
      updated = entries.map((e) => (e.id === entry.id ? entry : e))
      addToast('Entry updated.')
    } else {
      updated = [...entries, entry]
      addToast('Entry added.')
    }
    persist(updated)
    setEditEntry(undefined)
  }

  function handleDelete() {
    if (!deleteEntry) return
    const updated = entries.filter((e) => e.id !== deleteEntry.id)
    persist(updated)
    addToast('Entry deleted.')
    setDeleteEntry(null)
  }

  function handleDuplicate(entry: CardReleaseEntry) {
    const now = nowISO()
    const dupe: CardReleaseEntry = {
      ...entry,
      id: generateId(),
      productName: `${entry.productName} (copy)`,
      createdAt: now,
      updatedAt: now,
    }
    persist([...entries, dupe])
    addToast('Entry duplicated.')
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  return (
    <>
      <div className="space-y-5">
        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200/60 dark:border-amber-700/40 rounded-xl px-3 py-2">
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">⚡ Pokémon: {pokemonCount}</span>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200/60 dark:border-red-700/40 rounded-xl px-3 py-2">
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">☠️ One Piece: {onePieceCount}</span>
            </div>
          </div>
        </div>

        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <SearchBar
              value={filters.search}
              onChange={(v) => setFilters((f) => ({ ...f, search: v }))}
            />
          </div>
          <button
            onClick={() => setEditEntry(null)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            + Add Entry
          </button>
        </div>

        {/* Filter bar */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          retailerOptions={retailers}
        />

        {/* Count */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-bold text-gray-700 dark:text-gray-300">{filtered.length}</span> of {entries.length} entries
        </p>

        {/* Table or empty */}
        {filtered.length > 0 ? (
          <CardTable
            entries={filtered}
            onView={setViewEntry}
            onEdit={(e) => setEditEntry(e)}
            onDuplicate={handleDuplicate}
            onDelete={setDeleteEntry}
          />
        ) : (
          <EmptyState
            hasFilters={hasFilters}
            onClear={clearFilters}
            onAdd={() => setEditEntry(null)}
          />
        )}
      </div>

      {/* Modals */}
      {viewEntry && (
        <CardDetailModal
          entry={viewEntry}
          onClose={() => setViewEntry(null)}
          onEdit={(e) => {
            setViewEntry(null)
            setEditEntry(e)
          }}
        />
      )}

      {editEntry !== undefined && (
        <CardFormModal
          entry={editEntry}
          onSave={handleSave}
          onClose={() => setEditEntry(undefined)}
        />
      )}

      {deleteEntry && (
        <ConfirmDialog
          message={`Delete "${deleteEntry.productName}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteEntry(null)}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}
