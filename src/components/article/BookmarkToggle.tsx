"use client";

import { useStore } from "@/store/useStore";
import { Bookmark } from "lucide-react";
import { useState, useEffect } from "react";

export default function BookmarkToggle({ slug }: { slug: string }) {
  const { bookmarks, toggleBookmark } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isBookmarked = bookmarks.includes(slug);

  return (
    <button
      onClick={() => toggleBookmark(slug)}
      className={`p-2.5 rounded-full transition-colors flex items-center justify-center border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)] ${
        isBookmarked 
          ? "bg-[color:var(--color-moss)] text-white border-[color:var(--color-moss)]" 
          : "bg-[color:var(--color-surface-card)] text-[color:var(--color-muted-text)] border-[color:var(--color-border-default)] hover:text-[color:var(--color-moss)] dark:hover:text-[color:var(--color-lime-sprout)] hover:border-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)]"
      }`}
      title={isBookmarked ? "புக்மார்க்கை அகற்று" : "புக்மார்க் செய்"}
      aria-label={isBookmarked ? "புக்மார்க்கை அகற்று" : "புக்மார்க் செய்"}
    >
      <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
    </button>
  );
}
