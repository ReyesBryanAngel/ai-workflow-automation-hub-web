import { useState } from 'react'
import { CategoryDistributionChart } from '@/features/reports/CategoryDistributionChart'
import { DateRangeSelector } from '@/features/reports/DateRangeSelector'
import { EmailsPerDayChart } from '@/features/reports/EmailsPerDayChart'
import { PriorityDistributionChart } from '@/features/reports/PriorityDistributionChart'
import { useReports } from '@/features/reports/useReports'
import { WorkflowSuccessRateCard } from '@/features/reports/WorkflowSuccessRateCard'

const DEFAULT_DAYS = 30

export function ReportsPage() {
  const [days, setDays] = useState(DEFAULT_DAYS)
  const { data, isPending, isError } = useReports(days)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[var(--text-h)]">Reports</h1>
        <DateRangeSelector days={days} onChange={setDays} />
      </div>

      {isError && (
        <p role="alert" className="text-sm text-red-500">
          Unable to load reports. Please try again later.
        </p>
      )}

      <EmailsPerDayChart data={data?.emailsPerDay} isLoading={isPending} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryDistributionChart data={data?.categoryDistribution} isLoading={isPending} />
        <PriorityDistributionChart data={data?.priorityDistribution} isLoading={isPending} />
      </div>

      {/* <WorkflowSuccessRateCard data={data?.workflowSuccessRate} isLoading={isPending} /> */}
    </div>
  )
}
