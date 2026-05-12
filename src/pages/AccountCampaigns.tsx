import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { CampaignTable } from '../components/google-ads/CampaignTable'
import { dummyAccounts } from '../data/dummy'
import { useConnection } from '../context/ConnectionContext'

export function AccountCampaigns() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const account = dummyAccounts.find((a) => a.id === id)
  const { campaignsByAccount } = useConnection()
  const campaigns = campaignsByAccount[id] ?? []

  if (!account) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Google Ads', to: '/marketing/google-ads' }, { label: 'Unknown account' }]} />
        <div className="bg-hpanel-surface border border-hpanel-border rounded-card p-10 text-center">
          <h2 className="text-lg font-semibold text-white">Account not found</h2>
          <p className="text-sm text-hpanel-muted mt-1">This account may have been disconnected.</p>
          <Button className="mt-4" onClick={() => navigate('/marketing/google-ads')}>
            Back to accounts
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Google Ads', to: '/marketing/google-ads' }, { label: account.name }]} />

      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">{account.name}</h1>
            <Badge tone={account.status === 'Active' ? 'success' : 'neutral'}>{account.status}</Badge>
          </div>
          <p className="text-sm text-hpanel-muted mt-1 font-mono">Account ID: {account.externalId}</p>
        </div>
        <Button
          onClick={() => navigate(`/marketing/google-ads/accounts/${account.id}/new-campaign`)}
          disabled={account.status === 'Inactive'}
        >
          + Create new campaign
        </Button>
      </div>

      <CampaignTable campaigns={campaigns} accountId={account.id} />
    </div>
  )
}
