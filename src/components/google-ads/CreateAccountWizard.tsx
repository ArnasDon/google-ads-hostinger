import { useMemo, useState } from 'react'
import { Building2, Check, ExternalLink } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import {
  countryOptions,
  currencyOptions,
  timeZoneOptions,
} from '../../data/accountSetupOptions'
import { useConnection } from '../../context/ConnectionContext'

const TOS_URL = 'https://support.google.com/adspolicy/answer/54818'

const DEFAULT_COUNTRY = countryOptions.find((c) => c.code === 'US') ?? countryOptions[0]

export function CreateAccountWizard() {
  const { setupPending, finalizeAccountCreation, cancelAccountSetup, isConnecting, connectPhase } =
    useConnection()

  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY.code)
  const [timeZone, setTimeZone] = useState(DEFAULT_COUNTRY.suggestedTimeZone)
  const [currency, setCurrency] = useState(DEFAULT_COUNTRY.suggestedCurrency)
  const [tzManuallySet, setTzManuallySet] = useState(false)
  const [currencyManuallySet, setCurrencyManuallySet] = useState(false)
  const [tosAccepted, setTosAccepted] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const country = useMemo(
    () => countryOptions.find((c) => c.code === countryCode) ?? DEFAULT_COUNTRY,
    [countryCode]
  )

  const handleCountryChange = (next: string) => {
    setCountryCode(next)
    const c = countryOptions.find((o) => o.code === next) ?? DEFAULT_COUNTRY
    // Auto-fill TZ + currency from country unless the user manually overrode.
    if (!tzManuallySet) setTimeZone(c.suggestedTimeZone)
    if (!currencyManuallySet) setCurrency(c.suggestedCurrency)
  }

  const handleSubmit = async () => {
    setSubmitAttempted(true)
    if (!tosAccepted) return
    await finalizeAccountCreation({ countryCode, timeZone, currency })
  }

  const submitLabel =
    connectPhase === 'creating'
      ? 'Creating Google Ads account…'
      : connectPhase === 'linking-mcc'
      ? 'Linking to Hostinger manager account…'
      : 'Create Google Ads account'

  return (
    <Modal
      open={setupPending}
      onClose={isConnecting ? () => {} : cancelAccountSetup}
      width="max-w-xl"
      titleId="create-account-title"
    >
      <div className="p-6">
        <div className="flex items-start gap-3 pb-4 border-b border-hpanel-border">
          <div className="h-10 w-10 flex-shrink-0 rounded-card bg-hpanel-primary-soft flex items-center justify-center text-hpanel-primary-hover">
            <Building2 size={20} aria-hidden />
          </div>
          <div className="flex-1">
            <h2 id="create-account-title" className="text-base font-semibold text-white">
              Create your Google Ads account
            </h2>
            <p className="text-xs text-hpanel-muted mt-1">
              These settings determine how Google reports performance and bills you. They can't be changed after account creation.
            </p>
          </div>
        </div>

        <div className="pt-5 space-y-4">
          <Select
            label="Billing country"
            value={countryCode}
            onChange={(e) => handleCountryChange(e.target.value)}
            hint="Where your business is registered. Sets the billing region."
          >
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </Select>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Time zone"
              value={timeZone}
              onChange={(e) => {
                setTimeZone(e.target.value)
                setTzManuallySet(true)
              }}
              hint={
                tzManuallySet
                  ? undefined
                  : `Suggested for ${country.name}: ${country.suggestedTimeZone}`
              }
            >
              {timeZoneOptions.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </Select>

            <Select
              label="Currency"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value)
                setCurrencyManuallySet(true)
              }}
              hint={
                currencyManuallySet
                  ? undefined
                  : `Suggested for ${country.name}: ${country.suggestedCurrency}`
              }
            >
              {currencyOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <label
            className={[
              'flex items-start gap-3 rounded-card border p-3 transition cursor-pointer',
              submitAttempted && !tosAccepted
                ? 'border-hpanel-danger bg-hpanel-danger-soft'
                : 'border-hpanel-border-strong bg-hpanel-bg/60 hover:border-hpanel-primary/50',
            ].join(' ')}
          >
            <span
              className={[
                'mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition',
                tosAccepted
                  ? 'border-hpanel-primary bg-hpanel-primary'
                  : 'border-hpanel-muted bg-transparent',
              ].join(' ')}
              aria-hidden
            >
              {tosAccepted && <Check size={10} className="text-white" />}
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={tosAccepted}
              onChange={(e) => setTosAccepted(e.target.checked)}
              aria-label="Accept Google Ads Terms of Service"
            />
            <span className="text-sm text-white">
              I have read and accept the{' '}
              <a
                href={TOS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-hpanel-primary-hover underline hover:text-white"
              >
                Google Ads Terms of Service <ExternalLink size={11} aria-hidden />
              </a>
              .
            </span>
          </label>
          {submitAttempted && !tosAccepted && (
            <p className="text-xs text-hpanel-danger -mt-2">
              You need to accept the Google Ads Terms of Service to continue.
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={cancelAccountSetup} disabled={isConnecting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isConnecting} disabled={isConnecting}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
