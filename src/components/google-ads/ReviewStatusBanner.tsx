import { Clock, ShieldCheck } from 'lucide-react'
import { Button } from '../ui/Button'
import { useConnection } from '../../context/ConnectionContext'
import { useToast } from '../../context/ToastContext'
import type { Campaign, ReviewStatus } from '../../types'

interface ReviewStatusBannerProps {
  accountId: string
  campaign: Campaign
}

export function ReviewStatusBanner({ accountId, campaign }: ReviewStatusBannerProps) {
  const { approveReview } = useConnection()
  const { showToast } = useToast()

  if (campaign.reviewStatus !== 'UNDER_REVIEW') return null

  const handleSimulate = () => {
    approveReview(accountId, campaign.id)
    showToast('Your campaign was approved by Google and is now live.', 'success')
  }

  return (
    <div className="mb-6 rounded-card border border-hpanel-primary/40 bg-hpanel-primary-soft p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="h-10 w-10 flex-shrink-0 rounded-card bg-hpanel-primary flex items-center justify-center text-white">
          <ShieldCheck size={20} aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white">Google is reviewing your campaign</h3>
          <p className="text-sm text-hpanel-muted mt-1">
            Most campaigns are reviewed within one business day. Google checks your headlines, descriptions, destination URL, and any images or video against its policies. Once approved, your ad will go live automatically — no further action needed from you.
          </p>
          <p className="text-xs text-hpanel-muted-strong mt-2 inline-flex items-center gap-1.5">
            <Clock size={12} aria-hidden /> Submitted just now · review usually completes in under 24 hours
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={handleSimulate} className="flex-shrink-0">
          Simulate Google approval (demo)
        </Button>
      </div>
    </div>
  )
}

// Centralised label/tone helpers — reused by the table + details badge.
export function reviewStatusLabel(s: ReviewStatus): string {
  switch (s) {
    case 'UNDER_REVIEW':
      return 'Under review'
    case 'APPROVED':
      return 'Approved'
    case 'APPROVED_LIMITED':
      return 'Approved (limited)'
    case 'DISAPPROVED':
      return 'Disapproved'
  }
}

export function reviewStatusTone(s: ReviewStatus): 'info' | 'success' | 'warning' | 'danger' {
  switch (s) {
    case 'UNDER_REVIEW':
      return 'info'
    case 'APPROVED':
      return 'success'
    case 'APPROVED_LIMITED':
      return 'warning'
    case 'DISAPPROVED':
      return 'danger'
  }
}
