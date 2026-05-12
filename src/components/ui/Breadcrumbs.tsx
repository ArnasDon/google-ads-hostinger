import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Crumb {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  items: Crumb[]
  trailing?: ReactNode
}

export function Breadcrumbs({ items, trailing }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-hpanel-muted mb-4">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <span key={idx} className="flex items-center gap-2">
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-white transition">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-white' : ''}>{item.label}</span>
            )}
            {!isLast && <span className="text-hpanel-muted-strong">/</span>}
          </span>
        )
      })}
      {trailing && <span className="ml-auto">{trailing}</span>}
    </nav>
  )
}
