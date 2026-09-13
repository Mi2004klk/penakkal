import { promises as fs } from 'fs';
import path from 'path';
import { Article } from '@/types/article';
import { getCategoryCounts } from '@/lib/categories';
import { slugify } from '@/lib/utils';

const metaPath = path.join(process.cwd(), 'src/data/articles-meta.json');
const contentDir = path.join(process.cwd(), 'src/data/articles-content');

import { cache } from 'react';

let cachedArticles: Article[] | null = null;

export const getAllArticles = cache(async (): Promise<Article[]> => {
  if (cachedArticles) return cachedArticles;
  
  const fileContent = await fs.readFile(metaPath, 'utf-8');
  const articles: Article[] = JSON.parse(fileContent);
  
  // Clean titles and authors
  for (const a of articles) {
    if (a.title) {
      a.title = a.title.replace(/\s+/g, ' ').trim();
    }
    
    // Slugify authorSlug
    if (a.authorSlug) {
      a.authorSlug = slugify(a.authorSlug);
    } else if (a.author) {
      a.authorSlug = slugify(a.author);
    }
  }
  
  // Sort by date descending
  cachedArticles = articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return cachedArticles;
});

export const getArticleBySlug = cache(async (slug: string): Promise<Article | undefined> => {
  const articles = await getAllArticles();
  const meta = articles.find((a) => a.slug === slug);
  if (!meta) return undefined;

  try {
    const contentFile = await fs.readFile(path.join(contentDir, `${slug}.json`), 'utf-8');
    const { content } = JSON.parse(contentFile);
    return { ...meta, content };
  } catch (error) {
    console.error(`Error loading content for slug ${slug}:`, error);
    return undefined;
  }
});

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

export async function getLongreadArticles(): Promise<Article[]> {
  const articles = await getAllArticles();
  // Sort by longest reading time as a proxy for "popular/in-depth" articles
  return [...articles].sort((a, b) => b.readingTime - a.readingTime).slice(0, 6);
}
export const getNavCategories = cache(async () => {
  const articles = await getAllArticles();
  const counts = getCategoryCounts(articles);
  const curatedOrder = ['quran-tafsir', 'hadith', 'fiqh', 'seerah', 'history', 'spirituality'];
  
  // Get top 6 by count
  const top6 = counts.slice(0, 6);
  
  // Sort them according to curated order if they exist in it, else append at end
  return top6.sort((a, b) => {
    const idxA = curatedOrder.indexOf(a.slug);
    const idxB = curatedOrder.indexOf(b.slug);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  }).map(c => ({ id: c.slug, name: c.tamil }));
});

let adjacentIndex: Map<string, { prev: { title: string; slug: string } | null; next: { title: string; slug: string } | null }> | null = null;

export const getAdjacentArticles = cache(async (slug: string) => {
  if (!adjacentIndex) {
    const articles = await getAllArticles();
    adjacentIndex = new Map();
    
    for (let i = 0; i < articles.length; i++) {
      const current = articles[i];
      const next = i > 0 ? { title: articles[i - 1].title, slug: articles[i - 1].slug } : null;
      const prev = i < articles.length - 1 ? { title: articles[i + 1].title, slug: articles[i + 1].slug } : null;
      adjacentIndex.set(current.slug, { prev, next });
    }
  }
  
  return adjacentIndex.get(slug) || { prev: null, next: null };
});

