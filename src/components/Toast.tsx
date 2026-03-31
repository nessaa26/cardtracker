import { useEffect } from 'react'
import type { ToastMessage } from '../types'

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

const TYPE_CLASS = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-indigo-600 text-white',
}

function Toast({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${TYPE_CLASS[toast.type]} animate-slide-up backdrop-blur-sm`}
      role="alert"
    >
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}

export default function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
