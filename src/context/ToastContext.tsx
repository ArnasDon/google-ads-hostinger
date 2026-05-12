import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ToastVariant = 'success' | 'info' | 'warning' | 'danger'

interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let toastIdCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = ++toastIdCounter
      setToasts((prev) => [...prev, { id, message, variant }])
      setTimeout(() => dismiss(id), 3500)
    },
    [dismiss]
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`flex items-start gap-3 rounded-card border px-4 py-3 shadow-card min-w-[280px] max-w-[420px] text-sm font-medium animate-[fadeIn_.15s_ease-out] ${variantClasses(t.variant)}`}
              role="status"
            >
              <span className="flex-shrink-0 mt-[2px]">{variantIcon(t.variant)}</span>
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="opacity-60 hover:opacity-100 transition"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

function variantClasses(v: ToastVariant) {
  switch (v) {
    case 'success':
      return 'bg-hpanel-surface border-hpanel-success/40 text-white'
    case 'warning':
      return 'bg-hpanel-surface border-hpanel-warning/40 text-white'
    case 'danger':
      return 'bg-hpanel-surface border-hpanel-danger/40 text-white'
    default:
      return 'bg-hpanel-surface border-hpanel-border text-white'
  }
}

function variantIcon(v: ToastVariant) {
  const color =
    v === 'success'
      ? 'text-hpanel-success'
      : v === 'warning'
      ? 'text-hpanel-warning'
      : v === 'danger'
      ? 'text-hpanel-danger'
      : 'text-hpanel-primary'
  const symbol = v === 'success' ? '✓' : v === 'danger' ? '!' : 'i'
  return <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 ${color} text-xs font-bold`}>{symbol}</span>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
