import { useSyncExternalStore } from 'react'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(DARK_QUERY)
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.matchMedia(DARK_QUERY).matches
}

// index.css themes purely off the OS `prefers-color-scheme` media query (no
// manual toggle), so chart color picks follow the same signal.
export function useIsDarkMode(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
