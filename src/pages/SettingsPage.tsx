import { useState, useCallback } from 'react'
import type { CardReleaseEntry, ToastMessage } from '../types'
import { loadEntries, saveEntries, resetToSeed } from '../lib/storage'
import { generateId } from '../lib/id'
import ImportExportPanel from '../components/ImportExportPanel'
import ToastContainer from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'

export default function SettingsPage() {
  const [entries, setEntries] = useState<CardReleaseEntry[]>(() => loadEntries())
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = generateId()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  function handleImport(merged: CardReleaseEntry[]) {
    setEntries(merged)
    saveEntries(merged)
  }

  function handleReset() {
    const seed = resetToSeed()
    setEntries(seed)
    addToast('Data reset to seed (Pokémon + One Piece).')
    setShowResetConfirm(false)
  }

  const pokemonCount = entries.filter(e => e.game === 'pokemon').length
  const onePieceCount = entries.filter(e => e.game === 'one_piece').length

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Settings</h1>

        {/* Stats */}
        <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Collection Stats
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 text-center border border-indigo-200/60 dark:border-indigo-700/40">
              <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{entries.length}</p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-1">Total Entries</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4 text-center border border-amber-200/60 dark:border-amber-700/40">
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{pokemonCount}</p>
              <p className="text-xs text-amber-500 dark:text-amber-400 font-medium mt-1">⚡ Pokémon</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-4 text-center border border-red-200/60 dark:border-red-700/40">
              <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">{onePieceCount}</p>
              <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">☠️ One Piece</p>
            </div>
          </div>
        </section>

        {/* Import / Export */}
        <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Import &amp; Export
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Export your data as a JSON file or import a previously exported file to restore or
            merge entries. The merge strategy: if an incoming entry has the same ID as an
            existing one, it will only replace it if its <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">updatedAt</code> is newer.
          </p>
          <ImportExportPanel
            entries={entries}
            onImport={handleImport}
            onSuccess={(m) => addToast(m, 'success')}
            onError={(m) => addToast(m, 'error')}
          />
        </section>

        {/* Danger zone */}
        <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-red-200/60 dark:border-red-800/40 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-red-700 dark:text-red-400">
            ⚠️ Danger Zone
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Reset all data back to the built-in seed dataset (includes both Pokémon and One Piece entries). This will permanently delete any
            entries you have added or modified.
          </p>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
          >
            Reset to Seed Data
          </button>
        </section>
      </div>

      {showResetConfirm && (
        <ConfirmDialog
          message="Are you sure you want to reset all data to the seed dataset? All your custom entries will be deleted. This will restore both Pokémon and One Piece TCG entries."
          onConfirm={handleReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}
