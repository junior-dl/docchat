"use client";
import { useEffect, useState } from "react";
import { useSessionStore } from "@/stores/session.store";
import { useDocumentsStore } from "@/stores/documents.store";
import { useChatStore } from "@/stores/chat.store";

export function useSession() {
  const { expiresAt, setExpiresAt } = useSessionStore();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    fetch("/api/session", { method: "POST" }).then((r) => r.json()).then((d) => { setExpiresAt(d.expiresAt); setReady(true); });
  }, [setExpiresAt]);
  const endNow = async () => {
    await fetch("/api/session", { method: "DELETE" });
    useDocumentsStore.getState().set([]);
    useChatStore.getState().clear();
    const d = await fetch("/api/session", { method: "POST" }).then((r) => r.json());
    setExpiresAt(d.expiresAt);
  };
  return { ready, expiresAt, endNow };
}
