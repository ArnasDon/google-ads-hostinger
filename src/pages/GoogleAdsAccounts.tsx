import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { AccountCard } from '../components/google-ads/AccountCard'
import { CreditBanner } from '../components/google-ads/CreditBanner'
import { useConnection } from '../context/ConnectionContext'
import { dummyAccounts } from '../data/dummy'

export function GoogleAdsAccounts() {
  const { isNewUser, creditBannerDismissed, dismissCreditBanner } = useConnection()
  const showBanner = isNewUser && !creditBannerDismissed

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Marketing', to: '/marketing/google-ads' }, { label: 'Google Ads' }]} />

      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Google Ads Accounts</h1>
          <p className="text-sm text-hpanel-muted mt-1">Manage your connected accounts and their campaigns.</p>
        </div>
      </div>

      {showBanner && <CreditBanner onDismiss={dismissCreditBanner} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dummyAccounts.map((acc) => (
          <AccountCard key={acc.id} account={acc} />
        ))}
      </div>
    </div>
  )
}
