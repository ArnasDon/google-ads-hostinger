interface AudiencePreviewProps {
  businessName: string
  locations: string[]
  language: string
  keywords: string[]
}

const flagByLocation: Record<string, string> = {
  'United States': '🇺🇸',
  'United Kingdom': '🇬🇧',
  Germany: '🇩🇪',
  Canada: '🇨🇦',
  Australia: '🇦🇺',
  France: '🇫🇷',
  Spain: '🇪🇸',
}

function flagFor(loc: string): string {
  return flagByLocation[loc] ?? '🌍'
}

// Dummy reach estimate: each country adds a base pool, keywords slightly narrow it
// to reflect "audience signals" being hints rather than strict filters.
function estimateReach(locations: string[], keywords: string[]): string {
  const base = locations.length * 220_000
  const narrow = Math.max(0.55, 1 - keywords.length * 0.05)
  const reach = Math.round(base * narrow)
  if (reach >= 1_000_000) return `${(reach / 1_000_000).toFixed(1)}M`
  if (reach >= 1_000) return `${Math.round(reach / 1_000)}K`
  return String(reach)
}

export function AudiencePreview({ businessName, locations, language, keywords }: AudiencePreviewProps) {
  const reach = estimateReach(locations, keywords)

  return (
    <div className="lg:sticky lg:top-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Who will see your ads</h3>
        <span className="text-xs text-hpanel-muted">Estimated</span>
      </div>

      <div className="bg-hpanel-bg/60 border border-hpanel-border rounded-card p-4 space-y-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-hpanel-muted-strong font-medium mb-1.5">
            Locations
          </div>
          {locations.length === 0 ? (
            <p className="text-xs text-hpanel-muted">Add a location to see who'll be reached.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {locations.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-hpanel-border-strong px-2.5 py-1 text-xs text-white"
                >
                  <span aria-hidden>{flagFor(loc)}</span>
                  {loc}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider text-hpanel-muted-strong font-medium mb-1.5">
            Language
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-hpanel-border-strong px-2.5 py-1 text-xs text-white">
            🌐 {language}
          </span>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider text-hpanel-muted-strong font-medium mb-1.5">
            Audience signals
          </div>
          {keywords.length === 0 ? (
            <p className="text-xs text-hpanel-muted italic">No signals yet — Google will optimize broadly.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((k) => (
                <span
                  key={k}
                  className="inline-flex items-center gap-1.5 rounded-full bg-hpanel-primary-soft border border-hpanel-primary/30 px-2.5 py-1 text-xs text-white"
                >
                  ✨ {k}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-hpanel-border pt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-hpanel-muted">Estimated weekly reach</span>
            <span className="text-xl font-semibold text-white tabular-nums">~{reach}</span>
          </div>
          <p className="text-[11px] text-hpanel-muted-strong mt-1">
            People who could see {businessName || 'your'} ads based on the selected signals. Audience signals are hints — Google may serve outside them to find conversions.
          </p>
        </div>
      </div>
    </div>
  )
}
