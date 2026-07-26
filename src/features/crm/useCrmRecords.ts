import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { CrmRecord } from '@/types/api'

export function useCrmRecords() {
  return useQuery({
    queryKey: ['crm-records'],
    queryFn: async () => {
      const { data } = await apiClient.get<CrmRecord[]>('/crm/records')
      return data
    },
  })
}
