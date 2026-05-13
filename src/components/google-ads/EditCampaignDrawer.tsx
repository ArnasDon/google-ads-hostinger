import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Slider } from '../ui/Slider'
import { Chip } from '../ui/Chip'
import { ConversionTracking } from './ConversionTracking'
import { EuPoliticalDeclaration } from './EuPoliticalDeclaration'
import type { Campaign, ConversionTrackingConfig, EuPoliticalAdsStatus } from '../../types'
import { useToast } from '../../context/ToastContext'

interface EditCampaignDrawerProps {
  open: boolean
  campaign: Campaign
  onClose: () => void
  onSave: (patch: Partial<Campaign>) => void
}

const locationSuggestions = ['United Kingdom', 'Germany', 'Canada', 'Australia', 'France', 'Spain']

export function EditCampaignDrawer({ open, campaign, onClose, onSave }: EditCampaignDrawerProps) {
  const { showToast } = useToast()
  const [name, setName] = useState(campaign.name)
  const [dailyBudget, setDailyBudget] = useState(campaign.dailyBudget)
  const [locations, setLocations] = useState<string[]>(campaign.locations ?? ['United States'])
  const [language, setLanguage] = useState(campaign.language ?? 'English')
  const [conversionTracking, setConversionTracking] = useState<ConversionTrackingConfig | null>(
    campaign.conversionTracking ?? null
  )
  const [euPoliticalAdsStatus, setEuPoliticalAdsStatus] = useState<EuPoliticalAdsStatus | null>(
    campaign.euPoliticalAdsStatus ?? null
  )
  const [errors, setErrors] = useState<{ name?: boolean; budget?: boolean; locations?: boolean; conversion?: boolean; eu?: boolean }>(
    {}
  )

  // Re-seed state when the drawer is reopened on a different campaign.
  useEffect(() => {
    if (!open) return
    setName(campaign.name)
    setDailyBudget(campaign.dailyBudget)
    setLocations(campaign.locations ?? ['United States'])
    setLanguage(campaign.language ?? 'English')
    setConversionTracking(campaign.conversionTracking ?? null)
    setEuPoliticalAdsStatus(campaign.euPoliticalAdsStatus ?? null)
    setErrors({})
  }, [open, campaign])

  const conversionValid = useMemo(() => {
    if (!conversionTracking) return false
    if (conversionTracking.type === 'WEBPAGE') return !!conversionTracking.eventName?.trim()
    return !!conversionTracking.phoneNumber?.trim()
  }, [conversionTracking])

  const handleSave = () => {
    const next: typeof errors = {}
    if (!name.trim()) next.name = true
    if (dailyBudget < 5 || dailyBudget > 500) next.budget = true
    if (locations.length === 0) next.locations = true
    if (!conversionValid) next.conversion = true
    if (!euPoliticalAdsStatus) next.eu = true
    if (Object.keys(next).length) {
      setErrors(next)
      showToast("Some required fields need attention", 'warning')
      return
    }
    onSave({
      name: name.trim(),
      dailyBudget,
      locations,
      language,
      conversionTracking: conversionTracking ?? undefined,
      euPoliticalAdsStatus: euPoliticalAdsStatus ?? undefined,
    })
    showToast('Campaign settings updated', 'success')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      <div className="flex items-center justify-between border-b border-hpanel-border p-5">
        <div>
          <h2 className="text-base font-semibold text-white">Edit campaign settings</h2>
          <p className="text-xs text-hpanel-muted mt-0.5">
            Changes apply immediately. Only V1-required fields are editable.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-hpanel-muted hover:text-white"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
        <Section title="Basic">
          <Input
            label="Campaign name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setErrors((er) => ({ ...er, name: false }))
            }}
            error={errors.name ? 'Required' : undefined}
          />

          <div className="mt-4">
            <div className="flex items-end justify-between mb-2">
              <label className="text-sm font-medium text-white">Daily budget</label>
              <span className="text-xl font-semibold text-white tabular-nums">
                ${dailyBudget}
                <span className="text-sm text-hpanel-muted font-normal"> / day</span>
              </span>
            </div>
            <Slider
              min={5}
              max={500}
              value={dailyBudget}
              onChange={(e) => {
                setDailyBudget(Number(e.target.value))
                setErrors((er) => ({ ...er, budget: false }))
              }}
            />
            <div className="flex justify-between text-xs text-hpanel-muted mt-1 tabular-nums">
              <span>$5</span>
              <span>$500</span>
            </div>
            {errors.budget && (
              <p className="mt-1 text-xs text-hpanel-danger">Budget must be between $5 and $500.</p>
            )}
          </div>
        </Section>

        <Section title="Targeting">
          <div>
            <label className="text-sm font-medium text-white mb-1.5 block">Locations</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {locations.map((l) => (
                <Chip
                  key={l}
                  onRemove={() =>
                    setLocations((prev) => {
                      const next = prev.filter((x) => x !== l)
                      if (next.length) setErrors((er) => ({ ...er, locations: false }))
                      return next
                    })
                  }
                >
                  {l}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {locationSuggestions
                .filter((s) => !locations.includes(s))
                .map((s) => (
                  <Chip
                    key={s}
                    variant="suggestion"
                    onClick={() => {
                      setLocations((prev) => [...prev, s])
                      setErrors((er) => ({ ...er, locations: false }))
                    }}
                  >
                    + {s}
                  </Chip>
                ))}
            </div>
            {errors.locations && (
              <p className="mt-2 text-xs text-hpanel-danger">Add at least one location.</p>
            )}
          </div>

          <div className="mt-4 max-w-xs">
            <Select label="Language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>English</option>
              <option>Spanish</option>
              <option>German</option>
              <option>French</option>
              <option>Portuguese</option>
            </Select>
          </div>
        </Section>

        <Section title="Conversion tracking">
          <ConversionTracking
            value={conversionTracking}
            onChange={(c) => {
              setConversionTracking(c)
              setErrors((er) => ({ ...er, conversion: false }))
            }}
            error={errors.conversion}
          />
        </Section>

        <Section title="Declarations">
          <EuPoliticalDeclaration
            value={euPoliticalAdsStatus}
            onChange={(s) => {
              setEuPoliticalAdsStatus(s)
              setErrors((er) => ({ ...er, eu: false }))
            }}
            error={errors.eu}
          />
        </Section>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-hpanel-border p-4">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save changes</Button>
      </div>
    </Modal>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wider text-hpanel-muted-strong font-medium mb-3">{title}</h3>
      {children}
    </div>
  )
}
