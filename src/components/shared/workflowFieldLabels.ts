import type { WorkflowStatus } from '@/types/api'

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  SUCCESS: 'Success',
  FAILED: 'Failed',
  RETRYING: 'Retrying',
}
