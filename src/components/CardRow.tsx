import type { CardReleaseEntry } from '../types'
import StatusBadge from './StatusBadge'
import GameBadge from './GameBadge'
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
    <tr className="bg-white/60 dark:bg-gray-900/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors row-glow">
      <td className="px-4 py-3.5">
        <GameBadge game={entry.game} />
      </td>
      <td className="px-4 py-3.5">
        <button
          onClick={() => onView(entry)}
          className="font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left max-w-xs truncate block"
          title={entry.productName}
        >
          {entry.productName}
        </button>
      </td>
      <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 max-w-[140px] truncate">
        {entry.setOrSeries}
      </td>
      <td className="px-4 py-3.5">
        <span className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
          {entry.region}
        </span>
      </td>
      <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400">
        {entry.productUrl ? (
          <a
            href={entry.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors underline decoration-dotted underline-offset-2"
            title={entry.retailer}
          >
            {entry.retailer}
          </a>
        ) : (
          entry.retailer
        )}
      </td>
      <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {formatDate(entry.releaseDate)}
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge status={entry.status} />
      </td>
      <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">
        {entry.price != null ? `${entry.currency ?? ''} ${entry.price}` : '—'}
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1 justify-center">
          <button
            onClick={() => onView(entry)}
            title="View details"
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30 transition-all"
          >
            👁
          </button>
          <button
            onClick={() => onEdit(entry)}
            title="Edit"
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 transition-all"
          >
            ✏️
          </button>
          <button
            onClick={() => onDuplicate(entry)}
            title="Duplicate"
            className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-green-900/30 transition-all"
          >
            📋
          </button>
          <button
            onClick={() => onDelete(entry)}
            title="Delete"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 transition-all"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  )
}
