import type { EmailCategory, EmailStatus, Priority } from '@/types/api'

export const CATEGORY_LABELS: Record<EmailCategory, string> = {
  SALES: 'Sales',
  SUPPORT: 'Support',
  BILLING: 'Billing',
  COMPLAINT: 'Complaint',
  GENERAL_INQUIRY: 'General Inquiry',
  SPAM: 'Spam',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
}

export const STATUS_LABELS: Record<EmailStatus, string> = {
  PENDING: 'Pending',
  PROCESSED: 'Processed',
  FAILED: 'Failed',
}
