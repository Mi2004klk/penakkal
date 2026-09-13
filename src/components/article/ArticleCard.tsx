import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import CategoryBadge from "../ui/CategoryBadge";
import ReadingTime from "../ui/ReadingTime";
import { Article } from "@/types/article";
import { cleanAuthor, formatDate } from "@/lib/utils";
import { Card } from "../ui/Card";

interface ArticleCardProps {
  article: Article;
  viewMode?: 'grid' | 'magazine' | 'list' | 'compact';
}

export default function ArticleCard({ article, viewMode = 'grid' }: ArticleCardProps) {
  const formattedDate = formatDate(article.publishedAt, "short");

  if (viewMode === 'compact') {
    return (
      <Card variant="transparent" padding="none" className="block group border-b border-border-default last:border-b-0 py-4 hover:bg-surface-card px-3 -mx-3 transition-colors focus-within:ring-2 focus-within:ring-moss">
        <Link href={`/blog/${article.slug}`} className="absolute inset-0 z-0 focus:outline-none" aria-label={article.title}></Link>
        <div className="relative z-10 pointer-events-none">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-ui text-body-sm text-text-link font-medium">{article.categoryTamil}</span>
            <span className="font-ui text-body-sm text-muted-text">{formattedDate}</span>
          </div>
          <h3 className="font-display font-bold text-heading-sm text-heading group-hover:text-text-link transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
        </div>
      </Card>
    );
  }

  if (viewMode === 'list') {
    return (
      <Card variant="transparent" padding="none" className="flex flex-col sm:flex-row gap-6 lg:gap-8 group focus-within:ring-2 focus-within:ring-moss p-2 -m-2">
        <Link href={`/blog/${article.slug}`} className="absolute inset-0 z-0 focus:outline-none" aria-label={article.title}></Link>
        <div className="relative z-10 w-full sm:w-48 lg:w-64 aspect-[4/3] flex-shrink-0 rounded-cards overflow-hidden bg-surface-card pointer-events-none">
          {article.coverImage ? (
            <Image 
              src={article.coverImage} 
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, 256px"
              className="object-cover transition-transform duration-500"
              placeholder={article.coverBlur ? "blur" : "empty"}
              blurDataURL={article.coverBlur}
            />
          ) : (
            <div className="w-full h-full bg-surface-cream-paper flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-ash" aria-hidden="true" focusable="false" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center flex-grow py-1">
          <div className="mb-3 relative z-20">
            <CategoryBadge category={article.category} categoryTamil={article.categoryTamil} />
          </div>
          <h3 className="relative z-10 pointer-events-none font-display font-bold text-heading-sm mb-3 text-heading group-hover:text-text-link transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="relative z-10 pointer-events-none font-body text-body text-body-text mb-4 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          )}
          <div className="relative z-10 pointer-events-none flex flex-wrap sm:flex-nowrap items-end sm:items-center justify-between gap-6 md:gap-8 mt-auto">
            <div className="flex items-center flex-wrap gap-x-3 gap-y-2 font-ui text-body-sm text-muted-text">
              <span className="font-medium text-heading line-clamp-1" title={cleanAuthor(article.author)}>{cleanAuthor(article.author)}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-ember-coral"></span>
              <span>{formattedDate}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-ember-coral"></span>
              <ReadingTime minutes={article.readingTime} />
            </div>
            <span className="font-ui text-body-sm font-bold text-text-link hidden sm:block whitespace-nowrap group-hover:-translate-x-1 transition-transform">
              தொடர் படிக்கவும் &rarr;
            </span>
          </div>
        </div>
      </Card>
    );
  }

  // Default Grid or Magazine
  const isMagazine = viewMode === 'magazine';
  const shadowClass = isMagazine 
    ? 'shadow-product-frame hover:shadow-halo hover:border-lime-sprout' 
    : 'shadow-card hover:shadow-card-hover';

  return (
    <Card 
      padding="none"
      className={`group flex flex-col transition-all duration-300 focus-within:ring-2 focus-within:ring-moss ${shadowClass} ${isMagazine ? 'min-h-full' : ''}`}
    >
      <Link href={`/blog/${article.slug}`} className="absolute inset-0 z-0 focus:outline-none" aria-label={article.title}></Link>
      <div className={`relative z-10 w-full ${isMagazine ? 'aspect-[4/3] sm:aspect-[4/5]' : 'aspect-video'} bg-surface-card overflow-hidden pointer-events-none`}>
        {article.coverImage ? (
          <Image 
            src={article.coverImage} 
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500"
            placeholder={article.coverBlur ? "blur" : "empty"}
            blurDataURL={article.coverBlur}
          />
        ) : (
          <div className="w-full h-full bg-surface-cream-paper flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-ash" aria-hidden="true" focusable="false" />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4 relative z-20">
          <CategoryBadge category={article.category} categoryTamil={article.categoryTamil} />
        </div>
        <h3 className={`relative z-10 pointer-events-none font-display font-bold ${isMagazine ? 'text-heading-md' : 'text-heading-sm'} mb-4 text-heading group-hover:text-text-link  transition-colors line-clamp-3 leading-snug text-balance`}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p className={`relative z-10 pointer-events-none font-body text-body-text mb-6 line-clamp-3 leading-relaxed flex-grow ${isMagazine ? 'text-base md:text-body' : 'text-body'}`}>
            {article.excerpt}
          </p>
        )}
        <div className="relative z-10 pointer-events-none flex items-center flex-wrap justify-between gap-y-3 font-ui text-body-sm text-muted-text pt-6 border-t border-border-default mt-auto">
          <div className="flex items-center gap-3">
            <span className="font-medium text-heading line-clamp-1" title={cleanAuthor(article.author)}>{cleanAuthor(article.author)}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-ember-coral"></span>
            <span>{formattedDate}</span>
          </div>
          <ReadingTime minutes={article.readingTime} />
        </div>
      </div>
    </Card>
  );
}
