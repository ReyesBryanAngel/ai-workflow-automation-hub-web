import { Link } from 'react-router-dom'
import { useWorkflows } from '@/features/workflows/useWorkflows'
import type { WorkflowLog } from '@/types/api'

// No dedicated "workflow health" endpoint exists — degraded state is inferred
// client-side from the most recent logs (see FRONTEND_TASKS.md §5).
const RECENT_LOG_SAMPLE_SIZE = 5
const DEGRADED_FAILURE_RATIO = 0.5

function isDegraded(logs: WorkflowLog[]): boolean {
  if (logs.length === 0) return false
  const recent = logs.slice(0, RECENT_LOG_SAMPLE_SIZE)
  const failedCount = recent.filter((log) => log.status === 'FAILED').length
  return failedCount / recent.length >= DEGRADED_FAILURE_RATIO
}

export function WorkflowHealthBanner() {
  const { data: logs } = useWorkflows()

  if (!logs || !isDegraded(logs)) return null

  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3"
    >
      <p className="text-sm text-amber-700 dark:text-amber-400">
        Automated workflow may be unavailable — you can still add customers manually.
      </p>
      <Link
        to="/customers"
        className="shrink-0 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-h)] transition-colors hover:border-[var(--accent-border)]"
      >
        Add customer manually
      </Link>
    </div>
  )
}
