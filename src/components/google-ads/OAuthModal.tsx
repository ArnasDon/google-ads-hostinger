import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { GoogleLogo } from './GoogleLogo'

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

type UserKind = 'existing' | 'new' | null

export function OAuthModal({ open, onCancel, onAllow, loading }: OAuthModalProps) {
  const [userKind, setUserKind] = useState<UserKind>(null)

  useEffect(() => {
    if (!open) setUserKind(null)
  }, [open])

  return (
    <Modal open={open} onClose={loading ? () => {} : onCancel}>
      <div className="p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-hpanel-border">
          <GoogleLogo size={28} />
          <span className="text-sm text-hpanel-muted">accounts.google.com</span>
        </div>

        <div className="pt-5">
          <h2 className="text-lg font-semibold text-white">Hostinger wants to access your Google Ads account</h2>
          <p className="text-sm text-hpanel-muted mt-1.5">
            This allows Hostinger to help create and manage your campaigns.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-xs uppercase tracking-wider text-hpanel-muted-strong font-medium">This will allow Hostinger to:</p>
          <ul className="space-y-2.5">
            {permissions.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-white">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-hpanel-primary-soft text-hpanel-primary-hover text-xs">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-5 text-xs text-hpanel-muted">
          Hostinger never sees your Google login credentials. You can revoke access anytime from your Google account settings.
        </p>

        <div className="mt-5 border-t border-hpanel-border pt-4">
          <p className="text-xs uppercase tracking-wider text-hpanel-muted-strong font-medium mb-2">Are you new to Google Ads?</p>
          <div className="grid grid-cols-2 gap-2">
            <UserKindOption
              selected={userKind === 'existing'}
              onClick={() => setUserKind('existing')}
              label="I already use Google Ads"
              description="Connect an existing account"
            />
            <UserKindOption
              selected={userKind === 'new'}
              onClick={() => setUserKind('new')}
              label="I'm new to Google Ads"
              description="Unlock a starter credit offer"
            />
          </div>
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
            {loading ? 'Connecting…' : 'Allow'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function UserKindOption({
  selected,
  onClick,
  label,
  description,
}: {
  selected: boolean
  onClick: () => void
  label: string
  description: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'text-left rounded-card border p-3 transition',
        selected
          ? 'bg-hpanel-primary-soft border-hpanel-primary text-white'
          : 'bg-hpanel-bg/60 border-hpanel-border-strong text-white hover:border-hpanel-primary/50',
      ].join(' ')}
    >
      <div className="flex items-center gap-2">
        <span
          className={[
            'inline-block h-3.5 w-3.5 rounded-full border-2',
            selected ? 'border-hpanel-primary bg-hpanel-primary' : 'border-hpanel-muted',
          ].join(' ')}
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-1 text-xs text-hpanel-muted ml-5.5 pl-0.5">{description}</p>
    </button>
  )
}
