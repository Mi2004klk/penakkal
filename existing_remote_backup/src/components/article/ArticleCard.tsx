import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ta } from "date-fns/locale";
import { ImageIcon } from "lucide-react";
import CategoryBadge from "../ui/CategoryBadge";
import { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
  viewMode?: 'grid' | 'magazine' | 'list' | 'compact';
}

export default function ArticleCard({ article, viewMode = 'grid' }: ArticleCardProps) {
  const formattedDate = format(new Date(article.publishedAt), "dd MMM yyyy", { locale: ta });

  if (viewMode === 'compact') {
    return (
      <Link href={`/blog/${article.slug}`} className="block group border-b border-[color:var(--color-border-default)] last:border-b-0 py-4 hover:bg-[color:var(--color-surface-card)] px-3 -mx-3 rounded-[length:var(--radius-cards)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] font-medium tracking-wider uppercase">{article.categoryTamil}</span>
          <span className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[color:var(--color-muted-text)]">{formattedDate}</span>
        </div>
        <h3 className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-heading-sm)] text-[color:var(--color-heading)] group-hover:text-[color:var(--color-moss)] dark:group-hover:text-[color:var(--color-lime-sprout)] transition-colors line-clamp-2 leading-snug">
          {article.title}
        </h3>
      </Link>
    );
  }

  if (viewMode === 'list') {
    return (
      <Link href={`/blog/${article.slug}`} className="flex flex-col sm:flex-row gap-6 lg:gap-8 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)] rounded-[length:var(--radius-cards)] p-2 -m-2">
        <div className="relative w-full sm:w-48 lg:w-64 aspect-[4/3] flex-shrink-0 rounded-[length:var(--radius-cards)] overflow-hidden bg-[color:var(--color-surface-card)]">
          {article.coverImage ? (
            <Image 
              src={article.coverImage} 
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, 256px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              placeholder={article.coverBlur ? "blur" : "empty"}
              blurDataURL={article.coverBlur}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--color-fog)] dark:bg-[color:var(--color-slate)]">
              <ImageIcon className="w-8 h-8 text-[color:var(--color-ash)]" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center flex-grow py-1">
          <div className="mb-3">
            <CategoryBadge category={article.category} categoryTamil={article.categoryTamil} />
          </div>
          <h3 className="font-[family-name:var(--font-display)] font-bold text-subheading md:text-2xl mb-3 text-[color:var(--color-heading)] group-hover:text-[color:var(--color-moss)] dark:group-hover:text-[color:var(--color-lime-sprout)] transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-body-text)] mb-4 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex flex-wrap sm:flex-nowrap items-end sm:items-center justify-between gap-4 mt-auto">
            <div className="flex items-center flex-wrap gap-x-3 gap-y-2 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[color:var(--color-muted-text)] uppercase tracking-wider">
              <span className="font-medium text-[color:var(--color-heading)]">{article.author}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-ember-coral)]"></span>
              <span>{formattedDate}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-ember-coral)]"></span>
              <span>{article.readingTime} நிமிட வாசிப்பு</span>
            </div>
            <span className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] hidden sm:block whitespace-nowrap group-hover:-translate-x-1 transition-transform">
              தொடர் படிக்கவும் &rarr;
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default Grid or Magazine
  const isMagazine = viewMode === 'magazine';

  return (
    <Link 
      href={`/blog/${article.slug}`} 
      className={`group flex flex-col bg-[color:var(--color-surface-card)] rounded-[length:var(--radius-cards)] overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300 border border-[color:var(--color-border-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)] ${isMagazine ? 'min-h-full' : ''}`}
    >
      <div className={`relative w-full ${isMagazine ? 'aspect-[4/3] sm:aspect-[4/5]' : 'aspect-video'} bg-[color:var(--color-surface-card)] overflow-hidden`}>
        {article.coverImage ? (
          <Image 
            src={article.coverImage} 
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            placeholder={article.coverBlur ? "blur" : "empty"}
            blurDataURL={article.coverBlur}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--color-fog)] dark:bg-[color:var(--color-slate)]">
            <ImageIcon className="w-12 h-12 text-[color:var(--color-ash)]" />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <CategoryBadge category={article.category} categoryTamil={article.categoryTamil} />
        </div>
        <h3 className={`font-[family-name:var(--font-display)] font-bold ${isMagazine ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-subheading md:text-2xl'} mb-4 text-[color:var(--color-heading)] group-hover:text-[color:var(--color-moss)] dark:group-hover:text-[color:var(--color-lime-sprout)] transition-colors line-clamp-3 leading-snug text-balance`}>
          {article.title}
        </h3>
        <p className={`font-[family-name:var(--font-body)] text-[color:var(--color-body-text)] mb-6 line-clamp-3 leading-relaxed flex-grow ${isMagazine ? 'text-base md:text-body' : 'text-[length:var(--text-body)]'}`}>
          {article.excerpt}
        </p>
        <div className="flex items-center flex-wrap justify-between gap-y-3 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[color:var(--color-muted-text)] uppercase tracking-wider pt-6 border-t border-[color:var(--color-border-default)] mt-auto">
          <div className="flex items-center gap-3">
            <span className="font-medium text-[color:var(--color-heading)]">{article.author}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-ember-coral)]"></span>
            <span>{formattedDate}</span>
          </div>
          <span>{article.readingTime} நிமிடம்</span>
        </div>
      </div>
    </Link>
  );
}
