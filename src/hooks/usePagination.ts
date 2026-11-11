/**
 * @file usePagination.ts
 * Generic pagination hook with localStorage persistence.
 * Saves and restores the current page across navigation using a storage key.
 */

import { useState, useEffect, useMemo } from 'react';

/**
 * Provides pagination state and helpers for any array of data.
 *
 * Persists the current page to `localStorage` when a `storageKey` is provided,
 * allowing the page to be restored after navigating away and back.
 *
 * Page clamping is skipped when `data` is empty to avoid overwriting a saved
 * page before the async data has loaded.
 *
 * @param data - The full array of items to paginate
 * @param itemsPerPage - Number of items per page
 * @param storageKey - Optional localStorage key for page persistence
 * @returns `{ currentPage, setCurrentPage, totalPages, currentData }`
 *
 * @example
 * const { currentData, setCurrentPage, totalPages } = usePagination(items, 24, 'cp_cask');
 */
export function usePagination<T>(
    data: T[],
    itemsPerPage: number,
    storageKey?: string
) {
    const [currentPage, setCurrentPage] = useState(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            if (saved) return Number(saved);
        }
        return 1;
    });

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const clamp = (page: number) => Math.max(1, Math.min(page, totalPages));

    // Clamp during render rather than in an effect, and only once data has
    // loaded, so a saved page isn't reset to 1 while the list is still empty.
    const page = data.length > 0 ? clamp(currentPage) : currentPage;

    // Save to storage whenever the visible page changes
    useEffect(() => {
        if (storageKey && data.length > 0) {
            localStorage.setItem(storageKey, String(page));
        }
    }, [page, storageKey, data.length]);

    const safeSetPage = (next: number) => setCurrentPage(clamp(next));

    const currentData = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }, [data, page, itemsPerPage]);

    return { currentPage: page, setCurrentPage: safeSetPage, totalPages, currentData };
}