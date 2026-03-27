/**
 * @file BookmarksContext.tsx
 * Provides bookmark/collection management with localStorage persistence.
 */

import { createContext, useContext, type ReactNode } from 'react';
import { useStorage } from '../../hooks/useStorage';
import type { BrewItem } from '../../types';

export interface Collection {
    id: string;
    name: string;
    itemIds: string[];
}

export interface BookmarksContextType {
    collections: Collection[];
    addCollection: (name: string) => void;
    removeCollection: (id: string) => void;
    renameCollection: (id: string, name: string) => void;
    toggleBookmark: (collectionId: string, item: BrewItem) => void;
    isBookmarked: (itemId: string) => boolean;
    getCollectionForItem: (itemId: string) => Collection | undefined;
}

const BookmarksContext = createContext<BookmarksContextType | null>(null);

const DEFAULT_COLLECTION: Collection = { id: 'favourites', name: 'Favourites', itemIds: [] };

function isValidName(name: string): boolean {
    return name.trim().length > 0 && name.length <= 50;
}

export function BookmarksProvider({ children }: { children: ReactNode }) {
    const [rawCollections, setCollections] = useStorage<Collection[]>('brewlens_bookmarks', [], 'local');

    // Seed default "Favourites" collection when stored array is empty
    const collections: Collection[] = rawCollections.length === 0 ? [DEFAULT_COLLECTION] : rawCollections;

    const addCollection = (name: string) => {
        if (!isValidName(name)) return;
        const newCollection: Collection = {
            id: crypto.randomUUID(),
            name: name.trim(),
            itemIds: [],
        };
        setCollections([...collections, newCollection]);
    };

    const removeCollection = (id: string) => {
        setCollections(collections.filter(c => c.id !== id));
    };

    const renameCollection = (id: string, name: string) => {
        if (!isValidName(name)) return;
        setCollections(collections.map(c => c.id === id ? { ...c, name: name.trim() } : c));
    };

    const toggleBookmark = (collectionId: string, item: BrewItem) => {
        setCollections(collections.map(c => {
            if (c.id !== collectionId) return c;
            const has = c.itemIds.includes(item.id);
            return {
                ...c,
                itemIds: has
                    ? c.itemIds.filter(id => id !== item.id)
                    : [...c.itemIds, item.id],
            };
        }));
    };

    const isBookmarked = (itemId: string): boolean =>
        collections.some(c => c.itemIds.includes(itemId));

    const getCollectionForItem = (itemId: string): Collection | undefined =>
        collections.find(c => c.itemIds.includes(itemId));

    return (
        <BookmarksContext.Provider value={{
            collections,
            addCollection,
            removeCollection,
            renameCollection,
            toggleBookmark,
            isBookmarked,
            getCollectionForItem,
        }}>
            {children}
        </BookmarksContext.Provider>
    );
}

export function useBookmarks(): BookmarksContextType {
    const ctx = useContext(BookmarksContext);
    if (!ctx) throw new Error('useBookmarks must be used within a BookmarksProvider');
    return ctx;
}
