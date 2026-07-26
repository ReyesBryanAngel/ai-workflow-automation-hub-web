import type { EmailStatus } from '@/types/api'
import { STATUS_LABELS } from './emailFieldLabels'

const STATUS_STYLES: Record<EmailStatus, string> = {
  PENDING: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  PROCESSED: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  FAILED: 'bg-red-500/10 text-red-700 dark:text-red-400',
}

interface StatusChipProps {
  status: EmailStatus
}

export function StatusChip({ status }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
