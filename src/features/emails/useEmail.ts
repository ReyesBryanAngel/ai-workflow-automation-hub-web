import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { Email } from '@/types/api'

export function useEmail(id: string | undefined) {
  return useQuery({
    queryKey: ['emails', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Email>(`/emails/${id}`)
      return data
    },
    enabled: Boolean(id),
  })
}
