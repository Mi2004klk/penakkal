import ArticleCardSkeleton from "./ArticleCardSkeleton";

export default function ArticleListSkeleton({ 
  viewMode = 'grid', 
  count = 6 
}: { 
  viewMode?: 'grid' | 'magazine' | 'list' | 'compact',
  count?: number 
}) {
  const getGridClass = () => {
    switch (viewMode) {
      case 'grid':
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
      case 'magazine':
        return "grid grid-cols-1 md:grid-cols-2 gap-8";
      case 'list':
        return "flex flex-col gap-8 max-w-4xl mx-auto w-full";
      case 'compact':
        return "flex flex-col gap-2";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    }
  };

  return (
    <div className={getGridClass()}>
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}
