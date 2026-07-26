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

export interface DashboardStats {
  todayEmails: number
  aiProcessed: number
  salesLeads: number
  supportTickets: number
  failedWorkflows: number
}

export type WorkflowStatus = 'SUCCESS' | 'FAILED' | 'RETRYING'

export interface WorkflowLog {
  id: string
  workflow: string
  status: WorkflowStatus
  executionTime: number | null
  error: string | null
  retryCount: number
  createdAt: string
  emailId?: string
}
