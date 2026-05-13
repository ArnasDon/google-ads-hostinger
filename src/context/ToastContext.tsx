import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'

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
                className="opacity-60 hover:opacity-100 transition inline-flex items-center"
                aria-label="Dismiss"
              >
                <X size={14} />
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
  switch (v) {
    case 'success':
      return <CheckCircle2 size={18} className="text-hpanel-success" aria-hidden />
    case 'warning':
      return <AlertTriangle size={18} className="text-hpanel-warning" aria-hidden />
    case 'danger':
      return <XCircle size={18} className="text-hpanel-danger" aria-hidden />
    default:
      return <Info size={18} className="text-hpanel-primary-hover" aria-hidden />
  }
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
