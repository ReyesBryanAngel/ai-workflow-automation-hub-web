import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { CreateEmailRequest, Email } from '@/types/api'

export function useCreateEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateEmailRequest) => {
      const { data } = await apiClient.post<Email>('/emails', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] })
    },
  })
}
