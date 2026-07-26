interface StatCardProps {
  label: string
  value: number
  isLoading?: boolean
}

export function StatCard({ label, value, isLoading }: StatCardProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <p className="text-sm text-[var(--text)]">{label}</p>
      {isLoading ? (
        <div className="mt-2 h-8 w-16 animate-pulse rounded bg-[var(--code-bg)]" />
      ) : (
        <p className="mt-2 text-2xl font-semibold text-[var(--text-h)]">{value}</p>
      )}
    </div>
  )
}
