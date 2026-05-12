interface TopBarProps {
  onOpenSidebar: () => void
}

export function TopBar({ onOpenSidebar }: TopBarProps) {
  return (
    <header className="h-16 border-b border-hpanel-border bg-hpanel-surface flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
      <button
        onClick={onOpenSidebar}
        className="lg:hidden h-9 w-9 rounded-card border border-hpanel-border-strong flex items-center justify-center text-hpanel-muted hover:text-white"
        aria-label="Open menu"
      >
        ☰
      </button>

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-hpanel-muted-strong text-sm">🔍</span>
          <input
            placeholder="Search…"
            className="h-9 w-full pl-9 pr-3 rounded-card bg-hpanel-bg border border-hpanel-border-strong text-white text-sm placeholder:text-hpanel-muted-strong focus:outline-none focus:ring-2 focus:ring-hpanel-primary"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="h-9 w-9 rounded-card border border-hpanel-border-strong flex items-center justify-center text-hpanel-muted hover:text-white" aria-label="Notifications">
          🔔
        </button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-hpanel-primary to-hpanel-primary-hover flex items-center justify-center text-white font-semibold text-sm">A</div>
      </div>
    </header>
  )
}
