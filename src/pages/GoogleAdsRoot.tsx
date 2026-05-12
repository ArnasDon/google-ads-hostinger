import { GoogleAdsLanding } from './GoogleAdsLanding'
import { GoogleAdsAccounts } from './GoogleAdsAccounts'
import { useConnection } from '../context/ConnectionContext'

export function GoogleAdsRoot() {
  const { isConnected } = useConnection()
  return isConnected ? <GoogleAdsAccounts /> : <GoogleAdsLanding />
}
