"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, History, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  categoryTamil: string;
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

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { recentSearches, addRecentSearch, clearRecentSearches } = useStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length === 0) return;
          
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const res = await fetch("/search-manifest.json");
        const data: SearchResult[] = await res.json();
        
        const filtered = data.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) || 
          item.categoryTamil.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5); // Limit to 5 instant results
        
        setResults(filtered);
        setSelectedIndex(-1);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 200); // 200ms debounce
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (searchQuery: string) => {
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
      onClose();
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        // Navigate to selected result
        addRecentSearch(query.trim() || results[selectedIndex].title);
        onClose();
        router.push(`/blog/${results[selectedIndex].slug}`);
      } else {
        // Submit search
        handleSearchSubmit(query);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60"
          />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="தேடல்"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-[color:var(--color-surface-pure-white-card)] dark:bg-[color:var(--color-midnight-ink)] rounded-[length:var(--radius-productframes)] overflow-hidden relative z-10 border border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)]"
          >
            <div className="flex items-center px-6 py-4 border-b border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)]">
              <Search className="w-6 h-6 text-[color:var(--color-stone)] mr-4" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="கட்டுரைகளைத் தேடுக..."
                aria-label="தேடல்"
                className="flex-grow bg-transparent text-[length:var(--text-subheading)] font-[family-name:var(--font-ui)] text-[color:var(--color-true-black)] dark:text-[color:var(--color-cream-paper)] focus:outline-none placeholder:text-[color:var(--color-stone)]/50 dark:placeholder:text-[color:var(--color-ash)]/50"
              />
              {isLoading && <Loader2 className="w-5 h-5 text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] animate-spin mr-4" />}
              <button 
                onClick={onClose}
                aria-label="தேடலை மூடு"
                className="p-2 hover:bg-[color:var(--color-surface-cream-paper)] dark:hover:bg-[color:var(--color-slate)] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[color:var(--color-stone)] dark:text-[color:var(--color-ash)]" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {query.trim().length < 2 ? (
                // Recent Searches
                recentSearches.length > 0 ? (
                  <div>
                    <div className="flex justify-between items-center px-2 mb-2">
                      <h3 className="section-eyebrow text-[color:var(--color-true-black)] dark:text-[color:var(--color-cream-paper)]">சமீபத்திய தேடல்கள்</h3>
                      <button 
                        onClick={clearRecentSearches}
                        className="text-xs text-[color:var(--color-stone)] hover:text-[color:var(--color-ember-coral)] transition-colors"
                      >
                        அழி
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setQuery(search);
                            handleSearchSubmit(search);
                          }}
                          className="flex items-center gap-3 w-full text-left p-3 rounded-[length:var(--radius-cards)] hover:bg-[color:var(--color-surface-cream-paper)] dark:hover:bg-[color:var(--color-slate)]/50 transition-colors group"
                        >
                          <History className="w-4 h-4 text-[color:var(--color-stone)]" />
                          <span className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-true-black)] dark:text-[color:var(--color-cream-paper)] flex-grow">{search}</span>
                          <ArrowRight className="w-4 h-4 text-[color:var(--color-stone)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-[color:var(--color-stone)] dark:text-[color:var(--color-ash)] font-[family-name:var(--font-body)]">
                    தேட குறைந்தது 2 எழுத்துக்களை உள்ளிடவும்.
                  </div>
                )
              ) : results.length > 0 ? (
                // Results
                <div className="flex flex-col gap-2">
                  {results.map((result, idx) => (
                    <Link
                      key={result.id}
                      href={`/blog/${result.slug}`}
                      onClick={() => {
                        addRecentSearch(query.trim());
                        onClose();
                      }}
                      className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[length:var(--radius-cards)] transition-colors ${
                        idx === selectedIndex 
                          ? "bg-[color:var(--color-surface-cream-paper)] dark:bg-[color:var(--color-slate)] border-[color:var(--color-moss)] dark:border-[color:var(--color-lime-sprout)] border"
                          : "hover:bg-[color:var(--color-surface-cream-paper)] dark:hover:bg-[color:var(--color-slate)]/50 border border-transparent"
                      }`}
                    >
                      <div>
                        <h4 className="font-[family-name:var(--font-display)] text-body font-bold text-[color:var(--color-true-black)] dark:text-[color:var(--color-cream-paper)] mb-1">
                          <HighlightText text={result.title} highlight={query} />
                        </h4>
                        <span className="font-[family-name:var(--font-ui)] text-sm text-[color:var(--color-stone)] dark:text-[color:var(--color-ash)] font-bold">
                          {result.categoryTamil}
                        </span>
                      </div>
                      <span className="font-[family-name:var(--font-ui)] text-xs text-[color:var(--color-stone)] dark:text-[color:var(--color-ash)] whitespace-nowrap mt-2 sm:mt-0 font-bold bg-[color:var(--color-surface-cream-paper)] dark:bg-[color:var(--color-midnight-ink)] px-2 py-1 rounded border border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)]">
                        {result.readingTime} நிமிட வாசிப்பு
                      </span>
                    </Link>
                  ))}
                  <button 
                    onClick={() => handleSearchSubmit(query)}
                    className="mt-2 p-4 text-center font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] font-bold hover:bg-[color:var(--color-surface-cream-paper)] dark:hover:bg-[color:var(--color-slate)] rounded-[length:var(--radius-cards)] transition-colors border border-transparent hover:border-[color:var(--color-moss)]/20 dark:hover:border-[color:var(--color-lime-sprout)]/20"
                  >
                    அனைத்து முடிவுகளையும் காண் ({query}) →
                  </button>
                </div>
              ) : (
                // No Results
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[color:var(--color-surface-cream-paper)] dark:bg-[color:var(--color-slate)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-[color:var(--color-stone)]" />
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-subheading font-bold text-[color:var(--color-true-black)] dark:text-[color:var(--color-cream-paper)] mb-2">
                    முடிவுகள் ஏதுமில்லை
                  </h3>
                  <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-stone)] dark:text-[color:var(--color-ash)]">
                    "<span className="font-bold text-[color:var(--color-true-black)] dark:text-[color:var(--color-cream-paper)]">{query}</span>" தொடர்பான எந்த கட்டுரைகளும் கிடைக்கவில்லை.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-[color:var(--color-surface-cream-paper)] dark:bg-[color:var(--color-slate)]/30 px-6 py-3 border-t border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)] flex justify-between items-center text-xs font-[family-name:var(--font-ui)] text-[color:var(--color-stone)] dark:text-[color:var(--color-ash)] font-bold">
              <span className="flex items-center gap-4">
                <span className="flex items-center gap-1"><kbd className="bg-[color:var(--color-surface-pure-white-card)] dark:bg-[color:var(--color-midnight-ink)] px-1.5 py-0.5 rounded border border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)]">↑↓</kbd> நகர்த்த</span>
                <span className="flex items-center gap-1"><kbd className="bg-[color:var(--color-surface-pure-white-card)] dark:bg-[color:var(--color-midnight-ink)] px-1.5 py-0.5 rounded border border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)]">Enter</kbd> தேட</span>
              </span>
              <span className="flex items-center gap-1"><kbd className="bg-[color:var(--color-surface-pure-white-card)] dark:bg-[color:var(--color-midnight-ink)] px-1.5 py-0.5 rounded border border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)]">Esc</kbd> மூட</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
