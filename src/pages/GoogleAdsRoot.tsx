import { Navigate } from 'react-router-dom'
import { GoogleAdsLanding } from './GoogleAdsLanding'
import { useConnection } from '../context/ConnectionContext'
import { PRIMARY_ACCOUNT_ID } from '../data/dummy'

// Single-account V1 model: when connected, jump straight to the user's
// one Google Ads account. No multi-account chooser.
export function GoogleAdsRoot() {
  const { isConnected } = useConnection()
  if (isConnected) {
    return <Navigate to={`/marketing/google-ads/accounts/${PRIMARY_ACCOUNT_ID}`} replace />
  }
  return <GoogleAdsLanding />
}
