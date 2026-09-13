"use client";

import { useStore } from "@/store/useStore";
import { Bookmark } from "lucide-react";
import { useState, useEffect } from "react";

export default function BookmarkToggle({ article }: { article: { slug: string; title: string; coverImage?: string } }) {
  const bookmarks = useStore((s) => s.bookmarks);
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 p-2.5 rounded-full border border-transparent"></div>;
  }

  // bookmarks could be strings if legacy, so handle gracefully
  const isBookmarked = bookmarks.some(b => 
    (typeof b === 'string' ? b : b.slug) === article.slug
  );

  return (
    <button
      onClick={() => toggleBookmark({ slug: article.slug, title: article.title, coverImage: article.coverImage })}
      className={`touch-target p-2.5 rounded-full transition-colors flex items-center justify-center border ${
        isBookmarked 
          ? "bg-moss text-pure-white border-moss"
          : "bg-surface-card text-muted-text border-border-default hover:text-text-link  hover:border-moss "
      }`}
      title={isBookmarked ? "புக்மார்க்கை அகற்று" : "புக்மார்க் செய்"}
      aria-label={isBookmarked ? "புக்மார்க்கை அகற்று" : "புக்மார்க் செய்"}
      aria-pressed={isBookmarked}
    >
      <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
    </button>
  );
}
