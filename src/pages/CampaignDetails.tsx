import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { MetricCard } from '../components/google-ads/MetricCard'
import { PerformanceChart } from '../components/google-ads/PerformanceChart'
import { AssetGroupCard } from '../components/google-ads/AssetGroupCard'
import { RecommendationsCard } from '../components/google-ads/RecommendationsCard'
import { EditCampaignDrawer } from '../components/google-ads/EditCampaignDrawer'
import { dummyAccounts, dummyChart } from '../data/dummy'
import { useConnection } from '../context/ConnectionContext'
import { useToast } from '../context/ToastContext'

export function CampaignDetails() {
  const { id = '', campaignId = '' } = useParams<{ id: string; campaignId: string }>()
  const navigate = useNavigate()
  const { campaignsByAccount, updateCampaignStatus, updateCampaign } = useConnection()
  const { showToast } = useToast()
  const [editOpen, setEditOpen] = useState(false)

  const account = dummyAccounts.find((a) => a.id === id)
  const campaign = (campaignsByAccount[id] ?? []).find((c) => c.id === campaignId)

  if (!account || !campaign) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Google Ads', to: '/marketing/google-ads' }, { label: 'Unknown campaign' }]} />
        <div className="bg-hpanel-surface border border-hpanel-border rounded-card p-10 text-center">
          <h2 className="text-lg font-semibold text-white">Campaign not found</h2>
          <Button className="mt-4" onClick={() => navigate('/marketing/google-ads')}>
            Back to accounts
          </Button>
        </div>
      </div>
    )
  }

  const headlines = campaign.headlines ?? [
    'Fast & Reliable Web Hosting',
    'Get Online in Minutes',
    'Free Domain Included',
  ]

  const toggleStatus = () => {
    const next = campaign.status === 'Active' ? 'Paused' : 'Active'
    updateCampaignStatus(id, campaignId, next)
    showToast(`Campaign ${next.toLowerCase()}`, next === 'Active' ? 'success' : 'info')
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Google Ads', to: '/marketing/google-ads' },
          { label: account.name, to: `/marketing/google-ads/accounts/${account.id}` },
          { label: campaign.name },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">{campaign.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge tone={campaign.status === 'Active' ? 'success' : campaign.status === 'Paused' ? 'warning' : 'info'}>
              {campaign.status}
            </Badge>
            <span className="text-xs text-hpanel-muted">{campaign.type} campaign</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-hpanel-muted">Paused</span>
            <ToggleSwitch checked={campaign.status === 'Active'} onChange={toggleStatus} />
            <span className="text-sm text-white font-medium">Active</span>
          </div>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Edit settings
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard label="Impressions" value={campaign.impressions.toLocaleString()} delta={12.3} />
        <MetricCard label="Clicks" value={campaign.clicks.toLocaleString()} delta={8.7} />
        <MetricCard label="Conversions" value={String(campaign.conversions)} delta={15.2} />
        <MetricCard label="Cost" value={`$${campaign.cost.toFixed(2)}`} delta={-3.4} />
      </div>

      <div className="bg-hpanel-surface border border-hpanel-border rounded-card shadow-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Performance</h3>
            <p className="text-xs text-hpanel-muted">Clicks and conversions over the past week</p>
          </div>
          <select className="h-9 px-3 rounded-card bg-hpanel-bg border border-hpanel-border-strong text-white text-sm focus:outline-none">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
        <PerformanceChart data={dummyChart} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AssetGroupCard name="Main asset group" adStrength="Good" headlines={headlines} />
        <RecommendationsCard />
      </div>

      <p className="text-xs text-hpanel-muted-strong mt-4 italic">
        Note: These are dummy demo interactions — no real changes are made to your Google Ads account.
      </p>

      <EditCampaignDrawer
        open={editOpen}
        campaign={campaign}
        onClose={() => setEditOpen(false)}
        onSave={(patch) => updateCampaign(id, campaignId, patch)}
      />
    </div>
  )
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={[
        'relative inline-flex h-6 w-11 rounded-full transition',
        checked ? 'bg-hpanel-primary' : 'bg-hpanel-border-strong',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}
