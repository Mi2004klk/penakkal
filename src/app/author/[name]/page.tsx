import { Suspense } from "react";
import { getAllArticles } from "@/lib/content/queries";
import { notFound } from "next/navigation";

import PageShell from "@/components/layout/PageShell";
import ArticleListClient from "@/components/article/ArticleListClient";
import GeometricPattern from "@/components/ui/GeometricPattern";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getCollectionSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import ArticleListSkeleton from "@/components/ui/ArticleListSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { User } from "lucide-react";
import { getFirstGrapheme, pluralizeTa } from "@/lib/utils";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  const authors = new Set(articles.map(a => a.authorSlug).filter(Boolean));
  return Array.from(authors).map((name) => ({
    name: name,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const articles = await getAllArticles();
  const authorArticles = articles.filter(a => a.authorSlug === name);
  
  if (authorArticles.length === 0) return {};
  
  const authorName = authorArticles[0].authorTamil || authorArticles[0].author;
  
  return {
    title: `${authorName} கட்டுரைகள்`,
    description: `${authorName} எழுதிய இஸ்லாமிய கட்டுரைகள்`,
    robots: {
      index: authorArticles.length > 1,
    },
    alternates: {
      canonical: absoluteUrl(`/author/${name}`),
    }
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const allArticles = await getAllArticles();
  
  const authorArticles = allArticles.filter(a => a.authorSlug === name);
  
  if (authorArticles.length === 0) {
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto py-16">
          <EmptyState 
            icon={User} 
            title="எழுத்தாளர் காணப்படவில்லை" 
            description="இந்த எழுத்தாளரின் கட்டுரைகள் எதுவும் தற்போது காணப்படவில்லை."
            action={{ label: "அனைத்து கட்டுரைகள்", href: "/blog" }}
          />
        </div>
      </PageShell>
    );
  }

  const decodedName = authorArticles[0].authorTamil || authorArticles[0].author;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": decodedName,
      "url": `${SITE_URL}/author/${name}`
    }
  };

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "முகப்பு", url: "/" },
    { name: decodedName, url: `/author/${name}` }
  ]);

  const collectionJsonLd = getCollectionSchema(
    `${decodedName} கட்டுரைகள்`,
    `${decodedName} எழுதிய இஸ்லாமிய கட்டுரைகள்`,
    `/author/${name}`
  );

  return (
    <PageShell >
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      
      {/* Author Hero */}
      <section className="relative py-16 md:py-24 bg-surface-card overflow-hidden border-b border-border-default">
        <GeometricPattern className="opacity-10" />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 mx-auto bg-moss flex items-center justify-center text-pure-white text-4xl font-bold rounded-full border-2 border-moss/20 mb-6 shadow-card">
            {getFirstGrapheme(decodedName)}
          </div>
          <span className="section-eyebrow text-muted-text mb-4 inline-block">எழுத்தாளர்</span>
          <h1 className="editorial-headline mb-6 w-fit mx-auto wavy-underline">{decodedName}</h1>
          {authorArticles[0].authorBio ? (
            <p className="font-body text-body text-body-text max-w-2xl mx-auto mb-4">
              {authorArticles[0].authorBio}
            </p>
          ) : (
            <p className="font-body text-body text-body-text max-w-2xl mx-auto mb-4">
              இவரது கட்டுரைகள்
            </p>
          )}
          <p className="font-ui text-body-sm font-bold text-text-link">
            {pluralizeTa(authorArticles.length, "கட்டுரை", "கட்டுரைகள்")}
          </p>
        </div>
      </section>
      
      <div>
        <Suspense fallback={<ArticleListSkeleton viewMode="grid" />}>
          <ArticleListClient articles={authorArticles} basePath={`/author/${name}`} />
        </Suspense>
      </div>
    </PageShell>
  );
}
