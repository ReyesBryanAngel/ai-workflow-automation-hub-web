import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { Email } from '@/types/api'

export function useEmails() {
  return useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const { data } = await apiClient.get<Email[]>('/emails')
      return data
    },
  })
}
