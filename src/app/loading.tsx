import PageShell from "@/components/layout/PageShell";
import ArticleListSkeleton from "@/components/ui/ArticleListSkeleton";

export default function Loading() {
  return (
    <PageShell>
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <div className="h-10 bg-surface-page rounded w-48 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-surface-page rounded w-64 mx-auto animate-pulse" />
      </div>
      
      <ArticleListSkeleton viewMode="grid" count={6} />
    </PageShell>
  );
}
