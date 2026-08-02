import { ItemCard } from "../ItemCard";
import RecentlyViewedSection from "../ui/RecentlyViewedStrip";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useBrewData } from "../../hooks/useBrewData";
import { Button } from "../ui/Button";
import { NavLink } from "react-router-dom";
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useBookmarks } from '../contexts/BookmarksContext';
import BookmarksModal from "../ui/BookmarksModal";
import { useModal } from "../contexts/ModalContexts";

import {
    Clock,
    Cpu,
    Flame,
    Sparkles,
    Terminal,
    Zap,
    Palette,
    Globe,
    Code,
    Database,
    Rocket,
    Bookmark,
    Trash2,
    LayoutGrid,
    Film,
    Sliders,
    MessageSquare,
    Shield,
    Type,
    Bot,
    Gamepad2,
    Network,
    Hammer,
    GitBranch,
    Gauge,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "../../lib/utils";
import { FeaturedBanner } from "../ui/FeaturedBanner";
import { AppLane } from "../ui/AppLane";
import { SectionHeader } from "../ui/SectionHeader";
import { EDITORS_PICKS_TOKENS } from "../../data/curated";
import { CASK_CATEGORIES, FORMULA_CATEGORIES, getCategoryStyle } from "../../data/categories";

const fetchCaskAnalytics = async (period: string = '30d') => {
    const res = await fetch(`https://formulae.brew.sh/api/analytics/cask-install/${period}.json`);
    if (!res.ok) throw new Error('Failed to fetch cask analytics');
    return res.json();
};

// Lucide icon resolution from category icon name strings
const ICON_MAP: Record<string, React.ComponentType<any>> = {
    Terminal, Zap, Palette, Globe, Film, Sliders, MessageSquare, Shield, Type,
    Bot, Gamepad2, Code, Database, Rocket, GitBranch, Cpu, Network, Hammer, Gauge,
};

// Generate discover grid categories from category definitions.
// Filters out 'all' and combines cask + formula non-overlapping categories.
// Priority casks, then formulae — type is inferred from which array the cat lives in.
function buildDiscoverCategories(): Array<{
    id: string;
    label: string;
    desc: string;
    icon: React.ComponentType<any>;
    type: 'cask' | 'formula';
    surface: string;
    hoverSurface: string;
    border: string;
    hoverBorder: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeColor: string;
}> {
    const seen = new Set<string>();
    const result: ReturnType<typeof buildDiscoverCategories> = [];

    for (const cat of [...CASK_CATEGORIES, ...FORMULA_CATEGORIES]) {
        if (cat.id === 'all' || seen.has(cat.id)) continue;
        seen.add(cat.id);

        const icon = ICON_MAP[cat.icon];
        if (!icon) continue; // skip categories whose icon isn't mapped yet

        const s = getCategoryStyle(cat.color);
        const type: 'cask' | 'formula' = CASK_CATEGORIES.some(c => c.id === cat.id) ? 'cask' : 'formula';

        result.push({
            id: cat.id,
            label: cat.label,
            desc: cat.description || `${cat.label} packages`,
            icon,
            type,
            surface: s.surface,
            hoverSurface: s.hoverSurface,
            border: s.border,
            hoverBorder: s.hoverBorder,
            iconBg: s.iconBg,
            iconColor: s.iconColor,
            badgeBg: s.badgeBg,
            badgeColor: s.badgeColor,
        });
    }

    return result;
}

const Dashboard = () => {
    const { data: caskData = [] } = useBrewData("cask");
    const { openModal } = useModal();

    // Build discover categories once from the canonical definitions
    const DISCOVER_CATEGORIES = useMemo(() => buildDiscoverCategories(), []);

    const { recentItems, clearRecent } = useRecentlyViewed();
    const { bookmarks } = useBookmarks();
    const [shelfTab, setShelfTab] = useState<'bookmarks' | 'recents'>('bookmarks');

    // Auto-choose the active personalized shelf tab based on what contains data
    useEffect(() => {
        if (bookmarks.length === 0 && recentItems.length > 0) {
            setShelfTab('recents');
        } else if (bookmarks.length > 0) {
            setShelfTab('bookmarks');
        }
    }, [bookmarks.length, recentItems.length]);

    // Analytics queries
    const { data: caskAnalytics30d } = useQuery({
        queryKey: ['analytics-cask', '30d'],
        queryFn: () => fetchCaskAnalytics('30d'),
        staleTime: 1000 * 60 * 10,
    });


    // Derived editorial items from caskData
    const trendingItems = useMemo(() => {
        if (!caskAnalytics30d?.items || !caskData.length) return [];
        return caskAnalytics30d.items
            .slice(0, 12)
            .map((item: any) => {
                const found = caskData.find(c => c.token === item.cask);
                if (!found) return null;
                return {
                    ...found,
                    downloads: item.count,
                };
            })
            .filter(Boolean) as any[];
    }, [caskAnalytics30d, caskData]);

    const editorPickItems = useMemo(() => {
        if (!caskData.length) return [];
        return caskData.filter(i => EDITORS_PICKS_TOKENS.includes(i.token));
    }, [caskData]);

    const handleBookmarkView = useCallback(() =>
        openModal(() => <BookmarksModal />, { closeOnBackdropClick: true, size: 'lg' }),
        []);

    const hasShelfItems = bookmarks.length > 0 || recentItems.length > 0;

    return (
        <div className="sections flex flex-col gap-8 transition-all duration-500 px-0">

            {/* 1. Curated Editorial Hero Carousel */}
            {caskData.length > 0 && (
                <div className="w-full">
                    <FeaturedBanner items={caskData} />
                </div>
            )}

            {/* 4. Beautiful Category Grid Explorer Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center justify-center p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                        <LayoutGrid size={18} strokeWidth={1.8} />
                    </div>
                    <SectionHeader
                        title="Browse by Category"
                        subtitle="Explore cask packages and terminal formulae by theme"
                    />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {DISCOVER_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <NavLink
                                key={cat.id}
                                to={`/all?category=${cat.id}&type=${cat.type}`}
                                className={cn(
                                    "group relative flex items-start gap-3 p-4 rounded-2xl overflow-hidden",
                                    "transition-all duration-300 ease-out",
                                    cat.border,
                                    cat.hoverBorder,
                                    cat.surface,
                                    cat.hoverSurface
                                )}
                            >
                                {/* Light overlay on hover */}
                                <div className="absolute inset-0 bg-white/40 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                <div className={cn(
                                    "flex items-center justify-center shrink-0",
                                    "w-9 h-9 rounded-lg",
                                    "transition-transform duration-300 group-hover:scale-105",
                                    cat.iconBg,
                                    cat.iconColor
                                )}>
                                    <Icon size={18} strokeWidth={1.8} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                                        {cat.label}
                                    </h4>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5 line-clamp-2">
                                        {cat.desc}
                                    </p>
                                    <span className={cn(
                                        "inline-flex items-center mt-2",
                                        "text-[9px] font-semibold uppercase tracking-wide",
                                        "px-2 py-0.5 rounded-full",
                                        cat.badgeBg,
                                        cat.badgeColor
                                    )}>
                                        {cat.type}
                                    </span>
                                </div>
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* 3. Curated App Lanes */}
            {trendingItems.length > 0 && (
                <div className="space-y-3 mt-6">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <div className="flex items-center justify-center p-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400">
                            <Flame size={18} strokeWidth={1.8} />
                        </div>
                        <SectionHeader
                            title="Trending Apps"
                            subtitle="Most installed cask packages in the last 30 days"
                            action={<NavLink to="/analytics">View Trending →</NavLink>}
                            className="flex-1"
                        />
                    </div>
                    <AppLane items={trendingItems} variant="trending" />
                </div>
            )}

            {editorPickItems.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <div className="flex items-center justify-center p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
                            <Sparkles size={18} strokeWidth={1.8} />
                        </div>
                        <SectionHeader
                            title="Editor's Picks"
                            subtitle="Hand-picked visual tools and terminal utilities"
                            action={<NavLink to="/all">View All →</NavLink>}
                            className="flex-1"
                        />
                    </div>
                    <AppLane items={editorPickItems} variant="editor" />
                </div>
            )}

            {/* 5. Combined Personalized tabbed "My Shelf" Section */}
            {hasShelfItems && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <div className="flex items-center justify-center p-2.5 rounded-xl bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400">
                            <Bookmark size={18} strokeWidth={1.8} />
                        </div>
                        <SectionHeader
                            title="My Shelf"
                            subtitle="Your saved bookmarks and recently viewed items"
                        />
                    </div>
                <div className="section bg-gradient-to-br from-violet-500/5 via-fuchsia-500/3 to-transparent dark:from-violet-600/5 dark:via-fuchsia-700/2 dark:to-transparent border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-4.5 transition-all duration-300 hover:border-violet-500/20">
                    <div className="header flex flex-wrap justify-between items-center text-md text-zinc-900 dark:text-zinc-300 mb-3.5 gap-y-3">
                        <div className="flex items-center bg-gray-100/80 dark:bg-zinc-800/85 p-0.5 rounded-xl border border-zinc-200/30 dark:border-zinc-700/30 shadow-inner">
                            {bookmarks.length > 0 && (
                                <button
                                    onClick={() => setShelfTab('bookmarks')}
                                    className={cn("flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                                        shelfTab === 'bookmarks'
                                            ? "bg-white dark:bg-zinc-700 text-violet-600 dark:text-violet-400 scale-[1.02]"
                                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                    )}
                                >
                                    <Bookmark size={13} />
                                    <span>Bookmarks</span>
                                    {/* <span className="text-[10px] opacity-70">({bookmarks.length})</span> */}
                                </button>
                            )}
                            {recentItems.length > 0 && (
                                <button
                                    onClick={() => setShelfTab('recents')}
                                    className={cn("flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                                        shelfTab === 'recents'
                                            ? "bg-white dark:bg-zinc-700 text-violet-600 dark:text-violet-400 scale-[1.02]"
                                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                    )}
                                >
                                    <Clock size={13} />
                                    <span>Recently Viewed</span>
                                    {/* <span className="text-[10px] opacity-70">({recentItems.length})</span> */}
                                </button>
                            )}
                        </div>

                        {shelfTab === 'recents' && recentItems.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearRecent}
                                className="text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs shrink-0 cursor-pointer h-7"
                            >
                                <Trash2 size={13} className="mr-1.5" />
                                <span>Clear History</span>
                            </Button>
                        )}
                        {shelfTab === 'bookmarks' && bookmarks.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBookmarkView}
                                className="text-zinc-500 hover:text-red-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs shrink-0 cursor-pointer h-7"
                            >
                                <Bookmark size={13} className="mr-1.5" />
                                <span>Bookmarks</span>
                            </Button>
                        )}
                    </div>

                    <div className="contents">
                        {shelfTab === 'bookmarks' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {bookmarks.slice(0, 8).map((item) => (
                                    <ItemCard key={item.id} item={item} enableBackground={false} />
                                ))}
                            </div>
                        ) : (
                            <RecentlyViewedSection maxVisible={12} />
                        )}
                    </div>
                </div>
                </div>
            )}
            {/* Hit Counter Badge */}
            <div className="hidden flex justify-center py-6 opacity-80 hover:opacity-100 transition-opacity">
                <img
                    src="https://hitscounter.dev/api/hit?url=https%3A%2F%2Famit9838.github.io%2Fbrewlens%2F&label=Visits&icon=person-walking&color=%23198754&message=&style=flat&tz=UTC"
                    alt="Hit Counter"
                    className="h-6"
                />
            </div>
        </div>
    );
};

export default Dashboard;
