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

  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {prevPage ? (
        <Link
          href={createPageUrl(prevPage)}
          className="p-3 rounded-[length:var(--radius-buttons)] border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-card)] text-[color:var(--color-body-text)] hover:border-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)] hover:text-[color:var(--color-moss)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
          rel="prev"
          aria-label="முந்தைய பக்கம்"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <span className="p-3 rounded-[length:var(--radius-buttons)] border border-transparent text-[color:var(--color-ash)] dark:text-[color:var(--color-slate)] cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </span>
      )}

      <div className="flex items-center gap-1 mx-4 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold">
        <span className="text-[color:var(--color-heading)]">பக்கம் {currentPage}</span>
        <span className="text-[color:var(--color-muted-text)]">/ {totalPages}</span>
      </div>

      {nextPage ? (
        <Link
          href={createPageUrl(nextPage)}
          className="p-3 rounded-[length:var(--radius-buttons)] border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-card)] text-[color:var(--color-body-text)] hover:border-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)] hover:text-[color:var(--color-moss)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
          rel="next"
          aria-label="அடுத்த பக்கம்"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <span className="p-3 rounded-[length:var(--radius-buttons)] border border-transparent text-[color:var(--color-ash)] dark:text-[color:var(--color-slate)] cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </span>
      )}
    </div>
  );
}
