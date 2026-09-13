"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { getSearchResultsSchema } from "@/lib/seo";
import ArticleListSkeleton from "@/components/ui/ArticleListSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useSearch } from "@/hooks/useSearch";
import HighlightText from "@/components/ui/HighlightText";
import ReadingTime from "@/components/ui/ReadingTime";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const { query, setQuery, results, isLoading: loading, error, retry, fetchManifest } = useSearch(initialQuery, { threshold: 2, limit: 0 });

  useEffect(() => {
    fetchManifest();
  }, [fetchManifest]);

  return (
    <>
      {query && <JsonLd data={getSearchResultsSchema(query, results.length)} />}
      <div className="max-w-2xl mx-auto mb-16 relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="கட்டுரைகளை தேடுங்கள்..."
          aria-label="தேடல்"
          className="w-full px-6 py-4 pl-14 bg-surface-card border-2 border-border-default rounded-productframes focus:outline-none focus:border-moss font-ui text-subheading text-heading transition-colors"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-text" />
      </div>

      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="mt-8">
            <ArticleListSkeleton viewMode="list" count={4} />
          </div>
        ) : error ? (
          <EmptyState 
            icon={Search}
            title="தேடல் தரவை ஏற்ற முடியவில்லை"
            description="மன்னிக்கவும், தேடல் தரவை ஏற்றுவதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்."
            action={{
              label: "மீண்டும் முயற்சிக்கவும்",
              onClick: retry,
              variant: "secondary"
            }}
          />
        ) : query.trim().length < 2 ? (
          <div className="text-center py-12 text-muted-text font-body">
            தேட குறைந்தது 2 எழுத்துக்களை உள்ளிடவும்.
          </div>
        ) : results.length === 0 ? (
          <EmptyState 
            icon={Search}
            title="முடிவுகள் ஏதுமில்லை"
            description={<>&#34;<span className="font-bold text-heading">{query}</span>&#34; தொடர்பான எந்த கட்டுரைகளும் கிடைக்கவில்லை.</>}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <h2 className="sr-only">தேடல் முடிவுகள்</h2>
            {results.map((item) => (
              <Link 
                key={item.id} 
                href={`/blog/${item.slug}`}
                className="bg-surface-card p-6 rounded-cards border border-border-default hover:border-moss transition-all flex flex-col sm:flex-row justify-between gap-4 group"
              >
                <div>
                  <h3 className="font-display font-bold text-subheading text-heading group-hover:text-text-link transition-colors mb-2 line-clamp-2">
                    <HighlightText text={item.title} highlight={query} />
                  </h3>
                  <div className="flex items-center gap-3 font-ui text-body-sm">
                    <span className="text-text-link font-bold">{item.categoryTamil}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-border-default"></span>
                    <ReadingTime minutes={item.readingTime} className="text-muted-text font-bold" />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap sm:justify-end content-start">
                  {item.tags?.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="subtle" size="sm">
                      #<HighlightText text={tag} highlight={query} />
                    </Badge>
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
