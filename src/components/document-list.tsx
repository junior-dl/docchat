"use client";
import { useRef } from "react";
import type { DocumentItem } from "@/stores/types";

export function DocumentList(p: { items: DocumentItem[]; uploading: string | null; error: string | null; onUpload: (f: File) => void; onRemove: (id: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm">
      <h2 className="text-sm font-semibold text-zinc-900">Documents</h2>
      <button onClick={() => input.current?.click()} disabled={!!p.uploading}
        onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) p.onUpload(f); }}
        className="w-full rounded-lg border-2 border-dashed border-zinc-300 p-4 text-sm text-zinc-600 transition hover:border-indigo-400 hover:bg-indigo-50/50 disabled:opacity-60">
        {p.uploading ? `Embedding ${p.uploading}…` : "Drop a PDF or click to upload"}
      </button>
      <input ref={input} type="file" accept="application/pdf" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) p.onUpload(f); e.target.value = ""; }} />
      {p.error && <p className="text-xs text-red-600">{p.error}</p>}
      <ul className="space-y-1">
        {p.items.map((d) => (
          <li key={d.id} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm">
            <span className="truncate">{d.name} <span className="text-xs text-zinc-500">· {d.pageCount} pages · {d.chunkCount} chunks</span></span>
            <button onClick={() => p.onRemove(d.id)} className="text-xs text-zinc-500 hover:text-red-600" aria-label={`Remove ${d.name}`}>✕</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
