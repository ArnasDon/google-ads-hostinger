import type { ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  onRemove?: () => void
  onClick?: () => void
  variant?: 'selected' | 'suggestion'
}

export function Chip({ children, onRemove, onClick, variant = 'selected' }: ChipProps) {
  const isSelected = variant === 'selected'
  return (
    <span
      onClick={onClick}
      className={[
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition',
        isSelected
          ? 'bg-hpanel-primary-soft border-hpanel-primary/40 text-white'
          : 'bg-transparent border-hpanel-border-strong text-hpanel-muted hover:text-white hover:border-hpanel-primary cursor-pointer',
      ].join(' ')}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 opacity-70 hover:opacity-100 transition"
          aria-label="Remove"
        >
          ✕
        </button>
      )}
    </span>
  )
}
