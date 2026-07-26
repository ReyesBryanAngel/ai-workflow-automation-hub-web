import { Link, useParams } from 'react-router-dom'
import { CrmRecordDetail } from '@/features/crm/CrmRecordDetail'
import { useCrmRecord } from '@/features/crm/useCrmRecord'

export function CrmRecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: record, isPending, isError } = useCrmRecord(id)

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/customers"
        className="self-start text-sm text-[var(--text)] hover:text-[var(--text-h)]"
      >
        ← Back to Customers
      </Link>

      {isPending && <div className="h-40 animate-pulse rounded-lg bg-[var(--code-bg)]" />}

      {isError && (
        <p role="alert" className="text-sm text-red-500">
          Unable to load this customer. It may not exist.
        </p>
      )}

      {record && <CrmRecordDetail record={record} />}
    </div>
  )
}
