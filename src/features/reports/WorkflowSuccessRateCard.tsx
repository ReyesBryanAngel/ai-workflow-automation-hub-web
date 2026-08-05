import { StatCard } from '@/components/shared/StatCard'
import type { WorkflowSuccessRate } from '@/types/api'
import { successRateColor } from './reportColors'

interface WorkflowSuccessRateCardProps {
  data: WorkflowSuccessRate | undefined
  isLoading: boolean
}

export function WorkflowSuccessRateCard({ data, isLoading }: WorkflowSuccessRateCardProps) {
  const ratePercent = data ? Math.round(data.rate * 100) : 0

  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <h2 className="text-base font-semibold text-[var(--text-h)]">Workflow Success Rate</h2>

      <div className="mt-3 flex items-center gap-3">
        <div
          role="progressbar"
          aria-valuenow={ratePercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--code-bg)]"
        >
          {!isLoading && data && (
            <div
              className="h-full rounded-full transition-[width]"
              style={{ width: `${ratePercent}%`, background: successRateColor(data.rate) }}
            />
          )}
        </div>
        {isLoading ? (
          <div className="h-5 w-12 animate-pulse rounded bg-[var(--code-bg)]" />
        ) : (
          <span className="text-sm font-semibold text-[var(--text-h)]">{ratePercent}%</span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Runs" value={data?.total ?? 0} isLoading={isLoading} />
        <StatCard label="Success" value={data?.success ?? 0} isLoading={isLoading} />
        <StatCard label="Failed" value={data?.failed ?? 0} isLoading={isLoading} />
        <StatCard label="Retrying" value={data?.retrying ?? 0} isLoading={isLoading} />
      </div>

      {!isLoading && data && data.total === 0 && (
        <p className="mt-3 text-sm text-[var(--text)]">No workflow runs in this range yet.</p>
      )}
    </div>
  )
}
