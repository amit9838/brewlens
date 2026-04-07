/**
 * @file BrewList.tsx
 * Main browse and search page for Homebrew casks and formulae.
 *
 * Features:
 * - Full-text search with deferred value for performance
 * - Tag-based filters: OSS/Proprietary, Active/Inactive (persisted in sessionStorage)
 * - Font cask exclusion toggle (persisted in sessionStorage)
 * - A-Z alphabetical index navigation via modal
 * - Quick search shortcuts via modal
 * - Paginated grid with localStorage page persistence per type
 */

import React, { useState, useMemo, useEffect, useDeferredValue } from "react";
import { useSearch } from "../contexts/SearchContext";
import { useBrewData } from "../../hooks/useBrewData";
import { usePagination } from "../../hooks/usePagination";
import { useStorage } from "../../hooks/useStorage";
import { ItemCard } from "../ItemCard";
import { cn } from '../../lib/utils';
import SkeletonGrid from "./SkeletonGrid";
import ErrorState from "./Error";
import { Search, X } from "lucide-react";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import { useModal } from '../contexts/ModalContexts';
import SearchIndexModal from "../ui/SearchIndexModal";
import QuickSearchModal from "../ui/QuickSearchModal";
import BookmarksModal from "../ui/BookmarksModal";

export const BrewList: React.FC = () => {
    const { searchQuery, setSearchQuery, brewType, registerQuickSearchHandler } = useSearch();
    const { openModal, closeModal } = useModal();
    const [itemsPerPage, setItemsPerPage] = useState(24);
    const [newChar, setNewChar] = useState<string | null>(null);
    const [filterArr, setFilterArr] = useStorage<string[]>('brewlist_filters', ['active']);
    const activeFilters = new Set(filterArr);
    const setActiveFilters = (fn: Set<string> | ((prev: Set<string>) => Set<string>)) => {
        setFilterArr(prev => {
            const next = typeof fn === 'function' ? fn(new Set(prev)) : fn;
            return [...next];
        });
    };
    const [showFonts, setShowFonts] = useStorage<boolean>('brewlist_showFonts', false);

    // Register quick search modal handler (only once)
    useEffect(() => {
        const handleQuickSearch = () => {
            openModal(() => <QuickSearchModal onSelect={setSearchQuery} />, { closeOnBackdropClick: true });
        };
        registerQuickSearchHandler(handleQuickSearch);
    }, [openModal, setSearchQuery, registerQuickSearchHandler]);

    const { data = [], isLoading, error } = useBrewData(brewType);
    const deferredSearch = useDeferredValue(searchQuery);

    const groups = {
        foss: ['oss', 'proprietary'],
        status: ['active', 'inactive'],
    };

    const toggleFilter = (f: string) =>
        setActiveFilters(prev => {
            const next = new Set(prev);
            if (next.has(f)) {
                next.delete(f);
            } else {
                const siblings = Object.values(groups).find(g => g.includes(f)) ?? [];
                siblings.forEach(s => next.delete(s));
                next.add(f);
            }
            return next;
        });

    const filtered = useMemo(() => {
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        let result = sorted;
        if (deferredSearch) result = result.filter(i => i._searchString.includes(deferredSearch.toLowerCase()));
        if (activeFilters.has('oss')) result = result.filter(i => i.package.isFoss);
        if (activeFilters.has('proprietary')) result = result.filter(i => !i.package.isFoss);
        if (activeFilters.has('active')) result = result.filter(i => !i.deprecated && !i.disabled);
        if (activeFilters.has('inactive')) result = result.filter(i => i.deprecated || i.disabled);
        if (!showFonts) result = result.filter(i => !i.token.startsWith('font-'));
        return result;
    }, [data, deferredSearch, activeFilters, showFonts]);

    const pagination = usePagination(filtered, itemsPerPage, `cp_${brewType}`);
    const { currentData, setCurrentPage, totalPages } = pagination;

    // Reset to page 1 when brewType changes (ensures clean slate)
    useEffect(() => {
        setCurrentPage(1);
    }, [brewType, setCurrentPage]);

    // Index navigation effect
    useEffect(() => {
        if (!newChar || newChar === '#') {
            if (newChar === '#') setCurrentPage(1);
            return;
        }
        const index = filtered.findIndex(i => i.name.toLowerCase().startsWith(newChar.toLowerCase()));
        if (index === -1) return;
        const page = Math.ceil((index + 1) / itemsPerPage);
        setCurrentPage(page);
        setTimeout(() => closeModal(), 100);
    }, [newChar, itemsPerPage, filtered, setCurrentPage, closeModal]);

    const handleOpenIndexSearch = () => {
        openModal(() => <SearchIndexModal setNewChar={setNewChar} />, { size: 'lg', closeOnBackdropClick: true });
    };

    const handleBookmarkView = () => {
        openModal(() => <BookmarksModal />, { closeOnBackdropClick: true });
    };

    const clearFilters = () => setActiveFilters(new Set());

    return (
        <div className="container max-w-[1400px] mx-auto px-4">
            {/* Filter tags */}
            <div className="flex items-center justify-between gap-2 flex-wrap mb-5">
                <div className="quick-action-left flex items-center gap-2 flex-wrap">
                    <Button isPill size="sm" variant={!activeFilters.has('oss') && !activeFilters.has('proprietary') ? 'glass' : 'outline'}
                        onClick={() => setActiveFilters(prev => { const next = new Set(prev); next.delete('oss'); next.delete('proprietary'); return next; })}>
                        All
                    </Button>
                    {(['oss', 'proprietary'] as const).map(f => (
                        <Button key={f} isPill size="sm" variant={activeFilters.has(f) ? (f === 'oss' ? 'blue' : 'primary') : 'outline'} onClick={() => toggleFilter(f)}>
                            {f === 'oss' ? 'Open Source' : 'Proprietary'}
                        </Button>
                    ))}
                    <span className="text-gray-300 dark:text-zinc-600">|</span>
                    {(['active', 'inactive'] as const).map(s => (
                        <Button key={s} isPill size="sm" variant={activeFilters.has(s) ? (s === 'active' ? 'primary' : 'destructive') : 'outline'} onClick={() => toggleFilter(s)}>
                            {s === 'inactive' ? 'Inactive' : 'Active'}
                        </Button>
                    ))}
                    {activeFilters.size > 0 && (
                        <Button isPill size="sm" variant="ghost" onClick={clearFilters} className="text-red-400 hover:text-red-500">
                            <X size={12} /> Clear
                        </Button>
                    )}
                </div>

                <div className="quick-action-right flex items-center gap-2">
                    {brewType === 'cask' && (
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-500 dark:text-zinc-400">
                            <span>Fonts</span>
                            <div onClick={() => setShowFonts(p => !p)} className={cn("relative w-8 h-4 rounded-full transition-colors", showFonts ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600")}>
                                <div className={cn("absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform", showFonts ? "translate-x-4" : "translate-x-0.5")} />
                            </div>
                        </label>
                    )}
                    <Button onClick={handleBookmarkView} variant="secondary" size="sm">Bookmarks</Button>
                    <Button onClick={handleOpenIndexSearch} variant="secondary" size="sm" className="w-14">
                        <span className="text-sm font-semibold">A-Z</span>
                    </Button>
                </div>
            </div>

            {/* Grid */}
            {isLoading && <SkeletonGrid count={itemsPerPage} />}
            {error && <ErrorState error={error} />}
            {currentData && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentData.map(item => <ItemCard key={item.id} item={item} />)}
                    </div>
                    {totalPages > 1 && <Pagination pagination={pagination} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />}
                </>
            )}
            {currentData?.length === 0 && !isLoading && !error && (
                <div className="h-120 flex flex-col items-center justify-center p-20 text-gray-500">
                    <Search className="mb-4 h-12 w-12 opacity-40" />
                    <p className="text-lg">No data found. Try something else?</p>
                </div>
            )}
        </div>
    );
};