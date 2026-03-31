import type { CardReleaseEntry } from '../types'
import StatusBadge from './StatusBadge'
import { formatDate } from '../lib/date'

interface CardRowProps {
  entry: CardReleaseEntry
  onView: (entry: CardReleaseEntry) => void
  onEdit: (entry: CardReleaseEntry) => void
  onDuplicate: (entry: CardReleaseEntry) => void
  onDelete: (entry: CardReleaseEntry) => void
}

export default function CardRow({
  entry,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}: CardRowProps) {
  return (
    <tr className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="px-4 py-3">
        <button
          onClick={() => onView(entry)}
          className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline text-left max-w-xs truncate block"
          title={entry.productName}
        >
          {entry.productName}
        </button>
      </td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-[140px] truncate">
        {entry.setOrSeries}
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
          {entry.region}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
        {entry.productUrl ? (
          <a
            href={entry.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-indigo-600 dark:text-indigo-400"
            title={entry.retailer}
          >
            {entry.retailer}
          </a>
        ) : (
          entry.retailer
        )}
      </td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
        {formatDate(entry.releaseDate)}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={entry.status} />
      </td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
        {formatDate(entry.lastChecked)}
      </td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
        {entry.price != null ? `${entry.currency ?? ''} ${entry.price}` : '—'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() => onView(entry)}
            title="View details"
            className="p-1 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            👁
          </button>
          <button
            onClick={() => onEdit(entry)}
            title="Edit"
            className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={() => onDuplicate(entry)}
            title="Duplicate"
            className="p-1 text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            📋
          </button>
          <button
            onClick={() => onDelete(entry)}
            title="Delete"
            className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  )
}
