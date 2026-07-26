import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { useLogin } from './useLogin'

function loginErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) return 'Invalid email or password'
    if (error.response?.status === 429) return 'Too many attempts, try again later'
    const data = error.response?.data as { error?: string } | undefined
    if (data?.error) return data.error
  }
  return 'Unable to log in. Please try again.'
}

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const loginMutation = useLogin()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard'
    return <Navigate to={from} replace />
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          login(data.token, data.user)
          const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard'
          navigate(from, { replace: true })
        },
      },
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm rounded-lg border border-[var(--border)] p-8">
        <h1 className="text-xl font-semibold text-[var(--text-h)]">Sign in</h1>
        <p className="mt-1 text-sm text-[var(--text)]">AI Workflow Automation Hub</p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <label className="flex flex-col gap-1 text-left text-sm text-[var(--text)]">
            Email
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text-h)] outline-none focus-visible:border-[var(--accent-border)]"
            />
          </label>

          <label className="flex flex-col gap-1 text-left text-sm text-[var(--text)]">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text-h)] outline-none focus-visible:border-[var(--accent-border)]"
            />
          </label>

          {loginMutation.isError && (
            <p role="alert" className="text-sm text-red-500">
              {loginErrorMessage(loginMutation.error)}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-2 rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
