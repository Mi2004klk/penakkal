"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Article } from "@/types/article";
import ArticleCard from "./ArticleCard";
import Pagination from "../ui/Pagination";
import ViewToggle from "../ui/ViewToggle";
import FilterPanel from "../ui/FilterPanel";
import { Filter, SearchX } from "lucide-react";
import { useStore } from "@/store/useStore";

interface ArticleListClientProps {
  articles: Article[];
  basePath: string;
}

export default function ArticleListClient({ articles, basePath }: ArticleListClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { viewMode } = useStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const page = parseInt(searchParams.get("page") || "1");
  const categoryFilter = searchParams.get("category");
  const tagFilter = searchParams.get("tag");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  
  const filteredArticles = useMemo(() => {
    let result = [...articles];
    if (categoryFilter) {
      result = result.filter(a => a.category === categoryFilter);
    }
    if (tagFilter) {
      result = result.filter(a => a.tags.includes(tagFilter));
    }
    
    if (sortOrder === "oldest") {
      return [...result].reverse();
    }
    return result;
  }, [articles, categoryFilter, tagFilter, sortOrder]);

  const limit = 24;
  const totalPages = Math.ceil(filteredArticles.length / limit);
  
  const startIndex = (page - 1) * limit;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + limit);

  // Derive categories and tags for filter panel
  const availableCategories = useMemo(() => {
    const counts: Record<string, { label: string, count: number }> = {};
    articles.forEach(a => {
      if (!counts[a.category]) counts[a.category] = { label: a.categoryTamil, count: 0 };
      counts[a.category].count++;
    });
    return Object.entries(counts).map(([id, { label, count }]) => ({ id, label, count }));
  }, [articles]);

  const handleApplyFilter = (cats: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (cats.length > 0) {
      params.set("category", cats[0]); // For simplicity, single category filter
    } else {
      params.delete("category");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Determine grid class based on view mode
  const getGridClass = () => {
    if (!mounted) return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"; // Default SSR
    
    switch (viewMode) {
      case 'grid':
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
      case 'magazine':
        return "grid grid-cols-1 md:grid-cols-2 gap-8"; // 2 columns for magazine
      case 'list':
        return "flex flex-col gap-8 max-w-4xl mx-auto w-full"; // Single column max width for list
      case 'compact':
        return "flex flex-col gap-2";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 bg-[color:var(--color-surface-card)] p-4 rounded-[length:var(--radius-cards)] border border-[color:var(--color-border-default)]">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[color:var(--color-surface-page)] border border-[color:var(--color-border-default)] rounded-[length:var(--radius-buttons)] font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold hover:border-[color:var(--color-moss)] hover:text-[color:var(--color-moss)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
          >
            <Filter className="w-4 h-4" /> 
            வடிகட்டி {categoryFilter && <span className="ml-1 px-1.5 py-0.5 bg-[color:var(--color-moss)] text-[color:var(--color-surface-card)] text-[10px] font-bold rounded-full leading-none flex items-center justify-center">1</span>}
          </button>
          
          <div className="relative flex-1 md:flex-none">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full appearance-none px-5 py-2.5 pr-12 bg-[color:var(--color-surface-page)] border border-[color:var(--color-border-default)] rounded-[length:var(--radius-buttons)] font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold focus:outline-none focus:ring-2 focus:ring-[color:var(--color-moss)] cursor-pointer"
            >
              <option value="newest">புதியவை முதலில்</option>
              <option value="oldest">பழையவை முதலில்</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[color:var(--color-muted-text)]">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        
        <ViewToggle />
      </div>

      {currentArticles.length === 0 ? (
        <div className="text-center py-24 bg-[color:var(--color-surface-card)] rounded-[length:var(--radius-productframes)] border border-solid border-[color:var(--color-border-default)]">
          <SearchX className="w-10 h-10 mx-auto mb-6 text-[color:var(--color-muted-text)] opacity-50" />
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[color:var(--color-heading)] mb-2">முடிவுகள் ஏதும் இல்லை</h3>
          <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-body-text)]">
            உங்கள் தேடலுக்கு ஏற்ற கட்டுரைகள் எதுவும் காணப்படவில்லை. தயவுசெய்து வேறு வகையை தேடவும்.
          </p>
        </div>
      ) : (
        <div className={getGridClass()}>
          {currentArticles.map((article) => (
            <ArticleCard key={article.id} article={article} viewMode={mounted ? viewMode : 'grid'} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-16">
          <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />
        </div>
      )}
      
      <FilterPanel 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        categories={availableCategories}
        selectedCats={categoryFilter ? [categoryFilter] : []}
        onApply={handleApplyFilter}
      />
    </>
  );
}
