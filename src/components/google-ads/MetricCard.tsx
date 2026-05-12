import { Card } from '../ui/Card'

interface MetricCardProps {
  label: string
  value: string
  delta?: number // percent, signed
}

export function MetricCard({ label, value, delta }: MetricCardProps) {
  const positive = (delta ?? 0) >= 0
  return (
    <Card padded={false} className="p-5">
      <div className="text-xs uppercase tracking-wider text-hpanel-muted-strong font-medium">{label}</div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-semibold text-white tabular-nums">{value}</span>
        {typeof delta === 'number' && (
          <span
            className={`text-xs font-medium tabular-nums ${positive ? 'text-hpanel-success' : 'text-hpanel-danger'}`}
          >
            {positive ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
    </Card>
  )
}
