import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { WorkflowLog } from '@/types/api'

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data } = await apiClient.get<WorkflowLog[]>('/workflows')
      return data
    },
  })
}
