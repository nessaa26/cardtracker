import type { CardReleaseEntry } from '../types'
import CardRow from './CardRow'

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
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Set/Series</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Retailer</th>
              <th className="px-4 py-3">Release Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Checked</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
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
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {entry.productName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {entry.setOrSeries}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
                  {entry.region}
                </span>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
              <span>🏪 {entry.retailer}</span>
              <span>📅 {entry.releaseDate}</span>
              <span>🔍 {entry.lastChecked}</span>
              {entry.price != null && (
                <span>
                  💰 {entry.currency} {entry.price}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div>
                {/* StatusBadge imported inline to avoid circular deps */}
                <span className="text-xs">{entry.status.replace('_', ' ')}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onView(entry)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(entry)}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(entry)}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
