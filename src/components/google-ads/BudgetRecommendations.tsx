import type { BudgetRecommendation, BudgetTier } from '../../types'

interface BudgetRecommendationsProps {
  recommendations: BudgetRecommendation[]
  selectedBudget: number
  onSelect: (budget: number) => void
}

const tierLabels: Record<BudgetTier, string> = {
  conservative: 'Conservative',
  recommended: 'Recommended',
  aggressive: 'Aggressive',
}

const tierDescriptions: Record<BudgetTier, string> = {
  conservative: 'Test the waters with the lowest spend.',
  recommended: 'Balanced spend, best long-term value.',
  aggressive: 'Maximize reach and lead volume.',
}

export function BudgetRecommendations({ recommendations, selectedBudget, onSelect }: BudgetRecommendationsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {recommendations.map((r) => {
        const isSelected = r.dailyBudget === selectedBudget
        const isRecommended = r.tier === 'recommended'
        return (
          <button
            key={r.tier}
            type="button"
            onClick={() => onSelect(r.dailyBudget)}
            className={[
              'relative text-left rounded-card border p-4 transition',
              isSelected
                ? 'bg-hpanel-primary-soft border-hpanel-primary ring-1 ring-hpanel-primary'
                : 'bg-hpanel-bg/60 border-hpanel-border-strong hover:border-hpanel-primary/50',
            ].join(' ')}
          >
            {isRecommended && (
              <span className="absolute -top-2 right-3 inline-flex items-center gap-1 rounded-full bg-hpanel-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                ⭐ Recommended
              </span>
            )}
            <div className="text-xs uppercase tracking-wider text-hpanel-muted-strong font-medium">
              {tierLabels[r.tier]}
            </div>
            <div className="mt-1 text-2xl font-semibold text-white tabular-nums">
              ${r.dailyBudget}
              <span className="text-sm text-hpanel-muted font-normal"> / day</span>
            </div>
            <p className="text-xs text-hpanel-muted mt-1">{tierDescriptions[r.tier]}</p>

            <dl className="mt-4 space-y-1.5 text-xs">
              <ImpactRow label="Est. leads / week" value={`${r.weeklyLeadsLow}–${r.weeklyLeadsHigh}`} emphasis />
              <ImpactRow label="Clicks / week" value={r.weeklyClicks.toLocaleString()} />
              <ImpactRow label="Impressions / week" value={`~${r.weeklyImpressions.toLocaleString()}`} />
            </dl>
          </button>
        )
      })}
    </div>
  )
}

function ImpactRow({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-hpanel-muted">{label}</dt>
      <dd className={emphasis ? 'text-white font-semibold tabular-nums' : 'text-white tabular-nums'}>{value}</dd>
    </div>
  )
}
