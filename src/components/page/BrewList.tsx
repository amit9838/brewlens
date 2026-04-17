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
import React, { useState, useMemo, useEffect, useCallback, useDeferredValue, useRef } from "react";
import { useBrewData } from "../../hooks/useBrewData";
import { usePagination } from "../../hooks/usePagination";
import { useStorage } from "../../hooks/useStorage";
import { ItemCard } from "../ItemCard";
import { cn } from '../../lib/utils';
import { type BrewType } from "../../types";
import SkeletonGrid from "./SkeletonGrid";
import ErrorState from "./Error";
import { Search, X, Sparkles, LayoutGrid, List } from "lucide-react";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import { useModal } from '../contexts/ModalContexts';
import SearchIndexModal from "../ui/SearchIndexModal";
import QuickSearchModal from "../ui/QuickSearchModal";
import BookmarksModal from "../ui/BookmarksModal";
import { ItemListRow } from "./ItemListRow";


interface Props {
    type: BrewType;
    setType: (type: BrewType) => void;
    search: string;
    setSearch: (search: string) => void;
}

export const BrewList: React.FC<Props> = ({ type, setType, search, setSearch }) => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [itemsPerPage, setItemsPerPage] = useState(24);
    const [newChar, setNewChar] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [filterArr, setFilterArr] = useStorage<string[]>('brewlist_filters', ['active']);
    const activeFilters = new Set(filterArr);
    const setActiveFilters = (fn: Set<string> | ((prev: Set<string>) => Set<string>)) => {
        setFilterArr(prev => {
            const next = typeof fn === 'function' ? fn(new Set(prev)) : fn;
            return [...next];
        });
    };
    const [showFonts, setShowFonts] = useStorage<boolean>('brewlist_showFonts', false);
    const [viewMode, setViewMode] = useStorage<'grid' | 'list'>('brewlist_viewMode', 'grid');
    const { openModal, closeModal } = useModal();

    // Queries & Derived State
    const { data = [], isLoading, error } = useBrewData(type);


    const deferredSearch = useDeferredValue(search);

    const groups: Record<string, string[]> = {
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
        // sort the data by name
        data.sort((a, b) => a.name.localeCompare(b.name));
        let result = data;
        console.log(filterArr);
        if (deferredSearch) result = result.filter(i => i._searchString.includes(deferredSearch.toLowerCase()));
        if (activeFilters.has('oss')) result = result.filter(i => i.package.isFoss);
        if (activeFilters.has('proprietary')) result = result.filter(i => !i.package.isFoss);
        if (activeFilters.has('active')) result = result.filter(i => !i.deprecated && !i.disabled);
        if (activeFilters.has('inactive')) result = result.filter(i => i.deprecated || i.disabled);
        if (!showFonts) result = result.filter(i => !i.token.startsWith('font-'));
        return result;
    }, [data, deferredSearch, activeFilters, showFonts]);

    const pagination = usePagination(filtered, itemsPerPage, `cp_${type}`);
    const { currentData, setCurrentPage, totalPages } = pagination

    useEffect(() => {
        let lastEscTime = 0;
        const handleKeyDown = (e: KeyboardEvent) => {
            // 1. Clear search on Escape
            if (e.key === 'Escape') {
                const currentTime = Date.now();
                setSearch("");
                // 2. Check for double press (within 300ms)
                if (currentTime - lastEscTime < 300) {
                    // Exit focus from the input
                    if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                    }
                    console.log("removed focus")
                }
                lastEscTime = currentTime;
            }

            // 2. Focus on '/'
            if (e.key === '/') {
                // Optional: Don't hijack focus if user is already typing in an input
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                    return;
                }

                e.preventDefault(); // Prevents the "/" from appearing in the input
                searchInputRef.current?.focus(); // Must use () to call the function
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setSearch]);

    useEffect(() => {
        if (!newChar || newChar === '#') {
            if (newChar === '#') setCurrentPage(1);
            return;
        }

        const index = filtered.findIndex(i => i.name.toLowerCase().startsWith(newChar.toLowerCase()));
        if (index === -1) return;

        const page = Math.ceil((index + 1) / itemsPerPage);
        setCurrentPage(page);
        setTimeout(() => {
            closeModal();
        }, 100);

    }, [newChar, itemsPerPage]);


    const handleOpenIndexSearch = () => {
        openModal(() => <SearchIndexModal setNewChar={setNewChar} />, { size: 'lg', closeOnBackdropClick: true });
    };

    const handleQuickSearch = useCallback(() => {
        openModal(() => <QuickSearchModal onSelect={setSearch} />, { closeOnBackdropClick: true });
    }, [setSearch]);

    const handleBookmarkView = useCallback(() => {
        openModal(() => <BookmarksModal />, { closeOnBackdropClick: true });
    }, [setSearch]);




    const clearFilters = () => setActiveFilters(new Set());

    const changeType = (type: BrewType) => {
        setType(type);
        clearFilters();
    }

    {/* CONTROLS */ }
    return <div className="container max-w-[1400px] mx-auto px-4">
        <div className="flex w-full flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
                <div className="relative w-full sm:w-auto sm:min-w-[16rem] sm:max-w-[20rem]">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />

                    <input
                        ref={searchInputRef}
                        className="w-full pl-10 pr-16 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        placeholder="Search..."
                        value={search}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="absolute right-3 top-2.5 flex items-center gap-2 cursor-pointer">
                        {/* Shortcut Badges */}
                        {!search && !isFocused && (
                            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-400 border border-gray-300 dark:border-zinc-600 rounded bg-gray-50 dark:bg-zinc-700">
                                /
                            </kbd>
                        )}

                        {search && (
                            <kbd
                                onClick={() => setSearch("")}
                                className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-400 border border-gray-300 dark:border-zinc-600 rounded bg-gray-50 dark:bg-zinc-700">
                                ESC
                            </kbd>
                        )}
                    </div>
                </div>

                <Button variant="secondary" size="md" onClick={handleQuickSearch} title="Quick search">
                    <Sparkles size={15} />
                </Button>
                <div className="bg-gray-200 dark:bg-zinc-800 p-1 rounded-lg flex">
                    {(['cask', 'formula'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => { changeType(t); setSearch(''); }}
                            className={cn("px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                                type === t ? "bg-white dark:bg-zinc-600 shadow text-green-600 dark:text-green-400" : "text-gray-500"
                            )}
                        >
                            {t}s
                        </button>
                    ))}
                </div>
            </div>
            <div className="px-1 flex gap-2">
                <Button
                    onClick={handleBookmarkView}
                    variant="secondary"
                    size="sm"
                >
                    Bookmarks
                </Button>
                <Button
                    onClick={handleOpenIndexSearch}
                    variant="secondary"
                    size="sm"
                    className="w-14">
                    <span className="text-sm font-semibold opacity-90 hover:opacity-100">
                        A-Z
                    </span>
                </Button>
            </div>
        </div>

        <div className=" flex items-center justify-between gap-2 flex-wrap mb-5">
            {/* FILTER TAGS */}
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
                    <Button key={s} isPill size="sm"
                        variant={activeFilters.has(s) ? (s === 'active' ? 'primary' : 'destructive') : 'outline'}
                        onClick={() => toggleFilter(s)}>
                        {s === 'inactive' ? 'Inactive' : 'Active'}
                    </Button>
                ))}
                {activeFilters.size > 0 && (
                    <Button isPill size="sm" variant="ghost" onClick={clearFilters}
                        className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <X size={12} /> Clear
                    </Button>
                )}
            </div>


            <div className="quick-action-right flex items-center gap-3">
                {type === 'cask' && (
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Fonts</span>
                        <div
                            onClick={() => setShowFonts(p => !p)}
                            className={cn(
                                "relative w-8 h-4 rounded-full transition-colors duration-200",
                                showFonts ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200",
                                showFonts ? "translate-x-4" : "translate-x-0.5"
                            )} />
                        </div>
                    </label>
                )}

                {/* View mode toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-lg p-0.5">
                    <button
                        onClick={() => setViewMode('grid')}
                        title="Grid view"
                        className={cn(
                            "p-1.5 rounded-md transition-all",
                            viewMode === 'grid'
                                ? "bg-white dark:bg-zinc-600 shadow text-green-600 dark:text-green-400"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                        )}
                    >
                        <LayoutGrid size={15} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        title="List view"
                        className={cn(
                            "p-1.5 rounded-md transition-all",
                            viewMode === 'list'
                                ? "bg-white dark:bg-zinc-600 shadow text-green-600 dark:text-green-400"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                        )}
                    >
                        <List size={15} />
                    </button>
                </div>
            </div>
        </div>

        {/* GRID / LIST */}
        {isLoading && <SkeletonGrid count={itemsPerPage} />}
        {error && <ErrorState error={error} />}
        {currentData && <>
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {currentData.map(item => (
                        <ItemCard key={item.id} item={item} enableBackground />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-1.5">
                    {currentData.map(item => (
                        <ItemListRow key={item.id} item={item} />
                    ))}
                </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && <Pagination pagination={pagination} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />}

        </>}
        {currentData.length === 0 && !isLoading && !error && <>
            <div className="h-120 flex flex-col items-center justify-center p-20 text-gray-500">
                <Search className="mb-4 h-12 w-12 opacity-40 text-zinc-800 dark:text-zinc-100" />
                <p className="text-lg">No data found. Try something else?</p>
            </div>
        </>}
    </div>

};

