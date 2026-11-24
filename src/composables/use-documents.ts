"use client";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "./use-api";
import { useDocumentsStore } from "@/stores/documents.store";
import type { DocumentItem } from "@/stores/types";

export function useDocuments(ready: boolean, onChange?: () => void) {
  const api = useApi();
  const store = useDocumentsStore();
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(() => api<DocumentItem[]>("/api/documents").then(store.set), [api, store.set]);
  useEffect(() => { if (ready) load().catch(() => {}); }, [ready, load]);

  const upload = async (file: File) => {
    setError(null);
    store.setUploading(file.name);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await api("/api/documents", { method: "POST", body: fd });
      await load();
    } catch (e) { setError((e as Error).message); }
    finally { store.setUploading(null); onChange?.(); }
  };
  const remove = async (id: string) => { await api(`/api/documents/${id}`, { method: "DELETE" }); await load(); };
  return { ...store, upload, remove, error };
}
