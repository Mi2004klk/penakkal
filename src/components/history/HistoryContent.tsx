"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { History, Trash2 } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import ArticleListSkeleton from "@/components/ui/ArticleListSkeleton";

export default function HistoryContent() {
  const history = useStore((s) => s.history);
  const clearHistory = useStore((s) => s.clearHistory);
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-12 border-b border-border-default pb-8">
        <div>
          <span className="section-eyebrow text-muted-text mb-2 inline-block">தனிப்பட்ட</span>
          <h1 className="editorial-headline text-heading m-0 inline-block wavy-underline">வாசிப்பு வரலாறு</h1>
        </div>
        {mounted && history.length > 0 && (
          <div className="relative">
            <Button 
              onClick={() => setShowConfirm(true)}
              variant="alert"
              size="sm"
              className="flex items-center gap-2 font-ui text-body-sm font-bold"
            >
              <Trash2 className="w-4 h-4" />
              வரலாற்றை அழி
            </Button>
            {showConfirm && (
              <div 
                role="alertdialog" 
                aria-modal="true"
                className="absolute right-0 top-full mt-2 w-64 p-4 bg-surface-card border border-border-default rounded-cards shadow-modal z-50 flex flex-col gap-3"
              >
                <p className="font-ui text-body-sm font-bold text-heading text-center">வரலாற்றை அழிக்க விரும்புகிறீர்களா?</p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => { clearHistory(); setShowConfirm(false); }}
                    variant="alert"
                    size="sm"
                    className="flex-1"
                  >
                    ஆம்
                  </Button>
                  <Button 
                    onClick={() => setShowConfirm(false)}
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    ரத்து
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {!mounted ? (
        <div className="mt-8">
          <ArticleListSkeleton viewMode="list" count={4} />
        </div>
      ) : history.length === 0 ? (
        <EmptyState 
          icon={History}
          title="வரலாறு காலியாக உள்ளது"
          description="நீங்கள் இதுவரை எந்தக் கட்டுரைகளையும் படிக்கவில்லை. எங்கள் சமீபத்திய கட்டுரைகளை வாசிக்கத் தொடங்குங்கள்."
          action={{
            label: "கட்டுரைகளை வாசிக்க",
            href: "/blog"
          }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((item) => (
            <div 
              key={item.slug} 
              className="bg-surface-card p-6 rounded-cards shadow-card hover:shadow-modal border border-border-default hover:border-moss transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex-grow">
                <Link href={`/blog/${item.slug}`} className="rounded-buttons">
                  <h3 className="font-display font-bold text-subheading text-heading group-hover:text-text-link transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 font-ui text-body-sm text-muted-text mt-2">
                  <span className="font-bold text-text-link">சமீபத்தில் வாசித்தது</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-border-default"></span>
                  <span>{formatDate(new Date(item.timestamp), "long")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
