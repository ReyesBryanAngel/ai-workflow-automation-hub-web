import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { AnalyzeEmailRequest, AnalyzeEmailResult } from '@/types/api'

export function useAnalyzeEmail() {
  return useMutation({
    mutationFn: async (payload: AnalyzeEmailRequest) => {
      const { data } = await apiClient.post<AnalyzeEmailResult>('/ai/analyze', payload)
      return data
    },
  })
}
