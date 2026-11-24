"use client";
import { useCallback } from "react";
import { useSettingsStore } from "@/stores/settings.store";

export function useApi() {
  const apiKey = useSettingsStore((s) => s.apiKey);
  return useCallback(
    async <T,>(url: string, init: RequestInit = {}): Promise<T> => {
      const headers = new Headers(init.headers);
      if (apiKey) headers.set("x-gemini-key", apiKey);
      const res = await fetch(url, { ...init, headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      return data as T;
    },
    [apiKey],
  );
}
