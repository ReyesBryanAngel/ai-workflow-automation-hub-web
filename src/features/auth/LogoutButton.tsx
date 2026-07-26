import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--text-h)]"
    >
      Log out
    </button>
  )
}
