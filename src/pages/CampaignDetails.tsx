import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MoreVertical, Trash2 } from 'lucide-react'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { MetricCard } from '../components/google-ads/MetricCard'
import { EditCampaignDrawer } from '../components/google-ads/EditCampaignDrawer'
import { ReviewStatusBanner, reviewStatusLabel, reviewStatusTone } from '../components/google-ads/ReviewStatusBanner'

// recharts is ~150 KB minified — lazy-load it so the rest of the app
// (landing, account list, wizard, edit drawer) doesn't pay the cost.
const PerformanceChart = lazy(() => import('../components/google-ads/PerformanceChart'))
import { dummyAccounts, dummyChart } from '../data/dummy'
import { useConnection } from '../context/ConnectionContext'
import { useToast } from '../context/ToastContext'

export function CampaignDetails() {
  const { id = '', campaignId = '' } = useParams<{ id: string; campaignId: string }>()
  const navigate = useNavigate()
  const { campaignsByAccount, updateCampaignStatus, updateCampaign, removeCampaign } = useConnection()
  const { showToast } = useToast()
  const [editOpen, setEditOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close the kebab menu when clicking outside.
  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

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

  const toggleStatus = () => {
    const next = campaign.status === 'Active' ? 'Paused' : 'Active'
    updateCampaignStatus(id, campaignId, next)
    showToast(`Campaign ${next.toLowerCase()}`, next === 'Active' ? 'success' : 'info')
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Google Ads', to: `/marketing/google-ads/accounts/${account.id}` },
          { label: campaign.name },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">{campaign.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge tone={campaign.status === 'Active' ? 'success' : campaign.status === 'Paused' ? 'warning' : 'info'}>
              {campaign.status}
            </Badge>
            {campaign.reviewStatus && campaign.reviewStatus !== 'APPROVED' && (
              <Badge tone={reviewStatusTone(campaign.reviewStatus)}>
                {reviewStatusLabel(campaign.reviewStatus)}
              </Badge>
            )}
            <span className="text-xs text-hpanel-muted">{campaign.type} campaign</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-hpanel-muted">Paused</span>
            <ToggleSwitch
              checked={campaign.status === 'Active'}
              onChange={toggleStatus}
              label={`Campaign status (currently ${campaign.status})`}
            />
            <span className="text-sm text-white font-medium">Active</span>
          </div>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Edit settings
          </Button>
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="More campaign actions"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="h-10 w-10 inline-flex items-center justify-center rounded-card border border-hpanel-border-strong text-hpanel-muted hover:text-white hover:bg-white/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hpanel-primary"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-11 z-10 min-w-[180px] rounded-card border border-hpanel-border bg-hpanel-surface shadow-card py-1"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    setConfirmRemoveOpen(true)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-hpanel-danger hover:bg-white/5 transition"
                >
                  <Trash2 size={14} /> Remove campaign
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReviewStatusBanner accountId={id} campaign={campaign} />

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
        <Suspense fallback={<ChartSkeleton />}>
          <PerformanceChart data={dummyChart} />
        </Suspense>
      </div>

      <EditCampaignDrawer
        open={editOpen}
        campaign={campaign}
        onClose={() => setEditOpen(false)}
        onSave={(patch) => updateCampaign(id, campaignId, patch)}
      />

      <Modal
        open={confirmRemoveOpen}
        onClose={() => setConfirmRemoveOpen(false)}
        titleId="remove-campaign-title"
      >
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 flex-shrink-0 rounded-card bg-hpanel-danger/15 flex items-center justify-center text-hpanel-danger">
              <Trash2 size={20} aria-hidden />
            </div>
            <div className="flex-1">
              <h2 id="remove-campaign-title" className="text-base font-semibold text-white">
                Remove this campaign?
              </h2>
              <p className="text-sm text-hpanel-muted mt-1.5">
                <span className="text-white font-medium">{campaign.name}</span> will stop running immediately and will be removed from your account. This can't be undone from hPanel.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmRemoveOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                removeCampaign(id, campaignId)
                showToast(`Campaign "${campaign.name}" removed.`, 'info')
                navigate(`/marketing/google-ads/accounts/${id}`)
              }}
            >
              Remove campaign
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div
      className="w-full h-72 rounded-card bg-hpanel-bg/40 border border-hpanel-border animate-pulse"
      aria-label="Loading performance chart"
      role="status"
    />
  )
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={[
        'relative inline-flex h-6 w-11 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hpanel-primary focus-visible:ring-offset-2 focus-visible:ring-offset-hpanel-bg',
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
