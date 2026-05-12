import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { GoogleAdsRoot } from './pages/GoogleAdsRoot'
import { AccountCampaigns } from './pages/AccountCampaigns'
import { CampaignDetails } from './pages/CampaignDetails'
import { CreateCampaign } from './pages/CreateCampaign'
import { StubPage } from './pages/StubPage'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/marketing/google-ads" replace />} />
        <Route path="/marketing" element={<Navigate to="/marketing/google-ads" replace />} />
        <Route path="/marketing/google-ads" element={<GoogleAdsRoot />} />
        <Route path="/marketing/google-ads/accounts/:id" element={<AccountCampaigns />} />
        <Route path="/marketing/google-ads/accounts/:id/campaigns/:campaignId" element={<CampaignDetails />} />
        <Route path="/marketing/google-ads/accounts/:id/new-campaign" element={<CreateCampaign />} />

        <Route path="/dashboard" element={<StubPage title="Dashboard" />} />
        <Route path="/websites" element={<StubPage title="Websites" />} />
        <Route path="/hosting" element={<StubPage title="Hosting" />} />
        <Route path="/billing" element={<StubPage title="Billing" description="Payment methods and invoices for your Hostinger services." />} />
        <Route path="/settings" element={<StubPage title="Settings" />} />
        <Route path="/help" element={<StubPage title="Help" description="Browse the knowledge base or open a support ticket." />} />

        <Route path="*" element={<StubPage title="Not found" description="That page doesn't exist in this demo." />} />
      </Routes>
    </AppShell>
  )
}
