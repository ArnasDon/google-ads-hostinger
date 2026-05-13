import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { dummyCampaigns, PRIMARY_ACCOUNT_ID } from '../data/dummy'
import type { Campaign, CampaignStatus } from '../types'

interface ConnectionContextValue {
  isConnected: boolean
  isConnecting: boolean
  isNewUser: boolean
  creditBannerDismissed: boolean
  authCancelled: boolean
  connect: (isNewUser: boolean) => Promise<void>
  cancelAuth: () => void
  dismissCancelled: () => void
  dismissCreditBanner: () => void
  campaignsByAccount: Record<string, Campaign[]>
  addCampaign: (accountId: string, campaign: Campaign) => void
  updateCampaignStatus: (accountId: string, campaignId: string, status: CampaignStatus) => void
  updateCampaign: (accountId: string, campaignId: string, patch: Partial<Campaign>) => void
  approveReview: (accountId: string, campaignId: string) => void
}

const ConnectionContext = createContext<ConnectionContextValue | null>(null)

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [creditBannerDismissed, setCreditBannerDismissed] = useState(false)
  const [authCancelled, setAuthCancelled] = useState(false)
  const [campaignsByAccount, setCampaignsByAccount] = useState<Record<string, Campaign[]>>(dummyCampaigns)

  const connect = useCallback(async (newUser: boolean) => {
    setIsConnecting(true)
    setAuthCancelled(false)
    // New users wait ~2s while we "create" their Google Ads account (mirroring
    // CustomerService.CreateCustomerClient); existing users get a faster
    // ListAccessibleCustomers-style fetch.
    await new Promise((resolve) => setTimeout(resolve, newUser ? 2000 : 1200))
    if (newUser) {
      // Freshly created account has no campaigns yet.
      setCampaignsByAccount((prev) => ({ ...prev, [PRIMARY_ACCOUNT_ID]: [] }))
    }
    setIsNewUser(newUser)
    setCreditBannerDismissed(false)
    setIsConnected(true)
    setIsConnecting(false)
  }, [])

  const dismissCreditBanner = useCallback(() => setCreditBannerDismissed(true), [])

  const cancelAuth = useCallback(() => {
    setIsConnecting(false)
    setAuthCancelled(true)
  }, [])

  const dismissCancelled = useCallback(() => setAuthCancelled(false), [])

  const addCampaign = useCallback((accountId: string, campaign: Campaign) => {
    setCampaignsByAccount((prev) => ({
      ...prev,
      [accountId]: [...(prev[accountId] ?? []), campaign],
    }))
  }, [])

  const updateCampaignStatus = useCallback(
    (accountId: string, campaignId: string, status: CampaignStatus) => {
      setCampaignsByAccount((prev) => ({
        ...prev,
        [accountId]: (prev[accountId] ?? []).map((c) =>
          c.id === campaignId ? { ...c, status } : c
        ),
      }))
    },
    []
  )

  const updateCampaign = useCallback(
    (accountId: string, campaignId: string, patch: Partial<Campaign>) => {
      setCampaignsByAccount((prev) => ({
        ...prev,
        [accountId]: (prev[accountId] ?? []).map((c) =>
          c.id === campaignId ? { ...c, ...patch } : c
        ),
      }))
    },
    []
  )

  // Demo helper — flips an under-review campaign to APPROVED, simulating
  // Google's async review completing. In real Google Ads this transition is
  // server-side; the UI just reflects whatever PolicyApprovalStatus the API
  // returns on the next campaign fetch.
  const approveReview = useCallback((accountId: string, campaignId: string) => {
    setCampaignsByAccount((prev) => ({
      ...prev,
      [accountId]: (prev[accountId] ?? []).map((c) =>
        c.id === campaignId ? { ...c, reviewStatus: 'APPROVED' } : c
      ),
    }))
  }, [])

  const value = useMemo<ConnectionContextValue>(
    () => ({
      isConnected,
      isConnecting,
      isNewUser,
      creditBannerDismissed,
      authCancelled,
      connect,
      cancelAuth,
      dismissCancelled,
      dismissCreditBanner,
      campaignsByAccount,
      addCampaign,
      updateCampaignStatus,
      updateCampaign,
      approveReview,
    }),
    [
      isConnected,
      isConnecting,
      isNewUser,
      creditBannerDismissed,
      authCancelled,
      connect,
      cancelAuth,
      dismissCancelled,
      dismissCreditBanner,
      campaignsByAccount,
      addCampaign,
      updateCampaignStatus,
      updateCampaign,
      approveReview,
    ]
  )

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>
}

export function useConnection() {
  const ctx = useContext(ConnectionContext)
  if (!ctx) throw new Error('useConnection must be used inside ConnectionProvider')
  return ctx
}
