import type { WorkflowStatus } from '@/types/api'
import { WORKFLOW_STATUS_LABELS } from './workflowFieldLabels'

const WORKFLOW_STATUS_STYLES: Record<WorkflowStatus, string> = {
  SUCCESS: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  FAILED: 'bg-red-500/10 text-red-700 dark:text-red-400',
  RETRYING: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
}

interface WorkflowStatusChipProps {
  status: WorkflowStatus
}

export function WorkflowStatusChip({ status }: WorkflowStatusChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${WORKFLOW_STATUS_STYLES[status]}`}
    >
      {WORKFLOW_STATUS_LABELS[status]}
    </span>
  )
}
