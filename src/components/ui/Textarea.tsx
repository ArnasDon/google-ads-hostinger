import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  maxLength?: number
  showCounter?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, maxLength, showCounter, className, value, rows = 3, ...rest },
  ref
) {
  const length = typeof value === 'string' ? value.length : 0
  return (
    <label className="flex flex-col gap-1.5 w-full">
      {label && <span className="text-sm font-medium text-white">{label}</span>}
      <textarea
        ref={ref}
        value={value}
        rows={rows}
        maxLength={maxLength}
        className={[
          'px-3 py-2 rounded-card bg-hpanel-bg border text-white placeholder:text-hpanel-muted-strong',
          'focus:outline-none focus:ring-2 focus:ring-hpanel-primary focus:border-hpanel-primary',
          'transition resize-none',
          error ? 'border-hpanel-danger' : 'border-hpanel-border-strong',
          className ?? '',
        ].join(' ')}
        {...rest}
      />
      <div className="flex items-center justify-between text-xs">
        <span className={error ? 'text-hpanel-danger' : 'text-hpanel-muted'}>{error || hint}</span>
        {showCounter && maxLength && (
          <span className={`tabular-nums ${length > maxLength * 0.9 ? 'text-hpanel-warning' : 'text-hpanel-muted'}`}>
            {length}/{maxLength}
          </span>
        )}
      </div>
    </label>
  )
})
