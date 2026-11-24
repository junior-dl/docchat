"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// The user's own key stays in this browser tab (sessionStorage). It's never saved on the server.
interface SettingsState { apiKey: string; setApiKey: (k: string) => void }
export const useSettingsStore = create<SettingsState>()(
  persist((set) => ({ apiKey: "", setApiKey: (apiKey) => set({ apiKey }) }), {
    name: "rag-settings",
    storage: createJSONStorage(() => sessionStorage),
  }),
);
