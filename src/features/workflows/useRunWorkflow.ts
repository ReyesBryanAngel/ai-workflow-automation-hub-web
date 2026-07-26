import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { RunWorkflowRequest, RunWorkflowResponse } from '@/types/api'

export function useRunWorkflow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RunWorkflowRequest) => {
      const { data } = await apiClient.post<RunWorkflowResponse>('/workflows/run', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
    },
  })
}
