import type { CardReleaseEntry } from '../types'
import CardRow from './CardRow'
import GameBadge from './GameBadge'
import StatusBadge from './StatusBadge'
import { formatDate } from '../lib/date'

interface CardTableProps {
  entries: CardReleaseEntry[]
  onView: (entry: CardReleaseEntry) => void
  onEdit: (entry: CardReleaseEntry) => void
  onDuplicate: (entry: CardReleaseEntry) => void
  onDelete: (entry: CardReleaseEntry) => void
}

export default function CardTable({
  entries,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}: CardTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/80 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Game</th>
              <th className="px-4 py-3.5">Product</th>
              <th className="px-4 py-3.5">Set/Series</th>
              <th className="px-4 py-3.5">Region</th>
              <th className="px-4 py-3.5">Retailer</th>
              <th className="px-4 py-3.5">Release Date</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Price</th>
              <th className="px-4 py-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {entries.map((entry) => (
              <CardRow
                key={entry.id}
                entry={entry}
                onView={onView}
                onEdit={onEdit}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-4 shadow-sm card-hover"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1.5">
                <GameBadge game={entry.game} />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {entry.productName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.setOrSeries}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                  {entry.region}
                </span>
                <StatusBadge status={entry.status} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">🏪 {entry.retailer}</span>
              <span className="flex items-center gap-1">📅 {formatDate(entry.releaseDate)}</span>
              {entry.price != null && (
                <span className="flex items-center gap-1">
                  💰 {entry.currency} {entry.price}
                </span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-end gap-3">
              <button
                onClick={() => onView(entry)}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                View
              </button>
              <button
                onClick={() => onEdit(entry)}
                className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(entry)}
                className="text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
