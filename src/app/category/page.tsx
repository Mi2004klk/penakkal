import { getAllArticles } from "@/lib/articles";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import { getCollectionSchema } from "@/lib/seo";
import { getCategoryCounts } from "@/lib/categories";
import { pluralizeTa } from "@/lib/utils";

export const metadata = {
  title: "அனைத்து வகைகள்",
  description: "இஸ்லாமிய கட்டுரைகளின் அனைத்து வகைகளும்",
};

export default async function CategoryIndexPage() {
  const articles = await getAllArticles();
  const categories = getCategoryCounts(articles);

  return (
    <PageShell className="bg-surface-pure-white-card">
      <div>
        <h1 className="editorial-headline text-center mb-16 w-fit mx-auto wavy-underline">
          அனைத்து வகைகள்
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map(category => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="bg-surface-cream-paper p-8 rounded-cards border border-border-default hover:border-moss shadow-card hover:shadow-modal transition-all group text-center"
            >
              <h2 className="font-display text-heading-sm font-bold text-heading group-hover:text-text-link transition-colors mb-2">
                {category.tamil}
              </h2>
              <span className="font-ui text-body-sm font-bold text-body-text bg-surface-pure-white-card px-3 py-1 rounded-chips border border-border-default inline-block mt-4 group-hover:border-moss/30">
                {pluralizeTa(category.count, "கட்டுரை", "கட்டுரைகள்")}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <JsonLd data={getCollectionSchema("அனைத்து வகைகள்", "இஸ்லாமிய கட்டுரைகளின் அனைத்து வகைகளும்", "/category")} />
    </PageShell>
  );
}
