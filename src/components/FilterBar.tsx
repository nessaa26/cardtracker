import type { FilterState, Region, AvailabilityStatus, SortField, CardGame } from '../types'

const GAMES: { value: CardGame | ''; label: string }[] = [
  { value: '', label: '🎴 All Games' },
  { value: 'pokemon', label: '⚡ Pokémon TCG' },
  { value: 'one_piece', label: '☠️ One Piece TCG' },
]

const REGIONS: { value: Region | ''; label: string }[] = [
  { value: '', label: 'All Regions' },
  { value: 'US', label: '🇺🇸 US' },
  { value: 'CA', label: '🇨🇦 CA' },
  { value: 'EU', label: '🇪🇺 EU' },
  { value: 'UK', label: '🇬🇧 UK' },
  { value: 'JP', label: '🇯🇵 JP' },
  { value: 'AU', label: '🇦🇺 AU' },
  { value: 'OTHER', label: 'Other' },
]

const STATUSES: { value: AvailabilityStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'rumored', label: 'Rumored' },
  { value: 'announced', label: 'Announced' },
  { value: 'preorder', label: 'Preorder' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'discontinued', label: 'Discontinued' },
]

const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: 'releaseDate', label: 'Release Date' },
  { value: 'lastChecked', label: 'Last Checked' },
  { value: 'productName', label: 'Product Name' },
  { value: 'status', label: 'Status' },
]

interface FilterBarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  retailerOptions: string[]
}

export default function FilterBar({ filters, onChange, retailerOptions }: FilterBarProps) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value })

  const selectClass =
    'border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-shadow hover:shadow-md'

  const hasActiveFilters = !!(filters.game || filters.region || filters.retailer || filters.status)

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-4 shadow-sm">
      <div className="flex flex-wrap gap-2.5 items-center">
        {/* Game */}
        <select
          value={filters.game}
          onChange={(e) => set('game', e.target.value as CardGame | '')}
          className={selectClass}
          aria-label="Filter by game"
        >
          {GAMES.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>

        {/* Region */}
        <select
          value={filters.region}
          onChange={(e) => set('region', e.target.value as Region | '')}
          className={selectClass}
          aria-label="Filter by region"
        >
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        {/* Retailer */}
        <select
          value={filters.retailer}
          onChange={(e) => set('retailer', e.target.value)}
          className={selectClass}
          aria-label="Filter by retailer"
        >
          <option value="">All Retailers</option>
          {retailerOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => set('status', e.target.value as AvailabilityStatus | '')}
          className={selectClass}
          aria-label="Filter by status"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 ml-auto">
          {/* Sort field */}
          <select
            value={filters.sortField}
            onChange={(e) => set('sortField', e.target.value as SortField)}
            className={selectClass}
            aria-label="Sort by"
          >
            {SORT_FIELDS.map((f) => (
              <option key={f.value} value={f.value}>
                ↕ {f.label}
              </option>
            ))}
          </select>

          {/* Sort direction */}
          <button
            onClick={() =>
              set('sortDirection', filters.sortDirection === 'asc' ? 'desc' : 'asc')
            }
            className="border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-sm px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
            aria-label="Toggle sort direction"
            title={filters.sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
          >
            {filters.sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={() =>
                onChange({
                  ...filters,
                  game: '',
                  region: '',
                  retailer: '',
                  status: '',
                })
              }
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
