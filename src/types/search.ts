export interface SearchResult {
  id: string | number;
  title: string;
  slug: string;
  categoryTamil: string;
  tags?: string[];
  readingTime: number;
}
