import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { CreateCrmRecordRequest, CrmRecord } from '@/types/api'

export function useCreateCrmRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateCrmRecordRequest) => {
      const { data } = await apiClient.post<CrmRecord>('/crm/records', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-records'] })
    },
  })
}
