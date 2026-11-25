import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <p className="text-5xl font-bold text-brand-600">404</p>
      <h2 className="mt-3 text-xl font-semibold">Page not found</h2>
      <p className="mt-1 text-slate-500">The page you’re looking for doesn’t exist.</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
