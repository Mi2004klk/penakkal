export default function ArticleCardSkeleton({ viewMode = 'grid' }: { viewMode?: 'grid' | 'magazine' | 'list' | 'compact' }) {
  if (viewMode === 'compact') {
    return (
      <div className="bg-surface-card p-4 rounded-cards border border-border-default flex gap-4 animate-pulse">
        <div className="w-16 h-16 bg-surface-page rounded-cards flex-shrink-0" />
        <div className="flex-grow space-y-2 py-1">
          <div className="h-4 bg-surface-page rounded-chips w-3/4" />
          <div className="h-3 bg-surface-page rounded-chips w-1/4" />
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-surface-card rounded-cards border border-border-default overflow-hidden flex flex-col md:flex-row animate-pulse">
        <div className="w-full md:w-1/3 aspect-video md:aspect-[4/3] bg-surface-page" />
        <div className="p-6 md:p-8 flex-grow space-y-4">
          <div className="flex gap-2 mb-4">
            <div className="h-4 bg-surface-page rounded-chips w-16" />
            <div className="h-4 bg-surface-page rounded-chips w-24" />
          </div>
          <div className="h-6 bg-surface-page rounded-chips w-3/4" />
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-surface-page rounded-chips w-full" />
            <div className="h-4 bg-surface-page rounded-chips w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  // Grid and Magazine
  return (
    <div className="bg-surface-card rounded-cards border border-border-default overflow-hidden animate-pulse">
      <div className="w-full aspect-video bg-surface-page" />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <div className="h-4 bg-surface-page rounded-chips w-16" />
        </div>
        <div className="h-6 bg-surface-page rounded-chips w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-surface-page rounded-chips w-full" />
          <div className="h-4 bg-surface-page rounded-chips w-5/6" />
        </div>
      </div>
    </div>
  );
}
