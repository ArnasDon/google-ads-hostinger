import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padded?: boolean
  interactive?: boolean
}

export function Card({ children, padded = true, interactive, className, ...rest }: CardProps) {
  return (
    <div
      className={[
        'bg-hpanel-surface border border-hpanel-border rounded-card shadow-card',
        padded ? 'p-6' : '',
        interactive ? 'hover:border-hpanel-border-strong transition cursor-pointer' : '',
        className ?? '',
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
