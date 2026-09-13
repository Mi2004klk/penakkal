import { Metadata } from "next";
import { Suspense } from "react";
import PageShell from "@/components/layout/PageShell";
import ArticleListSkeleton from "@/components/ui/ArticleListSkeleton";
import SearchContent from "@/components/search/SearchContent";

export const metadata: Metadata = {
  title: "தேடல்",
  description: "பேனாக்கள் வலைப்பூவில் தேடுங்கள்",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SearchPage() {
  return (
    <PageShell>
      <div>
        <h1 className="editorial-headline text-center mb-12 text-heading">தேடல்</h1>
        
        <Suspense fallback={<ArticleListSkeleton viewMode="list" count={4} />}>
          <SearchContent />
        </Suspense>
      </div>
    </PageShell>
  );
}
