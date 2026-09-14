"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((state) => state.theme);
  const fontSize = useStore((state) => state.fontSize);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Handle theme
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Handle font size
    root.setAttribute("data-font-size", fontSize);
  }, [theme, fontSize]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return <>{children}</>;
}
