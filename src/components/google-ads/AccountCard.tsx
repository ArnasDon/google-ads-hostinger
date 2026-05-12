import { useNavigate } from 'react-router-dom'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import type { Account } from '../../types'

interface AccountCardProps {
  account: Account
}

export function AccountCard({ account }: AccountCardProps) {
  const navigate = useNavigate()
  const isInactive = account.status === 'Inactive'

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-10 w-10 rounded-card bg-hpanel-primary-soft flex items-center justify-center text-hpanel-primary-hover flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M21.6 10.2L13.2 1.8a1.8 1.8 0 00-2.4 0L2.4 10.2a1.8 1.8 0 000 2.4l8.4 8.4a1.8 1.8 0 002.4 0l8.4-8.4a1.8 1.8 0 000-2.4zM12 16.5l-3-3 1.5-1.5L12 13.5l4.5-4.5 1.5 1.5-6 6z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white truncate">{account.name}</h3>
            <p className="text-xs text-hpanel-muted mt-0.5 font-mono">ID: {account.externalId}</p>
          </div>
        </div>
        <Badge tone={isInactive ? 'neutral' : 'success'}>{account.status}</Badge>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Stat label="Active campaigns" value={String(account.activeCampaigns)} />
        <Stat label="Total spend" value={`$${account.spend.toLocaleString()}`} />
        <Stat label="Conversions" value={String(account.conversions)} />
      </dl>

      <div className="mt-5 flex items-center gap-2">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate(`/marketing/google-ads/accounts/${account.id}`)}
        >
          View campaigns
        </Button>
        <Button
          aria-label="Create new campaign"
          onClick={() => navigate(`/marketing/google-ads/accounts/${account.id}/new-campaign`)}
          disabled={isInactive}
          className="!w-10 !h-10 !p-0 flex-shrink-0"
        >
          +
        </Button>
      </div>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-hpanel-bg/60 border border-hpanel-border rounded-card py-2.5 px-2">
      <dt className="text-[10px] uppercase tracking-wider text-hpanel-muted-strong font-medium">{label}</dt>
      <dd className="text-base font-semibold text-white mt-0.5 tabular-nums">{value}</dd>
    </div>
  )
}
