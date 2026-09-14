"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function ArticleTracker({ slug, title }: { slug: string; title: string }) {
  const { addToHistory } = useStore();

  useEffect(() => {
    // Only track if we are in the browser
    const timer = setTimeout(() => {
      addToHistory({
        slug,
        title,
        timestamp: Date.now(),
        progress: 0, // In a more complex app, we'd update this based on scroll
      });
    }, 5000); // Record after 5 seconds of reading

    return () => clearTimeout(timer);
  }, [slug, title, addToHistory]);

  return null;
}
