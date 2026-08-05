import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PRIORITY_LABELS } from '@/components/shared/emailFieldLabels'
import { useIsDarkMode } from '@/lib/useIsDarkMode'
import type { PriorityDistributionPoint } from '@/types/api'
import { priorityColor } from './reportColors'

interface PriorityDistributionChartProps {
  data: PriorityDistributionPoint[] | undefined
  isLoading: boolean
}

export function PriorityDistributionChart({ data, isLoading }: PriorityDistributionChartProps) {
  const isDark = useIsDarkMode()
  const gridColor = isDark ? '#2e303a' : '#e5e4e7'
  const axisColor = isDark ? '#9ca3af' : '#6b6375'
  const labelColor = isDark ? '#f3f4f6' : '#08060d'

  const hasData = Boolean(data?.some((point) => point.count > 0))

  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <h2 className="text-base font-semibold text-[var(--text-h)]">Priority Distribution</h2>

      {isLoading && <div className="mt-3 h-64 animate-pulse rounded-md bg-[var(--code-bg)]" />}

      {!isLoading && data && hasData && (
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="priority"
                tickFormatter={(value: PriorityDistributionPoint['priority']) =>
                  PRIORITY_LABELS[value]
                }
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
                labelFormatter={(label) =>
                  PRIORITY_LABELS[label as PriorityDistributionPoint['priority']]
                }
                formatter={(value) => [String(value), 'Emails']}
                contentStyle={{
                  background: isDark ? '#1f2028' : '#f4f3ec',
                  border: `1px solid ${gridColor}`,
                  borderRadius: 8,
                  color: labelColor,
                  fontSize: 13,
                }}
              />
              <Bar dataKey="count" maxBarSize={48} radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.priority} fill={priorityColor(entry.priority, isDark)} />
                ))}
                <LabelList dataKey="count" position="top" fill={labelColor} fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {!isLoading && data && !hasData && (
        <p className="mt-3 text-sm text-[var(--text)]">No prioritized emails in this range.</p>
      )}
    </div>
  )
}
