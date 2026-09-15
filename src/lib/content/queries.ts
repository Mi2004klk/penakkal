import { prisma } from './prisma';
import { cache } from 'react';
import { Article } from '@/types/article';

// Helper to map Prisma article to Frontend Article type
function mapPrismaArticle(article: any): Article {
  const primaryCategory = article.categories[0]?.category;
  
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.contentHtml || '',
    excerpt: article.excerpt || '',
    publishedAt: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    author: article.author.nameTamil || article.author.nameEnglish || 'Admin',
    authorTamil: article.author.nameTamil || undefined,
    authorSlug: article.author.slug,
    authorBio: article.author.bio || undefined,
    coverImage: article.coverMedia ? `/media/${article.coverMedia.storageKey}` : undefined,
    category: primaryCategory?.slug || 'uncategorized',
    categoryTamil: primaryCategory?.nameTamil || 'Uncategorized',
    tags: article.tags.map((t: any) => t.tag.name),
    readingTime: article.readingTime || 5,
    wordCount: 1000, // mock or compute
    lang: article.lang as any || 'ta',
    quranRefs: [],
    hadithRefs: [],
    featured: article.isFeatured || false,
  } as any;
}

export const getAllArticles = cache(async (): Promise<Article[]> => {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      author: true,
      coverMedia: true,
    },
  });
  return articles.map(mapPrismaArticle);
});

export const getArticleBySlug = cache(async (slug: string): Promise<Article | undefined> => {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      author: true,
      coverMedia: true,
    },
  });
  if (!article) return undefined;
  return mapPrismaArticle(article);
});

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      categories: { some: { category: { slug: categorySlug } } },
    },
    orderBy: { publishedAt: 'desc' },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      author: true,
      coverMedia: true,
    },
  });
  return articles.map(mapPrismaArticle);
}

export async function getArticlesByTag(tagSlug: string): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      tags: { some: { tag: { slug: tagSlug } } },
    },
    orderBy: { publishedAt: 'desc' },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      author: true,
      coverMedia: true,
    },
  });
  return articles.map(mapPrismaArticle);
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED', isFeatured: true },
    orderBy: { featuredOrder: 'asc' },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      author: true,
      coverMedia: true,
    },
  });
  return articles.map(mapPrismaArticle);
}

export async function getLongreadArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { readingTime: 'desc' },
    take: 6,
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      author: true,
      coverMedia: true,
    },
  });
  return articles.map(mapPrismaArticle);
}

export const getNavCategories = cache(async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 6,
  });
});

export const getAdjacentArticles = cache(async (slug: string) => {
  const articles = await getAllArticles();
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) return { prev: null, next: null };
  const prev = index < articles.length - 1 ? { title: articles[index + 1].title, slug: articles[index + 1].slug } : null;
  const next = index > 0 ? { title: articles[index - 1].title, slug: articles[index - 1].slug } : null;
  return { prev, next };
});
