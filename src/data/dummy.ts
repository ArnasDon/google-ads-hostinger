import type { Account, BudgetRecommendation, Campaign, ChartPoint } from '../types'

// Mirrors Google Ads CampaignBudgetRecommendationService which returns
// 3 budget tiers each with projected impact metrics (impressions, clicks,
// conversions). Numbers are deterministic per budget so the demo stays
// realistic when stakeholders fiddle.
function projectImpact(dailyBudget: number) {
  const weeklyImpressions = Math.round(dailyBudget * 800)
  const weeklyClicks = Math.round(dailyBudget * 16)
  const weeklyLeadsLow = Math.round(dailyBudget * 1.5)
  const weeklyLeadsHigh = Math.round(dailyBudget * 2.6)
  return { weeklyImpressions, weeklyClicks, weeklyLeadsLow, weeklyLeadsHigh }
}

export function getBudgetRecommendations(): BudgetRecommendation[] {
  return (
    [
      { tier: 'conservative', dailyBudget: 5 },
      { tier: 'recommended', dailyBudget: 15 },
      { tier: 'aggressive', dailyBudget: 40 },
    ] as const
  ).map((r) => ({ ...r, ...projectImpact(r.dailyBudget) }))
}

export function estimateLeadsForBudget(dailyBudget: number) {
  return projectImpact(dailyBudget)
}


export const dummyAccounts: Account[] = [
  {
    id: 'acc-1',
    name: 'Hostinger Main Account',
    externalId: '123-456-7890',
    status: 'Active',
    activeCampaigns: 3,
    spend: 1245,
    conversions: 142,
  },
  {
    id: 'acc-2',
    name: 'Client A – E-commerce',
    externalId: '987-654-3210',
    status: 'Active',
    activeCampaigns: 1,
    spend: 450,
    conversions: 28,
  },
  {
    id: 'acc-3',
    name: 'Legacy Campaigns',
    externalId: '555-123-4567',
    status: 'Inactive',
    activeCampaigns: 0,
    spend: 0,
    conversions: 0,
  },
]

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
    },
  ],
  'acc-2': [
    {
      id: 'cmp-4',
      name: 'Holiday Promo – Performance Max',
      type: 'Performance Max',
      status: 'Active',
      dailyBudget: 30,
      impressions: 22000,
      clicks: 180,
      conversions: 12,
      cost: 62.4,
    },
  ],
  'acc-3': [],
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
