import { useNavigate } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { reviewStatusLabel, reviewStatusTone } from './ReviewStatusBanner'
import type { Campaign } from '../../types'

interface CampaignTableProps {
  campaigns: Campaign[]
  accountId: string
}

function statusTone(status: Campaign['status']) {
  switch (status) {
    case 'Active':
      return 'success' as const
    case 'Paused':
      return 'warning' as const
    case 'Draft':
      return 'info' as const
  }
}

export function CampaignTable({ campaigns, accountId }: CampaignTableProps) {
  const navigate = useNavigate()

  if (campaigns.length === 0) {
    return (
      <div className="bg-hpanel-surface border border-hpanel-border rounded-card p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-hpanel-primary-soft flex items-center justify-center text-hpanel-primary-hover">
          <BarChart3 size={22} aria-hidden />
        </div>
        <h3 className="mt-4 text-base font-semibold text-white">No campaigns yet</h3>
        <p className="mt-1 text-sm text-hpanel-muted max-w-sm mx-auto">
          Create your first campaign to start reaching new customers through Google.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-hpanel-surface border border-hpanel-border rounded-card overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-hpanel-muted-strong border-b border-hpanel-border">
              <th className="px-4 py-3 font-medium">Campaign name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Daily budget</th>
              <th className="px-4 py-3 font-medium text-right">Impressions</th>
              <th className="px-4 py-3 font-medium text-right">Clicks</th>
              <th className="px-4 py-3 font-medium text-right">Conversions</th>
              <th className="px-4 py-3 font-medium text-right">Cost</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigate(`/marketing/google-ads/accounts/${accountId}/campaigns/${c.id}`)}
                className="border-b border-hpanel-border last:border-b-0 hover:bg-white/[0.02] transition cursor-pointer"
              >
                <td className="px-4 py-3.5">
                  <div className="font-medium text-white">{c.name}</div>
                  <div className="text-xs text-hpanel-muted mt-0.5">{c.type}</div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-col items-start gap-1">
                    <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                    {c.reviewStatus && c.reviewStatus !== 'APPROVED' && (
                      <Badge tone={reviewStatusTone(c.reviewStatus)}>
                        {reviewStatusLabel(c.reviewStatus)}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums">${c.dailyBudget}</td>
                <td className="px-4 py-3.5 text-right tabular-nums">{c.impressions.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-right tabular-nums">{c.clicks.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-right tabular-nums">{c.conversions}</td>
                <td className="px-4 py-3.5 text-right tabular-nums font-medium">${c.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
