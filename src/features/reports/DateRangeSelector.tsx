const PRESETS = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
  { label: '365d', days: 365 },
]

interface DateRangeSelectorProps {
  days: number
  onChange: (days: number) => void
}

export function DateRangeSelector({ days, onChange }: DateRangeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-[var(--text)]">Range:</span>
      <div className="flex gap-1">
        {PRESETS.map((preset) => (
          <button
            key={preset.days}
            type="button"
            onClick={() => onChange(preset.days)}
            aria-pressed={days === preset.days}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              days === preset.days
                ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
                : 'text-[var(--text)] hover:bg-[var(--code-bg)] hover:text-[var(--text-h)]'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <label className="ml-2 flex items-center gap-2 text-sm text-[var(--text)]">
        Custom:
        <input
          type="number"
          min={1}
          max={365}
          value={days}
          onChange={(event) => {
            const value = Number(event.target.value)
            if (Number.isInteger(value) && value >= 1 && value <= 365) {
              onChange(value)
            }
          }}
          className="w-20 rounded-md border border-[var(--border)] bg-transparent px-2 py-1.5 text-sm text-[var(--text-h)] outline-none focus-visible:border-[var(--accent-border)]"
        />
      </label>
    </div>
  )
}
