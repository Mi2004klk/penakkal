import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationArticle {
  title: string;
  slug: string;
}

export default function ArticleNavigation({ prev, next }: { prev: NavigationArticle | null, next: NavigationArticle | null }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4 mt-8 pt-8 border-t border-border-default">
      {prev ? (
        <Link 
          href={`/blog/${prev.slug}`}
          className="flex-1 flex flex-col items-start p-6 rounded-cards border border-border-default bg-surface-card hover:border-moss transition-all group"
        >
          <span className="flex items-center gap-1 font-ui text-body-sm text-muted-text font-bold mb-2 group-hover:text-text-link transition-colors">
            <ChevronLeft className="w-4 h-4" /> முந்தைய கட்டுரை
          </span>
          <span className="font-display text-subheading font-bold text-heading line-clamp-2">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1"></div>
      )}

      {next ? (
        <Link 
          href={`/blog/${next.slug}`}
          className="flex-1 flex flex-col items-end p-6 rounded-cards border border-border-default bg-surface-card hover:border-moss transition-all group text-right"
        >
          <span className="flex items-center gap-1 font-ui text-body-sm text-muted-text font-bold mb-2 group-hover:text-text-link transition-colors">
            அடுத்த கட்டுரை <ChevronRight className="w-4 h-4" />
          </span>
          <span className="font-display text-subheading font-bold text-heading line-clamp-2">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1"></div>
      )}
    </div>
  );
}
