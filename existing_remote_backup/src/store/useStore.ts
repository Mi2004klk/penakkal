import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ArticleInfo {
  slug: string;
  title: string;
  timestamp: number;
  progress: number;
}

interface PenakkalState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  setFontSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  
  viewMode: 'grid' | 'magazine' | 'list' | 'compact';
  setViewMode: (mode: 'grid' | 'magazine' | 'list' | 'compact') => void;
  
  history: ArticleInfo[];
  addToHistory: (article: ArticleInfo) => void;
  clearHistory: () => void;
  
  bookmarks: string[];
  toggleBookmark: (slug: string) => void;
  
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (isOpen: boolean) => void;
}

export const useStore = create<PenakkalState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      fontSize: 'md',
      setFontSize: (fontSize) => set({ fontSize }),
      
      viewMode: 'grid',
      setViewMode: (viewMode) => set({ viewMode }),
      
      history: [],
      addToHistory: (article) => set((state) => {
        const filtered = state.history.filter((a) => a.slug !== article.slug);
        return { history: [article, ...filtered].slice(0, 50) };
      }),
      
      bookmarks: [],
      toggleBookmark: (slug) => set((state) => ({
        bookmarks: state.bookmarks.includes(slug)
          ? state.bookmarks.filter((b) => b !== slug)
          : [...state.bookmarks, slug]
      })),
      
      recentSearches: [],
      addRecentSearch: (query) => set((state) => {
        const filtered = state.recentSearches.filter((q) => q !== query);
        return { recentSearches: [query, ...filtered].slice(0, 10) };
      }),
      clearRecentSearches: () => set({ recentSearches: [] }),
      
      clearHistory: () => set({ history: [] }),

      isSearchModalOpen: false,
      setIsSearchModalOpen: (isOpen) => set({ isSearchModalOpen: isOpen }),
    }),
    {
      name: 'penakkal-storage',
    }
  )
);
