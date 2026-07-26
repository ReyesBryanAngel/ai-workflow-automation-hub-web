import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { LogoutButton } from '@/features/auth/LogoutButton'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/inbox', label: 'Inbox' },
  { to: '/customers', label: 'Customers' },
  { to: '/workflows', label: 'Workflows' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
]

export function AppLayout() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-svh w-full bg-[var(--bg)]">
      <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--border)] px-3 py-4">
        <div className="px-2 pb-4 text-sm font-semibold text-[var(--text-h)]">AI Workflow Hub</div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
                    : 'text-[var(--text)] hover:bg-[var(--code-bg)] hover:text-[var(--text-h)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-3">
          <span className="text-sm text-[var(--text)]">{user?.email}</span>
          <LogoutButton />
        </header>

        <main className="flex-1 px-6 py-6 text-left">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
