import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationArticle {
  title: string;
  slug: string;
}

export default function ArticleNavigation({ prev, next }: { prev: NavigationArticle | null, next: NavigationArticle | null }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4 mt-8 pt-8 border-t border-[color:var(--color-border-default)]">
      {prev ? (
        <Link 
          href={`/blog/${prev.slug}`}
          className="flex-1 flex flex-col items-start p-6 rounded-[length:var(--radius-cards)] border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-card)] hover:border-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
        >
          <span className="flex items-center gap-1 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[color:var(--color-muted-text)] font-bold mb-2 group-hover:text-[color:var(--color-moss)] dark:group-hover:text-[color:var(--color-lime-sprout)] transition-colors">
            <ChevronLeft className="w-4 h-4" /> முந்தைய கட்டுரை
          </span>
          <span className="font-[family-name:var(--font-display)] text-body font-bold text-[color:var(--color-heading)] line-clamp-2">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1"></div>
      )}

      {next ? (
        <Link 
          href={`/blog/${next.slug}`}
          className="flex-1 flex flex-col items-end p-6 rounded-[length:var(--radius-cards)] border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-card)] hover:border-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)] transition-all group text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
        >
          <span className="flex items-center gap-1 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[color:var(--color-muted-text)] font-bold mb-2 group-hover:text-[color:var(--color-moss)] dark:group-hover:text-[color:var(--color-lime-sprout)] transition-colors">
            அடுத்த கட்டுரை <ChevronRight className="w-4 h-4" />
          </span>
          <span className="font-[family-name:var(--font-display)] text-body font-bold text-[color:var(--color-heading)] line-clamp-2">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1"></div>
      )}
    </div>
  );
}
