"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: theme is only known client-side.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9 border-2 border-transparent" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center border-2 border-ink-900 text-ink-700 transition hover:bg-ink-900 hover:text-paper-50 dark:border-paper-200 dark:text-paper-100 dark:hover:bg-paper-100 dark:hover:text-ink-900"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}