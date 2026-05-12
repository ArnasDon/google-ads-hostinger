import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
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
import { BudgetRecommendations } from '../components/google-ads/BudgetRecommendations'
import { AdPreview } from '../components/google-ads/AdPreview'
import { AudiencePreview } from '../components/google-ads/AudiencePreview'
import { dummyAccounts, estimateLeadsForBudget, getBudgetRecommendations } from '../data/dummy'
import type { Campaign, CampaignDraft } from '../types'
import { useConnection } from '../context/ConnectionContext'
import { useToast } from '../context/ToastContext'

const locationSuggestions = ['United Kingdom', 'Germany', 'Canada', 'Australia', 'France', 'Spain']
const BUDGET_MIN = 5
const BUDGET_MAX = 500
const BUDGET_DEFAULT = 15

function estimateLeads(budget: number): string {
  const { weeklyLeadsLow, weeklyLeadsHigh } = estimateLeadsForBudget(budget)
  return `${weeklyLeadsLow}–${weeklyLeadsHigh}`
}

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
  const [keywordInput, setKeywordInput] = useState('')
  const [locationInput, setLocationInput] = useState('')

  const recommendations = useMemo(() => getBudgetRecommendations(), [])

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
    keywords: ['web hosting', 'website builder', 'small business website'],
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
    const next = [...draft.headlines] as CampaignDraft['headlines']
    next[i] = v
    setDraft({ ...draft, headlines: next })
  }
  const setDescription = (i: 0 | 1, v: string) => {
    const next = [...draft.descriptions] as CampaignDraft['descriptions']
    next[i] = v
    setDraft({ ...draft, descriptions: next })
  }

  const addKeyword = () => {
    const k = keywordInput.trim().toLowerCase()
    if (!k || draft.keywords.includes(k)) return
    setDraft({ ...draft, keywords: [...draft.keywords, k] })
    setKeywordInput('')
  }
  const removeKeyword = (k: string) =>
    setDraft({ ...draft, keywords: draft.keywords.filter((x) => x !== k) })

  const addLocation = (loc: string) => {
    if (draft.locations.includes(loc)) return
    setDraft({ ...draft, locations: [...draft.locations, loc] })
    setLocationInput('')
  }
  const removeLocation = (loc: string) =>
    setDraft({ ...draft, locations: draft.locations.filter((x) => x !== loc) })

  const goBack = () => {
    if (step === 1) {
      navigate(`/marketing/google-ads/accounts/${account.id}`)
    } else {
      setStep((s) => s - 1)
    }
  }

  const createCampaign = async (asDraft: boolean) => {
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
      keywords: [...draft.keywords],
    }
    addCampaign(account.id, newCampaign)
    setSubmitting(false)
    showToast(
      asDraft ? 'Campaign draft saved.' : 'Campaign created in paused mode.',
      'success'
    )
    navigate(`/marketing/google-ads/accounts/${account.id}`)
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Google Ads', to: '/marketing/google-ads' },
          { label: account.name, to: `/marketing/google-ads/accounts/${account.id}` },
          { label: 'Create Campaign' },
        ]}
      />

      <div className={step === 2 || step === 3 ? 'max-w-6xl mx-auto' : 'max-w-3xl mx-auto'}>
        {step === 1 && (
          <StepWizard
            step={1}
            totalSteps={4}
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
                <div className="h-10 w-10 rounded-card bg-hpanel-primary flex items-center justify-center text-white flex-shrink-0 text-lg">🎯</div>
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
                <div>
                  <h3 className="text-sm font-semibold text-white">Pick a daily budget</h3>
                  <p className="text-xs text-hpanel-muted mt-0.5">
                    Google recommends three starting points based on industry averages.
                  </p>
                </div>
              </div>
              <BudgetRecommendations
                recommendations={recommendations}
                selectedBudget={draft.dailyBudget}
                onSelect={(b) => setDraft({ ...draft, dailyBudget: b })}
              />
            </div>

            <div className="mt-6">
              <div className="flex items-end justify-between mb-3">
                <label className="text-sm font-medium text-white">Or set a custom daily budget</label>
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
              <div className="mt-3 rounded-card border border-hpanel-border bg-hpanel-bg/60 p-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-base">📈</span>
                  <span className="text-white">
                    Estimated <span className="font-semibold">{estimateLeads(draft.dailyBudget)}</span> leads / week
                  </span>
                  <span className="text-hpanel-muted">·</span>
                  <span className="text-hpanel-muted">~{estimateLeadsForBudget(draft.dailyBudget).weeklyClicks.toLocaleString()} clicks</span>
                </div>
              </div>
            </div>
          </StepWizard>
        )}

        {step === 2 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
          <StepWizard
            step={2}
            totalSteps={4}
            title="Tell us about your business"
            footer={
              <>
                <Button variant="secondary" onClick={goBack}>Back</Button>
                <Button onClick={() => setStep(3)}>Continue</Button>
              </>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Business name"
                value={draft.businessName}
                onChange={(e) => setDraft({ ...draft, businessName: e.target.value })}
              />
              <Input
                label="Website URL"
                value={draft.websiteUrl}
                onChange={(e) => setDraft({ ...draft, websiteUrl: e.target.value })}
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
                    onChange={(e) => setDescription(i, e.target.value)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white mb-1">Images (optional)</h3>
              <p className="text-xs text-hpanel-muted mb-3">Add visuals to help your ads stand out. Demo only — no upload required.</p>
              <div className="grid grid-cols-2 gap-3">
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
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
          <StepWizard
            step={3}
            totalSteps={4}
            title="Who should see your ads?"
            footer={
              <>
                <Button variant="secondary" onClick={goBack}>Back</Button>
                <Button onClick={() => setStep(4)}>Continue</Button>
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

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-white">Audience signals</h3>
                <span className="text-xs text-hpanel-muted bg-white/5 rounded-full px-2 py-0.5">Optional</span>
              </div>
              <p className="text-xs text-hpanel-muted mb-3">
                Add keywords to help Google find people interested in your business. These are <em>hints</em> for optimization, not strict targeting.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a keyword"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addKeyword()
                    }
                  }}
                />
                <Button variant="secondary" onClick={addKeyword} className="flex-shrink-0">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {draft.keywords.map((k) => (
                  <Chip key={k} onRemove={() => removeKeyword(k)}>
                    {k}
                  </Chip>
                ))}
              </div>
            </div>
          </StepWizard>
            </div>
            <AudiencePreview
              businessName={draft.businessName}
              locations={draft.locations}
              language={draft.language}
              keywords={draft.keywords}
            />
          </div>
        )}

        {step === 4 && (
          <StepWizard
            step={4}
            totalSteps={4}
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
            <ReviewSummary
              campaignName={campaignName}
              draft={draft}
              estimatedLeads={estimateLeads(draft.dailyBudget)}
            />

            <div className="mt-5 rounded-card border border-hpanel-primary/30 bg-hpanel-primary-soft p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">⏸</span>
                <div className="text-sm">
                  <div className="text-white font-medium">Your campaign will start in paused mode.</div>
                  <p className="text-hpanel-muted text-xs mt-0.5">
                    Review it once more on the campaign details page, then activate when ready.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-card border border-hpanel-border bg-hpanel-bg/60 p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">💳</span>
                <div className="text-sm">
                  <div className="text-white font-medium">Ad spend and payment settings</div>
                  <p className="text-hpanel-muted text-xs mt-0.5">
                    Billing, payment methods, and invoices are managed directly in your Google Ads account. Hostinger doesn't charge you for ad spend.
                  </p>
                </div>
              </div>
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
      <span className="text-2xl">🖼️</span>
      <div className="text-sm font-medium text-white mt-2">{label}</div>
      <div className="text-xs text-hpanel-muted">{ratio} ratio</div>
    </div>
  )
}
