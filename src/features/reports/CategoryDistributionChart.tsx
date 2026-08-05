import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CATEGORY_LABELS } from '@/components/shared/emailFieldLabels'
import { useIsDarkMode } from '@/lib/useIsDarkMode'
import type { CategoryDistributionPoint } from '@/types/api'
import { categoryColor } from './reportColors'

interface CategoryDistributionChartProps {
  data: CategoryDistributionPoint[] | undefined
  isLoading: boolean
}

export function CategoryDistributionChart({ data, isLoading }: CategoryDistributionChartProps) {
  const isDark = useIsDarkMode()
  const gridColor = isDark ? '#2e303a' : '#e5e4e7'
  const axisColor = isDark ? '#9ca3af' : '#6b6375'
  const labelColor = isDark ? '#f3f4f6' : '#08060d'

  const hasData = Boolean(data?.some((point) => point.count > 0))
  const chartHeight = data ? Math.max(160, data.length * 44) : 160

  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <h2 className="text-base font-semibold text-[var(--text-h)]">Category Distribution</h2>

      {isLoading && <div className="mt-3 h-64 animate-pulse rounded-md bg-[var(--code-bg)]" />}

      {!isLoading && data && hasData && (
        <div style={{ height: chartHeight }} className="mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              barCategoryGap={8}
            >
              <XAxis
                type="number"
                allowDecimals={false}
                stroke={axisColor}
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="category"
                tickFormatter={(value: CategoryDistributionPoint['category']) =>
                  CATEGORY_LABELS[value]
                }
                stroke={axisColor}
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
                width={104}
              />
              <Tooltip
                labelFormatter={(label) =>
                  CATEGORY_LABELS[label as CategoryDistributionPoint['category']]
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
              <Bar dataKey="count" maxBarSize={24} radius={[0, 4, 4, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.category} fill={categoryColor(entry.category, isDark)} />
                ))}
                <LabelList dataKey="count" position="right" fill={labelColor} fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {!isLoading && data && !hasData && (
        <p className="mt-3 text-sm text-[var(--text)]">No categorized emails in this range.</p>
      )}
    </div>
  )
}
