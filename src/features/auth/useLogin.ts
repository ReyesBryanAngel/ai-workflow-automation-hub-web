import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { LoginRequest, LoginResponse } from '@/types/api'

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials)
      return data
    },
  })
}
