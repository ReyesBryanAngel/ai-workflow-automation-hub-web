import { getApiErrorMessage, isRetryableApiError } from '@/lib/apiError'
import type { AnalyzeEmailResult, Email } from '@/types/api'
import { useDraftReply } from './useDraftReply'

interface ReplyDraftPanelProps {
  email: Email
  analysis: AnalyzeEmailResult | null
}

export function ReplyDraftPanel({ email, analysis }: ReplyDraftPanelProps) {
  const draftReply = useDraftReply()

  function handleDraft() {
    if (!analysis) return
    draftReply.mutate({
      ...analysis,
      sender: email.sender,
      subject: email.subject,
      body: email.body,
      emailId: email.id,
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDraft}
          disabled={!analysis || draftReply.isPending}
          title={!analysis ? 'Run "Analyze with AI" first' : undefined}
          className="self-start rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-h)] transition-colors hover:border-[var(--accent-border)] disabled:opacity-60"
        >
          {draftReply.isPending ? 'Drafting…' : 'Draft Reply'}
        </button>

        {draftReply.isError && (
          <p role="alert" className="text-sm text-red-500">
            {getApiErrorMessage(draftReply.error, 'Unable to draft a reply.')}
            {isRetryableApiError(draftReply.error) && (
              <button type="button" onClick={handleDraft} className="ml-2 underline">
                Retry
              </button>
            )}
          </p>
        )}
      </div>

      {!analysis && (
        <p className="text-xs text-[var(--text)]">
          Run "Analyze with AI" above first — the reply draft is based on the analysis result.
        </p>
      )}

      {draftReply.data && (
        <div className="flex flex-col gap-3 rounded-md bg-[var(--code-bg)] p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-[var(--text-h)]">{draftReply.data.subject}</p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(draftReply.data!.subject)}
              className="shrink-0 text-xs text-[var(--text)] underline hover:text-[var(--text-h)]"
            >
              Copy subject
            </button>
          </div>
          <div className="flex items-start justify-between gap-3">
            <p className="whitespace-pre-wrap text-sm text-[var(--text-h)]">
              {draftReply.data.body}
            </p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(draftReply.data!.body)}
              className="shrink-0 text-xs text-[var(--text)] underline hover:text-[var(--text-h)]"
            >
              Copy body
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
