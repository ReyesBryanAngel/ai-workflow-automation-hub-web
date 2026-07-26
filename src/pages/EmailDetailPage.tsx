import { Link, useParams } from 'react-router-dom'
import { EmailDetail } from '@/features/emails/EmailDetail'
import { useEmail } from '@/features/emails/useEmail'

export function EmailDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: email, isPending, isError } = useEmail(id)

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/inbox"
        className="self-start text-sm text-[var(--text)] hover:text-[var(--text-h)]"
      >
        ← Back to Inbox
      </Link>

      {isPending && <div className="h-40 animate-pulse rounded-lg bg-[var(--code-bg)]" />}

      {isError && (
        <p role="alert" className="text-sm text-red-500">
          Unable to load this email. It may not exist.
        </p>
      )}

      {email && <EmailDetail email={email} />}
    </div>
  )
}
