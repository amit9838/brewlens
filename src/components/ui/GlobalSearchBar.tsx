import React, { useState, useMemo, useRef, useEffect, useDeferredValue } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBrewData } from '../../hooks/useBrewData';
import { cn } from '../../lib/utils';
import type { BrewItem } from '../../types';
import { FaviconImage } from './FaviconImage';

export const GlobalSearchBar: React.FC = () => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const deferredSearch = useDeferredValue(search);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);
    const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const navigate = useNavigate();

    const { data: casks = [], isLoading: isLoadingCasks } = useBrewData('cask');
    const { data: formulae = [], isLoading: isLoadingFormulae } = useBrewData('formula');
    const isLoading = isLoadingCasks || isLoadingFormulae;

    // OS-aware modifier key label
    const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
    const shortcutLabel = isMac ? '⌘K' : 'Ctrl K';

    // Ctrl/Cmd+K → focus; Escape → clear + close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const modifierHeld = isMac ? e.metaKey : e.ctrlKey;
            if (modifierHeld && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === 'Escape' && isOpen) {
                setSearch('');
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isMac, isOpen]);

    // Scroll active item into view
    useEffect(() => {
        if (selectedIndex >= 0 && dropdownRef.current) {
            const activeItem = dropdownRef.current.children[selectedIndex] as HTMLElement;
            if (activeItem) {
                activeItem.scrollIntoView({
                    block: 'nearest',
                });
            }
        }
    }, [selectedIndex]);

    const filteredResults = useMemo(() => {
        setSelectedIndex(-1); // Reset selection when search changes
        if (!deferredSearch) return [];
        const allData = [...casks, ...formulae];
        const term = deferredSearch.toLowerCase();
        return allData
            .filter(item => item._searchString.includes(term))
            .slice(0, 10);
    }, [deferredSearch, casks, formulae]);

    // ── Focus / Blur handlers ────────────────────────────────────────────────
    // Use a delayed blur so that clicking a result (which briefly blurs the
    // input) doesn't close the dropdown before the click fires.
    const handleFocus = () => {
        if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
        setIsOpen(true);
    };

    const handleBlur = () => {
        blurTimerRef.current = setTimeout(() => setIsOpen(false), 150);
    };

    // When a result is clicked, cancel the pending blur (click fired first),
    // then navigate and fully reset.
    const handleSelect = (item: BrewItem) => {
        if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
        setSearch('');
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        navigate(`/${item.type}/${item.token}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown || filteredResults.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredResults.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0) {
                handleSelect(filteredResults[selectedIndex]);
            } else if (filteredResults.length > 0) {
                // Default to first result if none selected
                handleSelect(filteredResults[0]);
            }
        }
    };

    const showDropdown = isOpen && search.length > 0;
    const showHint = !isOpen && !search;

    return (
        <div className="relative w-[84vw] sm:w-full mx-auto">
            <div className="relative">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                />

                <input
                    ref={inputRef}
                    type="text"
                    className="w-full pl-9 pr-16 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-transparent focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm placeholder-gray-400 dark:placeholder-zinc-500"
                    placeholder="Search casks and formulae…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />

                {/* Right-side adornment: shortcut hint OR spinner */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                    {isLoading && search.length > 0 ? (
                        <Loader2 className="text-gray-400 animate-spin" size={16} />
                    ) : showHint ? (
                        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-400 border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 leading-none select-none">
                            {shortcutLabel}
                        </kbd>
                    ) : null}
                </div>
            </div>

            {/* Dropdown Results */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl overflow-hidden z-50">
                    {filteredResults.length > 0 ? (
                        <ul 
                            ref={dropdownRef}
                            className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800"
                        >
                            {filteredResults.map((item, idx) => (
                                <li key={`${item.type}-${item.id}`}>
                                    <button
                                        // No e.preventDefault() needed — blur timer handles the race
                                        onClick={() => handleSelect(item)}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 transition-colors flex items-center gap-3",
                                            selectedIndex === idx 
                                                ? "bg-gray-100 dark:bg-zinc-800" 
                                                : "hover:bg-gray-50 dark:hover:bg-zinc-800"
                                        )}
                                    >
                                        <FaviconImage
                                            homepage={item.homepage}
                                            name={item.name}
                                            size={28}
                                            className="rounded-full p-0.5"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900 dark:text-zinc-100 text-sm truncate">
                                                    {item.name}
                                                </span>
                                                <span className={cn(
                                                    "shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
                                                    item.type === 'cask'
                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                )}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            {item.desc && (
                                                <p className="text-xs text-gray-500 dark:text-zinc-400 truncate mt-0.5">
                                                    {item.desc}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-zinc-400">
                            No results for <span className="font-medium">"{search}"</span>
                        </div>
                    )}

                    {filteredResults.length > 0 && (
                        <div className="hidden sm:flex px-4 py-2 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-800/30 items-center gap-3 text-[10px] text-gray-400 dark:text-zinc-500">
                            <span className="flex items-center gap-1">
                                <span className="font-bold text-gray-300 dark:text-zinc-600">↑↓</span>
                                Use arrows to navigate
                            </span>
                            <span className="opacity-30">|</span>
                            <span className="flex items-center gap-1">
                                <span className="font-bold text-gray-300 dark:text-zinc-600">↵</span>
                                Enter to select
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
