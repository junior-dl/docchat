"use client";
import { useTheme } from "@/composables/use-theme";
import type { Theme } from "@/stores/theme.store";

const options: { value: Theme; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "system", label: "System", icon: "💻" },
  { value: "dark", label: "Dark", icon: "🌙" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div role="radiogroup" aria-label="Theme" className="flex rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
      {options.map((o) => (
        <button key={o.value} role="radio" aria-checked={theme === o.value} aria-label={o.label} title={o.label} onClick={() => setTheme(o.value)}
          className={`rounded-md px-2 py-1 text-xs ${theme === o.value ? "bg-zinc-100 dark:bg-zinc-800" : "opacity-60 hover:opacity-100"}`}>
          {o.icon}
        </button>
      ))}
    </div>
  );
}
