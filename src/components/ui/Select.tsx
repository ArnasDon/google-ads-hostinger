import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  children: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, className, children, ...rest },
  ref
) {
  return (
    <label className="flex flex-col gap-1.5 w-full">
      {label && <span className="text-sm font-medium text-white">{label}</span>}
      <div className="relative">
        <select
          ref={ref}
          className={[
            'h-10 w-full pl-3 pr-10 rounded-card bg-hpanel-bg border border-hpanel-border-strong text-white',
            'focus:outline-none focus:ring-2 focus:ring-hpanel-primary focus:border-hpanel-primary',
            'appearance-none transition',
            className ?? '',
          ].join(' ')}
          {...rest}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-hpanel-muted">▾</span>
      </div>
      {hint && <span className="text-xs text-hpanel-muted">{hint}</span>}
    </label>
  )
})
