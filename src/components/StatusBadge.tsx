import type { AvailabilityStatus } from '../types'

const STATUS_CONFIG: Record<
  AvailabilityStatus,
  { label: string; emoji: string; className: string }
> = {
  rumored: {
    label: 'Rumored',
    emoji: '💭',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
  announced: {
    label: 'Announced',
    emoji: '📢',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
  },
  preorder: {
    label: 'Preorder',
    emoji: '🛒',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300',
  },
  in_stock: {
    label: 'In Stock',
    emoji: '✅',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
  },
  out_of_stock: {
    label: 'Out of Stock',
    emoji: '❌',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300',
  },
  discontinued: {
    label: 'Discontinued',
    emoji: '⛔',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
  },
}

interface StatusBadgeProps {
  status: AvailabilityStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${config.className}`}
    >
      <span className="text-[10px]">{config.emoji}</span>
      {config.label}
    </span>
  )
}

export { STATUS_CONFIG }
