"use client";
import { useState } from "react";
import type { Message } from "@/stores/types";

export function ChatPanel({ messages, pending, onAsk, disabled }: { messages: Message[]; pending: boolean; onAsk: (q: string) => void; disabled: boolean }) {
  const [q, setQ] = useState("");
  return (
    <section className="flex h-full min-h-[70vh] flex-col rounded-xl border border-zinc-200 bg-white">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {!messages.length && <p className="pt-20 text-center text-sm text-zinc-500">{disabled ? "Upload a PDF to start." : "Ask anything about your documents."}</p>}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "ml-auto max-w-[80%] rounded-2xl bg-indigo-600 px-4 py-2 text-sm text-white" : "max-w-[90%] space-y-2"}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
            {m.citations?.length ? (
              <details className="text-xs">
                <summary className="cursor-pointer text-zinc-500">{m.citations.length} sources</summary>
                <ol className="mt-2 space-y-2">
                  {m.citations.map((c) => (
                    <li key={c.n} className="rounded-lg border border-zinc-200 p-2">
                      <div className="font-medium">[{c.n}] {c.document}, p.{c.page} <span className="font-normal text-zinc-400">· {(c.score * 100).toFixed(0)}% match</span></div>
                      <p className="mt-1 text-zinc-600">{c.snippet}…</p>
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}
            {m.usage && <p className="text-[11px] text-zinc-400">↑ {m.usage.inputTokens.toLocaleString()} tokens sent · ↓ {m.usage.outputTokens.toLocaleString()} received</p>}
          </div>
        ))}
        {pending && <p className="animate-pulse text-sm text-zinc-500">Searching your documents…</p>}
      </div>
      <form className="flex gap-2 border-t border-zinc-200 p-3" onSubmit={(e) => { e.preventDefault(); if (q.trim()) { onAsk(q.trim()); setQ(""); } }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} disabled={disabled || pending} placeholder="e.g. What is the late-submission policy?"
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm disabled:bg-zinc-50" />
        <button disabled={disabled || pending} className="rounded-lg bg-indigo-600 px-4 text-sm text-white disabled:opacity-50">Ask</button>
      </form>
    </section>
  );
}
