import { useEffect } from 'react'
import type { CardReleaseEntry } from '../types'
import StatusBadge from './StatusBadge'
import GameBadge from './GameBadge'
import { formatDate } from '../lib/date'

interface CardDetailModalProps {
  entry: CardReleaseEntry | null
  onClose: () => void
  onEdit: (entry: CardReleaseEntry) => void
}

export default function CardDetailModal({
  entry,
  onClose,
  onEdit,
}: CardDetailModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!entry) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-200/50 dark:border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="space-y-2">
            <GameBadge game={entry.game} size="md" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {entry.productName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {entry.setOrSeries}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-4 flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <StatusBadge status={entry.status} />
            <span className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full">
              {entry.region}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <div>
              <dt className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider font-medium">
                Retailer
              </dt>
              <dd className="text-gray-900 dark:text-gray-100 font-medium mt-1">
                {entry.retailer}
              </dd>
            </div>
            <div>
              <dt className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider font-medium">
                Release Date
              </dt>
              <dd className="text-gray-900 dark:text-gray-100 font-medium mt-1">
                {formatDate(entry.releaseDate)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider font-medium">
                Last Checked
              </dt>
              <dd className="text-gray-900 dark:text-gray-100 font-medium mt-1">
                {formatDate(entry.lastChecked)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider font-medium">
                Price
              </dt>
              <dd className="text-gray-900 dark:text-gray-100 font-medium mt-1">
                {entry.price != null
                  ? `${entry.currency ?? ''} ${entry.price}`
                  : '—'}
              </dd>
            </div>
          </dl>

          {entry.notes && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <dt className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider font-medium">
                Notes
              </dt>
              <dd className="text-gray-700 dark:text-gray-300 text-sm mt-1.5">
                {entry.notes}
              </dd>
            </div>
          )}

          <div className="text-xs text-gray-400 dark:text-gray-500 space-y-0.5 pt-3 border-t border-gray-100 dark:border-gray-800">
            <p>Created: {new Date(entry.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(entry.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 pt-0">
          {entry.productUrl && (
            <a
              href={entry.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Open Retailer Link ↗
            </a>
          )}
          <button
            onClick={() => {
              onClose()
              onEdit(entry)
            }}
            className="flex-1 text-center px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
