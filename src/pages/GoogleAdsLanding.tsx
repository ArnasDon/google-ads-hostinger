import { useState, type ReactNode } from 'react'
import { AlertTriangle, MousePointerClick, Search, Send, Sparkles, X } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { OAuthModal } from '../components/google-ads/OAuthModal'
import { CreateAccountWizard } from '../components/google-ads/CreateAccountWizard'
import { useConnection } from '../context/ConnectionContext'

interface Benefit {
  icon: ReactNode
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    icon: <Search size={22} />,
    title: 'Reach people searching for your product',
    description: 'Your ads appear when potential customers are actively searching on Google.',
  },
  {
    icon: <MousePointerClick size={22} />,
    title: 'Only pay when someone clicks',
    description: 'No charges for impressions — you only pay when someone interacts with your ad.',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'AI optimizes your ads automatically',
    description: 'Performance Max uses Google AI to test combinations and improve results over time.',
  },
]

export function GoogleAdsLanding() {
  const { connect, isConnecting, authCancelled, cancelAuth, dismissCancelled } = useConnection()
  const [modalOpen, setModalOpen] = useState(false)

  const handleAllow = async (isNewUser: boolean) => {
    await connect(isNewUser)
    setModalOpen(false)
  }

  const handleCancel = () => {
    if (isConnecting) return
    setModalOpen(false)
    cancelAuth()
  }

  return (
    <div className="max-w-3xl mx-auto">
      {authCancelled && (
        <div className="mb-6 flex items-start gap-3 rounded-card border border-hpanel-warning/40 bg-hpanel-warning-soft px-4 py-3 text-sm">
          <AlertTriangle size={16} className="text-hpanel-warning mt-0.5 flex-shrink-0" aria-hidden />
          <div className="flex-1">
            <div className="font-medium text-white">Authorization cancelled</div>
            <div className="text-hpanel-muted text-xs mt-0.5">
              You'll need to allow access to continue. Your data was not shared with Hostinger.
            </div>
          </div>
          <button onClick={dismissCancelled} className="text-hpanel-muted hover:text-white" aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-hpanel-primary-soft mb-4 text-hpanel-primary-hover">
          <Send size={26} aria-hidden />
        </div>
        <h1 className="text-3xl font-semibold text-white">Grow your website with Google Ads</h1>
        <p className="mt-2 text-hpanel-muted max-w-xl mx-auto">
          Connect your Google Ads account to create and manage campaigns directly from hPanel.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {benefits.map((b) => (
          <Card key={b.title}>
            <div className="text-hpanel-primary-hover">{b.icon}</div>
            <h3 className="mt-3 text-sm font-semibold text-white">{b.title}</h3>
            <p className="mt-1.5 text-xs text-hpanel-muted">{b.description}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center text-center">
        <Button size="lg" onClick={() => setModalOpen(true)}>
          Connect Google Ads account
        </Button>
        <p className="mt-3 text-xs text-hpanel-muted">You'll be redirected to Google to authorize access.</p>
      </div>

      <OAuthModal open={modalOpen} onCancel={handleCancel} onAllow={handleAllow} loading={isConnecting} />
      <CreateAccountWizard />
    </div>
  )
}
