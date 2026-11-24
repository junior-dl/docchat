"use client";
import type { Usage } from "@/stores/types";
import { ProgressBar } from "./progress-bar";

export function UsagePanel({ usage }: { usage: Usage | null }) {
  if (!usage) return null;
  const { limits: l } = usage;
  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 text-zinc-900 dark:text-zinc-100 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Usage</h2>
        <span className={`rounded-full px-2 py-0.5 text-[11px] ${usage.keySource === "own" ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"}`}>
          {usage.keySource === "own" ? "Your key" : "Free default key"}
        </span>
      </div>
      <ProgressBar label="Requests this minute" value={usage.minute.requests} max={l.requestsPerMinute} />
      <ProgressBar label="Tokens this minute" value={usage.minute.tokens} max={l.tokensPerMinute} />
      <ProgressBar label="Requests today" value={usage.day.requests} max={l.requestsPerDay} />
      <div className="grid grid-cols-2 gap-2 pt-1 text-center">
        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/60 p-2"><div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{usage.total.inputTokens.toLocaleString()}</div><div className="text-[11px] text-zinc-500 dark:text-zinc-400">tokens sent</div></div>
        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/60 p-2"><div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{usage.total.outputTokens.toLocaleString()}</div><div className="text-[11px] text-zinc-500 dark:text-zinc-400">tokens received</div></div>
      </div>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
        {usage.keySource === "own" ? "Limits are estimates for Gemini's free tier. Your real quota is in Google AI Studio." : "Add your own Gemini key for higher limits."} Embedding tokens are estimated.
      </p>
    </section>
  );
}
