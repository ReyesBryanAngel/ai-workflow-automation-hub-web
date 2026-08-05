import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useIsDarkMode } from '@/lib/useIsDarkMode'
import type { EmailsPerDayPoint } from '@/types/api'
import { trendLineColor } from './reportColors'

const MAX_VISIBLE_TICKS = 8

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

interface EmailsPerDayChartProps {
  data: EmailsPerDayPoint[] | undefined
  isLoading: boolean
}

export function EmailsPerDayChart({ data, isLoading }: EmailsPerDayChartProps) {
  const isDark = useIsDarkMode()
  const gridColor = isDark ? '#2e303a' : '#e5e4e7'
  const axisColor = isDark ? '#9ca3af' : '#6b6375'
  const color = trendLineColor(isDark)
  const hasActivity = Boolean(data?.some((point) => point.count > 0))

  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <h2 className="text-base font-semibold text-[var(--text-h)]">Emails per Day</h2>

      {isLoading && <div className="mt-3 h-64 animate-pulse rounded-md bg-[var(--code-bg)]" />}

      {!isLoading && data && hasActivity && (
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="emailsPerDayFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                interval={Math.max(0, Math.ceil(data.length / MAX_VISIBLE_TICKS) - 1)}
                stroke={axisColor}
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                stroke={axisColor}
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
                width={32}
              />
              <Tooltip
                labelFormatter={(label) => formatDate(String(label))}
                formatter={(value) => [String(value), 'Emails']}
                contentStyle={{
                  background: isDark ? '#1f2028' : '#f4f3ec',
                  border: `1px solid ${gridColor}`,
                  borderRadius: 8,
                  color: isDark ? '#f3f4f6' : '#08060d',
                  fontSize: 13,
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={color}
                strokeWidth={2}
                fill="url(#emailsPerDayFill)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: isDark ? '#1a1a19' : '#fcfcfb' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {!isLoading && data && !hasActivity && (
        <p className="mt-3 text-sm text-[var(--text)]">No email activity in this range.</p>
      )}
    </div>
  )
}
