interface EmptyStateProps {
  hasFilters: boolean
  onClear?: () => void
  onAdd?: () => void
}

export default function EmptyState({ hasFilters, onClear, onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4 select-none">🃏</div>
      {hasFilters ? (
        <>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            No results found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Try adjusting your search or filters.
          </p>
          {onClear && (
            <button
              onClick={onClear}
              className="mt-4 px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            No entries yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Add your first Pokémon card availability entry.
          </p>
          {onAdd && (
            <button
              onClick={onAdd}
              className="mt-4 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add Entry
            </button>
          )}
        </>
      )}
    </div>
  )
}
