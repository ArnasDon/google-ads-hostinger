import { useState } from 'react'
import { CreditCard, ExternalLink } from 'lucide-react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { useConnection } from '../../context/ConnectionContext'
import { useToast } from '../../context/ToastContext'

const GAFE_URL = 'https://ads.google.com/aw/overview'

type Stage = 'idle' | 'redirected'

export function BillingSetupBanner() {
  const { completeBillingSetup } = useConnection()
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [stage, setStage] = useState<Stage>('idle')

  const open = () => {
    setStage('idle')
    setModalOpen(true)
  }

  const close = () => setModalOpen(false)

  const handleOpenGoogleAds = () => {
    // Open the real GAFE in a new tab so stakeholders watching the demo see
    // what the redirect target looks like; then advance the modal to the
    // "did you finish setup?" follow-up.
    window.open(GAFE_URL, '_blank', 'noopener,noreferrer')
    setStage('redirected')
  }

  const handleMarkComplete = () => {
    completeBillingSetup()
    setModalOpen(false)
    setStage('idle')
    showToast('Billing setup complete. Your campaigns can now go live.', 'success')
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-card border border-hpanel-warning/40 bg-hpanel-warning-soft p-5 mb-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 flex-shrink-0 rounded-card bg-hpanel-warning/30 text-hpanel-warning flex items-center justify-center">
            <CreditCard size={22} aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-white">Finish billing setup in Google Ads</h3>
              <span className="inline-flex items-center rounded-full border border-hpanel-warning/40 bg-hpanel-warning/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-hpanel-warning">
                Action required
              </span>
            </div>
            <p className="text-sm text-hpanel-muted mt-1">
              Add a payment method and accept the Google Ads invitation. Campaigns can't start serving until billing is set up — even after Google approves them.
            </p>
            <div className="mt-3">
              <Button size="sm" onClick={open} leftIcon={<ExternalLink size={14} aria-hidden />}>
                Continue setup in Google Ads
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={close} titleId="billing-setup-title">
        <div className="p-6">
          {stage === 'idle' ? (
            <>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded-card bg-hpanel-primary-soft flex items-center justify-center text-hpanel-primary-hover">
                  <ExternalLink size={20} aria-hidden />
                </div>
                <div className="flex-1">
                  <h2 id="billing-setup-title" className="text-base font-semibold text-white">
                    You'll be redirected to Google Ads
                  </h2>
                  <p className="text-sm text-hpanel-muted mt-1.5">
                    Google Ads opens in a new tab where you'll add a payment method and accept the invitation Hostinger sent. Return here once you're done.
                  </p>
                  <p className="text-xs text-hpanel-muted-strong mt-3 font-mono break-all">{GAFE_URL}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="secondary" onClick={close}>Cancel</Button>
                <Button onClick={handleOpenGoogleAds} leftIcon={<ExternalLink size={14} aria-hidden />}>
                  Open Google Ads
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded-card bg-hpanel-primary-soft flex items-center justify-center text-hpanel-primary-hover">
                  <CreditCard size={20} aria-hidden />
                </div>
                <div className="flex-1">
                  <h2 id="billing-setup-title" className="text-base font-semibold text-white">
                    Did you finish setting up billing?
                  </h2>
                  <p className="text-sm text-hpanel-muted mt-1.5">
                    Once you've added a payment method and accepted the invitation in Google Ads, mark setup as complete so we can stop nudging you.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="secondary" onClick={close}>I'll do it later</Button>
                <Button onClick={handleMarkComplete}>Yes, setup is complete</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  )
}
