import { useEffect, useMemo, useRef, useState } from 'react'
import type { ConversionTrackingConfig, ConversionType } from '../../types'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useToast } from '../../context/ToastContext'

interface ConversionTrackingProps {
  value: ConversionTrackingConfig | null
  onChange: (config: ConversionTrackingConfig) => void
  error?: boolean
}

function buildWebpageSnippet(eventName: string): string {
  const safe = eventName.trim() || 'conversion'
  return `<!-- Google tag (gtag.js) — install on every page -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXX');
</script>

<!-- Event snippet for "${safe}" — fire on the success page -->
<script>
  gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXX/AbC-D_efGhIjKlMnO'
  });
</script>`
}

export function ConversionTracking({ value, onChange, error }: ConversionTrackingProps) {
  const [type, setType] = useState<ConversionType>(value?.type ?? 'WEBPAGE')
  const [eventName, setEventName] = useState(value?.eventName ?? 'lead_form_submit')
  const [phoneNumber, setPhoneNumber] = useState(value?.phoneNumber ?? '')
  const [minDuration, setMinDuration] = useState(value?.minDurationSeconds ?? 60)
  const { showToast } = useToast()

  const snippet = useMemo(() => buildWebpageSnippet(eventName), [eventName])

  // Mirror local field state up to the parent on every change so the wizard
  // validator always sees the latest values, not a stale onBlur snapshot.
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  useEffect(() => {
    const next: ConversionTrackingConfig =
      type === 'WEBPAGE'
        ? { type: 'WEBPAGE', eventName: eventName.trim() || 'conversion' }
        : {
            type: 'CLICK_TO_CALL',
            phoneNumber: phoneNumber.trim(),
            minDurationSeconds: minDuration,
          }
    onChangeRef.current(next)
  }, [type, eventName, phoneNumber, minDuration])

  const selectType = (t: ConversionType) => setType(t)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      showToast('Snippet copied to clipboard', 'success')
    } catch {
      showToast("Couldn't copy — please select and copy manually", 'warning')
    }
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 mb-5">
        <TypeOption
          selected={type === 'WEBPAGE'}
          onClick={() => selectType('WEBPAGE')}
          icon="🌐"
          title="Website conversion"
          description="Count form submissions, sign-ups, or purchases on your site."
        />
        <TypeOption
          selected={type === 'CLICK_TO_CALL'}
          onClick={() => selectType('CLICK_TO_CALL')}
          icon="📞"
          title="Phone call conversion"
          description="Count phone calls from people who saw your ad."
        />
      </div>

      {error && (
        <p className="mb-3 text-xs text-hpanel-danger font-medium">
          Please finish setting up conversion tracking before continuing.
        </p>
      )}

      {type === 'WEBPAGE' && (
        <div className="space-y-4">
          <Input
            label="Conversion event name"
            hint="A short slug Google uses to identify this conversion."
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            maxLength={50}
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">Code snippet</label>
              <Button size="sm" variant="secondary" onClick={copy}>
                📋 Copy snippet
              </Button>
            </div>
            <pre className="bg-hpanel-bg border border-hpanel-border-strong rounded-card p-3 text-xs text-hpanel-muted overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
              {snippet}
            </pre>
            <p className="mt-2 text-xs text-hpanel-muted">
              Add the global tag to every page and fire the event snippet on the conversion success page. Replace <code className="text-white bg-white/5 px-1 rounded">AW-XXXXXXXXX</code> with the ID Google gives you after creation.
            </p>
          </div>
        </div>
      )}

      {type === 'CLICK_TO_CALL' && (
        <div className="space-y-4">
          <Input
            label="Phone number"
            hint="Include the country code. We'll show this number in the ad and count calls of any length as conversions when set to 1."
            placeholder="+1 555 123 4567"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Input
            label="Minimum call duration (seconds)"
            hint="Calls shorter than this are not counted as conversions."
            type="number"
            min={1}
            max={600}
            value={minDuration}
            onChange={(e) => setMinDuration(Number(e.target.value))}
          />
        </div>
      )}
    </div>
  )
}

function TypeOption({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean
  onClick: () => void
  icon: string
  title: string
  description: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'text-left rounded-card border p-4 transition',
        selected
          ? 'bg-hpanel-primary-soft border-hpanel-primary ring-1 ring-hpanel-primary'
          : 'bg-hpanel-bg/60 border-hpanel-border-strong hover:border-hpanel-primary/50',
      ].join(' ')}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>
      <p className="text-xs text-hpanel-muted mt-1.5">{description}</p>
    </button>
  )
}
