import { useState, type FormEvent } from 'react'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/apiError'
import { MANUAL_SOURCE } from '@/components/shared/SourceBadge'
import type { CrmPrefillState } from '@/types/api'
import { useCreateCrmRecord } from './useCreateCrmRecord'

const INPUT_CLASS =
  'rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text-h)] outline-none focus-visible:border-[var(--accent-border)]'

interface ManualCrmRecordFormProps {
  prefill?: CrmPrefillState | null
  onSuccess?: () => void
}

// Direct POST /crm/records — never routed through /workflows/run or n8n, so
// this stays usable even when the automated pipeline is fully down (see
// FRONTEND_TASKS.md §5).
export function ManualCrmRecordForm({ prefill, onSuccess }: ManualCrmRecordFormProps) {
  const createCrmRecord = useCreateCrmRecord()

  const [customerName, setCustomerName] = useState(prefill?.customerName ?? '')
  const [email, setEmail] = useState(prefill?.email ?? '')
  const [company, setCompany] = useState(prefill?.company ?? '')
  const [source, setSource] = useState(prefill?.source ?? MANUAL_SOURCE)
  const sourceEmailId = prefill?.sourceEmailId

  const fieldErrors = getApiFieldErrors(createCrmRecord.error)
  const fieldError = (path: string) => fieldErrors.find((err) => err.path === path)?.message

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createCrmRecord.mutate(
      {
        customerName: customerName.trim() || null,
        email,
        company: company.trim() || undefined,
        source,
        sourceEmailId,
      },
      {
        onSuccess: () => {
          setCustomerName('')
          setEmail('')
          setCompany('')
          setSource(MANUAL_SOURCE)
          onSuccess?.()
        },
      },
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-lg border border-[var(--border)] p-4"
    >
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-h)]">Add customer manually</h2>
        <p className="mt-1 text-xs text-[var(--text)]">
          Creates a CRM record directly — works even if the automated workflow is unavailable.
        </p>
      </div>

      {sourceEmailId && (
        <p className="text-xs text-[var(--text)]">
          Linked to email <span className="font-medium text-[var(--text-h)]">{sourceEmailId}</span>
        </p>
      )}

      <label className="flex flex-col gap-1 text-left text-sm text-[var(--text)]">
        Customer name (optional)
        <input
          type="text"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          className={INPUT_CLASS}
        />
        {fieldError('customerName') && (
          <span className="text-xs text-red-500">{fieldError('customerName')}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-left text-sm text-[var(--text)]">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={INPUT_CLASS}
        />
        {fieldError('email') && <span className="text-xs text-red-500">{fieldError('email')}</span>}
      </label>

      <label className="flex flex-col gap-1 text-left text-sm text-[var(--text)]">
        Company (optional)
        <input
          type="text"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          className={INPUT_CLASS}
        />
        {fieldError('company') && (
          <span className="text-xs text-red-500">{fieldError('company')}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-left text-sm text-[var(--text)]">
        Source
        <input
          type="text"
          required
          value={source}
          onChange={(event) => setSource(event.target.value)}
          className={INPUT_CLASS}
        />
        {fieldError('source') && (
          <span className="text-xs text-red-500">{fieldError('source')}</span>
        )}
      </label>

      {createCrmRecord.isError && fieldErrors.length === 0 && (
        <p role="alert" className="text-sm text-red-500">
          {getApiErrorMessage(createCrmRecord.error, 'Unable to save this customer.')}
        </p>
      )}

      {createCrmRecord.isSuccess && (
        <p role="status" className="text-sm text-emerald-600 dark:text-emerald-400">
          Customer added successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={createCrmRecord.isPending}
        className="self-start rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {createCrmRecord.isPending ? 'Saving…' : 'Save Customer'}
      </button>
    </form>
  )
}
