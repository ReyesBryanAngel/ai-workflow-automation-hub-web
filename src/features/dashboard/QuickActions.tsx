import { Link } from 'react-router-dom'

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        to="/customers"
        className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Add Customer Manually
      </Link>
      <Link
        to="/workflows"
        className="rounded-md border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-h)] transition-colors hover:border-[var(--accent-border)]"
      >
        Run Workflow Manually
      </Link>
    </div>
  )
}
