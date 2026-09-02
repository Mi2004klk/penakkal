import { promises as fs } from 'fs';
import path from 'path';
import { Article } from '@/types/article';

const dataPath = path.join(process.cwd(), 'src/data/articles.json');

let cachedArticles: Article[] | null = null;

export async function getAllArticles(): Promise<Article[]> {
  if (cachedArticles) return cachedArticles;
  
  const fileContent = await fs.readFile(dataPath, 'utf-8');
  const articles: Article[] = JSON.parse(fileContent);
  
  // Clean up corrupted author data (some WordPress authors are entire paragraphs)
  // Truncating to 25 chars ensures the URL-encoded slug stays safely under the 255-byte file system limit
  articles.forEach(a => {
    if (a.author && a.author.length > 25) {
      a.author = a.author.substring(0, 25).trim() + "...";
    }
  });
  
  // Sort by date descending
  cachedArticles = articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return cachedArticles;
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getAllArticles();
  return articles.find((a) => a.slug === slug);
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter((a) => a.category === category);
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter((a) => a.tags.includes(tag));
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter(a => a.featured);
}

export async function getPopularArticles(): Promise<Article[]> {
  const articles = await getAllArticles();
  // Using a pseudo-random slice based on length for now, ideally this would be real analytics data
  return articles.slice(10, 16);
}

export async function getAllCategories(): Promise<{ slug: string; tamilName: string; count: number }[]> {
  const articles = await getAllArticles();
  const catMap = new Map<string, { tamilName: string; count: number }>();
  
  for (const article of articles) {
    if (!catMap.has(article.category)) {
      catMap.set(article.category, { tamilName: article.categoryTamil, count: 0 });
    }
    catMap.get(article.category)!.count++;
  }
  
  return Array.from(catMap.entries()).map(([slug, { tamilName, count }]) => ({
    slug,
    tamilName,
    count,
  })).sort((a, b) => b.count - a.count);
}

export async function getAllTags(): Promise<{ name: string; count: number }[]> {
  const articles = await getAllArticles();
  const tagMap = new Map<string, number>();
  
  for (const article of articles) {
    for (const tag of article.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getPaginatedArticles(
  page: number, 
  perPage: number, 
  filters?: { category?: string; tag?: string }
): Promise<{ articles: Article[]; total: number; totalPages: number }> {
  let articles = await getAllArticles();
  
  if (filters?.category) {
    articles = articles.filter(a => a.category === filters.category);
  }
  
  if (filters?.tag) {
    articles = articles.filter(a => a.tags.includes(filters.tag!));
  }
  
  const total = articles.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginatedArticles = articles.slice(start, start + perPage);
  
  return { articles: paginatedArticles, total, totalPages };
}

