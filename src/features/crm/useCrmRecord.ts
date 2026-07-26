import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { CrmRecord } from '@/types/api'

export function useCrmRecord(id: string | undefined) {
  return useQuery({
    queryKey: ['crm-records', id],
    queryFn: async () => {
      const { data } = await apiClient.get<CrmRecord>(`/crm/records/${id}`)
      return data
    },
    enabled: Boolean(id),
  })
}
