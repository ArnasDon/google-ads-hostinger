import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { OAuthModal } from '../components/google-ads/OAuthModal'
import { CreateAccountWizard } from '../components/google-ads/CreateAccountWizard'
import { SearchAdMock } from '../components/google-ads/SearchAdMock'
import { useConnection } from '../context/ConnectionContext'

const steps = [
  {
    title: 'Connect your Google account',
    description:
      "One-click sign-in through Google. We create a new Google Ads account for you if you don't have one yet.",
    tag: '30 seconds',
    tagIcon: <Clock size={14} aria-hidden />,
  },
  {
    title: 'Tell us about your site',
    description:
      'A short guided flow captures your budget, headline ideas, audience, and conversion goals. We translate it into Google Ads terms.',
    tag: '3 minutes',
    tagIcon: <Clock size={14} aria-hidden />,
  },
  {
    title: 'Go live and watch the leads',
    description:
      'Google reviews and launches your ad. Clicks, leads, and cost-per-lead show up on a single dashboard inside hPanel.',
    tag: 'Tracked in hPanel',
    tagIcon: <TrendingUp size={14} aria-hidden />,
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

      {/* ============================ HERO — Split layout ============================ */}
      <section
        className="relative overflow-hidden rounded-[28px] border border-white/[0.08] p-8 lg:p-16"
        style={{
          background:
            'radial-gradient(140% 90% at 0% 0%, rgba(103,61,230,0.22) 0%, rgba(103,61,230,0.06) 35%, rgba(103,61,230,0) 60%), #131318',
        }}
      >
        <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-[minmax(360px,1fr)_minmax(0,1.1fr)]">
          {/* Left column — headline + CTAs */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-hpanel-primary/40 bg-hpanel-primary/15 pl-2 pr-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#C8B5FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9747FF]" />
              New · Marketing
            </span>
            <h1 className="mt-4 text-[40px] sm:text-5xl lg:text-[60px] font-black text-white leading-[1.02] tracking-[-0.025em]">
              Grow your website with Google Ads.
            </h1>
            <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.55] text-[#B4B4C2]">
              Reach customers searching for what you sell across Google Search, YouTube, Gmail, and millions of partner sites. Set up your first campaign in minutes, no Google Ads experience needed.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={() => setModalOpen(true)}>
                Connect Google Ads account
                <ArrowRight size={16} aria-hidden />
              </Button>
              <Button size="lg" variant="secondary" leftIcon={<Play size={16} aria-hidden />}>
                Watch 60-second tour
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-[13px] text-hpanel-muted">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={14} className="text-hpanel-success" aria-hidden />
                Disconnect anytime
              </span>
              <span className="text-hpanel-muted-strong">·</span>
              <span className="inline-flex items-center gap-2">
                <Zap size={14} className="text-hpanel-success" aria-hidden />
                Live in under 5 minutes
              </span>
            </div>
          </div>

          {/* Right column — perspective-tilted Google Search ad mock */}
          <div className="relative">
            <div
              className="lg:[transform:perspective(1400px)_rotateY(-6deg)_rotateX(2deg)] lg:origin-left"
              style={{ filter: 'drop-shadow(0 60px 60px rgba(0,0,0,0.55))' }}
            >
              <SearchAdMock />
            </div>
            <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-hpanel-muted-strong">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-hpanel-primary-hover" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              </span>
              <span>Live preview updates as you type during setup.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section className="pt-24 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-[-0.02em]">
          From connect to live in five minutes.
        </h2>
        <p className="mt-3 mx-auto max-w-[56ch] text-base text-hpanel-muted">
          No agencies, no jargon, no Google Ads tabs to wrestle with. We translate the hard parts.
        </p>

        <div className="relative mt-12 grid gap-6 md:grid-cols-3 text-left">
          {/* Dashed connector — desktop only */}
          <div
            className="hidden md:block absolute top-[44px] left-[16%] right-[16%] h-px pointer-events-none"
            aria-hidden
            style={{
              background:
                'repeating-linear-gradient(to right, rgba(255,255,255,0.18) 0 6px, transparent 6px 12px)',
            }}
          />
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="relative rounded-[20px] border border-white/[0.08] bg-hpanel-surface p-6 flex flex-col"
            >
              <div
                className="h-9 w-9 rounded-full bg-hpanel-primary text-white grid place-items-center text-[15px] font-extrabold mb-5"
                style={{ boxShadow: '0 0 0 6px rgba(103,61,230,0.12)' }}
              >
                {idx + 1}
              </div>
              <h3 className="text-lg font-bold text-white tracking-[-0.01em] mb-1.5">{step.title}</h3>
              <p className="text-sm text-hpanel-muted leading-[1.55]">{step.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-hpanel-muted-strong">
                {step.tagIcon}
                {step.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ $500 CREDIT CALLOUT ============================ */}
      <section
        className="relative overflow-hidden rounded-[24px] mt-16 px-8 lg:px-12 py-10 grid items-center gap-8 lg:grid-cols-[1fr_auto] border"
        style={{
          background:
            'radial-gradient(80% 100% at 100% 0%, rgba(151,71,255,0.22) 0%, rgba(151,71,255,0) 60%), #1B143A',
          borderColor: 'rgba(151,71,255,0.22)',
        }}
      >
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FFD600]/30 bg-[#FFD600]/[0.12] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FFE066]">
            <Sparkles size={12} className="text-[#FFD600]" aria-hidden />
            Welcome offer
          </span>
          <h3 className="mt-3.5 text-2xl lg:text-[32px] font-extrabold text-white tracking-[-0.02em]">
            Get <span className="text-[#FFD24A]">$500 in ad credit</span> on Google.
          </h3>
          <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.55] text-[#C9C4DD]">
            New advertisers get $500 in Google Ads credit when they spend $500 in the first 60 days. Use it to test creative, audiences, and channels without burning your launch budget.
          </p>
          <div className="mt-4 flex flex-wrap gap-5 text-xs text-hpanel-muted-strong">
            <span className="inline-flex items-center gap-1.5">
              <Check size={12} aria-hidden /> Applied automatically
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check size={12} aria-hidden /> No promo codes
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check size={12} aria-hidden /> Terms apply
            </span>
          </div>
        </div>
        <div className="relative z-10">
          <Button size="lg" onClick={() => setModalOpen(true)}>
            Claim my $500
            <ArrowRight size={16} aria-hidden />
          </Button>
        </div>
      </section>

      <OAuthModal open={modalOpen} onCancel={handleCancel} onAllow={handleAllow} loading={isConnecting} />
      <CreateAccountWizard />
    </div>
  )
}
