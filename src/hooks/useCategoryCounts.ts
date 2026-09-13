import { useMemo } from 'react';
import { Article } from '@/types/article';
import { getCategoryCounts, CategoryCount } from '@/lib/categories';

export function useCategoryCounts(articles: Article[]): CategoryCount[] {
  return useMemo(() => getCategoryCounts(articles), [articles]);
}
