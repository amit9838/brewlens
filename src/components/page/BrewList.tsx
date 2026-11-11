/**
 * @file BrewList.tsx
 * Explore: searchable, filterable, paginated list of every cask and formula.
 * URL params: `type` (cask|formula), `category`, `q`.
 */
import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDownAZ, Search, SlidersHorizontal, X } from 'lucide-react';
import { useBrewData } from '../../hooks/useBrewData';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { usePagination } from '../../hooks/usePagination';
import { useStorage } from '../../hooks/useStorage';
import { useModal } from '../contexts/ModalContexts';
import { AppCard, AppRow } from '../ui/AppCards';
import { Pagination } from '../ui/Pagination';
import SearchIndexModal from '../ui/SearchIndexModal';
import FiltersModal from '../ui/FiltersModal';
import { EmptyState, PillButton, Segmented } from '../ui/kit';
import { shortcutLabel } from '../ui/SearchPalette';
import SkeletonGrid from './SkeletonGrid';
import ErrorState from './Error';
import { CASK_CATEGORIES, FORMULA_CATEGORIES, getCategoryForToken } from '../../data/categories';
import { cn } from '../../lib/utils';
import type { BrewType } from '../../types';

export const BrewList: React.FC = () => {
    const [params, setParams] = useSearchParams();
    const type: BrewType = params.get('type') === 'formula' ? 'formula' : 'cask';
    const search = params.get('q') || '';
    const categoryId = params.get('category') || 'all';

    useDocumentMeta({
        title: type === 'formula'
            ? 'All Homebrew Formulae — CLI Tools & Libraries | BrewLens'
            : 'All Homebrew Casks — macOS Apps | BrewLens',
        description: type === 'formula'
            ? 'Browse and search every Homebrew formula — command-line tools and libraries for macOS, Linux, and WSL. See versions, install commands, and dependencies.'
            : 'Browse and search every Homebrew cask — GUI apps for macOS. See versions, install commands, download URLs, and checksums.',
    });

    const { openModal, closeModal } = useModal();
    const [itemsPerPage, setItemsPerPage] = useState(48);
    const [filterArr, setFilterArr] = useStorage<string[]>('brewlist_filters', ['active']);
    const [showFonts, setShowFonts] = useStorage<boolean>('brewlist_showFonts', false);
    const [viewMode, setViewMode] = useStorage<'grid' | 'list'>('brewlist_viewMode', 'grid');
    const activeFilters = useMemo(() => new Set(filterArr), [filterArr]);

    const categories = type === 'cask' ? CASK_CATEGORIES : FORMULA_CATEGORIES;
    const { data = [], isLoading, error } = useBrewData(type);
    const deferredSearch = useDeferredValue(search);

    const setParam = useCallback((key: string, value: string | null) => {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value); else next.delete(key);
        setParams(next, { replace: key === 'q' });
    }, [params, setParams]);

    // token → category id, computed once per dataset.
    const catIndex = useMemo(() => {
        const map = new Map<string, string>();
        for (const item of data) map.set(item.token, getCategoryForToken(item, categories));
        return map;
    }, [data, categories]);

    const sorted = useMemo(() => [...data].sort((a, b) => a.name.localeCompare(b.name)), [data]);

    const filtered = useMemo(() => {
        let result = sorted;
        const kws = deferredSearch.toLowerCase().split(/[\s,]+/).filter(Boolean);
        if (kws.length) result = result.filter((i) => kws.some((k) => i._searchString.includes(k)));
        if (activeFilters.has('oss')) result = result.filter((i) => i.package.isFoss);
        if (activeFilters.has('proprietary')) result = result.filter((i) => !i.package.isFoss);
        if (activeFilters.has('active')) result = result.filter((i) => !i.deprecated && !i.disabled);
        if (activeFilters.has('inactive')) result = result.filter((i) => i.deprecated || i.disabled);
        if (!showFonts) result = result.filter((i) => !i.token.startsWith('font-'));
        if (categoryId !== 'all') result = result.filter((i) => (catIndex.get(i.token) || 'all') === categoryId);
        return result;
    }, [sorted, deferredSearch, activeFilters, showFonts, categoryId, catIndex]);

    const pagination = usePagination(filtered, itemsPerPage, `cp_${type}`);
    const { currentData, currentPage, setCurrentPage, totalPages } = pagination;

    // Any change to what's being listed goes back to page 1 (but not on first mount,
    // so a restored page survives navigating away and back).
    const firstRun = useRef(true);
    useEffect(() => {
        if (firstRun.current) { firstRun.current = false; return; }
        setCurrentPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deferredSearch, categoryId, filterArr, showFonts, type, itemsPerPage]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && search) setParam('q', null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [search, setParam]);

    const clearFilters = () => { setFilterArr([]); setShowFonts(false); };
    const filterCount = activeFilters.size + (showFonts ? 1 : 0);

    const changeType = (t: BrewType) => {
        const next = new URLSearchParams(params);
        next.set('type', t);
        next.delete('category');
        next.delete('q');
        setParams(next);
        setFilterArr(['active']);
    };

    const jumpToLetter = (ch: string) => {
        if (ch === '#') setCurrentPage(1);
        else {
            const idx = filtered.findIndex((i) => i.name.toLowerCase().startsWith(ch.toLowerCase()));
            if (idx !== -1) setCurrentPage(Math.ceil((idx + 1) / itemsPerPage));
        }
        closeModal();
    };

    const activeCat = categories.find((c) => c.id === categoryId);
    const resultTitle = categoryId === 'all' ? (type === 'cask' ? 'All Casks' : 'All Formulae') : activeCat?.label ?? 'Results';

    const openFilters = () =>
        openModal(() => (
            <FiltersModal
                type={type}
                initial={{ filters: filterArr, showFonts, view: viewMode }}
                onChange={(next) => { setFilterArr(next.filters); setShowFonts(next.showFonts); setViewMode(next.view); }}
            />
        ), { size: 'md' });

    return (
        <>
            <section aria-labelledby="ex-title" className="flex flex-col gap-5">
                <h1 id="ex-title" className="sr-only">Explore</h1>

                <div className="flex flex-wrap items-center gap-2.5">
                    <label className="flex h-[52px] min-w-[240px] max-w-[560px] flex-[1_1_360px] items-center gap-2.5 rounded-[10px] bg-chip px-4 focus-within:ring-2 focus-within:ring-accent">
                        <Search size={22} strokeWidth={2.2} className="shrink-0 text-muted" />
                        <span className="sr-only">Search packages</span>
                        <input
                            id="explore-search"
                            type="search"
                            value={search}
                            onChange={(e) => setParam('q', e.target.value)}
                            placeholder={type === 'cask' ? 'Search casks — e.g. “browser”, “figma”' : 'Search formulae — e.g. “postgres”, “git”'}
                            className="min-w-0 flex-1 border-0 bg-transparent text-base text-ink outline-none [&::-webkit-search-cancel-button]:hidden"
                        />
                        {search ? (
                            <button type="button" aria-label="Clear search" onClick={() => setParam('q', null)} className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-0 bg-raised text-muted"><X size={14} /></button>
                        ) : (
                            <span className="hidden rounded-md bg-raised px-2 py-1 font-mono text-xs text-ink-soft sm:block">{shortcutLabel}</span>
                        )}
                    </label>
                    <PillButton variant="outline" className="h-[52px] rounded-[10px] px-4 text-sm" onClick={() => openModal(() => <SearchIndexModal setNewChar={jumpToLetter} />, { size: 'lg' })} aria-label="Jump to letter">
                        <ArrowDownAZ size={20} className="sm:hidden" /><span className="hidden sm:inline">A–Z</span>
                    </PillButton>
                    <button
                        type="button"
                        aria-haspopup="dialog"
                        aria-label={filterCount > 0 ? `Filters and view, ${filterCount} active` : 'Filters and view'}
                        title="Filters & view"
                        onClick={openFilters}
                        className="relative flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-[10px] border border-line-strong bg-raised text-ink transition-colors hover:bg-surface"
                    >
                        <SlidersHorizontal size={20} strokeWidth={2.2} />
                        {filterCount > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-extrabold text-[#111114]">{filterCount}</span>
                        )}
                    </button>
                    <Segmented
                        size="lg"
                        label="Package type"
                        value={type}
                        onChange={changeType}
                        className="ml-auto"
                        options={[{ value: 'cask', label: 'Casks' }, { value: 'formula', label: 'Formulae' }]}
                    />
                </div>

                <div className="flex items-start gap-3">
                    <div className="no-scrollbar flex min-w-0 flex-1 flex-nowrap gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
                        {categories.map((c) => {
                            const on = categoryId === c.id;
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => setParam('category', c.id === 'all' ? null : c.id)}
                                    className={cn(
                                        'h-10 shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-4 text-sm font-semibold',
                                        on ? 'border-invert bg-invert text-on-invert' : 'border-line-strong bg-raised text-ink hover:bg-surface',
                                    )}
                                >
                                    {c.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section aria-labelledby="res-title" className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between gap-3">
                    <h2 id="res-title" className="m-0 text-2xl font-bold tracking-[-0.02em]">{resultTitle}</h2>
                    <span className="text-sm text-muted" aria-live="polite">
                        {isLoading ? 'Loading…' : `${filtered.length.toLocaleString()} ${filtered.length === 1 ? 'package' : 'packages'}${totalPages > 1 ? ` · page ${currentPage} of ${totalPages}` : ''}`}
                    </span>
                </div>

                {isLoading && <SkeletonGrid count={itemsPerPage} />}
                {error && <ErrorState error={error} />}

                {!isLoading && !error && (
                    currentData.length === 0 ? (
                        <EmptyState
                            icon={<Search size={24} />}
                            title="No packages found"
                            text={search ? `Nothing matches “${search}”. Try a different search or category.` : 'Try a different category or clear your filters.'}
                            action={(search || filterCount > 0) ? <PillButton variant="outline" className="text-sm" onClick={() => { setParam('q', null); clearFilters(); }}>Clear search & filters</PillButton> : undefined}
                        />
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
                            {currentData.map((item) => <AppCard key={item.id} item={item} />)}
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {currentData.map((item) => <AppRow key={item.id} item={item} />)}
                        </div>
                    )
                )}

                {!isLoading && !error && totalPages > 1 && (
                    <Pagination pagination={pagination} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />
                )}

                <p className="m-0 text-center text-[13px] text-muted">
                    Press <kbd className="rounded-md bg-chip px-1.5 py-0.5 font-mono">{shortcutLabel}</kbd> to search · <kbd className="rounded-md bg-chip px-1.5 py-0.5 font-mono">ESC</kbd> to clear
                </p>
            </section>
        </>
    );
};
