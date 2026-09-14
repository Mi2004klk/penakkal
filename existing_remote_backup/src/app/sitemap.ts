export const dynamic = "force-static";
import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();
  
  // Base URLs
  const routes = [
    '',
    '/blog',
    '/search',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `https://penakkal.com${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Categories
  const categories = new Set(articles.map(a => a.category));
  const categoryRoutes = Array.from(categories).map((category) => ({
    url: `https://penakkal.com/category/${category}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Tags
  const tags = new Set<string>();
  articles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag));
  });
  const tagRoutes = Array.from(tags).map((tag) => ({
    url: `https://penakkal.com/tag/${tag}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // Articles
  const articleRoutes = articles.map((article) => ({
    url: `https://penakkal.com/blog/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...categoryRoutes, ...tagRoutes, ...articleRoutes];
}
