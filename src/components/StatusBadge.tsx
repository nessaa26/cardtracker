import type { AvailabilityStatus } from '../types'

const STATUS_CONFIG: Record<
  AvailabilityStatus,
  { label: string; className: string }
> = {
  rumored: {
    label: 'Rumored',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
  announced: {
    label: 'Announced',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  preorder: {
    label: 'Preorder',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
  in_stock: {
    label: 'In Stock',
    className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  out_of_stock: {
    label: 'Out of Stock',
    className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
  discontinued: {
    label: 'Discontinued',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  },
}

interface StatusBadgeProps {
  status: AvailabilityStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  )
}

export { STATUS_CONFIG }
