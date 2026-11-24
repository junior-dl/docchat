"use client";
import { useCallback, useEffect } from "react";
import { useApi } from "./use-api";
import { useUsageStore } from "@/stores/usage.store";
import type { Usage } from "@/stores/types";

export function useUsage() {
  const api = useApi();
  const { usage, set } = useUsageStore();
  const refresh = useCallback(() => api<Usage>("/api/usage").then(set).catch(() => {}), [api, set]);
  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 10_000); // the per-minute window drains over time
    return () => clearInterval(t);
  }, [refresh]);
  return { usage, refresh };
}
