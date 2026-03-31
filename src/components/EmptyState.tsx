interface EmptyStateProps {
  hasFilters: boolean
  onClear?: () => void
  onAdd?: () => void
}

export default function EmptyState({ hasFilters, onClear, onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="text-7xl mb-6 select-none">🃏</div>
      {hasFilters ? (
        <>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">
            No results found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          {onClear && (
            <button
              onClick={onClear}
              className="mt-5 px-5 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all shadow-sm"
            >
              Clear Filters
            </button>
          )}
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">
            No entries yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
            Start tracking your Pokémon and One Piece card availability.
          </p>
          {onAdd && (
            <button
              onClick={onAdd}
              className="mt-5 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              + Add Entry
            </button>
          )}
        </>
      )}
    </div>
  )
}
