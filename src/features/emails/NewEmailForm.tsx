import { useState, type FormEvent } from 'react'
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/components/shared/emailFieldLabels'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/apiError'
import type { EmailCategory, Priority } from '@/types/api'
import { useCreateEmail } from './useCreateEmail'

const NO_VALUE = ''
const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS) as [EmailCategory, string][]
const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS) as [Priority, string][]

const INPUT_CLASS =
  'rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text-h)] outline-none focus-visible:border-[var(--accent-border)]'

interface NewEmailFormProps {
  onSuccess?: () => void
}

export function NewEmailForm({ onSuccess }: NewEmailFormProps) {
  const createEmail = useCreateEmail()

  const [sender, setSender] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<EmailCategory | typeof NO_VALUE>(NO_VALUE)
  const [priority, setPriority] = useState<Priority | typeof NO_VALUE>(NO_VALUE)
  const [summary, setSummary] = useState('')

  const fieldErrors = getApiFieldErrors(createEmail.error)
  const fieldError = (path: string) => fieldErrors.find((err) => err.path === path)?.message

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createEmail.mutate(
      {
        sender,
        subject,
        body,
        category: category || undefined,
        priority: priority || undefined,
        summary: summary || undefined,
      },
      {
        onSuccess: () => {
          setSender('')
          setSubject('')
          setBody('')
          setCategory(NO_VALUE)
          setPriority(NO_VALUE)
          setSummary('')
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
      <h2 className="text-sm font-semibold text-[var(--text-h)]">Log an email manually</h2>

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

      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-left text-sm text-[var(--text)]">
          Category (optional)
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as EmailCategory | typeof NO_VALUE)}
            className={INPUT_CLASS}
          >
            <option value={NO_VALUE}>Let AI decide</option>
            {CATEGORY_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-left text-sm text-[var(--text)]">
          Priority (optional)
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority | typeof NO_VALUE)}
            className={INPUT_CLASS}
          >
            <option value={NO_VALUE}>Let AI decide</option>
            {PRIORITY_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-left text-sm text-[var(--text)]">
        Summary (optional)
        <input
          type="text"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className={INPUT_CLASS}
        />
      </label>

      {createEmail.isError && fieldErrors.length === 0 && (
        <p role="alert" className="text-sm text-red-500">
          {getApiErrorMessage(createEmail.error, 'Unable to log this email.')}
        </p>
      )}

      <button
        type="submit"
        disabled={createEmail.isPending}
        className="self-start rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {createEmail.isPending ? 'Saving…' : 'Save Email'}
      </button>
    </form>
  )
}
