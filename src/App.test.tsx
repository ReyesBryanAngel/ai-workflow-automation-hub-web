import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from '@/features/auth/AuthProvider'

function renderApp(initialEntries: string[]) {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <App />
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('App', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('redirects unauthenticated visitors to the login page', () => {
    renderApp(['/dashboard'])
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders the dashboard for an authenticated user', () => {
    localStorage.setItem('auth.token', 'test-token')
    localStorage.setItem('auth.user', JSON.stringify({ id: '1', email: 'admin@example.com' }))
    renderApp(['/dashboard'])
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByText('admin@example.com')).toBeInTheDocument()
  })
})
