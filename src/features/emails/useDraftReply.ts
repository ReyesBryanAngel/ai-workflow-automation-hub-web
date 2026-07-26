import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { DraftReplyRequest, DraftReplyResult } from '@/types/api'

export function useDraftReply() {
  return useMutation({
    mutationFn: async (payload: DraftReplyRequest) => {
      const { data } = await apiClient.post<DraftReplyResult>('/ai/reply', payload)
      return data
    },
  })
}
