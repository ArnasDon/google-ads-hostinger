# Google Ads — Hostinger hPanel Demo

A clickable product-demo prototype of a **native Google Ads integration inside hPanel**. Built for stakeholder walkthroughs — there is no backend, no real OAuth, no real Google Ads API calls, and no money moves anywhere. Everything is dummy data held in local state.

## What's in the demo

1. **Disconnected landing** — "Grow your website with Google Ads" with three benefit cards and a primary CTA.
2. **Simulated Google OAuth modal** — permission list + Allow / Cancel. Cancel surfaces an inline cancelled-state alert.
3. **Connected accounts screen** — three dummy accounts with View campaigns / "+" actions.
4. **Account campaign list** — sortable-looking table with Active / Paused rows.
5. **Campaign details** — metric cards, performance chart (recharts), asset group, demo recommendations.
6–9. **Create campaign wizard** — 4-step Performance Max lead-gen flow (goal & budget → business info & assets → targeting → review). New campaigns default to **Paused**; "Save as draft" creates a **Draft** row.

Empty / error states covered:
- No accounts connected (landing screen)
- No campaigns in an account (inline empty state)
- Authorization cancelled (warning banner)
- Campaign creation failed (try `…/new-campaign?fail=1` on step 4)

## Stack

- Vite 5 + React 18 + TypeScript (strict)
- Tailwind CSS 3 with an hPanel-themed palette (`#673de6` purple, `#101011`/`#18181a` surfaces, DM Sans)
- `react-router-dom` v6
- `recharts` for the performance chart
- No backend, no auth, nothing persisted

## Develop locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run build
npm run preview
```

Build output lives in `dist/`. `public/.htaccess` is copied into `dist/` and provides SPA fallback + cache headers for Apache (Hostinger's default).

## Deploy to Hostinger via GitHub integration

Hostinger's **Git auto-deploy** clones a chosen branch directly into `public_html`. Since the source on `main` isn't browser-runnable, the CI workflow at `.github/workflows/deploy.yml` builds the project and force-pushes the contents of `dist/` to a separate **`deploy`** branch on every push to `main`.

Setup (one time):

1. Push the repo to GitHub (already done if you're reading this on github.com).
2. After the first successful Actions run, a `deploy` branch will exist with the built site at its root.
3. In hPanel → **Websites → your site → Advanced → Git**, connect this repository and select the **`deploy`** branch (not `main`).
4. Set the repository path to `/public_html` (or wherever the site should live).
5. Push to `main` — CI rebuilds → `deploy` updates → Hostinger pulls.

No FTP credentials or repo secrets needed beyond the default `GITHUB_TOKEN`.

## File layout

```
src/
  components/
    layout/        AppShell · Sidebar · TopBar
    ui/            Button · Card · Modal · Badge · Input · Textarea · Select · Slider · Chip · ProgressBar · Breadcrumbs
    google-ads/    AccountCard · CampaignTable · MetricCard · PerformanceChart · OAuthModal · StepWizard · ReviewSummary · AssetGroupCard · RecommendationsCard · GoogleLogo
  pages/           GoogleAdsRoot · GoogleAdsLanding · GoogleAdsAccounts · AccountCampaigns · CampaignDetails · CreateCampaign · StubPage
  context/         ConnectionContext · ToastContext
  data/dummy.ts    Dummy accounts, campaigns, and chart points
  types.ts
```

## Design tokens

Extracted from the real hPanel codebase so the look matches as closely as possible without depending on the private `@hostinger/hcomponents` Vue library:

| Token | Value |
|---|---|
| Primary | `#673de6` (hover `#7b66ff`) |
| Page bg | `#101011` |
| Card bg | `#18181a` |
| Border | `#222225` |
| Font | DM Sans |
| Card radius | 8px |

## Out of scope (intentionally)

- Real Google OAuth or Google Ads API calls
- Card / payment / invoice UI in Hostinger (billing lives in Google Ads)
- Image uploads (placeholders only)
- Persistence (refresh resets state)
