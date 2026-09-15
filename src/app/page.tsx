import MetaSeparator from "@/components/ui/MetaSeparator";
import Link from "next/link";
import Image from "next/image";
import { getAllArticles, getFeaturedArticles, getLongreadArticles } from "@/lib/content/queries";
import { cleanAuthor, formatDate } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";
import ArticleCard from "@/components/article/ArticleCard";
import GeometricPattern from "@/components/ui/GeometricPattern";
import BismillahBlock from "@/components/ui/BismillahBlock";
import CategoryQuickLinks from "@/components/ui/CategoryQuickLinks";
import HadithBanner from "@/components/ui/HadithBanner";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import IslamicDivider from "@/components/ui/IslamicDivider";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { buttonStyles } from "@/components/ui/Button";
import ReadingTime from "@/components/ui/ReadingTime";

import { absoluteUrl } from "@/lib/seo";

export const metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
  }
};

export default async function Home() {
  const allArticles = await getAllArticles();
  const featured = await getFeaturedArticles();
  
  const heroArticle = featured[0] || allArticles[0];
  const gridFeatured = featured.slice(1, 4);
  
  const featuredIds = new Set([heroArticle.id, ...gridFeatured.map(a => a.id)]);
  
  const latestArticles = allArticles
    .filter(a => !featuredIds.has(a.id))
    .slice(0, 9);
    
  const latestIds = new Set(latestArticles.map(a => a.id));
  
  const allLongreads = await getLongreadArticles();
  const longreads = allLongreads
    .filter(a => !featuredIds.has(a.id) && !latestIds.has(a.id))
    .slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col pt-[var(--header-height)]">
      <Header />
      
      <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
        {/* Hero Section - zone-forest with Parallax */}
        {heroArticle && (
          <section className="relative w-full min-h-[80vh] flex items-center zone-forest overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-forest-stage">
              {heroArticle.coverImage ? (
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                  <Image
                    src={heroArticle.coverImage}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                    placeholder={heroArticle.coverBlur ? "blur" : "empty"}
                    blurDataURL={heroArticle.coverBlur}
                  />
                </div>
              ) : (
                <GeometricPattern className="opacity-10 absolute inset-0" />
              )}
              {/* Radial gradient overlay for readability */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-forest-stage)_100%)] opacity-80" />
            </div>

            <div className="container relative z-10 mx-auto px-4 lg:px-8 max-w-[var(--page-max-width)] py-20 flex flex-col items-center justify-center text-center">
              <div className="mb-8">
                <BismillahBlock tone="lime" />
              </div>
              
              <div className="mb-6 flex justify-center">
                <CategoryBadge category={heroArticle.category} categoryTamil={heroArticle.categoryTamil} />
              </div>
              
              <Link href={`/blog/${heroArticle.slug}`} className="group max-w-4xl block">
                <h1 className="editorial-headline text-lime-sprout mb-8 group-hover:opacity-90 transition-opacity text-balance">
                  {heroArticle.title}
                </h1>
                
                <p className="font-tamil text-subheading text-cream-paper opacity-90 max-w-2xl mx-auto mb-10 line-clamp-3 leading-relaxed">
                  {heroArticle.excerpt}
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-ui text-body-sm text-lime-sprout mb-12 opacity-80">
                  <span className="font-medium line-clamp-1 max-w-[200px]" title={cleanAuthor(heroArticle.author)}>{cleanAuthor(heroArticle.author)}</span>
                  <MetaSeparator />
                  <span>{formatDate(heroArticle.publishedAt, "short")}</span>
                  <MetaSeparator />
                  <ReadingTime minutes={heroArticle.readingTime} />
                </div>

                <div className="inline-block">
                  <span className={buttonStyles({ variant: 'primary' })}>தொடர் படிக்கவும்</span>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Content Zone */}
        <div className="zone-cream pb-24">
          <div className="container mx-auto px-4 lg:px-8 max-w-[var(--page-max-width)]">
            <div className="py-12 border-b border-border-default">
              <CategoryQuickLinks />
            </div>

            <div className="flex flex-col lg:flex-row gap-12 mt-16">
              {/* Main Content Area */}
              <div className="flex-grow lg:w-2/3">
                
                {/* Asymmetric Featured Grid */}
                {gridFeatured.length > 0 && (
                  <section className="mb-24">
                    <div className="mb-10 text-center md:text-left">
                      <h2 className="sr-only">சிறப்புக் கட்டுரைகள்</h2>
                      <p aria-hidden="true" className="section-eyebrow wavy-underline">சிறப்புக் கட்டுரைகள்</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                      {/* Left: 1 Large Portrait Card */}
                      {gridFeatured[0] && (
                        <div className="md:col-span-1">
                          <ArticleCard article={gridFeatured[0]} viewMode="magazine" />
                        </div>
                      )}
                      
                      {/* Right: 2 Stacked Cards */}
                      <div className="md:col-span-1 flex flex-col gap-6 lg:gap-8">
                        {gridFeatured.slice(1, 3).map(article => (
                          <div key={article.id} className="flex-1">
                            <ArticleCard article={article} viewMode="grid" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                <div className="my-20">
                  <HadithBanner />
                </div>

                {/* Latest Articles */}
                <section className="mb-24">
                  <div className="mb-10 text-center md:text-left">
                    <h2 className="sr-only">சமீபத்திய கட்டுரைகள்</h2>
                    <p aria-hidden="true" className="section-eyebrow wavy-underline">சமீபத்திய கட்டுரைகள்</p>
                  </div>
                  
                  <div className="flex flex-col gap-8">
                    {latestArticles.map(article => (
                      <ArticleCard key={article.id} article={article} viewMode="list" />
                    ))}
                  </div>
                  
                  <div className="mt-12 text-center">
                    <Link href="/blog" className={`${buttonStyles({ variant: 'ghost', size: 'md' })} inline-block`}>
                      அனைத்தையும் காண்க &rarr;
                    </Link>
                  </div>
                </section>

                <div className="my-20">
                  <IslamicDivider />
                </div>

                {/* Longread Articles */}
                {longreads.length > 0 && (
                  <section className="mb-24">
                    <div className="mb-10 text-center md:text-left">
                      <h2 className="sr-only">ஆழமான வாசிப்பு</h2>
                      <p aria-hidden="true" className="section-eyebrow wavy-underline">ஆழமான வாசிப்பு</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                      {longreads.slice(0, 4).map(article => (
                        <ArticleCard key={article.id} article={article} viewMode="grid" />
                      ))}
                    </div>
                  </section>
                )}

                <NewsletterSignup />
              </div>

              {/* Sidebar */}
              <aside className="lg:w-1/3">
                <Sidebar />
              </aside>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
