import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CreditCard, ImageIcon, ShieldCheck, Target } from 'lucide-react'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Select } from '../components/ui/Select'
import { Slider } from '../components/ui/Slider'
import { Chip } from '../components/ui/Chip'
import { Card } from '../components/ui/Card'
import { StepWizard } from '../components/google-ads/StepWizard'
import { ReviewSummary } from '../components/google-ads/ReviewSummary'
import { AdPreview } from '../components/google-ads/AdPreview'
import { AudiencePreview } from '../components/google-ads/AudiencePreview'
import { EuPoliticalDeclaration } from '../components/google-ads/EuPoliticalDeclaration'
import { ConversionTracking } from '../components/google-ads/ConversionTracking'
import { dummyAccounts, locationSuggestions } from '../data/dummy'
import type {
  Campaign,
  CampaignDraft,
  ConversionTrackingConfig,
  EuPoliticalAdsStatus,
} from '../types'
import { useConnection } from '../context/ConnectionContext'
import { useToast } from '../context/ToastContext'

const BUDGET_MIN = 5
const BUDGET_MAX = 500
const BUDGET_DEFAULT = 15

function formatToday(): string {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function CreateCampaign() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const account = dummyAccounts.find((a) => a.id === id)
  const { addCampaign } = useConnection()
  const { showToast } = useToast()

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [locationInput, setLocationInput] = useState('')
  const [euDeclarationError, setEuDeclarationError] = useState(false)
  const [conversionError, setConversionError] = useState(false)
  const [step2Errors, setStep2Errors] = useState<{
    businessName?: boolean
    websiteUrl?: boolean
    headlines: [boolean, boolean, boolean]
    descriptions: [boolean, boolean]
  }>({ headlines: [false, false, false], descriptions: [false, false] })

  const [draft, setDraft] = useState<CampaignDraft>({
    goal: 'leads',
    dailyBudget: BUDGET_DEFAULT,
    businessName: account?.name ?? 'Hostinger Main Account',
    websiteUrl: 'yourdomain.com',
    headlines: [
      'Fast & Reliable Web Hosting',
      'Get Online in Minutes',
      'Free Domain Included',
    ],
    descriptions: [
      'Professional hosting with 99.9% uptime guarantee. Start your website today.',
      'Easy setup, powerful features. Perfect for small businesses and startups.',
    ],
    locations: ['United States'],
    language: 'English',
    euPoliticalAdsStatus: null,
    conversionTracking: null,
  })

  const campaignName = useMemo(
    () => `Lead Gen – ${account?.name ?? 'Account'} – ${formatToday()}`,
    [account]
  )

  if (!account) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Google Ads', to: '/marketing/google-ads' }, { label: 'Create campaign' }]} />
        <div className="bg-hpanel-surface border border-hpanel-border rounded-card p-10 text-center">
          <h2 className="text-lg font-semibold text-white">Account not found</h2>
          <Button className="mt-4" onClick={() => navigate('/marketing/google-ads')}>
            Back to accounts
          </Button>
        </div>
      </div>
    )
  }

  const setHeadline = (i: 0 | 1 | 2, v: string) => {
    setDraft((d) => ({
      ...d,
      headlines: [
        i === 0 ? v : d.headlines[0],
        i === 1 ? v : d.headlines[1],
        i === 2 ? v : d.headlines[2],
      ],
    }))
    if (v.trim()) {
      setStep2Errors((e) => {
        const next = [...e.headlines] as [boolean, boolean, boolean]
        next[i] = false
        return { ...e, headlines: next }
      })
    }
  }
  const setDescription = (i: 0 | 1, v: string) => {
    setDraft((d) => ({
      ...d,
      descriptions: [i === 0 ? v : d.descriptions[0], i === 1 ? v : d.descriptions[1]],
    }))
    if (v.trim()) {
      setStep2Errors((e) => {
        const next = [...e.descriptions] as [boolean, boolean]
        next[i] = false
        return { ...e, descriptions: next }
      })
    }
  }

  const continueFromBusiness = () => {
    const errs = {
      businessName: !draft.businessName.trim(),
      websiteUrl: !draft.websiteUrl.trim(),
      headlines: [
        !draft.headlines[0].trim(),
        !draft.headlines[1].trim(),
        !draft.headlines[2].trim(),
      ] as [boolean, boolean, boolean],
      descriptions: [
        !draft.descriptions[0].trim(),
        !draft.descriptions[1].trim(),
      ] as [boolean, boolean],
    }
    const hasError =
      errs.businessName ||
      errs.websiteUrl ||
      errs.headlines.some(Boolean) ||
      errs.descriptions.some(Boolean)
    if (hasError) {
      setStep2Errors(errs)
      return
    }
    setStep2Errors({ headlines: [false, false, false], descriptions: [false, false] })
    setStep(3)
  }

  const addLocation = (loc: string) => {
    setDraft((d) => (d.locations.includes(loc) ? d : { ...d, locations: [...d.locations, loc] }))
    setLocationInput('')
  }
  const removeLocation = (loc: string) =>
    setDraft((d) => ({ ...d, locations: d.locations.filter((x) => x !== loc) }))

  // Memoized so child components (ConversionTracking, EuPoliticalDeclaration)
  // can keep `onChange` in their effect dep arrays without re-firing every render.
  const handleConversionChange = useCallback((c: ConversionTrackingConfig) => {
    setDraft((d) => ({ ...d, conversionTracking: c }))
    setConversionError(false)
  }, [])
  const handleEuDeclarationChange = useCallback((s: EuPoliticalAdsStatus) => {
    setDraft((d) => ({ ...d, euPoliticalAdsStatus: s }))
    setEuDeclarationError(false)
  }, [])

  const goBack = () => {
    if (step === 1) {
      navigate(`/marketing/google-ads/accounts/${account.id}`)
    } else {
      setStep((s) => s - 1)
    }
  }

  const continueFromConversion = () => {
    const c = draft.conversionTracking
    const valid =
      !!c &&
      ((c.type === 'WEBPAGE' && !!c.eventName?.trim()) ||
        (c.type === 'CLICK_TO_CALL' && !!c.phoneNumber?.trim()))
    if (!valid) {
      setConversionError(true)
      return
    }
    setConversionError(false)
    setStep(4)
  }

  const createCampaign = async (asDraft: boolean) => {
    if (!draft.euPoliticalAdsStatus) {
      setEuDeclarationError(true)
      return
    }
    setEuDeclarationError(false)
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))

    // Demo error state via ?fail=1
    if (searchParams.get('fail') === '1') {
      setSubmitting(false)
      showToast('Campaign creation failed. Please try again.', 'danger')
      return
    }

    const newCampaign: Campaign = {
      id: `cmp-${Date.now()}`,
      name: campaignName,
      type: 'Performance Max',
      status: asDraft ? 'Draft' : 'Paused',
      dailyBudget: draft.dailyBudget,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      cost: 0,
      headlines: [...draft.headlines],
      descriptions: [...draft.descriptions],
      businessName: draft.businessName,
      websiteUrl: draft.websiteUrl,
      locations: [...draft.locations],
      language: draft.language,
      euPoliticalAdsStatus: draft.euPoliticalAdsStatus,
      conversionTracking: draft.conversionTracking ?? undefined,
      // Drafts stay local, no review yet. Submitted campaigns flow through
      // Google's policy review before they can serve.
      reviewStatus: asDraft ? undefined : 'UNDER_REVIEW',
    }
    addCampaign(account.id, newCampaign)
    setSubmitting(false)
    showToast(
      asDraft
        ? 'Campaign draft saved.'
        : 'Campaign sent to Google for review.',
      'success'
    )
    navigate(`/marketing/google-ads/accounts/${account.id}`)
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Google Ads', to: `/marketing/google-ads/accounts/${account.id}` },
          { label: 'Create Campaign' },
        ]}
      />

      <div className={step === 2 || step === 4 ? 'max-w-6xl mx-auto' : 'max-w-3xl mx-auto'}>
        {step === 1 && (
          <StepWizard
            step={1}
            totalSteps={5}
            title="Set your campaign goal"
            footer={
              <>
                <Button variant="secondary" onClick={goBack}>Back</Button>
                <Button onClick={() => setStep(2)}>Continue</Button>
              </>
            }
          >
            <Card className="border-hpanel-primary/40 bg-hpanel-primary-soft" padded={false}>
              <div className="p-5 flex items-start gap-3">
                <div className="h-10 w-10 rounded-card bg-hpanel-primary flex items-center justify-center text-white flex-shrink-0">
                  <Target size={20} aria-hidden />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-white">Generate leads for my website</h3>
                    <span className="text-xs text-hpanel-primary-hover bg-white/10 rounded-full px-2 py-0.5">Selected</span>
                  </div>
                  <p className="text-sm text-hpanel-muted mt-1">
                    Drive potential customers to contact you or sign up.
                  </p>
                </div>
              </div>
            </Card>

            <div className="mt-6">
              <div className="flex items-end justify-between mb-3">
                <label className="text-sm font-medium text-white">Daily budget</label>
                <span className="text-2xl font-semibold text-white tabular-nums">
                  ${draft.dailyBudget}
                  <span className="text-sm text-hpanel-muted font-normal"> / day</span>
                </span>
              </div>
              <Slider
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                value={draft.dailyBudget}
                onChange={(e) => setDraft({ ...draft, dailyBudget: Number(e.target.value) })}
              />
              <div className="flex justify-between text-xs text-hpanel-muted mt-2 tabular-nums">
                <span>${BUDGET_MIN}</span>
                <span>${BUDGET_MAX}</span>
              </div>
            </div>
          </StepWizard>
        )}

        {step === 2 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
          <StepWizard
            step={2}
            totalSteps={5}
            title="Tell us about your business"
            footer={
              <>
                <Button variant="secondary" onClick={goBack}>Back</Button>
                <Button onClick={continueFromBusiness}>Continue</Button>
              </>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Business name"
                value={draft.businessName}
                error={step2Errors.businessName ? 'Business name is required.' : undefined}
                onChange={(e) => {
                  setDraft({ ...draft, businessName: e.target.value })
                  if (e.target.value.trim()) setStep2Errors((er) => ({ ...er, businessName: false }))
                }}
              />
              <Input
                label="Website URL"
                value={draft.websiteUrl}
                error={step2Errors.websiteUrl ? 'Website URL is required.' : undefined}
                onChange={(e) => {
                  setDraft({ ...draft, websiteUrl: e.target.value })
                  if (e.target.value.trim()) setStep2Errors((er) => ({ ...er, websiteUrl: false }))
                }}
              />
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white mb-1">Headlines</h3>
              <p className="text-xs text-hpanel-muted mb-3">Short, catchy phrases that appear in your ads.</p>
              <div className="space-y-3">
                {([0, 1, 2] as const).map((i) => (
                  <Input
                    key={i}
                    label={`Headline ${i + 1}`}
                    value={draft.headlines[i]}
                    maxLength={30}
                    showCounter
                    error={step2Errors.headlines[i] ? 'This headline is required.' : undefined}
                    onChange={(e) => setHeadline(i, e.target.value)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white mb-1">Descriptions</h3>
              <p className="text-xs text-hpanel-muted mb-3">Tell people what makes your business unique.</p>
              <div className="space-y-3">
                {([0, 1] as const).map((i) => (
                  <Textarea
                    key={i}
                    label={`Description ${i + 1}`}
                    value={draft.descriptions[i]}
                    maxLength={90}
                    showCounter
                    rows={2}
                    error={step2Errors.descriptions[i] ? 'This description is required.' : undefined}
                    onChange={(e) => setDescription(i, e.target.value)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white mb-1">Images</h3>
              <p className="text-xs text-hpanel-muted mb-3">Add visuals to help your ads stand out. Demo only — no upload required.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <ImagePlaceholder ratio="1 : 1" label="Logo" />
                <ImagePlaceholder ratio="1.91 : 1" label="Landscape" />
                <ImagePlaceholder ratio="1 : 1" label="Square" />
              </div>
            </div>
          </StepWizard>
            </div>
            <AdPreview
              businessName={draft.businessName}
              websiteUrl={draft.websiteUrl}
              headlines={draft.headlines}
              descriptions={draft.descriptions}
            />
          </div>
        )}

        {step === 3 && (
          <StepWizard
            step={3}
            totalSteps={5}
            title="Set up conversion tracking"
            footer={
              <>
                <Button variant="secondary" onClick={goBack}>Back</Button>
                <Button onClick={() => continueFromConversion()}>Continue</Button>
              </>
            }
          >
            <p className="text-sm text-hpanel-muted mb-5">
              Pick at least one way Google should measure success. Without conversion tracking, your campaign can't optimize for leads.
            </p>
            <ConversionTracking
              value={draft.conversionTracking}
              onChange={handleConversionChange}
              error={conversionError}
            />
          </StepWizard>
        )}

        {step === 4 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
          <StepWizard
            step={4}
            totalSteps={5}
            title="Who should see your ads?"
            footer={
              <>
                <Button variant="secondary" onClick={goBack}>Back</Button>
                <Button onClick={() => setStep(5)}>Continue</Button>
              </>
            }
          >
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Locations</h3>
              <p className="text-xs text-hpanel-muted mb-3">Choose where your ads will appear.</p>
              <Input
                placeholder="Search for a country, city, or region…"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {draft.locations.map((loc) => (
                  <Chip key={loc} onRemove={() => removeLocation(loc)}>
                    {loc}
                  </Chip>
                ))}
              </div>
              <div className="mt-4">
                <div className="text-xs text-hpanel-muted mb-2">Suggestions</div>
                <div className="flex flex-wrap gap-2">
                  {locationSuggestions
                    .filter((s) => !draft.locations.includes(s))
                    .map((s) => (
                      <Chip key={s} variant="suggestion" onClick={() => addLocation(s)}>
                        + {s}
                      </Chip>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-6 max-w-xs">
              <Select
                label="Language"
                value={draft.language}
                onChange={(e) => setDraft({ ...draft, language: e.target.value })}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>German</option>
                <option>French</option>
                <option>Portuguese</option>
              </Select>
            </div>

          </StepWizard>
            </div>
            <AudiencePreview
              locations={draft.locations}
              language={draft.language}
            />
          </div>
        )}

        {step === 5 && (
          <StepWizard
            step={5}
            totalSteps={5}
            title="Review your campaign"
            footer={
              <>
                <Button variant="secondary" onClick={goBack} disabled={submitting}>Back</Button>
                <Button variant="secondary" onClick={() => createCampaign(true)} loading={submitting}>
                  Save as draft
                </Button>
                <Button onClick={() => createCampaign(false)} loading={submitting}>
                  Create campaign
                </Button>
              </>
            }
          >
            <ReviewSummary campaignName={campaignName} draft={draft} />

            <div className="mt-5 rounded-card border border-hpanel-primary/30 bg-hpanel-primary-soft p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-hpanel-primary-hover mt-0.5 flex-shrink-0" aria-hidden />
                <div className="text-sm">
                  <div className="text-white font-medium">Google will review your campaign before it can run</div>
                  <p className="text-hpanel-muted text-xs mt-1.5">
                    Most campaigns are reviewed within one business day. Google checks your headlines, descriptions, destination URL, and any images or video against its policies. Once approved, your ad goes live automatically — no further action needed from you.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-card border border-hpanel-border bg-hpanel-bg/60 p-4">
              <div className="flex items-start gap-3">
                <CreditCard size={18} className="text-hpanel-muted mt-0.5 flex-shrink-0" aria-hidden />
                <div className="text-sm">
                  <div className="text-white font-medium">Ad spend and payment settings</div>
                  <p className="text-hpanel-muted text-xs mt-0.5">
                    Billing, payment methods, and invoices are managed directly in your Google Ads account. Hostinger doesn't charge you for ad spend.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <EuPoliticalDeclaration
                value={draft.euPoliticalAdsStatus}
                onChange={handleEuDeclarationChange}
                error={euDeclarationError}
              />
            </div>
          </StepWizard>
        )}
      </div>
    </div>
  )
}

function ImagePlaceholder({ ratio, label }: { ratio: string; label: string }) {
  return (
    <div className="aspect-video bg-hpanel-bg border-2 border-dashed border-hpanel-border-strong rounded-card flex flex-col items-center justify-center text-center p-4 hover:border-hpanel-primary/50 transition cursor-pointer">
      <ImageIcon size={24} className="text-hpanel-muted-strong" aria-hidden />
      <div className="text-sm font-medium text-white mt-2">{label}</div>
      <div className="text-xs text-hpanel-muted">{ratio} ratio</div>
    </div>
  )
}
