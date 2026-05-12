import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { dummyCampaigns } from '../data/dummy'
import type { Campaign, CampaignStatus } from '../types'

interface ConnectionContextValue {
  isConnected: boolean
  isConnecting: boolean
  authCancelled: boolean
  connect: () => Promise<void>
  cancelAuth: () => void
  dismissCancelled: () => void
  campaignsByAccount: Record<string, Campaign[]>
  addCampaign: (accountId: string, campaign: Campaign) => void
  updateCampaignStatus: (accountId: string, campaignId: string, status: CampaignStatus) => void
}

const ConnectionContext = createContext<ConnectionContextValue | null>(null)

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [authCancelled, setAuthCancelled] = useState(false)
  const [campaignsByAccount, setCampaignsByAccount] = useState<Record<string, Campaign[]>>(dummyCampaigns)

  const connect = useCallback(async () => {
    setIsConnecting(true)
    setAuthCancelled(false)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsConnected(true)
    setIsConnecting(false)
  }, [])

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

  const value = useMemo<ConnectionContextValue>(
    () => ({
      isConnected,
      isConnecting,
      authCancelled,
      connect,
      cancelAuth,
      dismissCancelled,
      campaignsByAccount,
      addCampaign,
      updateCampaignStatus,
    }),
    [
      isConnected,
      isConnecting,
      authCancelled,
      connect,
      cancelAuth,
      dismissCancelled,
      campaignsByAccount,
      addCampaign,
      updateCampaignStatus,
    ]
  )

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>
}

export function useConnection() {
  const ctx = useContext(ConnectionContext)
  if (!ctx) throw new Error('useConnection must be used inside ConnectionProvider')
  return ctx
}
