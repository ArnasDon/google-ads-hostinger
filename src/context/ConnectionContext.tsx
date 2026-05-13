import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { dummyCampaigns, PRIMARY_ACCOUNT_ID } from '../data/dummy'
import type { AccountSettings, Campaign, CampaignStatus } from '../types'

export type ConnectPhase = 'idle' | 'authorizing' | 'creating' | 'linking-mcc' | 'fetching'

interface ConnectionContextValue {
  isConnected: boolean
  isConnecting: boolean
  /** Sub-stage of the connect flow — drives the loader label so users see
   *  what's happening rather than a generic spinner. */
  connectPhase: ConnectPhase
  isNewUser: boolean
  /** Google account that was authorized — every Ads account on the workspace
   *  is mapped to this email per the OAuth scope. */
  googleAccountEmail: string | null
  /** Settings the user picked during account creation (country, time zone,
   *  currency). null for existing users; populated after the setup wizard. */
  accountSettings: AccountSettings | null
  /** True while we're waiting on the new-user to finish the Create-Ads-Account
   *  wizard (between OAuth Allow and the simulated CustomerService creation). */
  setupPending: boolean
  /** Whether the user has finished the billing-setup step inside Google Ads
   *  (payment method + invitation acceptance). Real implementations track this
   *  via the GAFE return state; existing users start `true`, new users `false`. */
  billingSetupCompleted: boolean
  /** Demo-only suspension flag for the primary account. When true, campaigns
   *  are blocked from serving and the appeal CTA is surfaced. */
  accountSuspended: boolean
  /** Whether the Google Tag (gtag.js global snippet) has been installed on
   *  the user's Hostinger site. One-time, site-wide — once installed, every
   *  conversion action on the account fires through it. */
  googleTagDeployed: boolean
  creditBannerDismissed: boolean
  authCancelled: boolean
  connect: (isNewUser: boolean) => Promise<void>
  cancelAuth: () => void
  dismissCancelled: () => void
  dismissCreditBanner: () => void
  /** Offboards the user: unlinks the Ads account from Hostinger and from the
   *  Hostinger MCC, resets the in-memory campaign state, returns to landing. */
  disconnect: () => void
  campaignsByAccount: Record<string, Campaign[]>
  addCampaign: (accountId: string, campaign: Campaign) => void
  updateCampaignStatus: (accountId: string, campaignId: string, status: CampaignStatus) => void
  updateCampaign: (accountId: string, campaignId: string, patch: Partial<Campaign>) => void
  approveReview: (accountId: string, campaignId: string) => void
  removeCampaign: (accountId: string, campaignId: string) => void
  completeBillingSetup: () => void
  setAccountSuspended: (suspended: boolean) => void
  /** Simulates running the Google Tag installer against the user's site —
   *  resolves after ~1.5s and flips `googleTagDeployed` to true. */
  deployGoogleTag: () => Promise<void>
  /** Called by the Create-Ads-Account wizard once the user picks
   *  country/TZ/currency and accepts ToS. Runs the simulated CustomerService
   *  create + MCC link, then finalises the connection. */
  finalizeAccountCreation: (settings: AccountSettings) => Promise<void>
  /** User backed out of the setup wizard — cancel the in-flight new-user flow
   *  and return them to the disconnected landing. */
  cancelAccountSetup: () => void
}

// Demo email — in production we'd read this from the OAuth `id_token` claims.
const DEMO_GOOGLE_EMAIL = 'you@gmail.com'

const ConnectionContext = createContext<ConnectionContextValue | null>(null)

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectPhase, setConnectPhase] = useState<ConnectPhase>('idle')
  const [isNewUser, setIsNewUser] = useState(false)
  const [googleAccountEmail, setGoogleAccountEmail] = useState<string | null>(null)
  const [accountSettings, setAccountSettings] = useState<AccountSettings | null>(null)
  const [setupPending, setSetupPending] = useState(false)
  const [billingSetupCompleted, setBillingSetupCompleted] = useState(false)
  const [accountSuspended, setAccountSuspended] = useState(false)
  const [googleTagDeployed, setGoogleTagDeployed] = useState(false)
  const [creditBannerDismissed, setCreditBannerDismissed] = useState(false)
  const [authCancelled, setAuthCancelled] = useState(false)
  const [campaignsByAccount, setCampaignsByAccount] = useState<Record<string, Campaign[]>>(dummyCampaigns)

  const connect = useCallback(async (newUser: boolean) => {
    setIsConnecting(true)
    setAuthCancelled(false)
    setConnectPhase('authorizing')
    await new Promise((resolve) => setTimeout(resolve, 700))

    if (newUser) {
      // OAuth is complete; account creation requires the user to pick a
      // billing country / time zone / currency + accept ToS first. Pause
      // here so the Create-Ads-Account wizard can collect those, then call
      // finalizeAccountCreation() to resume the flow.
      setGoogleAccountEmail(DEMO_GOOGLE_EMAIL)
      setSetupPending(true)
      setIsConnecting(false)
      setConnectPhase('idle')
      return
    }

    // Existing user: skip the wizard and pull their account directly.
    setConnectPhase('fetching')
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setBillingSetupCompleted(true)
    setGoogleTagDeployed(true)
    setIsNewUser(false)
    setGoogleAccountEmail(DEMO_GOOGLE_EMAIL)
    setCreditBannerDismissed(false)
    setIsConnected(true)
    setIsConnecting(false)
    setConnectPhase('idle')
  }, [])

  const finalizeAccountCreation = useCallback(async (settings: AccountSettings) => {
    setIsConnecting(true)
    setConnectPhase('creating')
    await new Promise((resolve) => setTimeout(resolve, 800))
    setConnectPhase('linking-mcc')
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Freshly created account has no campaigns yet.
    setCampaignsByAccount((prev) => ({ ...prev, [PRIMARY_ACCOUNT_ID]: [] }))
    setAccountSettings(settings)
    setBillingSetupCompleted(false)
    setGoogleTagDeployed(false)
    setIsNewUser(true)
    setCreditBannerDismissed(false)
    setIsConnected(true)
    setSetupPending(false)
    setIsConnecting(false)
    setConnectPhase('idle')
  }, [])

  const cancelAccountSetup = useCallback(() => {
    setSetupPending(false)
    setIsConnecting(false)
    setConnectPhase('idle')
    setGoogleAccountEmail(null)
  }, [])

  const dismissCreditBanner = useCallback(() => setCreditBannerDismissed(true), [])
  const completeBillingSetup = useCallback(() => setBillingSetupCompleted(true), [])

  const deployGoogleTag = useCallback(async () => {
    // Simulates the Hostinger-side gtag installer hitting the user's site.
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setGoogleTagDeployed(true)
  }, [])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setIsConnecting(false)
    setConnectPhase('idle')
    setIsNewUser(false)
    setGoogleAccountEmail(null)
    setAccountSettings(null)
    setSetupPending(false)
    setBillingSetupCompleted(false)
    setAccountSuspended(false)
    setGoogleTagDeployed(false)
    setCreditBannerDismissed(false)
    setAuthCancelled(false)
    // Restore seed campaigns so re-connecting as an existing user goes back
    // to the familiar starting state (mirrors what a fresh Google Ads fetch
    // would return).
    setCampaignsByAccount(dummyCampaigns)
  }, [])

  const cancelAuth = useCallback(() => {
    setIsConnecting(false)
    setConnectPhase('idle')
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

  // Real Google Ads sets status=REMOVED (soft delete, still queryable in
  // historical reports). The demo just drops it from the in-memory list —
  // we don't surface a "Removed" tab.
  const removeCampaign = useCallback((accountId: string, campaignId: string) => {
    setCampaignsByAccount((prev) => ({
      ...prev,
      [accountId]: (prev[accountId] ?? []).filter((c) => c.id !== campaignId),
    }))
  }, [])

  const value = useMemo<ConnectionContextValue>(
    () => ({
      isConnected,
      isConnecting,
      connectPhase,
      isNewUser,
      googleAccountEmail,
      accountSettings,
      setupPending,
      billingSetupCompleted,
      accountSuspended,
      googleTagDeployed,
      creditBannerDismissed,
      authCancelled,
      connect,
      cancelAuth,
      dismissCancelled,
      dismissCreditBanner,
      disconnect,
      campaignsByAccount,
      addCampaign,
      updateCampaignStatus,
      updateCampaign,
      approveReview,
      removeCampaign,
      completeBillingSetup,
      setAccountSuspended,
      deployGoogleTag,
      finalizeAccountCreation,
      cancelAccountSetup,
    }),
    [
      isConnected,
      isConnecting,
      connectPhase,
      isNewUser,
      googleAccountEmail,
      accountSettings,
      setupPending,
      billingSetupCompleted,
      accountSuspended,
      googleTagDeployed,
      creditBannerDismissed,
      authCancelled,
      connect,
      cancelAuth,
      dismissCancelled,
      dismissCreditBanner,
      disconnect,
      campaignsByAccount,
      addCampaign,
      updateCampaignStatus,
      updateCampaign,
      approveReview,
      removeCampaign,
      completeBillingSetup,
      setAccountSuspended,
      deployGoogleTag,
      finalizeAccountCreation,
      cancelAccountSetup,
    ]
  )

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>
}

export function useConnection() {
  const ctx = useContext(ConnectionContext)
  if (!ctx) throw new Error('useConnection must be used inside ConnectionProvider')
  return ctx
}
