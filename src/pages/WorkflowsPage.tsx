import { useState } from 'react'
import { RunWorkflowForm } from '@/features/workflows/RunWorkflowForm'
import { WorkflowLogTable } from '@/features/workflows/WorkflowLogTable'

export function WorkflowsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-h)]">Workflow Logs</h1>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {showForm ? 'Cancel' : 'Run Workflow'}
        </button>
      </div>

      {showForm && <RunWorkflowForm onSuccess={() => setShowForm(false)} />}

      <WorkflowLogTable />
    </div>
  )
}
