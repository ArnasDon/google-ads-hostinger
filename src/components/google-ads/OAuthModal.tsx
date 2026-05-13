import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { RadioGroup, RadioOption } from '../ui/RadioGroup'
import { GoogleLogo } from './GoogleLogo'
import { useConnection, type ConnectPhase } from '../../context/ConnectionContext'

const phaseLabels: Record<ConnectPhase, string> = {
  idle: 'Allow',
  authorizing: 'Connecting to Google…',
  creating: 'Creating Google Ads account…',
  'linking-mcc': 'Linking to Hostinger manager account…',
  fetching: 'Fetching account…',
}

interface OAuthModalProps {
  open: boolean
  onCancel: () => void
  onAllow: (isNewUser: boolean) => void
  loading?: boolean
}

const permissions = [
  'View and manage your Google Ads campaigns',
  'Access campaign performance data',
  'Create and edit ads on your behalf',
]

type UserKind = 'existing' | 'new'

export function OAuthModal({ open, onCancel, onAllow, loading }: OAuthModalProps) {
  const [userKind, setUserKind] = useState<UserKind | null>(null)
  const { connectPhase } = useConnection()

  useEffect(() => {
    if (!open) setUserKind(null)
  }, [open])

  return (
    <Modal open={open} onClose={loading ? () => {} : onCancel} titleId="oauth-modal-title">
      <div className="p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-hpanel-border">
          <GoogleLogo size={28} />
          <span className="text-sm text-hpanel-muted">accounts.google.com</span>
        </div>

        <div className="pt-5">
          <h2 id="oauth-modal-title" className="text-lg font-semibold text-white">
            Hostinger wants to access your Google Ads account
          </h2>
          <p className="text-sm text-hpanel-muted mt-1.5">
            This allows Hostinger to help create and manage your campaigns.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-xs uppercase tracking-wider text-hpanel-muted-strong font-medium">This will allow Hostinger to:</p>
          <ul className="space-y-2.5">
            {permissions.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-white">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-hpanel-primary-soft text-hpanel-primary-hover">
                  <Check size={12} aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-5 text-xs text-hpanel-muted">
          Hostinger never sees your Google login credentials. You can revoke access anytime from your Google account settings.
        </p>

        <div className="mt-5 border-t border-hpanel-border pt-4">
          <RadioGroup<UserKind>
            label="Are you new to Google Ads?"
            value={userKind}
            onChange={setUserKind}
            orientation="horizontal"
            showLabel
            className=""
          >
            <div className="grid grid-cols-2 gap-2">
              <RadioOption<UserKind>
                value="existing"
                render={({ selected }) => (
                  <OptionCard
                    selected={selected}
                    label="I already use Google Ads"
                    description="Connect an existing account"
                  />
                )}
              />
              <RadioOption<UserKind>
                value="new"
                render={({ selected }) => (
                  <OptionCard
                    selected={selected}
                    label="I'm new to Google Ads"
                    description="Unlock a starter credit offer"
                  />
                )}
              />
            </div>
          </RadioGroup>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={() => userKind && onAllow(userKind === 'new')}
            loading={loading}
            disabled={!userKind}
          >
            {loading ? phaseLabels[connectPhase] : 'Allow'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function OptionCard({
  selected,
  label,
  description,
}: {
  selected: boolean
  label: string
  description: string
}) {
  return (
    <div
      className={[
        'h-full text-left rounded-card border p-3 transition focus-visible:outline-none',
        selected
          ? 'bg-hpanel-primary-soft border-hpanel-primary text-white'
          : 'bg-hpanel-bg/60 border-hpanel-border-strong text-white hover:border-hpanel-primary/50',
      ].join(' ')}
    >
      <div className="flex items-center gap-2">
        <span
          className={[
            'inline-block h-3.5 w-3.5 rounded-full border-2 flex-shrink-0',
            selected ? 'border-hpanel-primary bg-hpanel-primary' : 'border-hpanel-muted',
          ].join(' ')}
          aria-hidden
        />
        <span className="text-sm font-medium leading-tight">{label}</span>
      </div>
      <p className="mt-1 text-xs text-hpanel-muted">{description}</p>
    </div>
  )
}
