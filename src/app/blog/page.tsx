import { Suspense } from "react";
import { getAllArticles } from "@/lib/articles";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import ArticleListClient from "@/components/article/ArticleListClient";

export const metadata = {
  title: "கட்டுரைகள்",
  description: "அனைத்து இஸ்லாமிய கட்டுரைகளும்",
};

export default async function BlogListingPage() {
  const allArticles = await getAllArticles();

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Header />
      
      <main className="flex-grow zone-cream pt-16 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <header className="mb-16 text-center max-w-2xl mx-auto">
            <h1 className="editorial-headline mb-6 inline-block wavy-underline">
              அனைத்து கட்டுரைகள்
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[length:var(--text-subheading)] text-[color:var(--color-body-text)] leading-relaxed">
              குர்ஆன், ஹதீஸ், மற்றும் இஸ்லாமிய வரலாற்றை தேடிக் கற்கும் தமிழ் முஸ்லிம்களுக்கான தளம்
            </p>
          </header>

          <Suspense fallback={<div className="text-center py-24 font-[family-name:var(--font-ui)] text-[color:var(--color-muted-text)] font-bold animate-pulse">Loading...</div>}>
            <ArticleListClient articles={allArticles} basePath="/blog" />
          </Suspense>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
