import { Suspense } from "react";
import { getAllArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import ArticleListClient from "@/components/article/ArticleListClient";
import GeometricPattern from "@/components/ui/GeometricPattern";
import JsonLd from "@/components/seo/JsonLd";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  const authors = new Set(articles.map(a => a.author));
  return Array.from(authors).map((name) => ({
    name: encodeURIComponent(name),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  
  return {
    title: `${decodedName} கட்டுரைகள்`,
    description: `${decodedName} எழுதிய இஸ்லாமிய கட்டுரைகள்`,
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const allArticles = await getAllArticles();
  
  const authorArticles = allArticles.filter(a => a.author === decodedName);
  
  if (authorArticles.length === 0) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": decodedName,
    "url": `https://penakkal.com/author/${name}`
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[color:var(--color-surface-page)]">
      <JsonLd data={jsonLd} />
      <Header />
      
      {/* Author Hero */}
      <section className="relative py-16 md:py-24 bg-[color:var(--color-surface-card)] overflow-hidden border-b border-[color:var(--color-border-default)]">
        <GeometricPattern className="opacity-10 dark:opacity-[0.05]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="w-24 h-24 mx-auto bg-[color:var(--color-moss)]/10 flex items-center justify-center text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] text-4xl font-bold rounded-full border-2 border-[color:var(--color-moss)]/20 mb-6 shadow-[var(--shadow-card)]">
            {decodedName.charAt(0)}
          </div>
          <span className="section-eyebrow text-[color:var(--color-muted-text)] mb-4 inline-block">எழுத்தாளர்</span>
          <h1 className="editorial-headline mb-6 inline-block w-full wavy-underline">{decodedName}</h1>
          <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-body-text)] max-w-2xl mx-auto mb-4">
            இஸ்லாமிய கட்டுரைகள் மற்றும் வரலாற்று குறிப்புகளை எழுதும் எழுத்தாளர். குர்ஆன் மற்றும் ஹதீஸ் ஒளியில் சமூக சிந்தனைகளை பகிர்ந்து வருகிறார்.
          </p>
          <p className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)]">
            {authorArticles.length} கட்டுரைகள்
          </p>
        </div>
      </section>
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <Suspense fallback={<div className="text-center py-12 font-[family-name:var(--font-ui)] font-bold text-[color:var(--color-muted-text)]">சுமையேற்றுகிறது...</div>}>
          <ArticleListClient articles={authorArticles} basePath={`/author/${name}`} />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
