import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { SearchResult } from "@/types/search";

let searchManifestCache: SearchResult[] | null = null;
let searchManifestPromise: Promise<SearchResult[]> | null = null;

export const fetchManifest = async (signal?: AbortSignal): Promise<SearchResult[]> => {
  if (searchManifestCache) return searchManifestCache;
  if (searchManifestPromise) return searchManifestPromise;
  
  searchManifestPromise = fetch("/search-manifest.json", { signal }).then(res => {
    if (!res.ok) throw new Error("Manifest not found");
    return res.json();
  }).then(data => {
    // Rehydrate minified keys
    const expandedData = data.map((item: any) => ({
      slug: item.s,
      title: item.t,
      categoryTamil: item.c,
      tags: item.tg,
      readingTime: item.r,
      // Create a stable string for searching to avoid doing it per-keystroke
      _searchStr: `${item.t} ${item.c} ${(item.tg || []).join(" ")}`.toLowerCase()
    }));
    searchManifestCache = expandedData;
    return expandedData;
  }).catch(err => {
    if (err.name !== 'AbortError') {
      searchManifestPromise = null;
    }
    throw err;
  });
  
  return searchManifestPromise;
};

export function useSearch(initialQuery = "", options = { threshold: 2, limit: 0 }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const addRecentSearch = useStore((s) => s.addRecentSearch);

  useEffect(() => {
    let isMounted = true;
    const fetchResults = async () => {
      if (query.trim().length < options.threshold) {
        setResults([]);
        setError(false);
        return;
      }
      
      setIsLoading(true);
      setError(false);
      try {
        const data = await fetchManifest();
        if (!isMounted) return;
        
        const lowerQuery = query.toLowerCase();
        let filtered = data.filter((item: any) => item._searchStr.includes(lowerQuery));
        
        if (options.limit > 0) {
          filtered = filtered.slice(0, options.limit);
        }
        
        setResults(filtered);
      } catch (err) {
        console.error("Search failed:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 200); // 200ms debounce
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, retryCount, options.threshold, options.limit]);

  // Debounce recent search persistence (1s)
  useEffect(() => {
    if (query.trim().length < options.threshold) return;
    
    const debounceTimer = setTimeout(() => {
      addRecentSearch(query.trim());
    }, 1000);
    
    return () => clearTimeout(debounceTimer);
  }, [query, addRecentSearch, options.threshold]);

  const retry = () => setRetryCount(c => c + 1);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    retry,
    fetchManifest
  };
}
