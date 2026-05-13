import type { CampaignDraft } from '../../types'

interface ReviewSummaryProps {
  campaignName: string
  draft: CampaignDraft
  estimatedLeads: string
}

export function ReviewSummary({ campaignName, draft, estimatedLeads }: ReviewSummaryProps) {
  return (
    <div className="bg-hpanel-bg/60 border border-hpanel-border rounded-card divide-y divide-hpanel-border">
      <Row label="Campaign name" value={campaignName} />
      <Row label="Daily budget" value={`$${draft.dailyBudget}`} />
      <Row label="Estimated weekly leads" value={estimatedLeads} />
      <Row label="Business name" value={draft.businessName} />
      <Row label="Website" value={draft.websiteUrl} />
      {draft.conversionTracking && (
        <Row
          label="Conversion tracking"
          value={
            draft.conversionTracking.type === 'WEBPAGE'
              ? `Website · "${draft.conversionTracking.eventName ?? 'conversion'}"`
              : `Phone call · ${draft.conversionTracking.phoneNumber || '—'} (min ${draft.conversionTracking.minDurationSeconds ?? 60}s)`
          }
        />
      )}
      <Row
        label="Headlines"
        value={
          <ul className="space-y-1">
            {draft.headlines.map((h, i) => (
              <li key={i} className="text-sm text-white">
                {i + 1}. {h}
              </li>
            ))}
          </ul>
        }
      />
      <Row
        label="Targeting"
        value={
          <div className="flex flex-wrap gap-1.5">
            {draft.locations.map((l) => (
              <span key={l} className="inline-flex items-center gap-1 rounded-full border border-hpanel-border-strong px-2 py-0.5 text-xs text-white">
                {l}
              </span>
            ))}
            <span className="inline-flex items-center gap-1 rounded-full border border-hpanel-border-strong px-2 py-0.5 text-xs text-white">
              {draft.language}
            </span>
          </div>
        }
      />
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="px-4 py-3 grid grid-cols-3 gap-4 items-start">
      <dt className="text-sm text-hpanel-muted col-span-1">{label}</dt>
      <dd className="text-sm text-white col-span-2 font-medium">{value}</dd>
    </div>
  )
}
