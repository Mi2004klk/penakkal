"use client";

import { useEffect, useState, useRef } from "react";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import Image from "next/image";
import { formatDate, pluralizeTa } from "@/lib/utils";
import { Bookmark, Trash2, ImageIcon } from "lucide-react";
import ArticleListSkeleton from "@/components/ui/ArticleListSkeleton";
import EmptyState from "@/components/ui/EmptyState";

export default function SavedContent() {
  const bookmarks = useStore((s) => s.bookmarks);
  const removeBookmark = useStore((s) => s.removeBookmark);
  const restoreBookmark = useStore((s) => s.restoreBookmark);
  const [mounted, setMounted] = useState(false);
  const [lastRemoved, setLastRemoved] = useState<{ slug: string; title: string; coverImage?: string; savedAt: number } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleRemove = (bookmark: { slug: string; title: string; coverImage?: string; savedAt: number }) => {
    removeBookmark(bookmark.slug);
    setLastRemoved(bookmark);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setLastRemoved(null), 5000);
  };

  const handleUndo = () => {
    if (lastRemoved) {
      restoreBookmark(lastRemoved);
      setLastRemoved(null);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  };

  const validBookmarks = bookmarks.filter(b => typeof b === 'object' && b !== null) as { slug: string; title: string; coverImage?: string; savedAt: number }[];

  return (
    <>
      <div className="flex items-center justify-between mb-12 border-b border-border-default pb-8">
        <div>
          <span className="section-eyebrow text-muted-text mb-2 inline-block">தனிப்பட்ட</span>
          <h1 className="editorial-headline text-heading m-0 inline-block wavy-underline">சேமிக்கப்பட்டவை</h1>
        </div>
        {mounted && (
          <span className="font-ui text-body font-bold text-text-link bg-moss/10 px-4 py-2 rounded-chips">
            {pluralizeTa(bookmarks.length, "கட்டுரை", "கட்டுரைகள்")}
          </span>
        )}
      </div>
      
      {!mounted ? (
        <div className="mt-8">
          <ArticleListSkeleton viewMode="list" count={3} />
        </div>
      ) : validBookmarks.length === 0 ? (
        <EmptyState 
          icon={Bookmark}
          title="சேமித்த கட்டுரைகள் எதுவும் இல்லை"
          description="நீங்கள் இதுவரை எந்தக் கட்டுரைகளையும் சேமிக்கவில்லை. கட்டுரைகளை வாசிக்கும்போது புக்மார்க் ஐகானைக் கிளிக் செய்து சேமிக்கலாம்."
          action={{
            label: "கட்டுரைகளை வாசிக்க",
            href: "/blog"
          }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {validBookmarks.map((bookmark) => (
            <div 
              key={bookmark.slug} 
              className="bg-surface-card p-6 rounded-cards border border-border-default hover:border-moss transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="relative w-full sm:w-32 aspect-video sm:aspect-square flex-shrink-0 rounded-cards overflow-hidden bg-surface-page border border-border-default">
                {bookmark.coverImage ? (
                  <Image
                    src={bookmark.coverImage}
                    alt={bookmark.title}
                    fill
                    sizes="128px"
                    className="object-cover transition-transform"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-surface-cream-paper rounded-lg flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-6 h-6 text-muted-text" aria-hidden="true" focusable="false" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <Link href={`/blog/${bookmark.slug}`} className="rounded-buttons">
                  <h3 className="font-display font-bold text-subheading text-heading group-hover:text-text-link transition-colors line-clamp-2">
                    {bookmark.title}
                  </h3>
                </Link>
                <p className="font-ui text-sm text-muted-text mt-2">
                  {formatDate(new Date(bookmark.savedAt), "long")} அன்று சேமிக்கப்பட்டது
                </p>
              </div>
              <button 
                onClick={() => handleRemove(bookmark)}
                className="p-3 text-muted-text hover:text-error hover:bg-surface-page rounded-full transition-colors flex-shrink-0"
                title="புத்தகக்குறியை அகற்றவும்"
                aria-label="புத்தகக்குறியை அகற்றவும்"
              >
                <Trash2 className="w-5 h-5" aria-hidden="true" focusable="false" />
              </button>
            </div>
          ))}
        </div>
      )}

      {lastRemoved && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-heading text-surface-pure-white-card px-4 py-3 rounded-buttons shadow-modal z-toast flex items-center gap-4 font-ui animate-fade-in-up"
        >
          <span className="text-sm">புக்மார்க் அகற்றப்பட்டது</span>
          <button 
            onClick={handleUndo}
            className="text-lime-sprout font-bold hover:underline focus-visible:ring-2 focus-visible:ring-lime-sprout rounded"
          >
            மீட்டமை
          </button>
        </div>
      )}
    </>
  );
}
