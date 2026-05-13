import { Construction } from 'lucide-react'

interface StubPageProps {
  title: string
  description?: string
}

export function StubPage({ title, description }: StubPageProps) {
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="mx-auto h-14 w-14 rounded-full bg-hpanel-primary-soft flex items-center justify-center text-hpanel-primary-hover">
        <Construction size={26} aria-hidden />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-sm text-hpanel-muted">
        {description ?? "Coming soon. This part of the demo is a placeholder so the sidebar nav doesn't 404."}
      </p>
    </div>
  )
}
