interface AudiencePreviewProps {
  businessName: string
  locations: string[]
  language: string
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

// Dummy reach estimate: each selected country contributes a base pool.
function estimateReach(locations: string[]): string {
  const reach = locations.length * 220_000
  if (reach >= 1_000_000) return `${(reach / 1_000_000).toFixed(1)}M`
  if (reach >= 1_000) return `${Math.round(reach / 1_000)}K`
  return String(reach)
}

export function AudiencePreview({ businessName, locations, language }: AudiencePreviewProps) {
  const reach = estimateReach(locations)

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

        <div className="border-t border-hpanel-border pt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-hpanel-muted">Estimated weekly reach</span>
            <span className="text-xl font-semibold text-white tabular-nums">~{reach}</span>
          </div>
          <p className="text-[11px] text-hpanel-muted-strong mt-1">
            People who could see {businessName || 'your'} ads in the selected locations and language.
          </p>
        </div>
      </div>
    </div>
  )
}
