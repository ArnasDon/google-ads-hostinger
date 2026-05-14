import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronRight, Copy, Globe, Zap } from 'lucide-react'
import type { ConversionTrackingConfig } from '../../types'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useConnection } from '../../context/ConnectionContext'
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
  const [eventName, setEventName] = useState(value?.eventName ?? 'lead_form_submit')
  const [successUrl, setSuccessUrl] = useState(value?.successUrl ?? '')
  const [snippetExpanded, setSnippetExpanded] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const { googleTagDeployed, deployGoogleTag } = useConnection()
  const { showToast } = useToast()

  const snippet = useMemo(() => buildWebpageSnippet(eventName), [eventName])

  // Mirror local field state up to the parent on every change so the wizard
  // validator always sees the latest values, not a stale onBlur snapshot.
  // Parent must memoize `onChange` (otherwise this effect re-fires every
  // render); CreateCampaign and EditCampaignDrawer both wrap it in useCallback.
  useEffect(() => {
    onChange({
      type: 'WEBPAGE',
      eventName: eventName.trim() || 'conversion',
      successUrl: successUrl.trim() || undefined,
    })
  }, [eventName, successUrl, onChange])

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
      <div className="mb-5 rounded-card border border-hpanel-border-strong bg-hpanel-bg/60 p-4 flex items-start gap-3">
        <Globe size={18} className="text-hpanel-primary-hover mt-0.5 flex-shrink-0" aria-hidden />
        <div>
          <div className="text-sm font-semibold text-white">Website conversion</div>
          <p className="text-xs text-hpanel-muted mt-0.5">
            Count form submissions, sign-ups, or purchases on your site.
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-3 text-xs text-hpanel-danger font-medium">
          Please finish setting up conversion tracking before continuing.
        </p>
      )}

      <div className="space-y-4">
          <Input
            label="Conversion event name"
            hint="A short slug Google uses to identify this conversion."
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            maxLength={50}
          />

          <Input
            label="Success / thank-you URL (optional)"
            hint="The page users land on after submitting a form or completing a purchase. Google Ads uses it to verify the conversion."
            placeholder="https://yourdomain.com/thank-you"
            type="url"
            value={successUrl}
            onChange={(e) => setSuccessUrl(e.target.value)}
          />

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Install Google Tag on your site</label>
            {googleTagDeployed ? (
              <div className="rounded-card border border-hpanel-success/40 bg-hpanel-success/10 px-3 py-2.5 flex items-center gap-2 text-sm text-white">
                <CheckCircle2 size={16} className="text-hpanel-success flex-shrink-0" aria-hidden />
                <span>Google Tag is deployed on <span className="font-mono text-hpanel-success">yourdomain.com</span>. Conversions will fire automatically.</span>
              </div>
            ) : (
              <div className="rounded-card border border-hpanel-primary/40 bg-hpanel-primary-soft p-3">
                <div className="flex items-start gap-2.5">
                  <Zap size={16} className="text-hpanel-primary-hover mt-0.5 flex-shrink-0" aria-hidden />
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">Deploy automatically to your Hostinger site</p>
                    <p className="text-xs text-hpanel-muted mt-0.5">
                      We can install the Google Tag on every page of <span className="font-mono text-white">yourdomain.com</span> for you — no copy/paste needed.
                    </p>
                    <Button
                      size="sm"
                      className="mt-2.5"
                      loading={deploying}
                      onClick={async () => {
                        setDeploying(true)
                        await deployGoogleTag()
                        setDeploying(false)
                        showToast('Google Tag deployed to yourdomain.com.', 'success')
                      }}
                      leftIcon={!deploying ? <Zap size={14} aria-hidden /> : undefined}
                    >
                      {deploying ? 'Deploying…' : 'Deploy Google Tag'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSnippetExpanded((v) => !v)}
              aria-expanded={snippetExpanded}
              className="mt-3 inline-flex items-center gap-1 text-xs text-hpanel-muted hover:text-white transition"
            >
              {snippetExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              {snippetExpanded ? 'Hide manual snippet' : 'Show manual install snippet'}
            </button>

            {snippetExpanded && (
              <div className="mt-2">
                <div className="flex items-center justify-end mb-2">
                  <Button size="sm" variant="secondary" onClick={copy} leftIcon={<Copy size={14} aria-hidden />}>
                    Copy snippet
                  </Button>
                </div>
                <pre className="bg-hpanel-bg border border-hpanel-border-strong rounded-card p-3 text-xs text-hpanel-muted overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                  {snippet}
                </pre>
                <p className="mt-2 text-xs text-hpanel-muted">
                  Only needed if you're managing the site outside Hostinger. Add the global tag to every page and fire the event snippet on the conversion success page.
                </p>
              </div>
            )}
          </div>
        </div>
    </div>
  )
}
