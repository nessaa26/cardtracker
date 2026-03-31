import { useRef } from 'react'
import type { CardReleaseEntry } from '../types'
import { exportEntries } from '../lib/storage'
import { mergeEntries, validateImport } from '../lib/merge'

interface ImportExportPanelProps {
  entries: CardReleaseEntry[]
  onImport: (entries: CardReleaseEntry[]) => void
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
}

export default function ImportExportPanel({
  entries,
  onImport,
  onSuccess,
  onError,
}: ImportExportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    try {
      exportEntries(entries)
      onSuccess(`Exported ${entries.length} entries.`)
    } catch {
      onError('Export failed.')
    }
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const raw: unknown = JSON.parse(ev.target?.result as string)
        const incoming = validateImport(raw)
        const merged = mergeEntries(entries, incoming)
        onImport(merged)
        onSuccess(`Imported ${incoming.length} entries (${Math.max(0, merged.length - entries.length)} new, merged total: ${merged.length}).`)
      } catch (err) {
        onError(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
      >
        ⬇️ Export JSON
      </button>

      <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer shadow-sm hover:shadow-md">
        ⬆️ Import JSON
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
          className="sr-only"
        />
      </label>
    </div>
  )
}
