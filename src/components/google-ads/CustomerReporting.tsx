import { useMemo, useState } from 'react'
import type { Campaign } from '../../types'

interface CustomerReportingProps {
  campaigns: Campaign[]
}

type Range = '7d' | '30d' | '90d'

// Multipliers loosely simulate Google Ads metric scaling across windows.
// Numbers are dummy — the real client would call CampaignService /
// CustomerService with the chosen date_range and get back actual metrics.
const rangeMultipliers: Record<Range, number> = {
  '7d': 1,
  '30d': 4.1,
  '90d': 11.8,
}

const rangeLabels: Record<Range, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
}

export function CustomerReporting({ campaigns }: CustomerReportingProps) {
  const [range, setRange] = useState<Range>('7d')

  const totals = useMemo(() => {
    const active = campaigns.filter((c) => c.status !== 'Draft')
    const mul = rangeMultipliers[range]
    return {
      clicks: Math.round(active.reduce((sum, c) => sum + c.clicks, 0) * mul),
      cost: active.reduce((sum, c) => sum + c.cost, 0) * mul,
      conversions: Math.round(active.reduce((sum, c) => sum + c.conversions, 0) * mul),
      activeCount: active.filter((c) => c.status === 'Active').length,
      totalCount: active.length,
    }
  }, [campaigns, range])

  return (
    <div className="bg-hpanel-surface border border-hpanel-border rounded-card shadow-card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Customer performance</h2>
          <p className="text-xs text-hpanel-muted mt-0.5">
            Totals across {totals.totalCount} campaign{totals.totalCount === 1 ? '' : 's'} ({totals.activeCount} active)
          </p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as Range)}
          className="h-9 px-3 rounded-card bg-hpanel-bg border border-hpanel-border-strong text-white text-sm focus:outline-none focus:ring-2 focus:ring-hpanel-primary"
        >
          {(Object.keys(rangeLabels) as Range[]).map((r) => (
            <option key={r} value={r}>
              {rangeLabels[r]}
            </option>
          ))}
        </select>
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
