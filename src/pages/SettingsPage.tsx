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
    addToast('Data reset to seed.')
    setShowResetConfirm(false)
  }

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>

        {/* Import / Export */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Import &amp; Export
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Export your data as a JSON file or import a previously exported file to restore or
            merge entries. The merge strategy: if an incoming entry has the same ID as an
            existing one, it will only replace it if its <code>updatedAt</code> is newer.
          </p>
          <ImportExportPanel
            entries={entries}
            onImport={handleImport}
            onSuccess={(m) => addToast(m, 'success')}
            onError={(m) => addToast(m, 'error')}
          />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Current entries: <span className="font-semibold">{entries.length}</span>
          </p>
        </section>

        {/* Danger zone */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
            Danger Zone
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Reset all data back to the built-in seed dataset. This will permanently delete any
            entries you have added or modified.
          </p>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Reset to Seed Data
          </button>
        </section>
      </div>

      {showResetConfirm && (
        <ConfirmDialog
          message="Are you sure you want to reset all data to the seed dataset? All your custom entries will be deleted."
          onConfirm={handleReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}
