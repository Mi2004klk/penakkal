import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { getRelatedArticles } from "@/lib/recommendations";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { ta } from "date-fns/locale";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import CategoryBadge from "@/components/ui/CategoryBadge";
import TagChip from "@/components/ui/TagChip";
import ReadingProgress from "@/components/article/ReadingProgress";
import TableOfContents from "@/components/article/TableOfContents";
import ShareBar from "@/components/article/ShareBar";
import BismillahBlock from "@/components/ui/BismillahBlock";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedArticles from "@/components/article/RelatedArticles";
import JazakallahBlock from "@/components/article/JazakallahBlock";
import AuthorInfoCard from "@/components/article/AuthorInfoCard";
import ArticleNavigation from "@/components/article/ArticleNavigation";
import BookmarkToggle from "@/components/article/BookmarkToggle";
import ArticleTracker from "@/components/article/ArticleTracker";
import JsonLd from "@/components/seo/JsonLd";
import { getArticleSchema } from "@/lib/seo";

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
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: article.coverImage ? [article.coverImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allArticles = await getAllArticles();
  const currentIndex = allArticles.findIndex(a => a.slug === slug);
  const article = allArticles[currentIndex];
  
  if (!article) {
    notFound();
  }

  const prevArticle = currentIndex > 0 ? { title: allArticles[currentIndex - 1].title, slug: allArticles[currentIndex - 1].slug } : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? { title: allArticles[currentIndex + 1].title, slug: allArticles[currentIndex + 1].slug } : null;

  const related = getRelatedArticles(article, allArticles, 3);
  const formattedDate = format(new Date(article.publishedAt), "dd MMMM yyyy", { locale: ta });

  const jsonLd = getArticleSchema({
    title: article.title,
    excerpt: article.excerpt,
    coverImage: article.coverImage,
    date: article.publishedAt,
    author: article.author
  });

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[color:var(--color-surface-page)]">
      <JsonLd data={jsonLd} />
      <Header />
      <ReadingProgress title={article.title} />
      <ArticleTracker slug={article.slug} title={article.title} />
      
      <main className="flex-grow zone-cream pt-8 pb-20">
        {/* Article Header */}
        <header className="container mx-auto px-4 pt-8 pb-8 max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <Breadcrumb category={article.category} categoryTamil={article.categoryTamil} title={article.title} />
          </div>
          
          <div className="mb-6">
            <CategoryBadge category={article.category} categoryTamil={article.categoryTamil} />
          </div>
          
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold mb-6 text-[color:var(--color-heading)] leading-tight tracking-tight">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[color:var(--color-muted-text)] font-bold mb-8">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[color:var(--color-moss)]/10 flex items-center justify-center text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] text-xs">✍️</span>
              {article.author}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-border-default)]"></span>
            <span>{formattedDate}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-border-default)]"></span>
            <span>{article.readingTime} நிமிட வாசிப்பு</span>
          </div>

          <BismillahBlock />
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="container mx-auto px-4 max-w-5xl mb-16">
            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[length:var(--radius-productframes)] overflow-hidden border border-[color:var(--color-border-default)]">
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
        <div className="container mx-auto px-4 pb-20">
          <div className="flex flex-col xl:flex-row gap-12 max-w-6xl mx-auto">
            
            {/* Table of Contents */}
            <TableOfContents selector=".prose" />

            {/* Article Content */}
            <article className="flex-grow max-w-3xl min-w-0">
              <div 
                className="prose dark:prose-invert max-w-none w-full mb-12"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[color:var(--color-border-default)]">
                  <h3 className="section-eyebrow mb-4 text-[color:var(--color-heading)]">குறிச்சொற்கள்</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <TagChip key={tag} tag={tag} />
                    ))}
                  </div>
                </div>
              )}

              {/* Share and Bookmark Bar */}
              <div className="mt-12 pt-8 border-t border-[color:var(--color-border-default)] flex flex-wrap items-center justify-between gap-4">
                <ShareBar url={`/blog/${article.slug}`} title={article.title} />
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold text-[color:var(--color-body-text)]">சேமிக்க:</span>
                  <BookmarkToggle slug={article.slug} />
                </div>
              </div>
              
              <AuthorInfoCard authorName={article.author} />

              <ArticleNavigation prev={prevArticle} next={nextArticle} />

              <JazakallahBlock />
              
              <div className="mt-16">
                <h2 className="editorial-headline mb-8 inline-block wavy-underline">தொடர்புடைய கட்டுரைகள்</h2>
                <RelatedArticles articles={related} />
              </div>
            </article>
            
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
