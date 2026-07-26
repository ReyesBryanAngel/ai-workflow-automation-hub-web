import { CategoryChip } from '@/components/shared/CategoryChip'
import { PriorityChip } from '@/components/shared/PriorityChip'
import { getApiErrorMessage, isRetryableApiError } from '@/lib/apiError'
import type { AnalyzeEmailResult, Email } from '@/types/api'
import { useAnalyzeEmail } from './useAnalyzeEmail'

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-[var(--text)]">{label}</p>
      <p className="text-sm text-[var(--text-h)]">{value || '—'}</p>
    </div>
  )
}

interface AnalyzeEmailButtonProps {
  email: Email
  result: AnalyzeEmailResult | null
  onAnalyzed: (result: AnalyzeEmailResult) => void
}

export function AnalyzeEmailButton({ email, result, onAnalyzed }: AnalyzeEmailButtonProps) {
  const analyzeEmail = useAnalyzeEmail()

  function handleAnalyze() {
    analyzeEmail.mutate(
      { sender: email.sender, subject: email.subject, body: email.body, emailId: email.id },
      { onSuccess: onAnalyzed },
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={analyzeEmail.isPending}
          className="self-start rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-h)] transition-colors hover:border-[var(--accent-border)] disabled:opacity-60"
        >
          {analyzeEmail.isPending
            ? 'Analyzing…'
            : result
              ? 'Re-analyze with AI'
              : 'Analyze with AI'}
        </button>

        {analyzeEmail.isError && (
          <p role="alert" className="text-sm text-red-500">
            {getApiErrorMessage(analyzeEmail.error, 'Unable to analyze this email.')}
            {isRetryableApiError(analyzeEmail.error) && (
              <button type="button" onClick={handleAnalyze} className="ml-2 underline">
                Retry
              </button>
            )}
          </p>
        )}
      </div>

      {result && (
        <div className="grid grid-cols-2 gap-3 rounded-md bg-[var(--code-bg)] p-3 sm:grid-cols-3">
          <Field label="Customer name" value={result.customerName} />
          <Field label="Company" value={result.company} />
          <Field label="Email" value={result.email} />
          <Field label="Phone" value={result.phone} />
          <div>
            <p className="text-xs font-medium text-[var(--text)]">Category</p>
            <CategoryChip category={result.category} />
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text)]">Priority</p>
            <PriorityChip priority={result.priority} />
          </div>
          <div className="col-span-2 sm:col-span-3">
            <p className="text-xs font-medium text-[var(--text)]">Issue summary</p>
            <p className="text-sm text-[var(--text-h)]">{result.issueSummary}</p>
          </div>
          <div className="col-span-2 sm:col-span-3">
            <p className="text-xs font-medium text-[var(--text)]">Requested action</p>
            <p className="text-sm text-[var(--text-h)]">{result.requestedAction}</p>
          </div>
        </div>
      )}
    </div>
  )
}
