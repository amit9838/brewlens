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
    LayoutGrid
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "../../lib/utils";
import { FeaturedBanner } from "../ui/FeaturedBanner";
import { AppLane } from "../ui/AppLane";
import { SectionHeader } from "../ui/SectionHeader";
import { EDITORS_PICKS_TOKENS } from "../../data/categories";

const fetchCaskAnalytics = async (period: string = '30d') => {
    const res = await fetch(`https://formulae.brew.sh/api/analytics/cask-install/${period}.json`);
    if (!res.ok) throw new Error('Failed to fetch cask analytics');
    return res.json();
};

// Curated grid categories with flat accent backgrounds
const DISCOVER_CATEGORIES = [
    {
        id: 'dev-tools',
        label: 'Developer Tools',
        desc: 'Terminals, IDEs, compilers & databases',
        icon: Terminal,
        surface: 'bg-indigo-100 dark:bg-indigo-500/12',
        hoverSurface: 'group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/20',
        border: 'border-indigo-200/60 dark:border-indigo-500/20',
        hoverBorder: 'hover:border-indigo-300/70 dark:hover:border-indigo-400/40',
        iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        badgeBg: 'bg-indigo-100 dark:bg-indigo-400/15',
        badgeColor: 'text-indigo-700 dark:text-indigo-300',
        type: 'cask',
    },
    {
        id: 'productivity',
        label: 'Productivity',
        desc: 'Notes, task organizers & calendar apps',
        icon: Zap,
        surface: 'bg-emerald-100 dark:bg-emerald-500/12',
        hoverSurface: 'group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/20',
        border: 'border-emerald-200/60 dark:border-emerald-500/20',
        hoverBorder: 'hover:border-emerald-300/70 dark:hover:border-emerald-400/40',
        iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-400/15',
        badgeColor: 'text-emerald-700 dark:text-emerald-300',
        type: 'cask',
    },
    {
        id: 'design',
        label: 'Design & Creative',
        desc: 'Photo editors, vector tools & 3D art',
        icon: Palette,
        surface: 'bg-pink-100 dark:bg-pink-500/12',
        hoverSurface: 'group-hover:bg-pink-200 dark:group-hover:bg-pink-500/20',
        border: 'border-pink-200/60 dark:border-pink-500/20',
        hoverBorder: 'hover:border-pink-300/70 dark:hover:border-pink-400/40',
        iconBg: 'bg-pink-100 dark:bg-pink-500/20',
        iconColor: 'text-pink-600 dark:text-pink-400',
        badgeBg: 'bg-pink-100 dark:bg-pink-400/15',
        badgeColor: 'text-pink-700 dark:text-pink-300',
        type: 'cask',
    },
    {
        id: 'browsers',
        label: 'Web Browsers',
        desc: 'Fast, secure & modern browser options',
        icon: Globe,
        surface: 'bg-blue-100 dark:bg-blue-500/12',
        hoverSurface: 'group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20',
        border: 'border-blue-200/60 dark:border-blue-500/20',
        hoverBorder: 'hover:border-blue-300/70 dark:hover:border-blue-400/40',
        iconBg: 'bg-blue-100 dark:bg-blue-500/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
        badgeBg: 'bg-blue-100 dark:bg-blue-400/15',
        badgeColor: 'text-blue-700 dark:text-blue-300',
        type: 'cask',
    },
    {
        id: 'languages',
        label: 'Programming Languages',
        desc: 'Compilers, package managers & runtimes',
        icon: Code,
        surface: 'bg-cyan-100 dark:bg-cyan-500/12',
        hoverSurface: 'group-hover:bg-cyan-200 dark:group-hover:bg-cyan-500/20',
        border: 'border-cyan-200/60 dark:border-cyan-500/20',
        hoverBorder: 'hover:border-cyan-300/70 dark:hover:border-cyan-400/40',
        iconBg: 'bg-cyan-100 dark:bg-cyan-500/20',
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        badgeBg: 'bg-cyan-100 dark:bg-cyan-400/15',
        badgeColor: 'text-cyan-700 dark:text-cyan-300',
        type: 'formula',
    },
    {
        id: 'databases',
        label: 'Databases & Servers',
        desc: 'SQL, Document caches & messaging queues',
        icon: Database,
        surface: 'bg-amber-100 dark:bg-amber-500/12',
        hoverSurface: 'group-hover:bg-amber-200 dark:group-hover:bg-amber-500/20',
        border: 'border-amber-200/60 dark:border-amber-500/20',
        hoverBorder: 'hover:border-amber-300/70 dark:hover:border-amber-400/40',
        iconBg: 'bg-amber-100 dark:bg-amber-500/20',
        iconColor: 'text-amber-600 dark:text-amber-400',
        badgeBg: 'bg-amber-100 dark:bg-amber-400/15',
        badgeColor: 'text-amber-700 dark:text-amber-300',
        type: 'formula',
    },
    {
        id: 'devops',
        label: 'DevOps & Containers',
        desc: 'Docker, Kubernetes, AWS & cloud engines',
        icon: Rocket,
        surface: 'bg-rose-100 dark:bg-rose-500/12',
        hoverSurface: 'group-hover:bg-rose-200 dark:group-hover:bg-rose-500/20',
        border: 'border-rose-200/60 dark:border-rose-500/20',
        hoverBorder: 'hover:border-rose-300/70 dark:hover:border-rose-400/40',
        iconBg: 'bg-rose-100 dark:bg-rose-500/20',
        iconColor: 'text-rose-600 dark:text-rose-400',
        badgeBg: 'bg-rose-100 dark:bg-rose-400/15',
        badgeColor: 'text-rose-700 dark:text-rose-300',
        type: 'formula',
    },
    {
        id: 'cli-tools',
        label: 'CLI Tools & Utilities',
        desc: 'Terminal shell enhancements & helper search tools',
        icon: Cpu,
        surface: 'bg-violet-100 dark:bg-violet-500/12',
        hoverSurface: 'group-hover:bg-violet-200 dark:group-hover:bg-violet-500/20',
        border: 'border-violet-200/60 dark:border-violet-500/20',
        hoverBorder: 'hover:border-violet-300/70 dark:hover:border-violet-400/40',
        iconBg: 'bg-violet-100 dark:bg-violet-500/20',
        iconColor: 'text-violet-600 dark:text-violet-400',
        badgeBg: 'bg-violet-100 dark:bg-violet-400/15',
        badgeColor: 'text-violet-700 dark:text-violet-300',
        type: 'formula',
    },
];

const Dashboard = () => {
    const { data: caskData = [] } = useBrewData("cask");
    const { openModal } = useModal();

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {DISCOVER_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <NavLink
                                key={cat.id}
                                to={`/all?category=${cat.id}&type=${cat.type}`}
                                className={cn(
                                    "group relative flex items-start gap-4 p-5 rounded-2xl overflow-hidden",
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
                                    "w-11 h-11 rounded-xl",
                                    "transition-transform duration-300 group-hover:scale-105",
                                    cat.iconBg,
                                    cat.iconColor
                                )}>
                                    <Icon size={20} strokeWidth={1.8} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                                        {cat.label}
                                    </h4>
                                    <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
                                        {cat.desc}
                                    </p>
                                    <span className={cn(
                                        "inline-flex items-center mt-3",
                                        "text-[10px] font-semibold uppercase tracking-wide",
                                        "px-2.5 py-1 rounded-full",
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
