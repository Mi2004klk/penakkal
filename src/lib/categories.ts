import { Article } from "@/types/article";

export interface CategoryCount {
  slug: string;
  tamil: string;
  count: number;
}

export function getCategoryCounts(articles: Article[]): CategoryCount[] {
  const categoryMap = new Map<string, { tamil: string, count: number }>();
  
  articles.forEach(article => {
    if (categoryMap.has(article.category)) {
      categoryMap.get(article.category)!.count++;
    } else {
      categoryMap.set(article.category, { tamil: article.categoryTamil, count: 1 });
    }
  });

  return Array.from(categoryMap.entries()).map(([slug, data]) => ({
    slug,
    ...data
  })).sort((a, b) => b.count - a.count);
}
