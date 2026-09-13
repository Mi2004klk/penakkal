"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Article } from "@/types/article";
import ArticleCard from "./ArticleCard";
import Pagination from "../ui/Pagination";
import { Filter, SearchX, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import dynamic from "next/dynamic";

const FilterPanel = dynamic(() => import("../ui/FilterPanel"), { ssr: false });
const ViewToggle = dynamic(() => import("../ui/ViewToggle"), { ssr: false });
import EmptyState from "../ui/EmptyState";
import { useCategoryCounts } from "@/hooks/useCategoryCounts";

interface ArticleListClientProps {
  articles: Article[];
  basePath: string;
}

export default function ArticleListClient({ articles, basePath }: ArticleListClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const viewMode = useStore((s) => s.viewMode);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const page = parseInt(searchParams.get("page") || "1", 10);
  const categoryFilters = searchParams.getAll("category");
  const tagFilter = searchParams.get("tag");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sortOrder = searchParams.get("sort") || "newest";
  
  const filteredArticles = useMemo(() => {
    let result = [...articles];
    if (categoryFilters.length > 0) {
      result = result.filter(a => categoryFilters.includes(a.category));
    }
    if (tagFilter) {
      result = result.filter(a => a.tags.includes(tagFilter));
    }
    
    if (sortOrder === "oldest") {
      return [...result].reverse();
    }
    return result;
  }, [articles, categoryFilters, tagFilter, sortOrder]);

  const limit = 24;
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / limit));
  
  // Clamp page to valid range
  const validPage = isNaN(page) || page < 1 ? 1 : (page > totalPages ? totalPages : page);
  
  const startIndex = (validPage - 1) * limit;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + limit);

  const articlesForCounts = useMemo(() => {
    let result = [...articles];
    if (tagFilter) {
      result = result.filter(a => a.tags.includes(tagFilter));
    }
    return result;
  }, [articles, tagFilter]);

  // Derive categories and tags for filter panel
  const availableCategories = useCategoryCounts(articlesForCounts).map(c => ({
    id: c.slug,
    label: c.tamil,
    count: c.count
  }));

  const handleApplyFilter = (cats: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.delete("category");
    cats.forEach(c => params.append("category", c));
    router.push(`${pathname}?${params.toString()}`);
  };

  // Determine grid class based on view mode
  const getGridClass = () => {
    // Suppress hydration flash by gating only the grid class
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
      <div className="flex items-center justify-between mb-8 sm:mb-12 gap-4 bg-surface-card p-3 sm:p-4 rounded-cards border border-border-default overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-surface-page border border-border-default rounded-buttons font-ui text-body-sm font-bold hover:border-moss hover:text-text-link transition-colors shrink-0"
            aria-label="வடிகட்டி"
            title="வடிகட்டி"
          >
            <Filter className="w-4 h-4 shrink-0" /> 
            <span className="hidden sm:inline whitespace-nowrap">வடிகட்டி</span>
            {categoryFilters.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-moss text-pure-white text-caption font-bold rounded-full leading-none flex items-center justify-center">{categoryFilters.length}</span>}
          </button>
          
          <div className="relative shrink-0">
            <select 
              value={sortOrder}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("sort", e.target.value);
                params.set("page", "1"); // Reset to page 1 on sort change
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="appearance-none pl-3 pr-8 sm:px-5 sm:pr-12 py-2 sm:py-2.5 bg-surface-page border border-border-default rounded-buttons font-ui text-body-sm font-bold focus:outline-none focus:ring-2 focus:ring-moss cursor-pointer whitespace-nowrap"
              aria-label="வரிசைப்படுத்து"
              title="வரிசைப்படுத்து"
            >
              <option value="newest">புதியவை</option>
              <option value="oldest">பழையவை</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 sm:px-4 text-muted-text">
              <ChevronDown className="h-4 w-4" aria-hidden="true" focusable="false" />
            </div>
          </div>
        </div>
        
        <div className="shrink-0 ml-auto">
          <ViewToggle />
        </div>
      </div>

      {currentArticles.length === 0 ? (
        <EmptyState 
          icon={SearchX} 
          title="முடிவுகள் ஏதும் இல்லை" 
          description="உங்கள் தேடலுக்கு ஏற்ற கட்டுரைகள் எதுவும் காணப்படவில்லை. தயவுசெய்து வேறு வகையை தேடவும்."
          action={{
            label: "வடிகட்டியை அகற்று",
            onClick: () => handleApplyFilter([])
          }}
        />
      ) : (
        <div className={getGridClass()} style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}>
          {currentArticles.map((article) => (
            <ArticleCard key={article.id} article={article} viewMode={mounted ? viewMode : 'grid'} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-16">
          <Pagination currentPage={validPage} totalPages={totalPages} basePath={basePath} />
        </div>
      )}
      
      <FilterPanel 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        categories={availableCategories}
        selectedCats={categoryFilters}
        onApply={handleApplyFilter}
      />
    </>
  );
}
