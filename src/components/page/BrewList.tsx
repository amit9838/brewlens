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
import React, { useState, useMemo, useEffect, useCallback, useDeferredValue } from "react";
import { useBrewData } from "../../hooks/useBrewData";
import { usePagination } from "../../hooks/usePagination";
import { useStorage } from "../../hooks/useStorage";
import { ItemCard } from "../ItemCard";
import { cn } from '../../lib/utils';
import { type BrewType } from "../../types";
import SkeletonGrid from "./SkeletonGrid";
import ErrorState from "./Error";
import { Search, X, LayoutGrid, List, Bookmark, Keyboard } from "lucide-react";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import { useModal } from '../contexts/ModalContexts';
import { useSearchParams } from "react-router-dom";

import SearchIndexModal from "../ui/SearchIndexModal";
import BookmarksModal from "../ui/BookmarksModal";
import { ItemListRow } from "./ItemListRow";


interface Props {
    type: BrewType;
    setType: (type: BrewType) => void;
}

export const BrewList: React.FC<Props> = ({ type, setType }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('q') || '';
    const setSearch = useCallback((val: string) => {
        if (val) {
            setSearchParams({ q: val });
        } else {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('q');
            setSearchParams(newParams);
        }
    }, [searchParams, setSearchParams]);

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
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSearch("");
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



    const handleBookmarkView = useCallback(() => {
        openModal(() => <BookmarksModal />, { closeOnBackdropClick: true, size: 'lg' });
    }, [setSearch]);




    const clearFilters = () => setActiveFilters(new Set());

    const changeType = (type: BrewType) => {
        setType(type);
        clearFilters();
    }

    {/* Combined Compact Controls & Toolbar */}
    return <div className="container max-w-[1400px] mx-auto px-0 py-2 space-y-4">
        <div className="flex w-full flex-wrap justify-between items-center gap-3 px-1 py-1">
            {/* Cask/Formula Switcher and live counts */}
            <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-zinc-800/80 p-0.5 rounded-xl flex shadow-inner border border-zinc-200/30 dark:border-zinc-700/30">
                    {(['cask', 'formula'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => { changeType(t); setSearch(''); }}
                            className={cn("px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-300 cursor-pointer",
                                type === t 
                                    ? "bg-white dark:bg-zinc-700 shadow-sm text-green-600 dark:text-green-400 font-bold scale-[1.01]" 
                                    : "text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300"
                            )}
                        >
                            {t}s
                        </button>
                    ))}
                </div>
                <span className="text-xs text-zinc-400 dark:text-zinc-550 font-medium hidden sm:inline">
                    Showing <span className="text-green-600 dark:text-green-400 font-semibold">{filtered.length}</span> of {data.length}
                </span>
            </div>


            {/* Quick Actions (Bookmarks, A-Z Index) and view toggler */}
            <div className="flex items-center gap-2 ml-auto">
                <Button 
                    onClick={handleBookmarkView} 
                    variant="secondary" 
                    size="sm"
                    className="flex items-center gap-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 cursor-pointer h-7 text-[11px] font-semibold px-2 rounded-lg shrink-0 shadow-xs"
                >
                    <Bookmark size={12} />
                    <span className="hidden sm:inline">Bookmarks</span>
                </Button>
                
                <Button 
                    onClick={handleOpenIndexSearch} 
                    variant="secondary" 
                    size="sm"
                    className="font-bold border border-zinc-200 dark:border-zinc-700 cursor-pointer h-7 text-[11px] px-2.5 rounded-lg shrink-0 shadow-xs"
                >
                    <span>A-Z</span>
                </Button>

                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

                {/* View mode toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50">
                    <button
                        onClick={() => setViewMode('grid')}
                        title="Grid view"
                        className={cn(
                            "p-1 rounded transition-all cursor-pointer",
                            viewMode === 'grid'
                                ? "bg-white dark:bg-zinc-700 shadow-xs text-green-600 dark:text-green-400"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                        )}
                    >
                        <LayoutGrid size={13} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        title="List view"
                        className={cn(
                            "p-1 rounded transition-all cursor-pointer",
                            viewMode === 'list'
                                ? "bg-white dark:bg-zinc-700 shadow-xs text-green-600 dark:text-green-400"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                        )}
                    >
                        <List size={13} />
                    </button>
                </div>
            </div>
        </div>

        {/* Quick Filter Pills Row */}
        <div className="flex items-center gap-1.5 flex-wrap px-1">
            {(['oss', 'proprietary'] as const).map(f => (
                <button
                    key={f}
                    onClick={() => toggleFilter(f)}
                    className={cn("px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all duration-200 cursor-pointer",
                        activeFilters.has(f)
                            ? (f === 'oss' ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400")
                            : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    )}
                >
                    {f === 'oss' ? 'OSS Only' : 'Proprietary'}
                </button>
            ))}

            {(['active', 'inactive'] as const).map(s => (
                <button
                    key={s}
                    onClick={() => toggleFilter(s)}
                    className={cn("px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all duration-200 cursor-pointer",
                        activeFilters.has(s)
                            ? (s === 'active' ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" : "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400")
                            : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    )}
                >
                    {s === 'inactive' ? 'Inactive' : 'Active'}
                </button>
            ))}

            {type === 'cask' && (
                <button
                    onClick={() => setShowFonts(p => !p)}
                    className={cn("px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all duration-200 cursor-pointer",
                        showFonts
                            ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
                            : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    )}
                >
                    Fonts
                </button>
            )}

            {activeFilters.size > 0 && (
                <button
                    onClick={clearFilters}
                    className="text-[11px] font-bold text-red-500 hover:text-red-600 transition-colors ml-1 cursor-pointer flex items-center gap-0.5"
                >
                    <X size={12} /> Clear
                </button>
            )}
        </div>

        {/* Active Search Feedback Banner */}
        {search && (
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-transparent border border-emerald-500/15 rounded-2xl">
                <div className="flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-400">
                    <Search size={16} />
                    <span>
                        Showing results for <span className="font-bold">"{search}"</span> 
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                            ({filtered.length} {filtered.length === 1 ? 'match' : 'matches'} found)
                        </span>
                    </span>
                </div>
                <button 
                    onClick={() => setSearch("")}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                >
                    Clear Search
                </button>
            </div>
        )}

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

        {/* Keyboard shortcut tip */}
        <div className="flex items-center justify-center gap-2 pt-8 pb-2 text-xs text-zinc-400 dark:text-zinc-550 select-none">
            <Keyboard size={14} className="opacity-70" />
            <span>Tip: Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-800">⌘K</kbd> to search, and <kbd className="px-1.5 py-0.5 text-[10px] font-mono border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-800">ESC</kbd> to clear filters.</span>
        </div>
    </div>

};

