import { Link } from 'react-router-dom'
import { SourceBadge } from '@/components/shared/SourceBadge'
import type { CrmRecord } from '@/types/api'

interface CrmRecordDetailProps {
  record: CrmRecord
}

export function CrmRecordDetail({ record }: CrmRecordDetailProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={record.source} />
      </div>
      <h2 className="mt-3 text-lg font-semibold text-[var(--text-h)]">
        {record.customerName ?? 'Unnamed customer'}
      </h2>
      <p className="mt-1 text-sm text-[var(--text)]">
        Added {new Date(record.createdAt).toLocaleString()}
      </p>

      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium text-[var(--text)]">Email</dt>
          <dd className="text-sm text-[var(--text-h)]">{record.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-[var(--text)]">Company</dt>
          <dd className="text-sm text-[var(--text-h)]">{record.company ?? '—'}</dd>
        </div>
      </dl>

      {record.sourceEmailId && (
        <p className="mt-4 text-sm text-[var(--text)]">
          Created from{' '}
          <Link
            to={`/inbox/${record.sourceEmailId}`}
            className="text-[var(--accent)] underline hover:opacity-90"
          >
            this email
          </Link>
          .
        </p>
      )}
    </div>
  )
}
