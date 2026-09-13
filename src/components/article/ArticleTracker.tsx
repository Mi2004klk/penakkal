"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

export default function ArticleTracker({ slug, title }: { slug: string; title: string }) {
  const addToHistory = useStore((s) => s.addToHistory);
  const hasTracked = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasTracked.current) return;
      
      // If user scrolls down ~300px, count it as a read
      if (window.scrollY > 300) {
        hasTracked.current = true;
        addToHistory({
          slug,
          title,
          timestamp: Date.now(),
          progress: 5, // Approximate starting progress
        });
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Also track if they stay on the page for 10 seconds (e.g., short article)
    const timer = setTimeout(() => {
      if (!hasTracked.current) {
        hasTracked.current = true;
        addToHistory({
          slug,
          title,
          timestamp: Date.now(),
          progress: 0,
        });
      }
    }, 10000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [slug, title, addToHistory]);

  return null;
}
