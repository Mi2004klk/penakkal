import MetaSeparator from "@/components/ui/MetaSeparator";
import { getAllArticles, getArticleBySlug, getAdjacentArticles } from "@/lib/content/queries";
import { getRelatedArticles } from "@/lib/recommendations";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cleanAuthor, formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import TagChip from "@/components/ui/TagChip";
import PageShell from "@/components/layout/PageShell";
import dynamic from "next/dynamic";

const ShareBar = dynamic(() => import("@/components/article/ShareBar"));
const BookmarkToggle = dynamic(() => import("@/components/article/BookmarkToggle"));
const ReadingProgress = dynamic(() => import("@/components/article/ReadingProgress"));
const TableOfContents = dynamic(() => import("@/components/article/TableOfContents"));

import BismillahBlock from "@/components/ui/BismillahBlock";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedArticles from "@/components/article/RelatedArticles";
import JazakallahBlock from "@/components/article/JazakallahBlock";
import AuthorInfoCard from "@/components/article/AuthorInfoCard";
import ArticleNavigation from "@/components/article/ArticleNavigation";
import ArticleTracker from "@/components/article/ArticleTracker";
import JsonLd from "@/components/seo/JsonLd";
import { getArticleSchema, getBreadcrumbSchema, absoluteUrl } from "@/lib/seo";
import ReadingTime from "@/components/ui/ReadingTime";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  
  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: absoluteUrl(`/blog/${slug}`),
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [article.author],
      images: article.coverImage ? [article.coverImage] : ["/og-default.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : ["/og-default.png"],
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allArticles = await getAllArticles();
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    notFound();
  }

  const { prev: prevArticle, next: nextArticle } = await getAdjacentArticles(slug);

  const related = getRelatedArticles(article, allArticles, 3);
  const formattedDate = formatDate(article.publishedAt, "long");

  const jsonLd = getArticleSchema(article);
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "முகப்பு", url: "/" },
    { name: "கட்டுரைகள்", url: "/blog" },
    { name: article.categoryTamil || article.category, url: `/category/${article.category}` },
    { name: article.title, url: `/blog/${article.slug}` }
  ]);

  return (
    <PageShell hasHero={true}>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div data-print-hide>
        <ReadingProgress title={article.title} />
      </div>
      <ArticleTracker slug={article.slug} title={article.title} />
      
      <div className="flex-grow zone-cream pt-8 pb-20 px-4 md:px-8">
        {/* Article Header */}
        <header className="pt-8 max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Breadcrumb category={article.category} categoryTamil={article.categoryTamil} title={article.title} />
          </div>
          
          <div className="mb-6">
            <CategoryBadge category={article.category} categoryTamil={article.categoryTamil} />
          </div>
          
          <h1 className="editorial-headline mb-6 text-heading">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 font-ui text-body-sm text-muted-text font-bold mb-8">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-moss flex items-center justify-center text-pure-white text-xs">✍️</span>
              {article.authorSlug ? (
                <Link href={`/author/${article.authorSlug}`} className="line-clamp-1 max-w-[250px] hover:text-text-link transition-colors focus-visible:outline-none focus-visible:underline" title={cleanAuthor(article.author)}>
                  {cleanAuthor(article.author)}
                </Link>
              ) : (
                <span className="line-clamp-1 max-w-[250px]" title={cleanAuthor(article.author)}>{cleanAuthor(article.author)}</span>
              )}
            </span>
            <MetaSeparator />
            <span>{formattedDate}</span>
            <MetaSeparator />
            <ReadingTime minutes={article.readingTime} />
          </div>

          <BismillahBlock />
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="max-w-5xl mx-auto mb-16">
            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-productframes overflow-hidden border border-border-default">
              <Image 
                src={article.coverImage} 
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                placeholder={article.coverBlur ? "blur" : "empty"}
                blurDataURL={article.coverBlur}
              />
            </div>
          </div>
        )}

        {/* Layout: TOC + Content */}
        <div>
          <div className="flex flex-col xl:flex-row gap-12 max-w-6xl mx-auto">
            
            {/* Table of Contents */}
            <TableOfContents />

            {/* Article Content */}
            <article className="flex-grow max-w-3xl min-w-0 overflow-hidden">
              <div 
                className="prose-article relative mb-12 max-w-full overflow-hidden break-words"
                style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1000px' } as React.CSSProperties}
                dangerouslySetInnerHTML={{ 
                  __html: article.content
                    .replace(/<img /g, '<img sizes="100vw" ')
                    .replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, innerText) => {
                      if (attrs.includes('id=')) return match;
                      const id = innerText
                        .replace(/<[^>]*>?/gm, '')
                        .trim()
                        .toLowerCase()
                        .replace(/[^\p{L}\p{N}]+/gu, '-')
                        .replace(/^-+|-+$/g, '');
                      return `<${tag} id="${id}"${attrs}>${innerText}</${tag}>`;
                    })
                }}
              />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border-default">
                  <h2 className="sr-only">குறிச்சொற்கள்</h2>
                  <p aria-hidden="true" className="section-eyebrow mb-4 text-heading">குறிச்சொற்கள்</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <TagChip key={tag} tag={tag} />
                    ))}
                  </div>
                </div>
              )}

              {/* Article-Level Controls Dock */}
              <div data-print-hide className="mt-12 pt-8 border-t border-border-default flex flex-col gap-8 md:hidden">
                <ShareBar path={`/blog/${article.slug}`} title={article.title} />
                <div className="flex items-center gap-2">
                  <span className="font-ui text-body-sm font-bold text-body-text">சேமிக்க:</span>
                  <BookmarkToggle article={article} />
                </div>
              </div>
              
              <div data-print-hide className="hidden md:flex fixed bottom-[calc(4rem+env(safe-area-inset-bottom)+12px)] left-4 md:left-6 z-nav pointer-events-none">
                <div className="pointer-events-auto bg-surface-pure-white-card shadow-dropdown border border-border-default rounded-full p-2 pr-4 flex flex-row items-center gap-4">
                  <BookmarkToggle article={article} />
                  <div className="w-px h-6 bg-border-default" aria-hidden="true"></div>
                  <ShareBar path={`/blog/${article.slug}`} title={article.title} />
                </div>
              </div>
              
              <AuthorInfoCard authorName={article.author} authorSlug={article.authorSlug} />

              <div data-print-hide>
                <ArticleNavigation prev={prevArticle} next={nextArticle} />
              </div>

              <JazakallahBlock />
              
              {related.length > 0 && (
                <div data-print-hide className="mt-16">
                  <h2 className="text-heading-md font-display font-bold mb-8 inline-block wavy-underline">தொடர்புடைய கட்டுரைகள்</h2>
                  <RelatedArticles sourceArticle={article} articles={related} />
                </div>
              )}
            </article>
            
          </div>
        </div>
      </div>

    </PageShell>
  );
}
