import PageShell from "@/components/layout/PageShell";

export default function ArticleLoading() {
  return (
    <PageShell hasHero={true}>
      <div className="flex-grow zone-cream pt-8 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center pt-8">
          <div className="h-4 bg-border-default/50 rounded w-48 mx-auto mb-6 animate-pulse" />
          <div className="h-6 bg-border-default/50 rounded w-24 mx-auto mb-6 animate-pulse" />
          <div className="h-12 bg-border-default/50 rounded w-3/4 mx-auto mb-6 animate-pulse" />
          <div className="h-4 bg-border-default/50 rounded w-64 mx-auto mb-8 animate-pulse" />
        </div>
        
        <div className="max-w-5xl mx-auto mb-16">
          <div className="w-full aspect-video md:aspect-[21/9] rounded-productframes bg-border-default/30 animate-pulse" />
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            <div className="h-4 bg-border-default/30 rounded w-full animate-pulse" />
            <div className="h-4 bg-border-default/30 rounded w-full animate-pulse" />
            <div className="h-4 bg-border-default/30 rounded w-11/12 animate-pulse" />
            <div className="h-4 bg-border-default/30 rounded w-full animate-pulse" />
            <div className="h-4 bg-border-default/30 rounded w-4/5 animate-pulse" />
          </div>
          <div className="space-y-4 mt-8">
            <div className="h-4 bg-border-default/30 rounded w-full animate-pulse" />
            <div className="h-4 bg-border-default/30 rounded w-10/12 animate-pulse" />
            <div className="h-4 bg-border-default/30 rounded w-full animate-pulse" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
