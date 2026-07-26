import type { Priority } from '@/types/api'
import { PRIORITY_LABELS } from './emailFieldLabels'

const PRIORITY_STYLES: Record<Priority, string> = {
  LOW: 'bg-slate-500/10 text-slate-700 dark:text-slate-400',
  MEDIUM: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  HIGH: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  CRITICAL: 'bg-red-500/10 text-red-700 dark:text-red-400',
}

interface PriorityChipProps {
  priority: Priority | null
}

export function PriorityChip({ priority }: PriorityChipProps) {
  if (!priority) {
    return <span className="text-xs text-[var(--text)]">—</span>
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[priority]}`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
