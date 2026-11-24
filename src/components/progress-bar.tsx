export function ProgressBar({ label, value, max, hint }: { label: string; value: number; max: number; hint?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const tone = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
        <span className="tabular-nums text-zinc-900 dark:text-zinc-100">{value.toLocaleString()} / {max.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800" role="progressbar" aria-valuenow={value} aria-valuemax={max} aria-label={label}>
        <div className={`h-2 rounded-full transition-all ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      {hint && <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{hint}</p>}
    </div>
  );
}
