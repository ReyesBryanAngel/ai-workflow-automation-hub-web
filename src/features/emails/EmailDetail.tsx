import { useState } from 'react'
import { CategoryChip } from '@/components/shared/CategoryChip'
import { PriorityChip } from '@/components/shared/PriorityChip'
import { StatusChip } from '@/components/shared/StatusChip'
import type { AnalyzeEmailResult, Email } from '@/types/api'
import { AnalyzeEmailButton } from './AnalyzeEmailButton'
import { CreateCrmFromEmailButton } from './CreateCrmFromEmailButton'
import { ReplyDraftPanel } from './ReplyDraftPanel'

interface EmailDetailProps {
  email: Email
}

export function EmailDetail({ email }: EmailDetailProps) {
  const [analysis, setAnalysis] = useState<AnalyzeEmailResult | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-[var(--border)] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryChip category={email.category} />
          <PriorityChip priority={email.priority} />
          <StatusChip status={email.status} />
        </div>
        <h2 className="mt-3 text-lg font-semibold text-[var(--text-h)]">{email.subject}</h2>
        <p className="mt-1 text-sm text-[var(--text)]">
          From {email.sender} · {new Date(email.createdAt).toLocaleString()}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-sm text-[var(--text)]">{email.body}</p>

        {email.summary && (
          <div className="mt-4 rounded-md bg-[var(--code-bg)] p-3">
            <p className="text-xs font-medium text-[var(--text-h)]">AI Summary</p>
            <p className="mt-1 text-sm text-[var(--text)]">{email.summary}</p>
          </div>
        )}
      </div>

      <section className="flex flex-col gap-3 rounded-lg border border-[var(--border)] p-4">
        <h3 className="text-sm font-semibold text-[var(--text-h)]">AI Analysis</h3>
        <AnalyzeEmailButton email={email} result={analysis} onAnalyzed={setAnalysis} />
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-[var(--border)] p-4">
        <h3 className="text-sm font-semibold text-[var(--text-h)]">Draft Reply</h3>
        <ReplyDraftPanel email={email} analysis={analysis} />
      </section>

      <CreateCrmFromEmailButton email={email} analysis={analysis} />
    </div>
  )
}
