"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import { useStore } from "@/store/useStore";
import JsonLd from "@/components/seo/JsonLd";
import { getSearchResultsSchema } from "@/lib/seo";

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  categoryTamil: string;
  tags: string[];
  readingTime: number;
}

const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-[color:var(--color-moss)]/20 text-[color:var(--color-moss)] dark:bg-[color:var(--color-lime-sprout)]/20 dark:text-[color:var(--color-lime-sprout)] font-bold px-0.5 rounded">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [manifest, setManifest] = useState<SearchResult[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addRecentSearch } = useStore();

  useEffect(() => {
    fetch('/search-manifest.json')
      .then(res => res.json())
      .then(data => {
        setManifest(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load search manifest", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!manifest.length) return;
    
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = manifest.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(lowerQuery);
      const matchTag = item.tags.some(t => t.toLowerCase().includes(lowerQuery));
      return matchTitle || matchTag;
    });

    setResults(filtered);
    
    const debounceTimer = setTimeout(() => {
      if (query.trim().length >= 2) {
        addRecentSearch(query.trim());
      }
    }, 1000);
    
    return () => clearTimeout(debounceTimer);
  }, [query, manifest, addRecentSearch]);

  return (
    <>
      {query && <JsonLd data={getSearchResultsSchema(query, results.length)} />}
      <div className="max-w-2xl mx-auto mb-16 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="கட்டுரைகளை தேடுங்கள்..."
          aria-label="தேடல்"
          className="w-full px-6 py-4 pl-14 bg-[color:var(--color-surface-card)] border-2 border-[color:var(--color-border-default)] rounded-[length:var(--radius-productframes)] focus:outline-none focus:border-[color:var(--color-moss)] font-[family-name:var(--font-ui)] text-[length:var(--text-subheading)] text-[color:var(--color-heading)] transition-colors"
          autoFocus
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[color:var(--color-muted-text)]" />
      </div>

      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)]" />
          </div>
        ) : query && results.length === 0 ? (
          <div className="text-center py-20 bg-[color:var(--color-surface-card)] rounded-[length:var(--radius-cards)] border border-[color:var(--color-border-default)]">
            <div className="w-20 h-20 bg-[color:var(--color-surface-page)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-[color:var(--color-muted-text)]" />
            </div>
            <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[color:var(--color-heading)] mb-2">முடிவுகள் ஏதுமில்லை</p>
            <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-body-text)]">
              "<span className="font-bold text-[color:var(--color-heading)]">{query}</span>" தொடர்பான எந்த கட்டுரைகளும் கிடைக்கவில்லை.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {results.map((item) => (
              <Link 
                key={item.id} 
                href={`/blog/${item.slug}`}
                className="bg-[color:var(--color-surface-card)] p-6 rounded-[length:var(--radius-cards)] border border-[color:var(--color-border-default)] hover:border-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)] transition-all hover:scale-[1.01] flex flex-col sm:flex-row justify-between gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
              >
                <div>
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-subheading text-[color:var(--color-heading)] group-hover:text-[color:var(--color-moss)] dark:group-hover:text-[color:var(--color-lime-sprout)] transition-colors mb-2">
                    <HighlightText text={item.title} highlight={query} />
                  </h3>
                  <div className="flex items-center gap-3 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)]">
                    <span className="text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] font-bold">{item.categoryTamil}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-border-default)]"></span>
                    <span className="text-[color:var(--color-muted-text)] font-bold">{item.readingTime} நிமிட வாசிப்பு</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap sm:justify-end content-start">
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="font-[family-name:var(--font-ui)] text-xs font-bold px-2 py-1 bg-[color:var(--color-surface-page)] text-[color:var(--color-muted-text)] rounded-[length:var(--radius-chips)]">
                      #<HighlightText text={tag} highlight={query} />
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[color:var(--color-surface-page)]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-center mb-12 text-[color:var(--color-heading)]">தேடல்</h1>
        
        <Suspense fallback={<div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] mx-auto" /></div>}>
          <SearchContent />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
