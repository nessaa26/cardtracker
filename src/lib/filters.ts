import type { CardReleaseEntry, FilterState } from '../types'

export function filterAndSort(
  entries: CardReleaseEntry[],
  filters: FilterState,
): CardReleaseEntry[] {
  let result = [...entries]

  // Game filter
  if (filters.game) {
    result = result.filter((e) => e.game === filters.game)
  }

  // Search by product name
  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase()
    result = result.filter(
      (e) =>
        e.productName.toLowerCase().includes(q) ||
        e.setOrSeries.toLowerCase().includes(q) ||
        e.retailer.toLowerCase().includes(q),
    )
  }

  // Region filter
  if (filters.region) {
    result = result.filter((e) => e.region === filters.region)
  }

  // Retailer filter
  if (filters.retailer.trim()) {
    const r = filters.retailer.trim().toLowerCase()
    result = result.filter((e) => e.retailer.toLowerCase().includes(r))
  }

  // Status filter
  if (filters.status) {
    result = result.filter((e) => e.status === filters.status)
  }

  // Sort
  result.sort((a, b) => {
    let cmp = 0
    switch (filters.sortField) {
      case 'releaseDate':
        cmp = a.releaseDate.localeCompare(b.releaseDate)
        break
      case 'lastChecked':
        cmp = a.lastChecked.localeCompare(b.lastChecked)
        break
      case 'productName':
        cmp = a.productName.localeCompare(b.productName)
        break
      case 'status':
        cmp = a.status.localeCompare(b.status)
        break
    }
    return filters.sortDirection === 'asc' ? cmp : -cmp
  })

  return result
}

export function getUniqueRetailers(entries: CardReleaseEntry[]): string[] {
  const set = new Set(entries.map((e) => e.retailer))
  return [...set].sort()
}
