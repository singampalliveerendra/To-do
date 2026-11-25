import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="flex animate-fade-up flex-col items-center py-16 text-center">
      <div className="mb-7 -rotate-3 rounded-2xl border-2 border-ink bg-accent px-7 py-2 shadow-hard">
        <p className="font-display text-6xl font-extrabold tracking-tight">404</p>
      </div>
      <h2 className="font-display text-2xl font-extrabold tracking-tight">Page not found</h2>
      <p className="mt-1 text-brand-600">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="btn-press mt-7 inline-flex items-center gap-2 bg-white px-4 py-2.5 text-sm font-semibold text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to dashboard
      </Link>
    </div>
  )
}
