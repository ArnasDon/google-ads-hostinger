import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useToast } from '../../context/ToastContext'

const recommendations = [
  {
    title: 'Add responsive search ads',
    description: 'Ads that automatically adjust their content to match what people are searching for.',
  },
  {
    title: 'Expand to similar audiences',
    description: 'Reach more people similar to your existing customers and improve campaign reach.',
  },
]

export function RecommendationsCard() {
  const { showToast } = useToast()

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">Recommendations</h3>
          <p className="text-xs text-hpanel-muted mt-0.5">Suggested ways to improve performance</p>
        </div>
        <span className="text-xs text-hpanel-muted-strong">Demo only</span>
      </div>

      <ul className="mt-4 space-y-3">
        {recommendations.map((rec) => (
          <li key={rec.title} className="bg-hpanel-bg/60 border border-hpanel-border rounded-card p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-card bg-hpanel-primary-soft flex items-center justify-center text-hpanel-primary-hover flex-shrink-0">💡</div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-white">{rec.title}</h4>
                <p className="text-xs text-hpanel-muted mt-0.5">{rec.description}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => showToast(`Applied: ${rec.title}`)}>
                    Apply
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => showToast('Opening docs (demo)', 'info')}>
                    Learn more
                  </Button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
