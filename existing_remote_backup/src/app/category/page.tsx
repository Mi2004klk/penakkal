import { getAllArticles } from "@/lib/articles";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import JsonLd from "@/components/seo/JsonLd";
import { getCollectionSchema } from "@/lib/seo";

export const metadata = {
  title: "அனைத்து வகைகள் | பேனாக்கள்",
  description: "இஸ்லாமிய கட்டுரைகளின் அனைத்து வகைகளும்",
};

export default async function CategoryIndexPage() {
  const articles = await getAllArticles();
  
  // Calculate categories and their counts
  const categoryMap = new Map<string, { tamil: string, count: number }>();
  
  articles.forEach(article => {
    if (categoryMap.has(article.category)) {
      categoryMap.get(article.category)!.count++;
    } else {
      categoryMap.set(article.category, { tamil: article.categoryTamil, count: 1 });
    }
  });

  const categories = Array.from(categoryMap.entries()).map(([slug, data]) => ({
    slug,
    ...data
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[color:var(--color-surface-pure-white-card)] dark:bg-[color:var(--color-midnight-ink)]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <h1 className="editorial-headline text-center mb-16 inline-block w-full wavy-underline">
          அனைத்து வகைகள்
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map(category => (
            <Link 
              key={category.slug}
              href={`/category/${category.slug}`}
              className="bg-[color:var(--color-surface-cream-paper)] dark:bg-[color:var(--color-slate)]/30 p-8 rounded-[length:var(--radius-cards)] border border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)] hover:border-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-modal)] transition-all group text-center"
            >
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[color:var(--color-true-black)] dark:text-[color:var(--color-cream-paper)] group-hover:text-[color:var(--color-moss)] dark:group-hover:text-[color:var(--color-lime-sprout)] transition-colors mb-2">
                {category.tamil}
              </h2>
              <span className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold text-[color:var(--color-stone)] dark:text-[color:var(--color-ash)] bg-[color:var(--color-surface-pure-white-card)] dark:bg-[color:var(--color-midnight-ink)] px-3 py-1 rounded-[length:var(--radius-chips)] border border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)] inline-block mt-4 group-hover:border-[color:var(--color-moss)]/30 dark:group-hover:border-[color:var(--color-lime-sprout)]/30">
                {category.count} கட்டுரைகள்
              </span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
      <MobileNav />
      <JsonLd data={getCollectionSchema("அனைத்து வகைகள்", "இஸ்லாமிய கட்டுரைகளின் அனைத்து வகைகளும்", "/category")} />
    </div>
  );
}
