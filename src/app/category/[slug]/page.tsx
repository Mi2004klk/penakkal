import { Suspense } from "react";
import { getAllArticles, getArticlesByCategory } from "@/lib/articles";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import ArticleListClient from "@/components/article/ArticleListClient";
import GeometricPattern from "@/components/ui/GeometricPattern";
import JsonLd from "@/components/seo/JsonLd";
import { getCollectionSchema } from "@/lib/seo";

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
    notFound();
  }

  const categoryName = allArticles[0].categoryTamil;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://penakkal.com"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": categoryName,
      "item": `https://penakkal.com/category/${slug}`
    }]
  };

  const collectionJsonLd = getCollectionSchema(
    `${categoryName} கட்டுரைகள்`,
    `${categoryName} தொடர்பான இஸ்லாமிய கட்டுரைகள்`,
    `/category/${slug}`
  );

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[color:var(--color-surface-page)]">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <Header />
      
      {/* Category Hero */}
      <section className="relative py-16 md:py-24 bg-[color:var(--color-surface-card)] overflow-hidden border-b border-[color:var(--color-border-default)]">
        <GeometricPattern className="opacity-10 dark:opacity-[0.05]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="section-eyebrow text-[color:var(--color-muted-text)] mb-4 inline-block">வகை</span>
          <h1 className="editorial-headline mb-6 inline-block w-full wavy-underline">{categoryName}</h1>
          <p className="font-[family-name:var(--font-ui)] text-[length:var(--text-body)] font-bold text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)]">
            {allArticles.length} கட்டுரைகள்
          </p>
        </div>
      </section>
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <Suspense fallback={<div className="text-center py-12 font-[family-name:var(--font-ui)] font-bold text-[color:var(--color-muted-text)]">சுமையேற்றுகிறது...</div>}>
          <ArticleListClient articles={allArticles} basePath={`/category/${slug}`} />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
