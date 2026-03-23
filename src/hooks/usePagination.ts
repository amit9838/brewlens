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

    // Clamp page when data changes
    useEffect(() => {
        setCurrentPage(prev => Math.max(1, Math.min(prev, totalPages)));
    }, [data.length, itemsPerPage]);

    // Save to storage whenever page changes
    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(storageKey, String(currentPage));
        }
    }, [currentPage, storageKey]);

    const safeSetPage = (page: number) => {
        const p = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(p);
    };

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    return { currentPage, setCurrentPage: safeSetPage, totalPages, currentData };
}