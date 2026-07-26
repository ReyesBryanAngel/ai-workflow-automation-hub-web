import { useNavigate } from 'react-router-dom'
import type { AnalyzeEmailResult, CrmPrefillState, Email } from '@/types/api'

interface CreateCrmFromEmailButtonProps {
  email: Email
  analysis: AnalyzeEmailResult | null
}

// Module 4 (Customers/CRM) is not built yet — this wires the navigation + prefill
// contract described in FRONTEND_TASKS.md §4/§5 so ManualCrmRecordForm can read
// `location.state.prefill` once it exists.
export function CreateCrmFromEmailButton({ email, analysis }: CreateCrmFromEmailButtonProps) {
  const navigate = useNavigate()

  function handleClick() {
    const prefill: CrmPrefillState = {
      customerName: analysis?.customerName ?? null,
      email: analysis?.email ?? email.sender,
      company: analysis?.company ?? '',
      source: 'manual_entry',
      sourceEmailId: email.id,
    }
    navigate('/customers', { state: { prefill } })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="self-start rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      Create CRM Record from Email
    </button>
  )
}
