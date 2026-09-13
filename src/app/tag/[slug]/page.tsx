import { Suspense } from "react";
import { getAllArticles, getArticlesByTag } from "@/lib/articles";
import { notFound } from "next/navigation";

import PageShell from "@/components/layout/PageShell";
import ArticleListClient from "@/components/article/ArticleListClient";
import GeometricPattern from "@/components/ui/GeometricPattern";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getCollectionSchema } from "@/lib/seo";
import ArticleListSkeleton from "@/components/ui/ArticleListSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { TagIcon } from "lucide-react";
import { pluralizeTa } from "@/lib/utils";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  const tags = new Set<string>();
  articles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const articles = await getArticlesByTag(decodedSlug);
  if (articles.length === 0) return {};
  
  return {
    title: `${decodedSlug} கட்டுரைகள்`,
    description: `${decodedSlug} தொடர்பான இஸ்லாமிய கட்டுரைகள்`,
    robots: {
      index: articles.length > 1,
    }
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const allArticles = await getArticlesByTag(decodedSlug);
  
  if (allArticles.length === 0) {
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto py-16">
          <EmptyState 
            icon={TagIcon} 
            title="இந்த குறிச்சொல்லில் கட்டுரைகள் இல்லை" 
            description={`"#${decodedSlug}" குறிச்சொல்லுடன் தற்போது எந்த கட்டுரைகளும் காணப்படவில்லை.`}
            action={{ label: "அனைத்து கட்டுரைகள்", href: "/blog" }}
          />
        </div>
      </PageShell>
    );
  }

  const jsonLd = getBreadcrumbSchema([
    { name: "முகப்பு", url: "/" },
    { name: decodedSlug, url: `/tag/${encodeURIComponent(decodedSlug)}` }
  ]);

  const collectionJsonLd = getCollectionSchema(
    `${decodedSlug} கட்டுரைகள்`,
    `${decodedSlug} தொடர்பான இஸ்லாமிய கட்டுரைகள்`,
    `/tag/${encodeURIComponent(decodedSlug)}`
  );

  return (
    <PageShell >
      <JsonLd data={jsonLd} />
      <JsonLd data={collectionJsonLd} />
      
      {/* Tag Hero */}
      <section className="relative py-16 md:py-24 bg-surface-card overflow-hidden border-b border-border-default">
        <GeometricPattern className="opacity-10" />
        <div className="relative z-10 text-center">
          <span className="section-eyebrow text-muted-text mb-4 inline-block">குறிச்சொல்</span>
          <h1 className="editorial-headline mb-6 w-fit mx-auto wavy-underline">#{decodedSlug}</h1>
          <p className="font-ui text-body-sm font-bold text-text-link">
            {pluralizeTa(allArticles.length, "கட்டுரை", "கட்டுரைகள்")}
          </p>
        </div>
      </section>
      
      <div>
        <Suspense fallback={<ArticleListSkeleton viewMode="grid" />}>
          <ArticleListClient articles={allArticles} basePath={`/tag/${slug}`} />
        </Suspense>
      </div>
    </PageShell>
  );
}
