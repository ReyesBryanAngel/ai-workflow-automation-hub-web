import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SourceBadge } from '@/components/shared/SourceBadge'
import type { CrmRecord } from '@/types/api'
import { useCrmRecords } from './useCrmRecords'

type SortKey = 'customerName' | 'email' | 'createdAt'
type SortDir = 'asc' | 'desc'

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

export function CrmRecordList() {
  const { data, isPending, isError } = useCrmRecords()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const rows = useMemo(() => {
    if (!data) return []
    const term = search.trim().toLowerCase()

    const filtered = data.filter((record) => {
      if (!term) return true
      return (
        (record.customerName?.toLowerCase().includes(term) ?? false) ||
        record.email.toLowerCase().includes(term) ||
        (record.company?.toLowerCase().includes(term) ?? false)
      )
    })

    return [...filtered].sort((a, b) => {
      const aValue = a[sortKey] ?? ''
      const bValue = b[sortKey] ?? ''
      const cmp = aValue.localeCompare(bValue)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, search, sortKey, sortDir])

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
      <input
        type="search"
        placeholder="Search name, email, company…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="min-w-48 rounded-md border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm text-[var(--text-h)] outline-none focus-visible:border-[var(--accent-border)]"
      />

      {isError && (
        <p role="alert" className="text-sm text-red-500">
          Unable to load customers. Please try again later.
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
          No customers yet. Add your first customer manually with the button above.
        </p>
      )}

      {!isPending && !isError && data && data.length > 0 && rows.length === 0 && (
        <p className="text-sm text-[var(--text)]">No customers match your search.</p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <SortHeader
                  label="Name"
                  active={sortKey === 'customerName'}
                  dir={sortDir}
                  onClick={() => toggleSort('customerName')}
                />
                <SortHeader
                  label="Email"
                  active={sortKey === 'email'}
                  dir={sortDir}
                  onClick={() => toggleSort('email')}
                />
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--text)]">
                  Company
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--text)]">
                  Source
                </th>
                <SortHeader
                  label="Added"
                  active={sortKey === 'createdAt'}
                  dir={sortDir}
                  onClick={() => toggleSort('createdAt')}
                />
              </tr>
            </thead>
            <tbody>
              {rows.map((record: CrmRecord) => (
                <tr
                  key={record.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/customers/${record.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') navigate(`/customers/${record.id}`)
                  }}
                  className="cursor-pointer border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--code-bg)]"
                >
                  <td className="px-3 py-2 text-[var(--text-h)]">{record.customerName ?? '—'}</td>
                  <td className="px-3 py-2 text-[var(--text-h)]">{record.email}</td>
                  <td className="px-3 py-2 text-[var(--text)]">{record.company ?? '—'}</td>
                  <td className="px-3 py-2">
                    <SourceBadge source={record.source} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-[var(--text)]">
                    {new Date(record.createdAt).toLocaleString()}
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
