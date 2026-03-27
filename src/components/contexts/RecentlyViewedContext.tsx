/**
 * @file RecentlyViewedContext.tsx
 * Tracks recently viewed brew items with localStorage persistence and TTL.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { BrewItem, BrewType } from '../../types';

export interface RecentEntry {
    id: string;
    type: BrewType;
    token: string;
    name: string;
    desc: string;
    homepage?: string;
}

interface RecentlyViewedContextType {
    recentItems: RecentEntry[];
    trackView(item: BrewItem): void;
    clearRecent(): void;
}

const MAX_RECENT = 10;
const TTL_MS = 60 * 60 * 1000 * 24 * 3; // 3 day
const STORAGE_KEY_ITEMS = 'brewlens_recent';
const STORAGE_KEY_TIMESTAMP = 'brewlens_recent_ts';

function loadRecentItems(): RecentEntry[] {
    try {
        const timestampRaw = localStorage.getItem(STORAGE_KEY_TIMESTAMP);
        if (!timestampRaw) return [];

        const timestamp = parseInt(timestampRaw, 10);
        if (isNaN(timestamp) || Date.now() - timestamp > TTL_MS) {
            // Expired or invalid timestamp, clear both storage entries
            localStorage.removeItem(STORAGE_KEY_ITEMS);
            localStorage.removeItem(STORAGE_KEY_TIMESTAMP);
            return [];
        }

        const itemsRaw = localStorage.getItem(STORAGE_KEY_ITEMS);
        if (!itemsRaw) return [];

        const items = JSON.parse(itemsRaw) as RecentEntry[];
        return Array.isArray(items) ? items : [];
    } catch (error) {
        console.error('Failed to load recent items from localStorage', error);
        return [];
    }
}

function persistRecentItems(items: RecentEntry[]) {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    localStorage.setItem(STORAGE_KEY_TIMESTAMP, Date.now().toString());
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | null>(null);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
    const [recentItems, setRecentItems] = useState<RecentEntry[]>(loadRecentItems);

    // Persist to localStorage whenever the list changes
    useEffect(() => {
        persistRecentItems(recentItems);
    }, [recentItems]);

    const trackView = (item: BrewItem) => {
        const entry: RecentEntry = {
            id: item.id,
            type: item.type,
            token: item.token,
            name: item.name,
            desc: item.desc,
            homepage: item.homepage,
        };
        setRecentItems(prev => {
            const deduped = prev.filter(e => e.id !== entry.id);
            return [entry, ...deduped].slice(0, MAX_RECENT);
        });
    };

    const clearRecent = () => setRecentItems([]);

    return (
        <RecentlyViewedContext.Provider value={{ recentItems, trackView, clearRecent }}>
            {children}
        </RecentlyViewedContext.Provider>
    );
}

export function useRecentlyViewed(): RecentlyViewedContextType {
    const ctx = useContext(RecentlyViewedContext);
    if (!ctx) throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
    return ctx;
}