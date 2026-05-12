import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-hpanel-primary hover:bg-hpanel-primary-hover text-white border border-transparent disabled:bg-hpanel-primary/40 disabled:text-white/70',
  secondary:
    'bg-transparent text-white border border-hpanel-border-strong hover:bg-white/5',
  ghost:
    'bg-transparent text-hpanel-muted hover:text-white hover:bg-white/5 border border-transparent',
  danger:
    'bg-hpanel-danger/90 hover:bg-hpanel-danger text-white border border-transparent',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, leftIcon, fullWidth, className, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-card font-medium transition select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hpanel-primary focus-visible:ring-offset-2 focus-visible:ring-offset-hpanel-bg',
        'disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className ?? '',
      ].join(' ')}
      {...rest}
    >
      {loading ? <Spinner /> : leftIcon}
      {children}
    </button>
  )
})

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-hidden
    />
  )
}
