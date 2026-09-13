import { Suspense } from "react";
import { getAllArticles, getArticlesByCategory } from "@/lib/articles";
import { notFound } from "next/navigation";

import PageShell from "@/components/layout/PageShell";
import ArticleListClient from "@/components/article/ArticleListClient";
import GeometricPattern from "@/components/ui/GeometricPattern";
import JsonLd from "@/components/seo/JsonLd";
import { getCollectionSchema, getBreadcrumbSchema } from "@/lib/seo";
import ArticleListSkeleton from "@/components/ui/ArticleListSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { FolderOpen } from "lucide-react";
import { pluralizeTa } from "@/lib/utils";
import { getNavCategories } from "@/lib/articles";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  const categories = new Set(articles.map(a => a.category));
  return Array.from(categories).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getArticlesByCategory(slug);
  if (articles.length === 0) return {};
  
  const categoryName = articles[0].categoryTamil;
  
  return {
    title: `${categoryName} கட்டுரைகள்`,
    description: `${categoryName} தொடர்பான இஸ்லாமிய கட்டுரைகள்`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allArticles = await getArticlesByCategory(slug);
  
  if (allArticles.length === 0) {
    const navCategories = await getNavCategories();
    const isKnownCategory = navCategories.some(c => c.id === slug);
    if (!isKnownCategory) notFound();
    
    const knownCategory = navCategories.find(c => c.id === slug);
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto py-16">
          <EmptyState 
            icon={FolderOpen} 
            title="இந்த வகையில் கட்டுரைகள் இல்லை" 
            description={`"${knownCategory?.name || slug}" பிரிவில் தற்போது எந்த கட்டுரைகளும் காணப்படவில்லை.`}
            action={{ label: "அனைத்து வகைகளும்", href: "/category", variant: "secondary" }}
            secondaryAction={{ label: "அனைத்து கட்டுரைகள்", href: "/blog" }}
          />
        </div>
      </PageShell>
    );
  }

  const categoryName = allArticles[0].categoryTamil;

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "முகப்பு", url: "/" },
    { name: categoryName, url: `/category/${slug}` }
  ]);

  const collectionJsonLd = getCollectionSchema(
    `${categoryName} கட்டுரைகள்`,
    `${categoryName} தொடர்பான இஸ்லாமிய கட்டுரைகள்`,
    `/category/${slug}`
  );

  return (
    <PageShell >
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      
      {/* Category Hero */}
      <section className="relative py-16 md:py-24 bg-surface-card overflow-hidden border-b border-border-default">
        <GeometricPattern className="opacity-10" />
        <div className="relative z-10 text-center">
          <span className="section-eyebrow text-muted-text mb-4 inline-block">வகை</span>
          <h1 className="editorial-headline mb-6 w-fit mx-auto wavy-underline">{categoryName}</h1>
          <p className="font-ui text-body-sm font-bold text-text-link">
            {pluralizeTa(allArticles.length, "கட்டுரை", "கட்டுரைகள்")}
          </p>
        </div>
      </section>
      
      <div>
        <Suspense fallback={<ArticleListSkeleton viewMode="grid" />}>
          <ArticleListClient articles={allArticles} basePath={`/category/${slug}`} />
        </Suspense>
      </div>
    </PageShell>
  );
}
