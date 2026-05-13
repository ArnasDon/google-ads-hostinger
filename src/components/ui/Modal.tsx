import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  width?: string
  /** ID of the element inside `children` that titles the dialog. Strongly recommended for a11y. */
  titleId?: string
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({ open, onClose, children, width = 'max-w-md', titleId }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return

    // Remember the element that had focus before the modal opened so we can
    // restore it on close — required behaviour for accessible dialogs.
    previousActiveElementRef.current = document.activeElement

    // Move focus into the dialog after mount.
    const focusFirst = () => {
      const root = dialogRef.current
      if (!root) return
      const first = root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      ;(first ?? root).focus()
    }
    // Defer one frame so children with autofocus settle first.
    const id = requestAnimationFrame(focusFirst)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const root = dialogRef.current
      if (!root) return
      const focusables = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1'
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(id)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      // Return focus to whatever opened the modal.
      const previous = previousActiveElementRef.current as HTMLElement | null
      if (previous && typeof previous.focus === 'function') previous.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_.15s_ease-out]"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative w-full ${width} bg-hpanel-surface border border-hpanel-border rounded-card shadow-card focus:outline-none`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
