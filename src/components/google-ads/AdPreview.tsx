import { useEffect, useState } from 'react'

type Surface = 'search' | 'display' | 'youtube'

interface AdPreviewProps {
  businessName: string
  websiteUrl: string
  headlines: string[]
  descriptions: string[]
}

const surfaceLabels: Record<Surface, string> = {
  search: 'Search',
  display: 'Display',
  youtube: 'YouTube',
}

export function AdPreview({ businessName, websiteUrl, headlines, descriptions }: AdPreviewProps) {
  const [surface, setSurface] = useState<Surface>('search')
  const [variantIndex, setVariantIndex] = useState(0)

  // Performance Max rotates headlines/descriptions — auto-cycle every few seconds so
  // stakeholders see the mix without manual interaction.
  useEffect(() => {
    const id = setInterval(() => setVariantIndex((i) => i + 1), 3500)
    return () => clearInterval(id)
  }, [])

  const nonEmptyHeadlines = headlines.filter((h) => h.trim().length > 0)
  const nonEmptyDescriptions = descriptions.filter((d) => d.trim().length > 0)
  const headline = nonEmptyHeadlines.length
    ? nonEmptyHeadlines[variantIndex % nonEmptyHeadlines.length]
    : 'Your headline here'
  const description = nonEmptyDescriptions.length
    ? nonEmptyDescriptions[variantIndex % nonEmptyDescriptions.length]
    : 'Your description here'
  const cleanUrl = (websiteUrl || 'yourdomain.com').replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <div className="lg:sticky lg:top-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Ad preview</h3>
        <span className="text-xs text-hpanel-muted">Updates as you type</span>
      </div>

      <div className="flex items-center gap-1 p-1 bg-hpanel-bg/60 border border-hpanel-border rounded-card mb-3">
        {(['search', 'display', 'youtube'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSurface(s)}
            className={[
              'flex-1 h-8 text-xs font-medium rounded-[6px] transition',
              surface === s ? 'bg-hpanel-primary text-white' : 'text-hpanel-muted hover:text-white',
            ].join(' ')}
          >
            {surfaceLabels[s]}
          </button>
        ))}
      </div>

      {surface === 'search' && (
        <SearchAdMock businessName={businessName} cleanUrl={cleanUrl} headline={headline} description={description} />
      )}
      {surface === 'display' && (
        <DisplayAdMock businessName={businessName} cleanUrl={cleanUrl} headline={headline} description={description} />
      )}
      {surface === 'youtube' && (
        <YouTubeAdMock businessName={businessName} cleanUrl={cleanUrl} headline={headline} description={description} />
      )}

      {nonEmptyHeadlines.length > 1 && (
        <p className="mt-3 text-xs text-hpanel-muted-strong text-center">
          Variation {(variantIndex % nonEmptyHeadlines.length) + 1} of {nonEmptyHeadlines.length} · Google rotates these to find the best mix
        </p>
      )}
    </div>
  )
}

function AdLabel() {
  return (
    <span className="inline-flex items-center rounded-sm border border-hpanel-success/40 bg-hpanel-success/10 px-1 text-[10px] font-semibold uppercase tracking-wider text-hpanel-success">
      Ad
    </span>
  )
}

function SearchAdMock({
  businessName,
  cleanUrl,
  headline,
  description,
}: {
  businessName: string
  cleanUrl: string
  headline: string
  description: string
}) {
  return (
    <div className="bg-white rounded-card p-4 text-black">
      <div className="flex items-center gap-2 mb-1">
        <AdLabel />
        <span className="text-xs text-gray-600">·</span>
        <span className="text-xs text-gray-800 truncate">{cleanUrl}</span>
      </div>
      <div className="text-xs text-gray-700 mb-1 truncate">{businessName || 'Your business'}</div>
      <a className="text-[#1a0dab] text-lg leading-snug hover:underline cursor-pointer block">{headline}</a>
      <p className="text-sm text-gray-700 mt-1 line-clamp-2">{description}</p>
    </div>
  )
}

function DisplayAdMock({
  businessName,
  cleanUrl,
  headline,
  description,
}: {
  businessName: string
  cleanUrl: string
  headline: string
  description: string
}) {
  return (
    <div className="bg-white rounded-card overflow-hidden text-black border border-gray-200">
      <div className="aspect-video bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center text-3xl">
        🖼️
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <AdLabel />
          <span className="text-[10px] text-gray-500 truncate">{cleanUrl}</span>
        </div>
        <div className="text-sm font-semibold text-gray-900 line-clamp-2">{headline}</div>
        <div className="text-xs text-gray-600 mt-1 line-clamp-2">{description}</div>
        <button className="mt-3 w-full bg-[#1a73e8] text-white text-sm font-medium rounded-md py-1.5">
          Visit {businessName || 'site'}
        </button>
      </div>
    </div>
  )
}

function YouTubeAdMock({
  businessName,
  cleanUrl,
  headline,
  description,
}: {
  businessName: string
  cleanUrl: string
  headline: string
  description: string
}) {
  return (
    <div className="rounded-card overflow-hidden bg-[#0f0f0f] border border-hpanel-border">
      <div className="aspect-video bg-black relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-transparent to-orange-900/40" />
        <div className="relative z-10 h-14 w-14 rounded-full bg-white/90 flex items-center justify-center text-2xl text-black">
          ▶
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="rounded-sm bg-yellow-400 px-1.5 py-0.5 text-[10px] font-semibold text-black">Ad</span>
          <span className="rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] text-white">Skip ad in 5</span>
        </div>
      </div>
      <div className="p-3 flex gap-3 items-start">
        <div className="h-9 w-9 rounded-full bg-hpanel-primary flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm">
          {(businessName || 'Y')[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-white line-clamp-2">{headline}</div>
          <div className="text-xs text-gray-400 mt-0.5 truncate">{businessName || 'Your business'} · {cleanUrl}</div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{description}</div>
        </div>
      </div>
    </div>
  )
}
