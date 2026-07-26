import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getApiErrorMessage, getApiFieldErrors, isRetryableApiError } from '@/lib/apiError'
import { useRunWorkflow } from './useRunWorkflow'

const INPUT_CLASS =
  'rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text-h)] outline-none focus-visible:border-[var(--accent-border)]'

interface RunWorkflowFormProps {
  onSuccess?: () => void
}

// Triggers n8n by posting a fresh inbound-email payload (there is no
// "re-run for an existing email" endpoint — see FRONTEND_TASKS.md §1).
export function RunWorkflowForm({ onSuccess }: RunWorkflowFormProps) {
  const runWorkflow = useRunWorkflow()

  const [sender, setSender] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const fieldErrors = getApiFieldErrors(runWorkflow.error)
  const fieldError = (path: string) => fieldErrors.find((err) => err.path === path)?.message

  function triggerRun() {
    runWorkflow.mutate(
      { sender, subject, body },
      {
        onSuccess: () => {
          setSender('')
          setSubject('')
          setBody('')
          onSuccess?.()
        },
      },
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    triggerRun()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-lg border border-[var(--border)] p-4"
    >
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-h)]">Run workflow manually</h2>
        <p className="mt-1 text-xs text-[var(--text)]">
          Simulates a new inbound email through the n8n pipeline.
        </p>
      </div>

      <label className="flex flex-col gap-1 text-left text-sm text-[var(--text)]">
        Sender
        <input
          type="email"
          required
          value={sender}
          onChange={(event) => setSender(event.target.value)}
          className={INPUT_CLASS}
        />
        {fieldError('sender') && (
          <span className="text-xs text-red-500">{fieldError('sender')}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-left text-sm text-[var(--text)]">
        Subject
        <input
          type="text"
          required
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className={INPUT_CLASS}
        />
        {fieldError('subject') && (
          <span className="text-xs text-red-500">{fieldError('subject')}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-left text-sm text-[var(--text)]">
        Body
        <textarea
          required
          rows={4}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className={INPUT_CLASS}
        />
        {fieldError('body') && <span className="text-xs text-red-500">{fieldError('body')}</span>}
      </label>

      {runWorkflow.isError && fieldErrors.length === 0 && (
        <div role="alert" className="flex flex-col gap-1 text-sm text-red-500">
          <span>
            {getApiErrorMessage(runWorkflow.error, 'Unable to trigger the workflow.')}
            {isRetryableApiError(runWorkflow.error) && (
              <button type="button" onClick={triggerRun} className="ml-2 underline">
                Retry
              </button>
            )}
          </span>
          {isRetryableApiError(runWorkflow.error) && (
            <span className="text-xs text-[var(--text)]">
              Automation may be unavailable —{' '}
              <Link to="/customers" className="underline">
                add the customer manually instead
              </Link>
              .
            </span>
          )}
        </div>
      )}

      {runWorkflow.isSuccess && (
        <p role="status" className="text-sm text-emerald-600 dark:text-emerald-400">
          Workflow triggered successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={runWorkflow.isPending}
        className="self-start rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {runWorkflow.isPending ? 'Triggering…' : 'Run Workflow'}
      </button>
    </form>
  )
}
