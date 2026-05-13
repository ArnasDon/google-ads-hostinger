import { AlertOctagon, ExternalLink } from 'lucide-react'
import { Button } from '../ui/Button'

const APPEAL_URL = 'https://support.google.com/google-ads/answer/2375414'

/**
 * Red alert surfaced when the Google Ads account is suspended. Mirrors the
 * Google Ads UI pattern — explain why campaigns aren't running, point to the
 * official appeal flow.
 */
export function SuspensionAlert() {
  return (
    <div className="mb-6 rounded-card border border-hpanel-danger/40 bg-hpanel-danger-soft p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="h-10 w-10 flex-shrink-0 rounded-card bg-hpanel-danger/20 text-hpanel-danger flex items-center justify-center">
          <AlertOctagon size={20} aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white">
            Your Google Ads account is suspended
          </h3>
          <p className="text-sm text-hpanel-muted mt-1">
            None of your campaigns are serving right now. This usually happens when an ad or landing page violates Google Ads policies. Review the suspension reason in Google Ads, fix the issue, then submit an appeal.
          </p>
          <ul className="mt-3 space-y-1.5 text-xs text-hpanel-muted list-disc pl-4">
            <li>Open Google Ads to see the specific policy that was flagged.</li>
            <li>Make the requested changes (update ad copy, the destination URL, etc.).</li>
            <li>Submit an appeal — most reviews complete in 1 to 2 business days.</li>
          </ul>
        </div>
        <a
          href={APPEAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0"
        >
          <Button variant="danger" size="sm" leftIcon={<ExternalLink size={14} aria-hidden />}>
            Appeal in Google Ads
          </Button>
        </a>
      </div>
    </div>
  )
}
