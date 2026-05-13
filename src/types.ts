export type CampaignStatus = 'Active' | 'Paused' | 'Draft'

export type AccountStatus = 'Active' | 'Inactive'

// Mirrors Google Ads EuPoliticalAdvertisingStatusEnum.EuPoliticalAdvertisingStatus
// https://developers.google.com/google-ads/api/reference/rpc/v23/EuPoliticalAdvertisingStatusEnum.EuPoliticalAdvertisingStatus
export type EuPoliticalAdsStatus =
  | 'CONTAINS_EU_POLITICAL_ADVERTISING'
  | 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING'

// Mirrors Google Ads ConversionActionTypeEnum (subset). V1 supports at least
// one type per the feature spec — website page-load or phone call.
export type ConversionType = 'WEBPAGE' | 'CLICK_TO_CALL'

export interface ConversionTrackingConfig {
  type: ConversionType
  /** For WEBPAGE — short slug e.g. "lead_form_submit". */
  eventName?: string
  /** For CLICK_TO_CALL — phone number to attribute. */
  phoneNumber?: string
  /** For CLICK_TO_CALL — call must last this many seconds to count as a conversion. */
  minDurationSeconds?: number
}

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
  euPoliticalAdsStatus?: EuPoliticalAdsStatus
  conversionTracking?: ConversionTrackingConfig
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
  euPoliticalAdsStatus: EuPoliticalAdsStatus | null
  conversionTracking: ConversionTrackingConfig | null
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
