interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400 pointer-events-none text-sm">
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by product, set, or retailer…"
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-shadow hover:shadow-md placeholder:text-gray-400"
      />
    </div>
  )
}
