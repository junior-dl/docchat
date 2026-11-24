"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";
interface ThemeState { theme: Theme; setTheme: (t: Theme) => void }
export const useThemeStore = create<ThemeState>()(
  persist((set) => ({ theme: "system", setTheme: (theme) => set({ theme }) }), { name: "docchat-theme" }),
);
