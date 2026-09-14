import { Article } from "@/types/article";

export function computeRelevanceScore(source: Article, candidate: Article, viewedSlugs: string[] = []): number {
  if (source.id === candidate.id) return -1000; // Don't recommend the same article
  
  let score = 0;
  
  if (source.category === candidate.category) score += 40;

  const shared = source.tags.filter(t => candidate.tags.includes(t));
  score += Math.min(shared.length * 10, 30);

  if (source.author === candidate.author) score += 15;

  const candidateDate = new Date(candidate.publishedAt);
  const now = new Date();
  const monthsDiff = (now.getFullYear() - candidateDate.getFullYear()) * 12 + (now.getMonth() - candidateDate.getMonth());
  
  if (monthsDiff < 6) score += 5;

  if (viewedSlugs.includes(candidate.slug)) score -= 20;

  return score;
}

export function getRelatedArticles(source: Article, allArticles: Article[], limit: number = 3, viewedSlugs: string[] = []): Article[] {
  const scored = allArticles
    .filter(a => a.id !== source.id)
    .map(a => ({
      article: a,
      score: computeRelevanceScore(source, a, viewedSlugs)
    }))
    .sort((a, b) => b.score - a.score);
    
  return scored.slice(0, limit).map(s => s.article);
}
