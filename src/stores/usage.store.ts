"use client";
import { create } from "zustand";
import type { Usage } from "./types";
interface UsageState { usage: Usage | null; set: (u: Usage) => void }
export const useUsageStore = create<UsageState>((set) => ({ usage: null, set: (usage) => set({ usage }) }));
