export const MANUAL_SOURCE = 'manual_entry'

interface SourceBadgeProps {
  source: string
}

// `source` is free-text (see FRONTEND_TASKS.md §2 CRM) — only the
// "manual_entry" convention is special-cased so staff can spot hand-entered
// records; anything else is treated as pipeline-originated.
export function SourceBadge({ source }: SourceBadgeProps) {
  const isManual = source === MANUAL_SOURCE

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        isManual
          ? 'bg-slate-500/10 text-slate-700 dark:text-slate-400'
          : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
      }`}
    >
      {isManual ? 'Manual Entry' : source}
    </span>
  )
}
