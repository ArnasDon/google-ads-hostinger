import type { ReactNode } from 'react'

type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}

const toneStyles: Record<BadgeTone, string> = {
  success: 'bg-hpanel-success-soft text-hpanel-success border-hpanel-success/30',
  warning: 'bg-hpanel-warning-soft text-hpanel-warning border-hpanel-warning/30',
  danger: 'bg-hpanel-danger-soft text-hpanel-danger border-hpanel-danger/30',
  info: 'bg-hpanel-primary-soft text-hpanel-primary-hover border-hpanel-primary/30',
  neutral: 'bg-white/5 text-hpanel-muted border-hpanel-border-strong',
}

export function Badge({ tone = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneStyles[tone]} ${className}`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          tone === 'success'
            ? 'bg-hpanel-success'
            : tone === 'warning'
            ? 'bg-hpanel-warning'
            : tone === 'danger'
            ? 'bg-hpanel-danger'
            : tone === 'info'
            ? 'bg-hpanel-primary'
            : 'bg-hpanel-muted'
        }`}
      />
      {children}
    </span>
  )
}
