"use client";
import { useApi } from "./use-api";
import { useChatStore } from "@/stores/chat.store";
import type { Citation } from "@/stores/types";

export function useChat(onChange?: () => void) {
  const api = useApi();
  const { messages, pending, add, setPending } = useChatStore();
  const ask = async (question: string) => {
    add({ id: crypto.randomUUID(), role: "user", content: question });
    setPending(true);
    try {
      const r = await api<{ answer: string; citations: Citation[]; usage: { inputTokens: number; outputTokens: number }; model?: string }>("/api/chat", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question }),
      });
      add({ id: crypto.randomUUID(), role: "assistant", content: r.answer, citations: r.citations, usage: r.usage, model: r.model });
    } catch (e) {
      add({ id: crypto.randomUUID(), role: "assistant", content: `⚠️ ${(e as Error).message}` });
    } finally { setPending(false); onChange?.(); }
  };
  return { messages, pending, ask };
}
