import { StatCard } from '@/components/shared/StatCard'
import { WorkflowHealthBanner } from '@/components/shared/WorkflowHealthBanner'
import { QuickActions } from '@/features/dashboard/QuickActions'
import { useDashboard } from '@/features/dashboard/useDashboard'
import type { DashboardStats } from '@/types/api'

const STAT_ITEMS: { key: keyof DashboardStats; label: string }[] = [
  { key: 'todayEmails', label: "Today's Emails" },
  { key: 'aiProcessed', label: 'AI Processed' },
  { key: 'salesLeads', label: 'Sales Leads' },
  { key: 'supportTickets', label: 'Support Tickets' },
  { key: 'failedWorkflows', label: 'Failed Workflows' },
]

export function DashboardPage() {
  const { data, isPending, isError } = useDashboard()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-[var(--text-h)]">Dashboard</h1>

      <WorkflowHealthBanner />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STAT_ITEMS.map((item) => (
          <StatCard
            key={item.key}
            label={item.label}
            value={data?.[item.key] ?? 0}
            isLoading={isPending}
          />
        ))}
      </div>

      {isError && (
        <p role="alert" className="text-sm text-red-500">
          Unable to load dashboard stats. Please try again later.
        </p>
      )}

      <QuickActions />
    </div>
  )
}
