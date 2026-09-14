"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

interface SavedArticle {
  slug: string;
  title: string;
  // In a real app we'd fetch full details for saved slugs, here we'll use a mocked structure or minimal display
}

export default function SavedPage() {
  const { bookmarks, toggleBookmark } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[color:var(--color-surface-page)]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <div className="flex items-center justify-between mb-12 border-b border-[color:var(--color-border-default)] pb-8">
          <div>
            <span className="section-eyebrow text-[color:var(--color-muted-text)] mb-2 inline-block">தனிப்பட்ட</span>
            <h1 className="editorial-headline text-[color:var(--color-heading)] m-0 inline-block wavy-underline">சேமிக்கப்பட்டவை</h1>
          </div>
          {mounted && (
            <span className="font-[family-name:var(--font-ui)] text-[length:var(--text-body)] font-bold text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] bg-[color:var(--color-moss)]/10 dark:bg-[color:var(--color-lime-sprout)]/10 px-4 py-2 rounded-[length:var(--radius-chips)]">
              {bookmarks.length} கட்டுரைகள்
            </span>
          )}
        </div>
        
        {!mounted ? (
          <div className="text-center py-20 font-[family-name:var(--font-ui)] font-bold text-[color:var(--color-muted-text)]">சுமையேற்றுகிறது...</div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-24 bg-[color:var(--color-surface-card)] rounded-[length:var(--radius-cards)] border border-[color:var(--color-border-default)]">
            <div className="w-20 h-20 bg-[color:var(--color-surface-page)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-10 h-10 text-[color:var(--color-muted-text)]" />
            </div>
            <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[color:var(--color-heading)] mb-2">சேமிக்கப்பட்டவை ஏதுமில்லை</p>
            <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-body-text)] max-w-md mx-auto">
              நீங்கள் இன்னும் எந்த கட்டுரைகளையும் சேமிக்கவில்லை. கட்டுரைகளை வாசிக்கும் போது 'சேமிக்க' பட்டனை அழுத்தி இங்கு சேமிக்கலாம்.
            </p>
            <Link 
              href="/blog"
              className="mt-8 inline-block font-[family-name:var(--font-ui)] text-[length:var(--text-body)] font-bold bg-[color:var(--color-moss)] text-white px-6 py-3 rounded-[length:var(--radius-buttons)] hover:-translate-y-1 transition-all"
            >
              கட்டுரைகளை வாசிக்க
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookmarks.map((slug) => (
              <div 
                key={slug} 
                className="bg-[color:var(--color-surface-card)] p-6 rounded-[length:var(--radius-cards)] border border-[color:var(--color-border-default)] hover:border-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex-grow">
                  <Link href={`/blog/${slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)] rounded">
                    <h3 className="font-[family-name:var(--font-display)] font-bold text-subheading text-[color:var(--color-heading)] group-hover:text-[color:var(--color-moss)] dark:group-hover:text-[color:var(--color-lime-sprout)] transition-colors line-clamp-2">
                      {/* In a real app we would load the actual title from an API / lookup table. For now we format the slug */}
                      {slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h3>
                  </Link>
                  <p className="font-[family-name:var(--font-ui)] text-sm text-[color:var(--color-muted-text)] mt-2">
                    சேமிக்கப்பட்ட கட்டுரை
                  </p>
                </div>
                <button 
                  onClick={() => toggleBookmark(slug)}
                  className="p-3 text-[color:var(--color-muted-text)] hover:text-[color:var(--color-ember-coral)] hover:bg-[color:var(--color-surface-page)] rounded-full transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
                  title="Remove Bookmark"
                  aria-label="புத்தகக்குறியை அகற்றவும்"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
