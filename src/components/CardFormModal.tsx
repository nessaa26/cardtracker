import { useEffect, useState } from 'react'
import type { CardReleaseEntry, AvailabilityStatus, Region, CardGame } from '../types'
import { today, nowISO } from '../lib/date'
import { generateId } from '../lib/id'
import StatusBadge from './StatusBadge'
import GameBadge from './GameBadge'

const STATUSES: AvailabilityStatus[] = [
  'rumored',
  'announced',
  'preorder',
  'in_stock',
  'out_of_stock',
  'discontinued',
]

const REGIONS: Region[] = ['US', 'CA', 'EU', 'UK', 'JP', 'AU', 'OTHER']
const GAMES: CardGame[] = ['pokemon', 'one_piece']

interface CardFormModalProps {
  entry?: CardReleaseEntry | null
  onSave: (entry: CardReleaseEntry) => void
  onClose: () => void
}

type FormData = Omit<CardReleaseEntry, 'id' | 'createdAt' | 'updatedAt'>

const DEFAULT_FORM: FormData = {
  game: 'pokemon',
  productName: '',
  setOrSeries: '',
  releaseDate: '',
  region: 'US',
  retailer: '',
  productUrl: '',
  status: 'announced',
  lastChecked: today(),
  price: undefined,
  currency: 'USD',
  notes: '',
}

function toFormData(entry: CardReleaseEntry): FormData {
  return {
    game: entry.game,
    productName: entry.productName,
    setOrSeries: entry.setOrSeries,
    releaseDate: entry.releaseDate,
    region: entry.region,
    retailer: entry.retailer,
    productUrl: entry.productUrl ?? '',
    status: entry.status,
    lastChecked: entry.lastChecked,
    price: entry.price,
    currency: entry.currency ?? 'USD',
    notes: entry.notes ?? '',
  }
}

export default function CardFormModal({ entry, onSave, onClose }: CardFormModalProps) {
  const [form, setForm] = useState<FormData>(
    entry ? toFormData(entry) : DEFAULT_FORM,
  )
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.productName.trim()) e.productName = 'Product name is required.'
    if (!form.setOrSeries.trim()) e.setOrSeries = 'Set/Series is required.'
    if (!form.retailer.trim()) e.retailer = 'Retailer is required.'
    if (!form.releaseDate) e.releaseDate = 'Release date is required.'
    if (!form.lastChecked) e.lastChecked = 'Last checked date is required.'
    if (form.releaseDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.releaseDate)) {
      e.releaseDate = 'Use format YYYY-MM-DD.'
    }
    if (form.lastChecked && !/^\d{4}-\d{2}-\d{2}$/.test(form.lastChecked)) {
      e.lastChecked = 'Use format YYYY-MM-DD.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const now = nowISO()
    const saved: CardReleaseEntry = {
      id: entry?.id ?? generateId(),
      game: form.game,
      productName: form.productName.trim(),
      setOrSeries: form.setOrSeries.trim(),
      releaseDate: form.releaseDate,
      region: form.region,
      retailer: form.retailer.trim(),
      productUrl: form.productUrl?.trim() || undefined,
      status: form.status,
      lastChecked: form.lastChecked,
      price: form.price != null ? Number(form.price) : undefined,
      currency: form.currency?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
      createdAt: entry?.createdAt ?? now,
      updatedAt: now,
    }
    onSave(saved)
  }

  const inputClass = (err?: string) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 transition-shadow shadow-sm hover:shadow-md ${
      err
        ? 'border-red-400 dark:border-red-500'
        : 'border-gray-200 dark:border-gray-600'
    }`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-200/50 dark:border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {entry ? 'Edit Entry' : 'Add Entry'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Game Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Card Game <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {GAMES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set('game', g)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    form.game === g
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <GameBadge game={g} size="sm" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.productName}
              onChange={(e) => set('productName', e.target.value)}
              className={inputClass(errors.productName)}
              placeholder={form.game === 'pokemon' ? 'e.g. Scarlet & Violet Booster Box' : 'e.g. OP-05 Booster Box'}
            />
            {errors.productName && (
              <p className="text-red-500 text-xs mt-1">{errors.productName}</p>
            )}
          </div>

          {/* Set/Series */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Set / Series <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.setOrSeries}
              onChange={(e) => set('setOrSeries', e.target.value)}
              className={inputClass(errors.setOrSeries)}
              placeholder={form.game === 'pokemon' ? 'e.g. Scarlet & Violet' : 'e.g. Awakening of the New Era'}
            />
            {errors.setOrSeries && (
              <p className="text-red-500 text-xs mt-1">{errors.setOrSeries}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Release Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Release Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.releaseDate}
                onChange={(e) => set('releaseDate', e.target.value)}
                className={inputClass(errors.releaseDate)}
              />
              {errors.releaseDate && (
                <p className="text-red-500 text-xs mt-1">{errors.releaseDate}</p>
              )}
            </div>

            {/* Last Checked */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Checked <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.lastChecked}
                onChange={(e) => set('lastChecked', e.target.value)}
                className={inputClass(errors.lastChecked)}
              />
              {errors.lastChecked && (
                <p className="text-red-500 text-xs mt-1">{errors.lastChecked}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                value={form.region}
                onChange={(e) => set('region', e.target.value as Region)}
                className={inputClass()}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as AvailabilityStatus)}
                className={inputClass()}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <div className="mt-1.5">
                <StatusBadge status={form.status} />
              </div>
            </div>
          </div>

          {/* Retailer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Retailer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.retailer}
              onChange={(e) => set('retailer', e.target.value)}
              className={inputClass(errors.retailer)}
              placeholder="e.g. Amazon, Pokemon Center, TCGPlayer"
            />
            {errors.retailer && (
              <p className="text-red-500 text-xs mt-1">{errors.retailer}</p>
            )}
          </div>

          {/* Product URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product URL
            </label>
            <input
              type="url"
              value={form.productUrl ?? ''}
              onChange={(e) => set('productUrl', e.target.value)}
              className={inputClass()}
              placeholder="https://…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price ?? ''}
                onChange={(e) =>
                  set('price', e.target.value === '' ? undefined : Number(e.target.value))
                }
                className={inputClass()}
                placeholder="e.g. 49.99"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <input
                type="text"
                value={form.currency ?? ''}
                onChange={(e) => set('currency', e.target.value)}
                className={inputClass()}
                placeholder="USD"
                maxLength={5}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={form.notes ?? ''}
              onChange={(e) => set('notes', e.target.value)}
              className={`${inputClass()} resize-none`}
              rows={3}
              placeholder="Any additional notes…"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              {entry ? 'Save Changes' : 'Add Entry'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
