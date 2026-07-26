import { isAxiosError } from 'axios'
import type { ApiErrorBody } from '@/types/api'

export interface FieldError {
  path: string
  message: string
}

// Maps the error shapes documented in FRONTEND_TASKS.md §0/§6 to user-facing copy.
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (isAxiosError(error)) {
    const status = error.response?.status
    if (status === 429) return 'Too many requests — wait a bit and retry'
    if (status === 502 || status === 503 || status === 504) {
      return 'Service temporarily unavailable — please retry'
    }
    const data = error.response?.data as ApiErrorBody | undefined
    if (typeof data?.error === 'string') return data.error
  }
  return fallback
}

export function getApiFieldErrors(error: unknown): FieldError[] {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined
    if (Array.isArray(data?.details)) {
      return data.details.map((detail) => ({
        path: detail.path.join('.'),
        message: detail.message,
      }))
    }
  }
  return []
}

export function isRetryableApiError(error: unknown): boolean {
  if (isAxiosError(error)) {
    const status = error.response?.status
    return status === 502 || status === 503 || status === 504
  }
  return false
}
