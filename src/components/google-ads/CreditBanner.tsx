import { Gift, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { useToast } from '../../context/ToastContext'

interface CreditBannerProps {
  onDismiss: () => void
}

export function CreditBanner({ onDismiss }: CreditBannerProps) {
  const { showToast } = useToast()
  return (
    <div className="relative overflow-hidden rounded-card border border-hpanel-primary/40 bg-gradient-to-r from-hpanel-primary-soft to-transparent p-5 mb-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 flex-shrink-0 rounded-card bg-hpanel-primary flex items-center justify-center text-white">
          <Gift size={22} aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-white">Get $500 in Google Ads credit</h3>
            <span className="inline-flex items-center rounded-full border border-hpanel-primary/40 bg-hpanel-primary-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-hpanel-primary-hover">
              New advertiser
            </span>
          </div>
          <p className="text-sm text-hpanel-muted mt-1">
            Spend $500 in your first 60 days and Google will match it up to $500. Offer for new advertisers in eligible regions. Terms apply.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={() => showToast('Credit offer applied to your account (demo)', 'success')}>
              Apply credit
            </Button>
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              Not now
            </Button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-hpanel-muted hover:text-white flex-shrink-0"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
