import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CategoryChip } from '@/components/shared/CategoryChip'
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '@/components/shared/emailFieldLabels'
import { PriorityChip } from '@/components/shared/PriorityChip'
import { StatusChip } from '@/components/shared/StatusChip'
import type { Email, EmailCategory, EmailStatus, Priority } from '@/types/api'
import { useEmails } from './useEmails'

type SortKey = 'sender' | 'subject' | 'createdAt'
type SortDir = 'asc' | 'desc'

const ALL = 'ALL'

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS) as [EmailCategory, string][]
const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS) as [Priority, string][]
const STATUS_OPTIONS = Object.entries(STATUS_LABELS) as [EmailStatus, string][]

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

export function EmailList() {
  const { data, isPending, isError } = useEmails()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<EmailCategory | typeof ALL>(ALL)
  const [priority, setPriority] = useState<Priority | typeof ALL>(ALL)
  const [status, setStatus] = useState<EmailStatus | typeof ALL>(ALL)
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const rows = useMemo(() => {
    if (!data) return []
    const term = search.trim().toLowerCase()

    const filtered = data.filter((email) => {
      if (category !== ALL && email.category !== category) return false
      if (priority !== ALL && email.priority !== priority) return false
      if (status !== ALL && email.status !== status) return false
      if (!term) return true
      return (
        email.sender.toLowerCase().includes(term) ||
        email.subject.toLowerCase().includes(term) ||
        (email.summary?.toLowerCase().includes(term) ?? false)
      )
    })

    return [...filtered].sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey])
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, search, category, priority, status, sortKey, sortDir])

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
          placeholder="Search sender, subject, summary…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="min-w-48 flex-1 rounded-md border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm text-[var(--text-h)] outline-none focus-visible:border-[var(--accent-border)]"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as EmailCategory | typeof ALL)}
          className={SELECT_CLASS}
        >
          <option value={ALL}>All categories</option>
          {CATEGORY_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value as Priority | typeof ALL)}
          className={SELECT_CLASS}
        >
          <option value={ALL}>All priorities</option>
          {PRIORITY_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as EmailStatus | typeof ALL)}
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
          Unable to load emails. Please try again later.
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
          No emails yet. Log one manually with the button above to get started.
        </p>
      )}

      {!isPending && !isError && data && data.length > 0 && rows.length === 0 && (
        <p className="text-sm text-[var(--text)]">No emails match your filters.</p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <SortHeader
                  label="Sender"
                  active={sortKey === 'sender'}
                  dir={sortDir}
                  onClick={() => toggleSort('sender')}
                />
                <SortHeader
                  label="Subject"
                  active={sortKey === 'subject'}
                  dir={sortDir}
                  onClick={() => toggleSort('subject')}
                />
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--text)]">
                  Category
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--text)]">
                  Priority
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--text)]">
                  Status
                </th>
                <SortHeader
                  label="Received"
                  active={sortKey === 'createdAt'}
                  dir={sortDir}
                  onClick={() => toggleSort('createdAt')}
                />
              </tr>
            </thead>
            <tbody>
              {rows.map((email: Email) => (
                <tr
                  key={email.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/inbox/${email.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') navigate(`/inbox/${email.id}`)
                  }}
                  className="cursor-pointer border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--code-bg)]"
                >
                  <td className="px-3 py-2 text-[var(--text-h)]">{email.sender}</td>
                  <td className="max-w-[280px] truncate px-3 py-2 text-[var(--text-h)]">
                    {email.subject}
                  </td>
                  <td className="px-3 py-2">
                    <CategoryChip category={email.category} />
                  </td>
                  <td className="px-3 py-2">
                    <PriorityChip priority={email.priority} />
                  </td>
                  <td className="px-3 py-2">
                    <StatusChip status={email.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-[var(--text)]">
                    {new Date(email.createdAt).toLocaleString()}
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
