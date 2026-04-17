/**
 * @file BookmarksContext.tsx
 * Provides simplified bookmark management with localStorage persistence.
 * Stores a single flat list of BrewItem objects.
 */

import { createContext, useContext, type ReactNode, useMemo } from 'react';
import { useStorage } from '../../hooks/useStorage';
import type { BrewItem } from '../../types';

export interface BookmarksContextType {
    bookmarks: BrewItem[];
    toggleBookmark: (item: BrewItem) => void;
    isBookmarked: (itemId: string) => boolean;
    clearBookmarks: () => void;
}

const BookmarksContext = createContext<BookmarksContextType | null>(null);

export function BookmarksProvider({ children }: { children: ReactNode }) {
    // Using a new key for the simplified schema
    const [bookmarks, setBookmarks] = useStorage<BrewItem[]>('brewlens_bookmarks_v3', [], 'local');

    const toggleBookmark = (item: BrewItem) => {
        setBookmarks(prev => {
            const isBookmarked = prev.some(b => b.id === item.id);
            if (isBookmarked) {
                return prev.filter(b => b.id !== item.id);
            } else {
                return [item, ...prev];
            }
        });
    };

    const isBookmarked = (itemId: string): boolean =>
        bookmarks.some(b => b.id === itemId);

    const clearBookmarks = () => setBookmarks([]);

    const value = useMemo(() => ({
        bookmarks,
        toggleBookmark,
        isBookmarked,
        clearBookmarks,
    }), [bookmarks]);

    return (
        <BookmarksContext.Provider value={value}>
            {children}
        </BookmarksContext.Provider>
    );
}

export function useBookmarks(): BookmarksContextType {
    const ctx = useContext(BookmarksContext);
    if (!ctx) throw new Error('useBookmarks must be used within a BookmarksProvider');
    return ctx;
}
