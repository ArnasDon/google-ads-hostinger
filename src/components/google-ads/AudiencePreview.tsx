import { Globe } from 'lucide-react'

interface AudiencePreviewProps {
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

export function AudiencePreview({ locations, language }: AudiencePreviewProps) {
  return (
    <div className="lg:sticky lg:top-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Who will see your ads</h3>
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
            <Globe size={12} aria-hidden /> {language}
          </span>
        </div>
      </div>
    </div>
  )
}
