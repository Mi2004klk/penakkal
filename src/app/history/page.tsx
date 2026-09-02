"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { History, Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

export default function HistoryPage() {
  const { history, clearHistory } = useStore();
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
            <h1 className="editorial-headline text-[color:var(--color-heading)] m-0 inline-block wavy-underline">வாசிப்பு வரலாறு</h1>
          </div>
          {mounted && history.length > 0 && (
            <button 
              onClick={clearHistory}
              className="flex items-center gap-2 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold text-[color:var(--color-ember-coral)] bg-[color:var(--color-ember-coral)]/10 hover:bg-[color:var(--color-ember-coral)]/20 px-4 py-2 rounded-[length:var(--radius-chips)] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>வரலாற்றை அழி</span>
            </button>
          )}
        </div>
        
        {!mounted ? (
          <div className="text-center py-20 font-[family-name:var(--font-ui)] font-bold text-[color:var(--color-muted-text)]">சுமையேற்றுகிறது...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-24 bg-[color:var(--color-surface-card)] rounded-[length:var(--radius-cards)] border border-[color:var(--color-border-default)] shadow-[var(--shadow-card)]">
            <div className="w-20 h-20 bg-[color:var(--color-surface-page)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <History className="w-10 h-10 text-[color:var(--color-muted-text)]" />
            </div>
            <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[color:var(--color-heading)] mb-2">வரலாறு ஏதுமில்லை</p>
            <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-body-text)] max-w-md mx-auto">
              நீங்கள் இன்னும் எந்த கட்டுரைகளையும் வாசிக்கவில்லை. கட்டுரைகளை வாசிக்கும் போது அவை இங்கு சேமிக்கப்படும்.
            </p>
            <Link 
              href="/blog"
              className="mt-8 inline-block font-[family-name:var(--font-ui)] text-[length:var(--text-body)] font-bold bg-[color:var(--color-moss)] text-white px-6 py-3 rounded-[length:var(--radius-buttons)] shadow-[var(--)] hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              கட்டுரைகளை வாசிக்க
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map((item) => (
              <div 
                key={item.slug} 
                className="bg-[color:var(--color-surface-card)] p-6 rounded-[length:var(--radius-cards)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-modal)] border border-[color:var(--color-border-default)] hover:border-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex-grow">
                  <Link href={`/blog/${item.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)] rounded">
                    <h3 className="font-[family-name:var(--font-display)] font-bold text-subheading text-[color:var(--color-heading)] group-hover:text-[color:var(--color-moss)] dark:group-hover:text-[color:var(--color-lime-sprout)] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[color:var(--color-muted-text)] mt-2">
                    <span className="font-bold text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)]">சமீபத்தில் வாசித்தது</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-border-default)]"></span>
                    <span>{new Date(item.timestamp).toLocaleDateString('ta-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
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
