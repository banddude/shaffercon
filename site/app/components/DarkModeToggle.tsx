"use client";

import { useEffect, useState } from "react";
import * as Switch from "@radix-ui/react-switch";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const darkMode = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode = darkMode ? darkMode === "true" : prefersDark;

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setIsDark(checked);
    localStorage.setItem("darkMode", checked.toString());

    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) return null;

  return (
    <Switch.Root
      checked={isDark}
      onCheckedChange={toggleDarkMode}
      className="relative inline-flex h-6 w-14 items-center rounded-full transition-colors focus:outline-none"
      style={{
        backgroundColor: "var(--primary)",
      }}
      aria-label="Toggle dark mode"
    >
      <span
        className="absolute text-xs font-semibold pointer-events-none transition-all duration-300"
        style={{
          color: "#ffffff",
          left: "20px",
        }}
      >
        {isDark ? "Dark" : "Light"}
      </span>
      <Switch.Thumb
        className="inline-flex items-center justify-center h-4 w-4 transition-transform"
        style={{
          backgroundColor: "transparent",
          transform: "translateX(4px)",
        }}
      >
        {isDark ? (
          <svg
            className="h-4 w-4"
            fill="#000000"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <span className="text-sm font-bold" style={{ color: "#ffffff" }}>☼</span>
        )}
      </Switch.Thumb>
    </Switch.Root>
  );
}
