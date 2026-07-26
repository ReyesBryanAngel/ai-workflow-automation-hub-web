import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-2 bg-[var(--bg)] text-center">
      <h1 className="text-2xl font-semibold text-[var(--text-h)]">404 — Page not found</h1>
      <p className="text-sm text-[var(--text)]">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="mt-2 text-sm text-[var(--accent)] hover:underline">
        Back to Dashboard
      </Link>
    </div>
  )
}
