import { useMemo, useState } from 'react'
import { WorkflowStatusChip } from '@/components/shared/WorkflowStatusChip'
import { WORKFLOW_STATUS_LABELS } from '@/components/shared/workflowFieldLabels'
import type { WorkflowLog, WorkflowStatus } from '@/types/api'
import { useWorkflows } from './useWorkflows'

type SortKey = 'workflow' | 'createdAt'
type SortDir = 'asc' | 'desc'

const ALL = 'ALL'
const ERROR_TRUNCATE_LENGTH = 80

const STATUS_OPTIONS = Object.entries(WORKFLOW_STATUS_LABELS) as [WorkflowStatus, string][]

const SELECT_CLASS =
  'rounded-md border border-[var(--border)] bg-transparent px-2 py-1.5 text-sm text-[var(--text-h)] outline-none focus-visible:border-[var(--accent-border)]'

function SortHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string
  active: boolean
  dir: SortDir
  onClick: () => void
}) {
  return (
    <th className="px-3 py-2 text-left text-xs font-medium text-[var(--text)]">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 hover:text-[var(--text-h)]"
      >
        {label}
        {active && <span aria-hidden>{dir === 'asc' ? '▲' : '▼'}</span>}
      </button>
    </th>
  )
}

function ErrorCell({ error }: { error: string | null }) {
  const [expanded, setExpanded] = useState(false)

  if (!error) return <span className="text-[var(--text)]">—</span>

  if (error.length <= ERROR_TRUNCATE_LENGTH) {
    return <span className="text-red-500">{error}</span>
  }

  return (
    <span className="text-red-500">
      {expanded ? error : `${error.slice(0, ERROR_TRUNCATE_LENGTH)}…`}{' '}
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="text-xs underline"
      >
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </span>
  )
}

export function WorkflowLogTable() {
  const { data, isPending, isError } = useWorkflows()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<WorkflowStatus | typeof ALL>(ALL)
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const rows = useMemo(() => {
    if (!data) return []
    const term = search.trim().toLowerCase()

    const filtered = data.filter((log) => {
      if (status !== ALL && log.status !== status) return false
      if (!term) return true
      return log.workflow.toLowerCase().includes(term)
    })

    return [...filtered].sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey])
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, search, status, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search workflow…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="min-w-48 flex-1 rounded-md border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm text-[var(--text-h)] outline-none focus-visible:border-[var(--accent-border)]"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as WorkflowStatus | typeof ALL)}
          className={SELECT_CLASS}
        >
          <option value={ALL}>All statuses</option>
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isError && (
        <p role="alert" className="text-sm text-red-500">
          Unable to load workflow logs. Please try again later.
        </p>
      )}

      {isPending && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-10 animate-pulse rounded-md bg-[var(--code-bg)]" />
          ))}
        </div>
      )}

      {!isPending && !isError && data && data.length === 0 && (
        <p className="text-sm text-[var(--text)]">
          No workflow runs yet. Trigger one manually with the form above to get started.
        </p>
      )}

      {!isPending && !isError && data && data.length > 0 && rows.length === 0 && (
        <p className="text-sm text-[var(--text)]">No workflow logs match your filters.</p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <SortHeader
                  label="Workflow"
                  active={sortKey === 'workflow'}
                  dir={sortDir}
                  onClick={() => toggleSort('workflow')}
                />
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--text)]">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--text)]">
                  Execution time
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--text)]">
                  Retries
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--text)]">
                  Error
                </th>
                <SortHeader
                  label="Ran at"
                  active={sortKey === 'createdAt'}
                  dir={sortDir}
                  onClick={() => toggleSort('createdAt')}
                />
              </tr>
            </thead>
            <tbody>
              {rows.map((log: WorkflowLog) => (
                <tr
                  key={log.id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--code-bg)]"
                >
                  <td className="px-3 py-2 text-[var(--text-h)]">{log.workflow}</td>
                  <td className="px-3 py-2">
                    <WorkflowStatusChip status={log.status} />
                  </td>
                  <td className="px-3 py-2 text-[var(--text-h)]">
                    {log.executionTime !== null ? `${log.executionTime}ms` : '—'}
                  </td>
                  <td className="px-3 py-2 text-[var(--text-h)]">{log.retryCount}</td>
                  <td className="max-w-[320px] px-3 py-2">
                    <ErrorCell error={log.error} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-[var(--text)]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
