import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { WorkflowHealthBanner } from '@/components/shared/WorkflowHealthBanner'
import { CrmRecordList } from '@/features/crm/CrmRecordList'
import { ManualCrmRecordForm } from '@/features/crm/ManualCrmRecordForm'
import type { CrmPrefillState } from '@/types/api'

export function CustomersPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const prefill = (location.state as { prefill?: CrmPrefillState } | null)?.prefill ?? null
  const [showForm, setShowForm] = useState(Boolean(prefill))

  function closeForm() {
    setShowForm(false)
    if (prefill) {
      // Drop the router state so a refresh/back navigation doesn't reopen the
      // form with a stale prefill (see CreateCrmFromEmailButton).
      navigate('.', { replace: true, state: null })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-h)]">Customers</h1>
        <button
          type="button"
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {showForm ? 'Cancel' : 'Add Customer'}
        </button>
      </div>

      <WorkflowHealthBanner />

      {showForm && <ManualCrmRecordForm prefill={prefill} onSuccess={closeForm} />}

      <CrmRecordList />
    </div>
  )
}
