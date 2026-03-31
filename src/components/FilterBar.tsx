import type { FilterState, Region, AvailabilityStatus, SortField } from '../types'

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
    'border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="flex flex-wrap gap-2 items-center">
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

      {/* Sort field */}
      <select
        value={filters.sortField}
        onChange={(e) => set('sortField', e.target.value as SortField)}
        className={selectClass}
        aria-label="Sort by"
      >
        {SORT_FIELDS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      {/* Sort direction */}
      <button
        onClick={() =>
          set('sortDirection', filters.sortDirection === 'asc' ? 'desc' : 'asc')
        }
        className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle sort direction"
        title={filters.sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
      >
        {filters.sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
      </button>

      {/* Clear filters */}
      {(filters.region || filters.retailer || filters.status) && (
        <button
          onClick={() =>
            onChange({
              ...filters,
              region: '',
              retailer: '',
              status: '',
            })
          }
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
