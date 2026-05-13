import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LinkIcon, MoreVertical, Unlink } from 'lucide-react'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { CampaignTable } from '../components/google-ads/CampaignTable'
import { CustomerReporting } from '../components/google-ads/CustomerReporting'
import { CreditBanner } from '../components/google-ads/CreditBanner'
import { dummyAccounts } from '../data/dummy'
import { useConnection } from '../context/ConnectionContext'
import { useToast } from '../context/ToastContext'

export function AccountCampaigns() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const account = dummyAccounts.find((a) => a.id === id)
  const {
    campaignsByAccount,
    isNewUser,
    creditBannerDismissed,
    dismissCreditBanner,
    googleAccountEmail,
    disconnect,
  } = useConnection()
  const { showToast } = useToast()
  const campaigns = campaignsByAccount[id] ?? []
  const showCreditBanner = isNewUser && !creditBannerDismissed

  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmDisconnectOpen, setConfirmDisconnectOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  if (!account) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Google Ads', to: '/marketing/google-ads' }, { label: 'Unknown account' }]} />
        <div className="bg-hpanel-surface border border-hpanel-border rounded-card p-10 text-center">
          <h2 className="text-lg font-semibold text-white">Account not found</h2>
          <p className="text-sm text-hpanel-muted mt-1">This account may have been disconnected.</p>
          <Button className="mt-4" onClick={() => navigate('/marketing/google-ads')}>
            Back to Google Ads
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Marketing' }, { label: 'Google Ads' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">{account.name}</h1>
            <Badge tone={account.status === 'Active' ? 'success' : 'neutral'}>{account.status}</Badge>
          </div>
          <p className="text-sm text-hpanel-muted mt-1 font-mono">Account ID: {account.externalId}</p>
          {googleAccountEmail && (
            <p className="text-xs text-hpanel-muted-strong mt-1">
              Connected as <span className="text-white font-medium">{googleAccountEmail}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate(`/marketing/google-ads/accounts/${account.id}/new-campaign`)}
            disabled={account.status === 'Inactive'}
          >
            + Create new campaign
          </Button>
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="More account actions"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="h-10 w-10 inline-flex items-center justify-center rounded-card border border-hpanel-border-strong text-hpanel-muted hover:text-white hover:bg-white/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hpanel-primary"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-11 z-10 min-w-[220px] rounded-card border border-hpanel-border bg-hpanel-surface shadow-card py-1"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    setConfirmDisconnectOpen(true)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-hpanel-danger hover:bg-white/5 transition"
                >
                  <Unlink size={14} /> Disconnect Google Ads
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreditBanner && <CreditBanner onDismiss={dismissCreditBanner} />}

      {campaigns.length > 0 && <CustomerReporting campaigns={campaigns} />}

      <CampaignTable campaigns={campaigns} accountId={account.id} />

      <Modal
        open={confirmDisconnectOpen}
        onClose={() => setConfirmDisconnectOpen(false)}
        titleId="disconnect-title"
      >
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 flex-shrink-0 rounded-card bg-hpanel-danger/15 flex items-center justify-center text-hpanel-danger">
              <Unlink size={20} aria-hidden />
            </div>
            <div className="flex-1">
              <h2 id="disconnect-title" className="text-base font-semibold text-white">
                Disconnect Google Ads?
              </h2>
              <p className="text-sm text-hpanel-muted mt-1.5">
                Hostinger will lose access to <span className="text-white font-medium">{account.name}</span> ({account.externalId}). The link to the Hostinger manager account will also be removed.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-hpanel-muted">
                <li className="flex items-start gap-2">
                  <LinkIcon size={12} className="mt-[3px] flex-shrink-0" aria-hidden />
                  <span>Your campaigns will keep running inside Google Ads — only the Hostinger connection ends.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Unlink size={12} className="mt-[3px] flex-shrink-0" aria-hidden />
                  <span>You can reconnect at any time by going through the Connect flow again.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmDisconnectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirmDisconnectOpen(false)
                disconnect()
                showToast('Google Ads disconnected from hPanel.', 'info')
                navigate('/marketing/google-ads')
              }}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
