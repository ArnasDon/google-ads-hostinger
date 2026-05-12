import { NavLink } from 'react-router-dom'
import { useState, type ReactNode } from 'react'

interface NavItem {
  label: string
  to: string
  icon: ReactNode
  children?: { label: string; to: string }[]
  defaultOpen?: boolean
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <Icon d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /> },
  { label: 'Websites', to: '/websites', icon: <Icon d="M3 12h18M12 3v18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" /> },
  { label: 'Hosting', to: '/hosting', icon: <Icon d="M4 6h16v4H4zM4 14h16v4H4zM6 8h.01M6 16h.01" /> },
  {
    label: 'Marketing',
    to: '/marketing',
    icon: <Icon d="M3 11l18-8-8 18-2-8-8-2z" />,
    defaultOpen: true,
    children: [{ label: 'Google Ads', to: '/marketing/google-ads' }],
  },
  { label: 'Billing', to: '/billing', icon: <Icon d="M3 7h18v10H3zM3 11h18M7 15h4" /> },
  { label: 'Settings', to: '/settings', icon: <Icon d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51h0a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v0a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" /> },
  { label: 'Help', to: '/help', icon: <Icon d="M12 18h.01M12 6a3 3 0 013 3c0 1.5-1.5 2-2 3-.5.5-1 1-1 2M12 22a10 10 0 110-20 10 10 0 010 20z" /> },
]

export function Sidebar({ mobileOpen, onMobileClose }: { mobileOpen: boolean; onMobileClose: () => void }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onMobileClose} aria-hidden />
      )}
      <aside
        className={[
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-hpanel-surface border-r border-hpanel-border',
          'flex flex-col transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="h-16 flex items-center gap-2 px-6 border-b border-hpanel-border">
          <div className="h-7 w-7 rounded-md bg-hpanel-primary flex items-center justify-center text-white font-bold text-sm">h</div>
          <span className="font-semibold text-white text-base">hPanel</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map((item) => (
            <SidebarItem key={item.label} item={item} onNavigate={onMobileClose} />
          ))}
        </nav>

        <div className="border-t border-hpanel-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-hpanel-primary to-hpanel-primary-hover flex items-center justify-center text-white font-semibold text-sm">A</div>
            <div className="min-w-0">
              <div className="text-sm text-white font-medium truncate">Arnas D.</div>
              <div className="text-xs text-hpanel-muted truncate">Demo workspace</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

function SidebarItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(!!item.defaultOpen)
  const hasChildren = !!item.children?.length

  if (!hasChildren) {
    return (
      <NavLink
        to={item.to}
        onClick={onNavigate}
        className={({ isActive }) =>
          [
            'flex items-center gap-3 px-3 py-2 rounded-card text-sm transition',
            isActive
              ? 'bg-hpanel-primary-soft text-white'
              : 'text-hpanel-muted hover:bg-white/5 hover:text-white',
          ].join(' ')
        }
      >
        <span className="flex-shrink-0">{item.icon}</span>
        <span>{item.label}</span>
      </NavLink>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-card text-sm text-hpanel-muted hover:bg-white/5 hover:text-white transition"
      >
        <span className="flex-shrink-0">{item.icon}</span>
        <span className="flex-1 text-left">{item.label}</span>
        <span className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="mt-0.5 ml-9 space-y-0.5">
          {item.children!.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  'block px-3 py-1.5 rounded-card text-sm transition',
                  isActive
                    ? 'bg-hpanel-primary-soft text-white font-medium'
                    : 'text-hpanel-muted hover:text-white',
                ].join(' ')
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
