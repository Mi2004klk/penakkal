"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, History, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Modal } from "../ui/Modal";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

import { useSearch, fetchManifest } from "@/hooks/useSearch";

import HighlightText from "@/components/ui/HighlightText";
import ReadingTime from "@/components/ui/ReadingTime";



export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { query, setQuery, results, isLoading, error, retry } = useSearch("", { threshold: 2, limit: 5 });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recentSearches = useStore((s) => s.recentSearches);
  const addRecentSearch = useStore((s) => s.addRecentSearch);
  const clearRecentSearches = useStore((s) => s.clearRecentSearches);


  useEffect(() => {
    let abortController: AbortController | null = null;
    if (isOpen) {
      abortController = new AbortController();
      // Prefetch manifest in background when modal opens
      fetchManifest(abortController.signal).catch((err: Error) => {
        if (err.name !== 'AbortError') console.error('Prefetch failed:', err);
      });
    } else {
      setQuery("");
      setSelectedIndex(-1);
    }
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [isOpen]);



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
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-label="தேடல்"
      className="w-full h-full sm:h-auto sm:max-h-[85vh] flex flex-col"
    >
      <div className="p-4 sm:p-6 border-b border-border-default flex gap-3 items-center sticky top-0 bg-surface-pure-white-card z-10 flex-shrink-0">
              <Search className="w-6 h-6 text-muted-text mr-4" aria-hidden="true" focusable="false" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={results.length > 0 || (query.trim().length < 2 && recentSearches.length > 0)}
                aria-controls="search-listbox"
                aria-activedescendant={selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="கட்டுரைகளைத் தேடுக..."
                aria-label="தேடல்"
                className="flex-grow bg-transparent text-subheading font-ui text-heading focus:outline-none placeholder:text-muted-text"
              />
              <div aria-live="polite" className="sr-only">
                {isLoading ? "தேடல் முடிவுகளை ஏற்றுகிறது..." : (results.length > 0 ? `${results.length} முடிவுகள் கிடைத்துள்ளன` : (query.length >= 2 && !error ? "முடிவுகள் ஏதுமில்லை" : ""))}
              </div>
              {isLoading && <Loader2 className="w-5 h-5 text-text-link animate-spin mr-4" aria-hidden="true" focusable="false" />}
              <button
                onClick={onClose}
                aria-label="தேடலை மூடு"
                className="p-2 touch-target hover:bg-surface-cream-paper rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-text" aria-hidden="true" focusable="false" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {query.trim().length < 2 ? (
                // Recent Searches
                recentSearches.length > 0 ? (
                  <div>
                    <div className="flex justify-between items-center px-2 mb-2">
                      <h2 className="section-eyebrow">சமீபத்திய தேடல்கள்</h2>
                      <button
                        onClick={clearRecentSearches}
                        className="text-caption text-muted-text hover:text-text-link-hover transition-colors touch-target"
                      >
                        அழி
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => {
                            setQuery(search);
                            handleSearchSubmit(search);
                          }}
                          className="flex items-center gap-3 w-full text-left p-3 rounded-cards hover:bg-surface-cream-paper transition-colors group"
                        >
                          <History className="w-4 h-4 text-muted-text" aria-hidden="true" focusable="false" />
                          <span className="font-body text-body text-heading flex-grow">{search}</span>
                          <ArrowRight className="w-4 h-4 text-muted-text opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" focusable="false" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-text font-body">
                    தேட குறைந்தது 2 எழுத்துக்களை உள்ளிடவும்.
                  </div>
                )
              ) : error ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <p className="font-display text-lg font-bold text-error mb-2">தேடல் தரவை ஏற்ற முடியவில்லை</p>
                  <p className="font-body text-body-sm text-muted-text mb-4">
                    தயவுசெய்து மீண்டும் முயற்சிக்கவும்.
                  </p>
                  <button
                    onClick={retry}
                    className="font-ui text-body-sm font-bold bg-moss text-pure-white px-4 py-2 rounded-buttons hover:-translate-y-0.5 transition-transform"
                  >
                    மீண்டும் முயற்சி
                  </button>
                </div>
              ) : results.length > 0 ? (
                // Results
                <div id="search-listbox" role="listbox" aria-label="தேடல் முடிவுகள்" className="flex flex-col gap-2">
                  {results.map((result, idx) => (
                    <Link
                      key={result.id}
                      href={`/blog/${result.slug}`}
                      id={`search-result-${idx}`}
                      role="option"
                      aria-selected={idx === selectedIndex}
                      onClick={() => {
                        addRecentSearch(query.trim());
                        onClose();
                      }}
                      className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-cards transition-colors ${
                        idx === selectedIndex
                          ? "bg-surface-cream-paper border-moss  border"
                          : "hover:bg-surface-cream-paper  border border-transparent"
                      }`}
                    >
                      <div>
                        <h3 className="font-display text-body font-bold text-heading mb-1 line-clamp-2">
                          <HighlightText text={result.title} highlight={query} />
                        </h3>
                        <span className="font-ui text-body-sm text-muted-text font-bold">
                          {result.categoryTamil}
                        </span>
                      </div>
                      <ReadingTime minutes={result.readingTime} className="font-ui text-caption text-muted-text whitespace-nowrap mt-2 sm:mt-0 font-bold bg-surface-page px-2 py-1 rounded-buttons border border-border-default" />
                    </Link>
                  ))}
                  <button
                    onClick={() => handleSearchSubmit(query)}
                    className="mt-2 p-4 text-center font-ui text-body-sm text-text-link font-bold hover:bg-surface-cream-paper rounded-cards transition-colors border border-transparent hover:border-moss/20"
                  >
                    அனைத்து முடிவுகளையும் காண் ({query}) →
                  </button>
                </div>
              ) : (
                // No Results
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-surface-cream-paper rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-text" aria-hidden="true" focusable="false" />
                  </div>
                  <h2 className="font-display text-subheading font-bold text-heading mb-2">
                    முடிவுகள் ஏதுமில்லை
                  </h2>
                  <p className="font-body text-body text-muted-text">
                    "<span className="font-bold text-heading">{query}</span>" தொடர்பான எந்த கட்டுரைகளும் கிடைக்கவில்லை.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-surface-cream-paper px-6 py-3 border-t border-border-default flex justify-between items-center text-caption font-ui text-muted-text font-bold">
              <span className="flex items-center gap-4">
                <span className="flex items-center gap-1"><kbd className="bg-surface-pure-white-card px-1.5 py-0.5 rounded-buttons border border-border-default">↑↓</kbd> நகர்த்த</span>
                <span className="flex items-center gap-1"><kbd className="bg-surface-pure-white-card px-1.5 py-0.5 rounded-buttons border border-border-default">Enter</kbd> தேட</span>
              </span>
              <span className="flex items-center gap-1"><kbd className="bg-surface-pure-white-card px-1.5 py-0.5 rounded-buttons border border-border-default">Esc</kbd> மூட</span>
            </div>
      </Modal>
  );
}
