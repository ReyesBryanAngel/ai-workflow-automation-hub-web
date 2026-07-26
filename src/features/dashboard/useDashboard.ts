import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { DashboardStats } from '@/types/api'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardStats>('/dashboard')
      return data
    },
  })
}
