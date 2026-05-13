export type CampaignStatus = 'Active' | 'Paused' | 'Draft'

// Account-level operating state. `Suspended` mirrors Google Ads' policy
// suspension — campaigns can't serve until the user successfully appeals.
export type AccountStatus = 'Active' | 'Inactive' | 'Suspended'

/** Billing/locale settings the user picks when creating a new Google Ads
 *  account. In real Google Ads these are immutable post-creation. */
export interface AccountSettings {
  /** ISO 3166-1 alpha-2 country code, e.g. "US", "DE". */
  countryCode: string
  /** IANA time zone name, e.g. "America/New_York". */
  timeZone: string
  /** ISO 4217 currency code, e.g. "USD". */
  currency: string
}

// Mirrors Google Ads EuPoliticalAdvertisingStatusEnum.EuPoliticalAdvertisingStatus
// https://developers.google.com/google-ads/api/reference/rpc/v23/EuPoliticalAdvertisingStatusEnum.EuPoliticalAdvertisingStatus
export type EuPoliticalAdsStatus =
  | 'CONTAINS_EU_POLITICAL_ADVERTISING'
  | 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING'

// Mirrors Google Ads ConversionActionTypeEnum (subset). V1 supports at least
// one type per the feature spec — website page-load or phone call.
export type ConversionType = 'WEBPAGE' | 'CLICK_TO_CALL'

// Mirrors Google Ads PolicyApprovalStatus. The policy-review state for an ad
// is orthogonal to the user-controlled play/pause status: a campaign can be
// Paused & Approved, or Active & Under-review (in which case Google doesn't
// serve it yet). New and edited campaigns flow through UNDER_REVIEW until
// Google completes the review.
// https://developers.google.com/google-ads/api/reference/rpc/v21/PolicyApprovalStatusEnum.PolicyApprovalStatus
export type ReviewStatus = 'UNDER_REVIEW' | 'APPROVED' | 'APPROVED_LIMITED' | 'DISAPPROVED'

export interface ConversionTrackingConfig {
  type: ConversionType
  /** For WEBPAGE — short slug e.g. "lead_form_submit". */
  eventName?: string
  /** For WEBPAGE — destination URL Google Ads uses to verify the conversion
   *  (the "thank-you" / success page the user lands on after submitting a
   *  form, completing a checkout, etc.). */
  successUrl?: string
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
  /** Policy review state. Defaults to APPROVED for seed campaigns; new and
   *  edited campaigns flip to UNDER_REVIEW until Google's review completes. */
  reviewStatus?: ReviewStatus
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
