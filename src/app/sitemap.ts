export const dynamic = "force-static";
import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { absoluteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();
  
  const maxUpdated = articles.length > 0 
    ? new Date(Math.max(...articles.map(a => new Date(a.updatedAt || a.publishedAt).getTime()))).toISOString()
    : new Date().toISOString();

  // Base URLs
  const routes = [
    '',
    '/blog',
    '/category',
    '/search',
    '/about',
  ].map((route) => ({
    url: absoluteUrl(route),
    lastModified: maxUpdated,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Categories
  const categories = new Set(articles.map(a => a.category));
  const categoryRoutes = Array.from(categories).map((category) => {
    const categoryArticles = articles.filter(a => a.category === category);
    const categoryMaxUpdated = categoryArticles.length > 0 
      ? new Date(Math.max(...categoryArticles.map(a => new Date(a.updatedAt || a.publishedAt).getTime()))).toISOString()
      : maxUpdated;
      
    return {
      url: absoluteUrl(`/category/${category}`),
      lastModified: categoryMaxUpdated,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });

  // Tags
  const tags = new Set<string>();
  articles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag));
  });
  const tagRoutes = Array.from(tags).map((tag) => {
    const tagArticles = articles.filter(a => a.tags.includes(tag));
    const tagMaxUpdated = tagArticles.length > 0 
      ? new Date(Math.max(...tagArticles.map(a => new Date(a.updatedAt || a.publishedAt).getTime()))).toISOString()
      : maxUpdated;
      
    return {
      url: absoluteUrl(`/tag/${tag}`),
      lastModified: tagMaxUpdated,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    };
  });

  // Articles
  const articleRoutes = articles.map((article) => ({
    url: absoluteUrl(`/blog/${article.slug}`),
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Authors (indexable only with >1 article — mirrors the page-level robots policy)
  const authorCounts = new Map<string, { count: number; maxUpdated: string }>();
  articles.forEach((article) => {
    if (!article.authorSlug) return;
    const updated = article.updatedAt || article.publishedAt;
    const entry = authorCounts.get(article.authorSlug);
    if (entry) {
      entry.count += 1;
      if (new Date(updated).getTime() > new Date(entry.maxUpdated).getTime()) {
        entry.maxUpdated = updated;
      }
    } else {
      authorCounts.set(article.authorSlug, { count: 1, maxUpdated: updated });
    }
  });
  const authorRoutes = Array.from(authorCounts.entries())
    .filter(([, info]) => info.count > 1)
    .map(([authorSlug, info]) => ({
      url: absoluteUrl(`/author/${authorSlug}`),
      lastModified: info.maxUpdated,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    }));

  return [...routes, ...categoryRoutes, ...tagRoutes, ...authorRoutes, ...articleRoutes];
}
