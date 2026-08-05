import type { EmailCategory, Priority, WorkflowStatus } from '@/types/api'

interface Themed {
  light: string
  dark: string
}

function pick(mode: Themed, isDark: boolean): string {
  return isDark ? mode.dark : mode.light
}

// Validated categorical theme (dataviz skill reference palette) — the fixed
// hue order clears CVD/contrast checks against this app's surfaces (#fff /
// #16171d), unlike the chip colors reused elsewhere in the UI, which don't
// (slate/neutral read as near-identical under CVD simulation).
const TREND_LINE: Themed = { light: '#2a78d6', dark: '#3987e5' }

const CATEGORY_COLORS: Record<EmailCategory, Themed> = {
  SALES: { light: '#2a78d6', dark: '#3987e5' },
  SUPPORT: { light: '#eb6834', dark: '#d95926' },
  BILLING: { light: '#1baf7a', dark: '#199e70' },
  COMPLAINT: { light: '#eda100', dark: '#c98500' },
  GENERAL_INQUIRY: { light: '#e87ba4', dark: '#d55181' },
  SPAM: { light: '#008300', dark: '#008300' },
}

// Priority is an ordered severity scale, so it borrows the reserved
// status palette (good → critical) rather than the nominal categorical set.
const PRIORITY_COLORS: Record<Priority, Themed> = {
  LOW: { light: '#0ca30c', dark: '#0ca30c' },
  MEDIUM: { light: '#fab219', dark: '#fab219' },
  HIGH: { light: '#ec835a', dark: '#ec835a' },
  CRITICAL: { light: '#d03b3b', dark: '#d03b3b' },
}

const WORKFLOW_STATUS_COLORS: Record<WorkflowStatus, Themed> = {
  SUCCESS: { light: '#0ca30c', dark: '#0ca30c' },
  FAILED: { light: '#d03b3b', dark: '#d03b3b' },
  RETRYING: { light: '#fab219', dark: '#fab219' },
}

export function trendLineColor(isDark: boolean): string {
  return pick(TREND_LINE, isDark)
}

export function categoryColor(category: EmailCategory, isDark: boolean): string {
  return pick(CATEGORY_COLORS[category], isDark)
}

export function priorityColor(priority: Priority, isDark: boolean): string {
  return pick(PRIORITY_COLORS[priority], isDark)
}

export function workflowStatusColor(status: WorkflowStatus, isDark: boolean): string {
  return pick(WORKFLOW_STATUS_COLORS[status], isDark)
}

const RATE_GOOD_THRESHOLD = 0.9
const RATE_WARNING_THRESHOLD = 0.7

// Reserved status hues (good/warning/critical), same three steps as
// WORKFLOW_STATUS_COLORS — these are mode-invariant per the palette reference.
export function successRateColor(rate: number): string {
  if (rate >= RATE_GOOD_THRESHOLD) return '#0ca30c'
  if (rate >= RATE_WARNING_THRESHOLD) return '#fab219'
  return '#d03b3b'
}
