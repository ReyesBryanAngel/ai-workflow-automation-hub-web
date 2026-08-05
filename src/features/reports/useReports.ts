import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { ReportsData } from '@/types/api'

export function useReports(days: number) {
  return useQuery({
    queryKey: ['reports', days],
    queryFn: async () => {
      const { data } = await apiClient.get<ReportsData>('/reports', { params: { days } })
      return data
    },
    placeholderData: keepPreviousData,
  })
}
