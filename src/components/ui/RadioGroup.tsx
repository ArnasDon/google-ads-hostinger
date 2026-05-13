import { createContext, useCallback, useContext, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'

interface RadioGroupProps<T extends string> {
  label?: string
  value: T | null
  onChange: (value: T) => void
  children: ReactNode
  /** Vertical = arrow keys go up/down. Horizontal = left/right. */
  orientation?: 'vertical' | 'horizontal'
  /** Pass true to render the label visibly; defaults to screen-reader only when omitted. */
  showLabel?: boolean
  className?: string
}

interface RadioOptionProps<T extends string> {
  value: T
  /** Either `children` (simple option) or `render` (card-style) must be provided. */
  children?: ReactNode
  render?: (state: { selected: boolean }) => ReactNode
  className?: string
}

interface RadioContextValue {
  name: string
  selectedValue: string | null
  onSelect: (value: string) => void
  registerOption: (el: HTMLButtonElement | null, value: string) => void
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>, currentValue: string) => void
}

const RadioContext = createContext<RadioContextValue | null>(null)

export function RadioGroup<T extends string>({
  label,
  value,
  onChange,
  children,
  orientation = 'vertical',
  showLabel = false,
  className,
}: RadioGroupProps<T>) {
  const name = useId()
  const labelId = useId()
  const optionsRef = useRef<Array<{ el: HTMLButtonElement; value: string }>>([])

  const registerOption = useCallback((el: HTMLButtonElement | null, value: string) => {
    optionsRef.current = optionsRef.current.filter((o) => o.value !== value)
    if (el) optionsRef.current.push({ el, value })
  }, [])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, currentValue: string) => {
      const forwards = orientation === 'vertical' ? ['ArrowDown', 'ArrowRight'] : ['ArrowRight', 'ArrowDown']
      const backwards = orientation === 'vertical' ? ['ArrowUp', 'ArrowLeft'] : ['ArrowLeft', 'ArrowUp']
      if (![...forwards, ...backwards, 'Home', 'End'].includes(e.key)) return
      e.preventDefault()
      const options = optionsRef.current
      if (options.length === 0) return
      const i = options.findIndex((o) => o.value === currentValue)
      let nextIdx = i
      if (forwards.includes(e.key)) nextIdx = (i + 1) % options.length
      else if (backwards.includes(e.key)) nextIdx = (i - 1 + options.length) % options.length
      else if (e.key === 'Home') nextIdx = 0
      else if (e.key === 'End') nextIdx = options.length - 1
      const next = options[nextIdx]
      next.el.focus()
      onChange(next.value as T)
    },
    [orientation, onChange]
  )

  const ctx: RadioContextValue = {
    name,
    selectedValue: value,
    onSelect: (v) => onChange(v as T),
    registerOption,
    onKeyDown,
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={label ? labelId : undefined}
      aria-orientation={orientation}
      className={className}
    >
      {label && (
        <div id={labelId} className={showLabel ? 'mb-2 text-sm font-medium text-white' : 'sr-only'}>
          {label}
        </div>
      )}
      <RadioContext.Provider value={ctx}>{children}</RadioContext.Provider>
    </div>
  )
}

/** A single radio option. Renders as a button with role="radio" and arrow-key navigation. */
export function RadioOption<T extends string>({ value, children, render, className }: RadioOptionProps<T>) {
  const ctx = useContext(RadioContext)
  if (!ctx) throw new Error('<RadioOption> must be used inside <RadioGroup>')
  const selected = ctx.selectedValue === value
  return (
    <button
      ref={(el) => ctx.registerOption(el, value)}
      type="button"
      role="radio"
      aria-checked={selected}
      // Only the selected option is in the tab order; the rest are reached via arrow keys.
      // When none is selected, the first option is reachable (handled by registration order + tabIndex 0 below).
      tabIndex={selected || ctx.selectedValue === null ? 0 : -1}
      onClick={() => ctx.onSelect(value)}
      onKeyDown={(e) => ctx.onKeyDown(e, value)}
      className={className}
    >
      {render ? render({ selected }) : children}
    </button>
  )
}
