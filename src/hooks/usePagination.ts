import { useState, useEffect, useMemo } from 'react';

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