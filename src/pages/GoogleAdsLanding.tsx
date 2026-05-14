import { useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  Layers,
  MousePointerClick,
  Rocket,
  Search,
  Send,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { OAuthModal } from '../components/google-ads/OAuthModal'
import { CreateAccountWizard } from '../components/google-ads/CreateAccountWizard'
import { AdPreview } from '../components/google-ads/AdPreview'
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

interface Step {
  icon: ReactNode
  title: string
  description: string
}

const howItWorks: Step[] = [
  {
    icon: <Layers size={18} />,
    title: '1. Connect or create your account',
    description: 'One click through Google sign-in. We create a new Google Ads account for you if you don\'t have one yet.',
  },
  {
    icon: <Wand2 size={18} />,
    title: '2. Build your first campaign',
    description: 'A short guided flow captures your budget, headlines, audience, and conversion tracking — no Google Ads jargon required.',
  },
  {
    icon: <Rocket size={18} />,
    title: '3. Go live and track results',
    description: 'Google reviews and launches your ad. Clicks, leads, and cost-per-lead show up on a single dashboard in hPanel.',
  },
]

// Sample data for the live ad preview. Generic small business so the demo
// reads as aspirational rather than tied to any one industry.
const SAMPLE_AD = {
  businessName: 'Acme Coffee Roasters',
  websiteUrl: 'acmecoffee.co',
  headlines: ['Small-Batch Roasted Coffee', 'Free Shipping Over $30', 'Try Our Sampler Box'],
  descriptions: [
    'Hand-roasted, locally sourced beans delivered to your door each week.',
    'From bean to brew in under 7 days. 10% off your first order.',
  ],
}

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
    <div className="max-w-6xl mx-auto">
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

      <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-center">
        {/* Hero copy + primary CTA */}
        <div>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-hpanel-primary-soft mb-4 text-hpanel-primary-hover">
            <Send size={22} aria-hidden />
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-white leading-tight">
            Grow your website with Google Ads
          </h1>
          <p className="mt-3 text-hpanel-muted max-w-xl">
            Reach customers searching for what you sell, across Google Search, YouTube, Gmail, and millions of partner sites. Set up in minutes — no Google Ads experience needed.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button size="lg" onClick={() => setModalOpen(true)}>
              Connect Google Ads account
            </Button>
            <span className="text-xs text-hpanel-muted">You'll be redirected to Google to authorize access.</span>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-hpanel-muted-strong">
            <Sparkles size={12} className="text-hpanel-primary-hover" aria-hidden />
            <span>
              <span className="text-white font-medium">$500 in ad credit</span> for new advertisers when you spend $500 in the first 60 days.
            </span>
          </div>
        </div>

        {/* Live sample ad preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">What your ads could look like</h2>
            <span className="text-[10px] uppercase tracking-wider text-hpanel-muted-strong font-medium">Sample</span>
          </div>
          <AdPreview
            businessName={SAMPLE_AD.businessName}
            websiteUrl={SAMPLE_AD.websiteUrl}
            headlines={SAMPLE_AD.headlines}
            descriptions={SAMPLE_AD.descriptions}
          />
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-14">
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((b) => (
            <Card key={b.title}>
              <div className="text-hpanel-primary-hover">{b.icon}</div>
              <h3 className="mt-3 text-sm font-semibold text-white">{b.title}</h3>
              <p className="mt-1.5 text-xs text-hpanel-muted">{b.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mt-14">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-white">How it works</h2>
          <p className="text-sm text-hpanel-muted mt-1">From connect to launch in under five minutes.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((s, i) => (
            <Card key={s.title} className="relative">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-card bg-hpanel-primary-soft flex items-center justify-center text-hpanel-primary-hover flex-shrink-0">
                  {s.icon}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-hpanel-muted-strong font-medium">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">{s.title}</h3>
              <p className="mt-1.5 text-xs text-hpanel-muted">{s.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-14 mb-2 rounded-card border border-hpanel-primary/30 bg-hpanel-primary-soft p-6 lg:p-8 text-center">
        <h2 className="text-xl font-semibold text-white">Ready to bring new visitors to your site?</h2>
        <p className="mt-1.5 text-sm text-hpanel-muted">
          Connect your Google Ads account and launch your first Performance Max campaign in minutes.
        </p>
        <Button size="lg" className="mt-5" onClick={() => setModalOpen(true)}>
          Connect Google Ads account
        </Button>
        <p className="mt-3 text-xs text-hpanel-muted-strong">
          You can disconnect at any time. Hostinger never sees your Google login.
        </p>
      </div>

      <OAuthModal open={modalOpen} onCancel={handleCancel} onAllow={handleAllow} loading={isConnecting} />
      <CreateAccountWizard />
    </div>
  )
}
