import { useMemo } from 'react'
import type { Campaign } from '../../types'

interface CustomerReportingProps {
  campaigns: Campaign[]
}

export function CustomerReporting({ campaigns }: CustomerReportingProps) {
  const totals = useMemo(() => {
    const active = campaigns.filter((c) => c.status !== 'Draft')
    return {
      clicks: active.reduce((sum, c) => sum + c.clicks, 0),
      cost: active.reduce((sum, c) => sum + c.cost, 0),
      conversions: active.reduce((sum, c) => sum + c.conversions, 0),
      activeCount: active.filter((c) => c.status === 'Active').length,
      totalCount: active.length,
    }
  }, [campaigns])

  return (
    <div className="bg-hpanel-surface border border-hpanel-border rounded-card shadow-card mb-6 p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">Customer performance</h2>
        <p className="text-xs text-hpanel-muted mt-0.5">
          Totals across {totals.totalCount} campaign{totals.totalCount === 1 ? '' : 's'} ({totals.activeCount} active)
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Tile label="Clicks" value={totals.clicks.toLocaleString()} />
        <Tile label="Cost" value={`$${totals.cost.toFixed(2)}`} />
        <Tile label="Conversions" value={totals.conversions.toLocaleString()} />
      </div>
    </div>
  )
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-hpanel-bg/60 border border-hpanel-border rounded-card p-4">
      <div className="text-xs uppercase tracking-wider text-hpanel-muted-strong font-medium">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white tabular-nums">{value}</div>
    </div>
  )
}
