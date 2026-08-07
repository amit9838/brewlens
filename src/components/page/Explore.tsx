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
    Clock, Flame, Sparkles, Terminal, Zap, Palette, Globe, Code, Database,
    Rocket, Bookmark, Trash2, LayoutGrid, Network, Bot, Film, Cpu, GitBranch,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "../../lib/utils";
import { FeaturedBanner } from "../ui/FeaturedBanner";
import { AppLane } from "../ui/AppLane";
import { SectionHeader } from "../ui/SectionHeader";
import { EDITORS_PICKS_TOKENS } from "../../data/curated";
import { getCategoryStyle } from "../../data/categories";

const fetchCaskAnalytics = async (period: string = '30d') => {
    const res = await fetch(`https://formulae.brew.sh/api/analytics/cask-install/${period}.json`);
    if (!res.ok) throw new Error('Failed to fetch cask analytics');
    return res.json();
};

const DISCOVER_CATEGORIES = [
    { id: 'dev-tools',     label: 'Dev Tools',          desc: 'Terminals, IDEs & editors',        icon: Terminal,    type: 'cask' as const,    color: 'indigo' },
    { id: 'ai-tools',      label: 'AI & LLM',           desc: 'LLM runners & AI assistants',      icon: Bot,         type: 'cask' as const,    color: 'violet' },
    { id: 'design',        label: 'Design & Creative',  desc: 'Photo, vector, 3D & media',        icon: Palette,     type: 'cask' as const,    color: 'pink' },
    { id: 'media',         label: 'Media & Games',      desc: 'Players, streaming & gaming',      icon: Film,        type: 'cask' as const,    color: 'rose' },
    { id: 'browsers',      label: 'Internet',           desc: 'Browsers, chat, VPN & security',   icon: Globe,       type: 'cask' as const,    color: 'blue' },
    { id: 'productivity',  label: 'Productivity',       desc: 'Notes, office & system tools',     icon: Zap,         type: 'cask' as const,    color: 'emerald' },
    { id: 'languages',     label: 'Languages & Build',  desc: 'Compilers, runtimes & build',      icon: Code,        type: 'formula' as const,  color: 'cyan' },
    { id: 'databases',     label: 'Databases',          desc: 'SQL, NoSQL & caching',             icon: Database,    type: 'formula' as const,  color: 'amber' },
    { id: 'devops',        label: 'DevOps & Infra',     desc: 'Containers, K8s & cloud CLIs',     icon: Rocket,      type: 'formula' as const,  color: 'rose' },
    { id: 'cli-tools',     label: 'CLI Tools',          desc: 'Shell enhancers & text processing',icon: Cpu,         type: 'formula' as const,  color: 'violet' },
    { id: 'networking',    label: 'Networking',         desc: 'DNS, proxies & diagnostics',       icon: Network,     type: 'formula' as const,  color: 'purple' },
    { id: 'git',           label: 'Git & VCS',          desc: 'Version control & collaboration',  icon: GitBranch,   type: 'formula' as const,  color: 'emerald' },
];

const Dashboard = () => {
    const { data: caskData = [] } = useBrewData("cask");
    const { openModal } = useModal();

    const { recentItems, clearRecent } = useRecentlyViewed();
    const { bookmarks } = useBookmarks();
    const [shelfTab, setShelfTab] = useState<'bookmarks' | 'recents'>('bookmarks');

    useEffect(() => {
        if (bookmarks.length === 0 && recentItems.length > 0) setShelfTab('recents');
        else if (bookmarks.length > 0) setShelfTab('bookmarks');
    }, [bookmarks.length, recentItems.length]);

    const { data: caskAnalytics30d } = useQuery({
        queryKey: ['analytics-cask', '30d'],
        queryFn: () => fetchCaskAnalytics('30d'),
        staleTime: 1000 * 60 * 10,
    });

    const trendingItems = useMemo(() => {
        if (!caskAnalytics30d?.items || !caskData.length) return [];
        return caskAnalytics30d.items.slice(0, 12).map((item: any) => {
            const found = caskData.find(c => c.token === item.cask);
            return found ? { ...found, downloads: item.count } : null;
        }).filter(Boolean) as any[];
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

            {caskData.length > 0 && (
                <div className="w-full">
                    <FeaturedBanner items={caskData} />
                </div>
            )}

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

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                    {DISCOVER_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const s = getCategoryStyle(cat.color);
                        return (
                            <NavLink
                                key={cat.id}
                                to={`/all?category=${cat.id}&type=${cat.type}`}
                                className={cn(
                                    "group relative flex items-center gap-2 p-2.5 sm:gap-3 sm:p-3 lg:gap-4 lg:p-4 rounded-xl overflow-hidden",
                                    "ring-1 ring-zinc-200/40 dark:ring-white/8",
                                    "transition-all duration-300 ease-out",
                                    s.border, s.hoverBorder, s.surface, s.hoverSurface
                                )}
                            >
                                <div className="absolute inset-0 bg-white/40 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                <div className={cn("flex items-center justify-center shrink-0 w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9 rounded-md transition-transform duration-300 group-hover:scale-105", s.iconBg, s.iconColor)}>
                                    <Icon size={12} strokeWidth={2} className="sm:scale-110 lg:scale-125" />
                                </div>
                                <div className="min-w-0 flex-1 leading-tight">
                                    <h4 className="text-[11px] sm:text-xs lg:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate leading-tight">{cat.label}</h4>
                                    {cat.desc && (
                                        <p className="hidden lg:block text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight line-clamp-2">{cat.desc}</p>
                                    )}
                                    <span className={cn("inline-flex items-center mt-0.5 lg:mt-1 text-[8px] sm:text-[9px] lg:text-[10px] font-semibold uppercase tracking-wider px-1 py-0.5 rounded", s.badgeBg, s.badgeColor)}>{cat.type}</span>
                                </div>
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {trendingItems.length > 0 && (
                <div className="space-y-3 mt-6">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <div className="flex items-center justify-center p-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400">
                            <Flame size={18} strokeWidth={1.8} />
                        </div>
                        <SectionHeader title="Trending Apps" subtitle="Most installed cask packages in the last 30 days" action={<NavLink to="/analytics">View Trending →</NavLink>} className="flex-1" />
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
                        <SectionHeader title="Editor's Picks" subtitle="Hand-picked visual tools and terminal utilities" action={<NavLink to="/all">View All →</NavLink>} className="flex-1" />
                    </div>
                    <AppLane items={editorPickItems} variant="editor" />
                </div>
            )}

            {hasShelfItems && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <div className="flex items-center justify-center p-2.5 rounded-xl bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400">
                            <Bookmark size={18} strokeWidth={1.8} />
                        </div>
                        <SectionHeader title="My Shelf" subtitle="Your saved bookmarks and recently viewed items" />
                    </div>
                    <div className="section bg-gradient-to-br from-violet-500/5 via-fuchsia-500/3 to-transparent dark:from-violet-600/5 dark:via-fuchsia-700/2 dark:to-transparent border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-4.5 transition-all duration-300 hover:border-violet-500/20">
                        <div className="header flex flex-wrap justify-between items-center text-md text-zinc-900 dark:text-zinc-300 mb-3.5 gap-y-3">
                            <div className="flex items-center bg-gray-100/80 dark:bg-zinc-800/85 p-0.5 rounded-xl border border-zinc-200/30 dark:border-zinc-700/30 shadow-inner">
                                {bookmarks.length > 0 && (
                                    <button onClick={() => setShelfTab('bookmarks')} className={cn("flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer", shelfTab === 'bookmarks' ? "bg-white dark:bg-zinc-700 text-violet-600 dark:text-violet-400 scale-[1.02]" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300")}>
                                        <Bookmark size={13} /><span>Bookmarks</span>
                                    </button>
                                )}
                                {recentItems.length > 0 && (
                                    <button onClick={() => setShelfTab('recents')} className={cn("flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer", shelfTab === 'recents' ? "bg-white dark:bg-zinc-700 text-violet-600 dark:text-violet-400 scale-[1.02]" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300")}>
                                        <Clock size={13} /><span>Recently Viewed</span>
                                    </button>
                                )}
                            </div>
                            {shelfTab === 'recents' && recentItems.length > 0 && (
                                <Button variant="ghost" size="sm" onClick={clearRecent} className="text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs shrink-0 cursor-pointer h-7">
                                    <Trash2 size={13} className="mr-1.5" /><span>Clear History</span>
                                </Button>
                            )}
                            {shelfTab === 'bookmarks' && bookmarks.length > 0 && (
                                <Button variant="ghost" size="sm" onClick={handleBookmarkView} className="text-zinc-500 hover:text-red-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs shrink-0 cursor-pointer h-7">
                                    <Bookmark size={13} className="mr-1.5" /><span>Bookmarks</span>
                                </Button>
                            )}
                        </div>
                        <div className="contents">
                            {shelfTab === 'bookmarks' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {bookmarks.slice(0, 8).map((item) => (<ItemCard key={item.id} item={item} enableBackground={false} />))}
                                </div>
                            ) : (<RecentlyViewedSection maxVisible={12} />)}
                        </div>
                    </div>
                </div>
            )}

            <div className="hidden flex justify-center py-6 opacity-80 hover:opacity-100 transition-opacity">
                <img src="https://hitscounter.dev/api/hit?url=https%3A%2F%2Famit9838.github.io%2Fbrewlens%2F&label=Visits&icon=person-walking&color=%23198754&message=&style=flat&tz=UTC" alt="Hit Counter" className="h-6" />
            </div>
        </div>
    );
};

export default Dashboard;