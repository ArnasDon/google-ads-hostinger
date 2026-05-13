import type { Account, Campaign, ChartPoint } from '../types'

// V1 model: one user → one Google Ads account. The OAuth flow either
// surfaces this existing account or simulates creating it for a new user.
// Multi-account (MCC / agency) support is intentionally out of scope.
export const PRIMARY_ACCOUNT_ID = 'acc-1'

// Suggested locations shown when picking targeting / editing the campaign.
// Kept in the data module so the wizard and edit drawer stay in sync.
export const locationSuggestions = [
  'United Kingdom',
  'Germany',
  'Canada',
  'Australia',
  'France',
  'Spain',
]

export const dummyAccounts: Account[] = [
  {
    id: PRIMARY_ACCOUNT_ID,
    name: 'Hostinger Main Account',
    externalId: '123-456-7890',
    status: 'Active',
    activeCampaigns: 3,
    spend: 1245,
    conversions: 142,
  },
]

// Seed campaigns are pre-populated with all V1-required fields (locations,
// language, conversion tracking, EU political ads declaration) so that the
// edit drawer doesn't pop validation errors on existing data.
const seededDefaults = {
  locations: ['United States'],
  language: 'English',
  euPoliticalAdsStatus: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING',
  conversionTracking: { type: 'WEBPAGE', eventName: 'lead_form_submit' },
} satisfies Partial<Campaign>

export const dummyCampaigns: Record<string, Campaign[]> = {
  'acc-1': [
    {
      id: 'cmp-1',
      name: 'Spring Sale 2026 – Search',
      type: 'Search',
      status: 'Active',
      dailyBudget: 50,
      impressions: 12480,
      clicks: 347,
      conversions: 28,
      cost: 84.2,
      headlines: [
        'Fast & Reliable Web Hosting',
        'Get Online in Minutes',
        'Free Domain Included',
      ],
      ...seededDefaults,
    },
    {
      id: 'cmp-2',
      name: 'Brand Awareness – Display',
      type: 'Display',
      status: 'Active',
      dailyBudget: 20,
      impressions: 45000,
      clicks: 120,
      conversions: 5,
      cost: 45.5,
      ...seededDefaults,
    },
    {
      id: 'cmp-3',
      name: 'Retargeting – YouTube',
      type: 'YouTube',
      status: 'Paused',
      dailyBudget: 15,
      impressions: 8900,
      clicks: 45,
      conversions: 2,
      cost: 12.8,
      ...seededDefaults,
    },
  ],
}

export const dummyChart: ChartPoint[] = [
  { day: 'Mon', clicks: 38, conversions: 3 },
  { day: 'Tue', clicks: 52, conversions: 4 },
  { day: 'Wed', clicks: 47, conversions: 4 },
  { day: 'Thu', clicks: 61, conversions: 5 },
  { day: 'Fri', clicks: 58, conversions: 4 },
  { day: 'Sat', clicks: 49, conversions: 4 },
  { day: 'Sun', clicks: 42, conversions: 4 },
]
