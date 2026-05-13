/**
 * Curated lists for the Create-Ads-Account wizard. Real Google Ads supports
 * 100+ countries / TZs / currencies; we ship the most common ones for the
 * V1 demo. Each country has a suggested time zone + currency that the wizard
 * auto-fills when the user picks the country (override still allowed).
 */

export interface CountryOption {
  code: string
  name: string
  suggestedTimeZone: string
  suggestedCurrency: string
}

export const countryOptions: CountryOption[] = [
  { code: 'US', name: 'United States', suggestedTimeZone: 'America/New_York', suggestedCurrency: 'USD' },
  { code: 'GB', name: 'United Kingdom', suggestedTimeZone: 'Europe/London', suggestedCurrency: 'GBP' },
  { code: 'DE', name: 'Germany', suggestedTimeZone: 'Europe/Berlin', suggestedCurrency: 'EUR' },
  { code: 'FR', name: 'France', suggestedTimeZone: 'Europe/Paris', suggestedCurrency: 'EUR' },
  { code: 'IT', name: 'Italy', suggestedTimeZone: 'Europe/Rome', suggestedCurrency: 'EUR' },
  { code: 'ES', name: 'Spain', suggestedTimeZone: 'Europe/Madrid', suggestedCurrency: 'EUR' },
  { code: 'NL', name: 'Netherlands', suggestedTimeZone: 'Europe/Amsterdam', suggestedCurrency: 'EUR' },
  { code: 'PL', name: 'Poland', suggestedTimeZone: 'Europe/Warsaw', suggestedCurrency: 'PLN' },
  { code: 'LT', name: 'Lithuania', suggestedTimeZone: 'Europe/Vilnius', suggestedCurrency: 'EUR' },
  { code: 'CA', name: 'Canada', suggestedTimeZone: 'America/Toronto', suggestedCurrency: 'CAD' },
  { code: 'MX', name: 'Mexico', suggestedTimeZone: 'America/Mexico_City', suggestedCurrency: 'MXN' },
  { code: 'BR', name: 'Brazil', suggestedTimeZone: 'America/Sao_Paulo', suggestedCurrency: 'BRL' },
  { code: 'AU', name: 'Australia', suggestedTimeZone: 'Australia/Sydney', suggestedCurrency: 'AUD' },
  { code: 'NZ', name: 'New Zealand', suggestedTimeZone: 'Pacific/Auckland', suggestedCurrency: 'NZD' },
  { code: 'IN', name: 'India', suggestedTimeZone: 'Asia/Kolkata', suggestedCurrency: 'INR' },
  { code: 'JP', name: 'Japan', suggestedTimeZone: 'Asia/Tokyo', suggestedCurrency: 'JPY' },
  { code: 'SG', name: 'Singapore', suggestedTimeZone: 'Asia/Singapore', suggestedCurrency: 'SGD' },
]

/** Friendly TZ list grouped by region. */
export const timeZoneOptions: string[] = [
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Toronto',
  'America/Mexico_City',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Amsterdam',
  'Europe/Warsaw',
  'Europe/Vilnius',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
]

export const currencyOptions: string[] = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'NZD',
  'MXN',
  'BRL',
  'INR',
  'JPY',
  'PLN',
  'SGD',
]
