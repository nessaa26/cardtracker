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
  const hasFilters = !!(filters.search || filters.region || filters.retailer || filters.status)

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
      <div className="space-y-4">
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
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
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
          Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{filtered.length}</span> of {entries.length} entries
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
