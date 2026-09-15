import { Suspense } from "react";
import { getAllArticles } from "@/lib/content/queries";
import ArticleListClient from "@/components/article/ArticleListClient";
import { getCollectionSchema } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import PageShell from "@/components/layout/PageShell";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { getCollectionSchema, absoluteUrl } from "@/lib/seo";

export const metadata = {
  title: "கட்டுரைகள்",
  description: "அனைத்து இஸ்லாமிய கட்டுரைகளும்",
  alternates: {
    canonical: absoluteUrl("/blog"),
  }
};

export default async function BlogListingPage() {
  const allArticles = await getAllArticles();

  return (
    <PageShell className="zone-cream" >
      <div>
        <header className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="editorial-headline mb-6 inline-block wavy-underline">
            அனைத்து கட்டுரைகள்
          </h1>
          <p className="font-body text-subheading text-body-text leading-relaxed">
            குர்ஆன், ஹதீஸ், மற்றும் இஸ்லாமிய வரலாற்றை தேடிக் கற்கும் தமிழ் முஸ்லிம்களுக்கான தளம்
          </p>
        </header>

        <Suspense fallback={<LoadingSpinner />}>
          <ArticleListClient articles={allArticles} basePath="/blog" />
        </Suspense>
      </div>
      <JsonLd data={getCollectionSchema("அனைத்து கட்டுரைகள்", "அனைத்து இஸ்லாமிய கட்டுரைகளும்", "/blog")} />
    </PageShell>
  );
}
