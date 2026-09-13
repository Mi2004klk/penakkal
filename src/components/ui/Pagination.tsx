"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const searchParams = useSearchParams();
  const safeCurrentPage = isNaN(currentPage) ? 1 : currentPage;

  if (totalPages <= 1) return null;

  const prevPage = safeCurrentPage > 1 ? safeCurrentPage - 1 : null;
  const nextPage = safeCurrentPage < totalPages ? safeCurrentPage + 1 : null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${basePath}?${params.toString()}`;
  };

  const renderPageLinks = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Determine window
    let start = Math.max(2, safeCurrentPage - 2);
    let end = Math.min(totalPages - 1, safeCurrentPage + 2);
    
    // Adjust window if near ends
    if (safeCurrentPage <= 3) {
      end = Math.min(totalPages - 1, 5);
    }
    if (safeCurrentPage >= totalPages - 2) {
      start = Math.max(2, totalPages - 4);
    }
    
    // Ellipsis after first page if gap exists
    if (start > 2) {
      pages.push("...");
    }
    
    // Main window
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Ellipsis before last page if gap exists
    if (end < totalPages - 1) {
      pages.push("...");
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages.map((p, i) => {
      if (p === "...") {
        return (
          <span key={`ellipsis-${i}`} className="px-1 text-muted-text">...</span>
        );
      }
      
      const isCurrent = p === safeCurrentPage;
      return (
        <Link
          key={p}
          href={createPageUrl(p as number)}
          aria-current={isCurrent ? "page" : undefined}
          aria-label={`பக்கம் ${p}`}
          className={`touch-target flex items-center justify-center min-w-[2.5rem] h-10 px-2 rounded-buttons font-ui text-body-sm font-bold transition-colors ${
            isCurrent
              ? "bg-moss text-pure-white  "
              : "bg-surface-card border border-border-default hover:border-moss hover:text-text-link   text-heading"
          }`}
        >
          {p}
        </Link>
      );
    });
  };

  return (
    <nav aria-label="பக்கப்புறங்கள்" className="flex items-center justify-center gap-2">
      {prevPage ? (
        <Link
          href={createPageUrl(prevPage)}
          className="touch-target p-3 rounded-buttons border border-border-default bg-surface-card text-body-text hover:border-moss hover:text-text-link transition-colors"
          rel="prev"
          aria-label="முந்தைய பக்கம்"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" focusable="false" />
        </Link>
      ) : (
        <span aria-disabled="true" className="touch-target p-3 rounded-buttons border border-transparent text-ash cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" aria-hidden="true" focusable="false" />
        </span>
      )}

      {/* Mobile simple view */}
      <div className="flex items-center gap-1 mx-2 sm:mx-4 font-ui text-body-sm font-bold md:hidden">
        <span className="text-heading">பக்கம் {safeCurrentPage}</span>
        <span className="text-muted-text">/ {totalPages}</span>
      </div>

      {/* Desktop numbered view */}
      <div className="hidden md:flex items-center gap-1.5 mx-4">
        {renderPageLinks()}
      </div>

      {nextPage ? (
        <Link
          href={createPageUrl(nextPage)}
          className="touch-target p-3 rounded-buttons border border-border-default bg-surface-card text-body-text hover:border-moss hover:text-text-link transition-colors"
          rel="next"
          aria-label="அடுத்த பக்கம்"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" focusable="false" />
        </Link>
      ) : (
        <span aria-disabled="true" className="touch-target p-3 rounded-buttons border border-transparent text-ash cursor-not-allowed">
          <ChevronRight className="w-5 h-5" aria-hidden="true" focusable="false" />
        </span>
      )}
    </nav>
  );
}
