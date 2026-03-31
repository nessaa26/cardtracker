interface ConfirmDialogProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in border border-gray-200/50 dark:border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-gray-800 dark:text-gray-200 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 text-sm bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
