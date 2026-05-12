import type { ReactNode } from 'react'
import { ProgressBar } from '../ui/ProgressBar'

interface StepWizardProps {
  step: number
  totalSteps: number
  title: string
  children: ReactNode
  footer: ReactNode
}

export function StepWizard({ step, totalSteps, title, children, footer }: StepWizardProps) {
  const progress = (step / totalSteps) * 100
  return (
    <div className="bg-hpanel-surface border border-hpanel-border rounded-card shadow-card">
      <div className="px-6 py-5 border-b border-hpanel-border">
        <div className="flex items-center justify-between text-xs text-hpanel-muted mb-2">
          <span>
            Step {step} of {totalSteps}
          </span>
          <span className="tabular-nums">{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} />
        <h1 className="text-xl font-semibold text-white mt-4">{title}</h1>
      </div>

      <div className="p-6">{children}</div>

      <div className="px-6 py-4 border-t border-hpanel-border flex items-center justify-end gap-2 bg-hpanel-bg/40 rounded-b-card">
        {footer}
      </div>
    </div>
  )
}
