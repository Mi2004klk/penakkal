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
      root.setAttribute('data-theme', systemTheme);
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) metaThemeColor.setAttribute('content', systemTheme === 'dark' ? '#171717' : '#fcf7ed');
    } else {
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) metaThemeColor.setAttribute('content', theme === 'dark' ? '#171717' : '#fcf7ed');
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
      const isDark = mediaQuery.matches;
      root.classList.remove("light", "dark");
      root.classList.add(isDark ? "dark" : "light");
      root.setAttribute('data-theme', isDark ? "dark" : "light");
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) metaThemeColor.setAttribute('content', isDark ? '#171717' : '#fcf7ed');
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return <>{children}</>;
}
