import { RadioGroup, RadioOption } from '../ui/RadioGroup'
import type { EuPoliticalAdsStatus } from '../../types'

interface EuPoliticalDeclarationProps {
  value: EuPoliticalAdsStatus | null
  onChange: (status: EuPoliticalAdsStatus) => void
  error?: boolean
}

const options: { value: EuPoliticalAdsStatus; label: string }[] = [
  {
    value: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING',
    label: 'This campaign does not contain EU political advertising',
  },
  {
    value: 'CONTAINS_EU_POLITICAL_ADVERTISING',
    label: 'This campaign contains EU political advertising',
  },
]

export function EuPoliticalDeclaration({ value, onChange, error }: EuPoliticalDeclarationProps) {
  return (
    <div
      className={[
        'rounded-card border p-4 transition',
        error ? 'border-hpanel-danger bg-hpanel-danger-soft' : 'border-hpanel-border bg-hpanel-bg/60',
      ].join(' ')}
    >
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold text-white">EU Political Advertising declaration</h3>
        <span className="inline-flex items-center rounded-full border border-hpanel-danger/40 bg-hpanel-danger-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-hpanel-danger">
          Required
        </span>
      </div>
      <p className="text-xs text-hpanel-muted mb-3">
        Required by EU regulation for all Google Ads campaigns. This declaration is sent to Google when the campaign is created.
      </p>

      <RadioGroup<EuPoliticalAdsStatus>
        label="EU political advertising status"
        value={value}
        onChange={onChange}
        orientation="vertical"
      >
        <div className="space-y-2">
          {options.map((opt) => (
            <RadioOption<EuPoliticalAdsStatus>
              key={opt.value}
              value={opt.value}
              className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hpanel-primary rounded-card"
              render={({ selected }) => (
                <div
                  className={[
                    'w-full flex items-start gap-2.5 rounded-card border p-3 transition',
                    selected
                      ? 'border-hpanel-primary bg-hpanel-primary-soft'
                      : 'border-hpanel-border-strong bg-transparent hover:border-hpanel-primary/50',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2',
                      selected ? 'border-hpanel-primary' : 'border-hpanel-muted',
                    ].join(' ')}
                    aria-hidden
                  >
                    {selected && <span className="h-2 w-2 rounded-full bg-hpanel-primary" />}
                  </span>
                  <span className="text-sm text-white">{opt.label}</span>
                </div>
              )}
            />
          ))}
        </div>
      </RadioGroup>

      {error && (
        <p className="mt-3 text-xs text-hpanel-danger font-medium">
          Please declare political ads status before continuing.
        </p>
      )}
    </div>
  )
}
