export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  authorTamil?: string;
  authorSlug?: string;
  authorBio?: string;
  coverImage?: string;
  coverSourceUrl?: string;
  coverBlur?: string;
  category: string;
  categoryTamil: string;
  tags: string[];
  readingTime: number;
  wordCount: number;
  lang: 'ta' | 'ar' | 'ta-ar';
  quranRefs: string[];
  hadithRefs: string[];
  featured: boolean;
}
