/**
 * @file BrewList.tsx
 * Clean, high-performance package search and listing page for Homebrew casks and formulae.
 * Features type toggles, search, tabbed categories (with flat icons), quick filter popover,
 * grid/list views, A-Z index drawer, bookmarks, and pagination.
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
import { 
    Search, 
    X, 
    LayoutGrid, 
    List, 
    Bookmark, 
    Keyboard, 
    SlidersHorizontal,
    Home,
    Zap,
    Terminal,
    Globe,
    Palette,
    Film,
    Sliders,
    MessageSquare,
    Shield,
    Type,
    Code,
    Database,
    Rocket,
    GitBranch,
    Cpu,
    Network,
    Hammer
} from "lucide-react";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import { useModal } from '../contexts/ModalContexts';
import { useSearchParams } from "react-router-dom";

import SearchIndexModal from "../ui/SearchIndexModal";
import BookmarksModal from "../ui/BookmarksModal";
import { ItemListRow } from "./ItemListRow";
import { SectionHeader } from "../ui/SectionHeader";
import {
    CASK_CATEGORIES,
    FORMULA_CATEGORIES,
    getCategoryForToken,
    type Category,
} from "../../data/categories";

interface Props {
    type: BrewType;
    setType: (type: BrewType) => void;
}

// Map category IDs to clean flat Lucide icons
const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
    all: Home,
    productivity: Zap,
    'dev-tools': Terminal,
    browsers: Globe,
    design: Palette,
    media: Film,
    utilities: Sliders,
    communication: MessageSquare,
    security: Shield,
    fonts: Type,
    
    // Formulae categories
    languages: Code,
    databases: Database,
    devops: Rocket,
    git: GitBranch,
    'cli-tools': Cpu,
    networking: Network,
    'build-tools': Hammer,
};

// ─── Category Tab Bar ─────────────────────────────────────────────────────────
const CategoryTabs: React.FC<{
    categories: Category[];
    activeId: string;
    onChange: (id: string) => void;
}> = ({ categories, activeId, onChange }) => (
    <div className="relative">
        <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => {
                const IconComponent = CATEGORY_ICONS[cat.id] || Home;
                const isActive = activeId === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => onChange(cat.id)}
                        className={cn(
                            "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap",
                            isActive
                                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                                : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        )}
                    >
                        <IconComponent size={13} className={isActive ? "text-white" : "text-zinc-400 dark:text-zinc-500"} />
                        <span>{cat.label}</span>
                    </button>
                );
            })}
        </div>
        {/* Fade edge */}
        <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent pointer-events-none" />
    </div>
);

// ─── Quick Filters popover ────────────────────────────────────────────────────
const FilterPills: React.FC<{
    type: BrewType;
    activeFilters: Set<string>;
    showFonts: boolean;
    toggleFilter: (f: string) => void;
    setShowFonts: (fn: (p: boolean) => boolean) => void;
    clearFilters: () => void;
}> = ({ type, activeFilters, showFonts, toggleFilter, setShowFonts, clearFilters }) => {
    const [open, setOpen] = useState(false);
    const hasActive = activeFilters.size > 0 || showFonts;

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                    hasActive
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                )}
            >
                <SlidersHorizontal size={11} />
                Filters
                {hasActive && (
                    <span className="bg-white/30 rounded-full px-1 text-[10px]">
                        {activeFilters.size + (showFonts ? 1 : 0)}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-9 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl p-3 min-w-[180px] flex flex-col gap-1.5">
                    {(['oss', 'proprietary', 'active', 'inactive'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => toggleFilter(f)}
                            className={cn(
                                "flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer",
                                activeFilters.has(f)
                                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            )}
                        >
                            {f === 'oss' ? 'Open Source Only' : f === 'proprietary' ? 'Proprietary' : f === 'active' ? 'Active' : 'Deprecated/Disabled'}
                            {activeFilters.has(f) && <X size={10} />}
                        </button>
                    ))}
                    {type === 'cask' && (
                        <button
                            onClick={() => setShowFonts(p => !p)}
                            className={cn(
                                "flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer",
                                showFonts
                                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            )}
                        >
                            Include Fonts {showFonts && <X size={10} />}
                        </button>
                    )}
                    {hasActive && (
                        <button
                            onClick={() => { clearFilters(); setOpen(false); }}
                            className="mt-1 text-[10px] font-bold text-red-500 hover:text-red-600 px-3 py-1 text-left cursor-pointer"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};


// ─── Main component ───────────────────────────────────────────────────────────
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

    const [itemsPerPage, setItemsPerPage] = useState(48);
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
    
    // Sync category from URL search params
    const categoryParam = searchParams.get('category') || 'all';
    const [activeCategoryId, setActiveCategoryId] = useState(categoryParam);

    useEffect(() => {
        const cat = searchParams.get('category') || 'all';
        setActiveCategoryId(cat);
    }, [searchParams]);

    // Sync type from URL search params
    useEffect(() => {
        const t = searchParams.get('type') as BrewType;
        if (t === 'cask' || t === 'formula') {
            setType(t);
        }
    }, [searchParams, setType]);

    const { openModal, closeModal } = useModal();

    const categories = type === 'cask' ? CASK_CATEGORIES : FORMULA_CATEGORIES;

    // Queries
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

    const clearFilters = () => setActiveFilters(new Set());

    const changeType = (t: BrewType) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('type', t);
        newParams.delete('category'); // Reset category when switching type
        setSearchParams(newParams);
        setType(t);
        clearFilters();
    };

    // Base filtered data (search + quick filters, no category yet)
    const baseFiltered = useMemo(() => {
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

    // Category filtered
    const filtered = useMemo(() => {
        if (activeCategoryId === 'all') return baseFiltered;
        const cat = categories.find(c => c.id === activeCategoryId);
        if (!cat) return baseFiltered;
        return baseFiltered.filter(i => getCategoryForToken(i.token, categories) === activeCategoryId);
    }, [baseFiltered, activeCategoryId, categories]);

    const pagination = usePagination(filtered, itemsPerPage, `cp_${type}`);
    const { currentData, setCurrentPage, totalPages } = pagination;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSearch("");
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
        setTimeout(() => closeModal(), 100);
    }, [newChar, itemsPerPage]);

    const handleOpenIndexSearch = () =>
        openModal(() => <SearchIndexModal setNewChar={setNewChar} />, { size: 'lg', closeOnBackdropClick: true });

    const handleBookmarkView = useCallback(() =>
        openModal(() => <BookmarksModal />, { closeOnBackdropClick: true, size: 'lg' }),
        []);

    const activeCategory = categories.find(c => c.id === activeCategoryId);
    const ActiveCatIcon = activeCategory ? (CATEGORY_ICONS[activeCategory.id] || Home) : Home;

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="container max-w-[1400px] mx-auto px-0 py-2 space-y-5">

            {/* ── Toolbar ── */}
            <div className="flex w-full flex-wrap justify-between items-center gap-3 px-1 py-1">
                {/* Type switcher + count */}
                <div className="flex items-center gap-3">
                    <div className="bg-gray-100 dark:bg-zinc-800/80 p-0.5 rounded-xl flex shadow-inner border border-zinc-200/30 dark:border-zinc-700/30">
                        {(['cask', 'formula'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => { changeType(t); setSearch(''); }}
                                className={cn(
                                    "px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-300 cursor-pointer",
                                    type === t
                                        ? "bg-white dark:bg-zinc-700 shadow-sm text-green-600 dark:text-green-400 font-bold"
                                        : "text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300"
                                )}
                            >
                                {t}s
                            </button>
                        ))}
                    </div>
                    <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
                        <span className="text-green-600 dark:text-green-400 font-semibold">{filtered.length}</span> of {data.length}
                    </span>
                </div>

                {/* Right actions */}
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

                    {/* View toggle */}
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

            {/* ── Category Tab Bar + Filters popover ── */}
            <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                    <CategoryTabs
                        categories={categories}
                        activeId={activeCategoryId}
                        onChange={id => { 
                            const newParams = new URLSearchParams(searchParams);
                            if (id === 'all') {
                                newParams.delete('category');
                            } else {
                                newParams.set('category', id);
                            }
                            setSearchParams(newParams);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="shrink-0">
                    <FilterPills
                        type={type}
                        activeFilters={activeFilters}
                        showFonts={showFonts}
                        toggleFilter={toggleFilter}
                        setShowFonts={setShowFonts}
                        clearFilters={clearFilters}
                    />
                </div>
            </div>

            {/* ── Loading / Error ── */}
            {isLoading && <SkeletonGrid count={48} />}
            {error && <ErrorState error={error} />}

            {!isLoading && !error && <>

                {/* ── Search feedback banner ── */}
                {search && (
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-transparent border border-emerald-500/15 rounded-2xl">
                        <div className="flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-400">
                            <Search size={16} />
                            <span>
                                Showing results for <span className="font-bold">"{search}"</span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                                    ({filtered.length} {filtered.length === 1 ? 'match' : 'matches'})
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

                {/* ── Grid section header ── */}
                {activeCategoryId === 'all' ? (
                    <SectionHeader
                        title={`All ${type === 'cask' ? 'Casks' : 'Formulae'}`}
                        subtitle={`${filtered.length} packages available`}
                    />
                ) : (
                    <div className="flex items-center gap-2 pt-2 px-1 text-zinc-900 dark:text-zinc-100">
                        <div className="flex items-center justify-center p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-xs">
                            <ActiveCatIcon size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">{activeCategory?.label}</h2>
                            <p className="text-xs text-zinc-400 font-medium">{filtered.length} packages in this category</p>
                        </div>
                    </div>
                )}

                {/* ── Grid / List ── */}
                {currentData.length > 0 && (
                    viewMode === 'grid' ? (
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
                    )
                )}

                {/* ── Empty state ── */}
                {currentData.length === 0 && (
                    <div className="h-60 flex flex-col items-center justify-center p-20 text-gray-500">
                        <Search className="mb-4 h-12 w-12 opacity-30" />
                        <p className="text-base font-medium">No packages found</p>
                        <p className="text-sm opacity-60 mt-1">Try a different search or category</p>
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <Pagination pagination={pagination} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />
                )}
            </>}

            {/* ── Footer tip ── */}
            <div className="flex items-center justify-center gap-2 pt-4 pb-2 text-xs text-zinc-400 dark:text-zinc-500 select-none">
                <Keyboard size={14} className="opacity-70" />
                <span>
                    Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-800">⌘K</kbd> to search · <kbd className="px-1.5 py-0.5 text-[10px] font-mono border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-800">ESC</kbd> to clear
                </span>
            </div>
        </div>
    );
};
