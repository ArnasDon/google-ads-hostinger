interface ProgressBarProps {
  value: number // 0-100
  label?: string
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between text-xs text-hpanel-muted mb-1.5">
          <span>{label}</span>
          <span className="tabular-nums">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-hpanel-border">
        <div
          className="h-full rounded-full bg-hpanel-primary transition-[width] duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
