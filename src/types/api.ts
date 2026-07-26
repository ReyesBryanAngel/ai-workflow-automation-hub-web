// Shared API response/request shapes. Extend per-module as later phases wire up more endpoints.

export interface User {
  id: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface ApiErrorBody {
  error: string
  details?: string | { path: (string | number)[]; message: string }[]
}
