import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@/types/api'
import { clearStoredAuth, getStoredToken, getStoredUser, setStoredAuth } from '@/lib/authStorage'
import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [user, setUser] = useState<User | null>(() => getStoredUser())

  const login = useCallback((nextToken: string, nextUser: User) => {
    setStoredAuth(nextToken, nextUser)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    clearStoredAuth()
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, logout }),
    [token, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
