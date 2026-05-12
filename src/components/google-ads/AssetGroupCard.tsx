import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

interface AssetGroupCardProps {
  name: string
  adStrength: 'Excellent' | 'Good' | 'Average' | 'Poor'
  headlines: string[]
}

export function AssetGroupCard({ name, adStrength, headlines }: AssetGroupCardProps) {
  const tone = adStrength === 'Excellent' || adStrength === 'Good' ? 'success' : adStrength === 'Average' ? 'warning' : 'danger'
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">{name}</h3>
        <Badge tone={tone}>Ad strength: {adStrength}</Badge>
      </div>

      <div className="mt-5">
        <div className="text-xs uppercase tracking-wider text-hpanel-muted-strong font-medium mb-2.5">Headlines</div>
        <ul className="space-y-2">
          {headlines.map((h, i) => (
            <li key={i} className="flex items-center gap-3 bg-hpanel-bg/60 border border-hpanel-border rounded-card px-3 py-2.5">
              <span className="text-xs text-hpanel-muted-strong tabular-nums w-5">0{i + 1}</span>
              <span className="text-sm text-white">{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
