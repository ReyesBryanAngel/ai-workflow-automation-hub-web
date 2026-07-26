import type { EmailCategory } from '@/types/api'
import { CATEGORY_LABELS } from './emailFieldLabels'

const CATEGORY_STYLES: Record<EmailCategory, string> = {
  SALES: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  SUPPORT: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  BILLING: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  COMPLAINT: 'bg-red-500/10 text-red-700 dark:text-red-400',
  GENERAL_INQUIRY: 'bg-slate-500/10 text-slate-700 dark:text-slate-400',
  SPAM: 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400',
}

interface CategoryChipProps {
  category: EmailCategory | null
}

export function CategoryChip({ category }: CategoryChipProps) {
  if (!category) {
    return <span className="text-xs text-[var(--text)]">—</span>
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLES[category]}`}
    >
      {CATEGORY_LABELS[category]}
    </span>
  )
}
