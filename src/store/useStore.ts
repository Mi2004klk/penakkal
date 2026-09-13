import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ArticleInfo {
  slug: string;
  title: string;
  timestamp: number;
  progress: number;
}

interface BookmarkInfo {
  slug: string;
  title: string;
  coverImage?: string;
  savedAt: number;
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
  
  bookmarks: BookmarkInfo[];
  toggleBookmark: (article: Omit<BookmarkInfo, 'savedAt'>) => void;
  removeBookmark: (slug: string) => void;
  restoreBookmark: (bookmark: BookmarkInfo) => void;
  
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (isOpen: boolean) => void;
}

export const STORAGE_KEY = 'penakkal-storage';

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
      toggleBookmark: (article) => set((state) => {
        // filter out legacy string bookmarks
        const validBookmarks = state.bookmarks.filter(b => typeof b === 'object' && b !== null);
        const exists = validBookmarks.some((b) => b.slug === article.slug);
        return {
          bookmarks: exists
            ? validBookmarks.filter((b) => b.slug !== article.slug)
            : [...validBookmarks, { ...article, savedAt: Date.now() }]
        };
      }),
      removeBookmark: (slug) => set((state) => {
        const validBookmarks = state.bookmarks.filter(b => typeof b === 'object' && b !== null);
        return { bookmarks: validBookmarks.filter((b) => b.slug !== slug) };
      }),
      restoreBookmark: (bookmark) => set((state) => {
        const validBookmarks = state.bookmarks.filter(b => typeof b === 'object' && b !== null);
        const exists = validBookmarks.some((b) => b.slug === bookmark.slug);
        return { bookmarks: exists ? validBookmarks : [...validBookmarks, bookmark] };
      }),
      
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
      name: STORAGE_KEY,
      version: 2,
      // v1→v2: bookmark strings become {slug,...} objects; runtime normalizers
      // in the actions already filter legacy shapes, so pass through as-is
      // (without migrate, zustand silently DISCARDS all persisted state on
      // version mismatch and users lose bookmarks/history).
      migrate: (persisted: unknown) => persisted ?? {},
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        viewMode: state.viewMode,
        history: state.history,
        bookmarks: state.bookmarks,
        recentSearches: state.recentSearches,
      }),
    }
  )
);
