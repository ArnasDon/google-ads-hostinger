export type CampaignStatus = 'Active' | 'Paused' | 'Draft'

export type AccountStatus = 'Active' | 'Inactive'

// Mirrors Google Ads EuPoliticalAdvertisingStatusEnum.EuPoliticalAdvertisingStatus
// https://developers.google.com/google-ads/api/reference/rpc/v23/EuPoliticalAdvertisingStatusEnum.EuPoliticalAdvertisingStatus
export type EuPoliticalAdsStatus =
  | 'CONTAINS_EU_POLITICAL_ADVERTISING'
  | 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING'

export interface Account {
  id: string
  name: string
  externalId: string
  status: AccountStatus
  activeCampaigns: number
  spend: number
  conversions: number
}

export interface Campaign {
  id: string
  name: string
  type: 'Search' | 'Display' | 'YouTube' | 'Performance Max'
  status: CampaignStatus
  dailyBudget: number
  impressions: number
  clicks: number
  conversions: number
  cost: number
  // Optional fields for created/draft campaigns
  headlines?: string[]
  descriptions?: string[]
  businessName?: string
  websiteUrl?: string
  locations?: string[]
  language?: string
  keywords?: string[]
  euPoliticalAdsStatus?: EuPoliticalAdsStatus
}

export interface CampaignDraft {
  goal: 'leads'
  dailyBudget: number
  businessName: string
  websiteUrl: string
  headlines: [string, string, string]
  descriptions: [string, string]
  locations: string[]
  language: string
  keywords: string[]
  euPoliticalAdsStatus: EuPoliticalAdsStatus | null
}

export interface ChartPoint {
  day: string
  clicks: number
  conversions: number
}

export type BudgetTier = 'conservative' | 'recommended' | 'aggressive'

export interface BudgetRecommendation {
  tier: BudgetTier
  dailyBudget: number
  weeklyImpressions: number
  weeklyClicks: number
  weeklyLeadsLow: number
  weeklyLeadsHigh: number
}
