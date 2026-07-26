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

export type EmailCategory =
  'SALES' | 'SUPPORT' | 'BILLING' | 'COMPLAINT' | 'GENERAL_INQUIRY' | 'SPAM'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type EmailStatus = 'PENDING' | 'PROCESSED' | 'FAILED'

export interface Email {
  id: string
  sender: string
  subject: string
  body: string
  category: EmailCategory | null
  priority: Priority | null
  summary: string | null
  status: EmailStatus
  createdAt: string
}

export interface CreateEmailRequest {
  sender: string
  subject: string
  body: string
  category?: EmailCategory
  priority?: Priority
  summary?: string
}

export interface AnalyzeEmailRequest {
  sender: string
  senderName?: string
  subject: string
  body: string
  emailId?: string
}

export interface AnalyzeEmailResult {
  customerName: string | null
  company: string | null
  email: string | null
  phone: string | null
  issueSummary: string
  requestedAction: string
  category: EmailCategory
  priority: Priority
  summary: string
}

export interface DraftReplyRequest extends AnalyzeEmailResult {
  sender: string
  subject: string
  body: string
  emailId?: string
}

export interface DraftReplyResult {
  subject: string
  body: string
}

// Shape handed off to Module 4's ManualCrmRecordForm via router state when
// launched from CreateCrmFromEmailButton (see FRONTEND_TASKS.md §4 Module 2 / §5).
export interface CrmPrefillState {
  customerName: string | null
  email: string
  company: string
  source: string
  sourceEmailId: string
}

export interface CrmRecord {
  id: string
  customerName: string | null
  email: string
  company: string | null
  source: string
  createdAt: string
  sourceEmailId?: string
}

export interface CreateCrmRecordRequest {
  customerName: string | null
  email: string
  company?: string
  source: string
  sourceEmailId?: string
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

export interface RunWorkflowRequest {
  sender: string
  subject: string
  body: string
}

export interface RunWorkflowResponse {
  status: string
  result: unknown
}
