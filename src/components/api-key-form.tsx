"use client";
import { useState } from "react";
import { useSettingsStore } from "@/stores/settings.store";

export function ApiKeyForm() {
  const { apiKey, setApiKey } = useSettingsStore();
  const [draft, setDraft] = useState(apiKey);
  return (
    <section className="space-y-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 text-zinc-900 dark:text-zinc-100 shadow-sm">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Gemini API key <span className="font-normal text-zinc-500 dark:text-zinc-400">(optional)</span></h2>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setApiKey(draft.trim()); }}>
        <input type="password" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="AIza…" autoComplete="off"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/30" />
        <button className="rounded-lg bg-zinc-900 px-3 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">Save</button>
      </form>
      {apiKey && <button className="text-xs text-red-600" onClick={() => { setApiKey(""); setDraft(""); }}>Remove key</button>}
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Kept only in this browser tab and sent with each request. Never saved on the server. <a className="underline" href="https://aistudio.google.com/apikey" target="_blank">Get a key</a></p>
    </section>
  );
}
