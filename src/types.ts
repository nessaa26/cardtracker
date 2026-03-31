export type AvailabilityStatus =
  | 'rumored'
  | 'announced'
  | 'preorder'
  | 'in_stock'
  | 'out_of_stock'
  | 'discontinued'

export type Region = 'US' | 'CA' | 'EU' | 'UK' | 'JP' | 'AU' | 'OTHER'

export interface CardReleaseEntry {
  id: string
  productName: string
  setOrSeries: string
  releaseDate: string        // ISO yyyy-mm-dd
  region: Region
  retailer: string
  productUrl?: string
  status: AvailabilityStatus
  lastChecked: string        // ISO date
  price?: number
  currency?: string
  notes?: string
  createdAt: string          // ISO datetime
  updatedAt: string          // ISO datetime
}

export type SortField = 'releaseDate' | 'lastChecked' | 'productName' | 'status'
export type SortDirection = 'asc' | 'desc'

export interface FilterState {
  search: string
  region: Region | ''
  retailer: string
  status: AvailabilityStatus | ''
  sortField: SortField
  sortDirection: SortDirection
}

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
