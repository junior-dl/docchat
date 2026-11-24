"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme.store";

export function useTheme() {
  const { theme, setTheme } = useThemeStore();
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
  return { theme, setTheme };
}
