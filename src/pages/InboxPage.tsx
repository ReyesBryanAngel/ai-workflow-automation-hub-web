import { useState } from 'react'
import { EmailList } from '@/features/emails/EmailList'
import { NewEmailForm } from '@/features/emails/NewEmailForm'

export function InboxPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-h)]">Email Inbox</h1>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {showForm ? 'Cancel' : 'Log Email'}
        </button>
      </div>

      {showForm && <NewEmailForm onSuccess={() => setShowForm(false)} />}

      <EmailList />
    </div>
  )
}
