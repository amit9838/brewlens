import { ItemCard } from "../ItemCard";
import RecentlyViewedSection from "../ui/RecentlyViewedStrip";
import { useState, useEffect, useMemo } from 'react';
import { useBrewData } from "../../hooks/useBrewData";
import { Button } from "../ui/Button";
import { NavLink } from "react-router-dom";
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useBookmarks } from '../contexts/BookmarksContext';
import { type BrewItem } from '../../types';
import { 
    Clock, 
    TrendingUp, 
    Layers, 
    Cpu, 
    ShieldCheck, 
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
import { formatCount, fetchCaskMeta } from "../page/Analytics"; 
import { AnalyticsItemRow } from "../ui/AnalyticsItemRow";
import { cn } from "../../lib/utils";
import { FeaturedBanner } from "../ui/FeaturedBanner";
import { AppLane } from "../ui/AppLane";
import { SectionHeader } from "../ui/SectionHeader";

const fetchCaskAnalytics = async (period: string = '30d') => {
    const res = await fetch(`https://formulae.brew.sh/api/analytics/cask-install/${period}.json`);
    if (!res.ok) throw new Error('Failed to fetch cask analytics');
    return res.json();
};

const fetchFormulaAnalytics = async (period: string = '30d') => {
    const res = await fetch(`https://formulae.brew.sh/api/analytics/install-on-request/${period}.json`);
    if (!res.ok) throw new Error('Failed to fetch formula analytics');
    return res.json();
};

// Curated grid categories definitions
const DISCOVER_CATEGORIES = [
    {
        id: 'dev-tools',
        label: 'Developer Tools',
        desc: 'Terminals, IDEs, compilers & databases',
        icon: Terminal,
        color: 'from-indigo-500/10 to-blue-500/10 hover:from-indigo-500/15 hover:to-blue-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:border-indigo-500/40 dark:hover:border-indigo-400/40',
        type: 'cask',
    },
    {
        id: 'productivity',
        label: 'Productivity',
        desc: 'Notes, task organizers & calendar apps',
        icon: Zap,
        color: 'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/15 hover:to-teal-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40 dark:hover:border-emerald-400/40',
        type: 'cask',
    },
    {
        id: 'design',
        label: 'Design & Creative',
        desc: 'Photo editors, vector tools & 3D art',
        icon: Palette,
        color: 'from-pink-500/10 to-rose-500/10 hover:from-pink-500/15 hover:to-rose-500/15 text-pink-600 dark:text-pink-400 border-pink-500/20 hover:border-pink-500/40 dark:hover:border-pink-400/40',
        type: 'cask',
    },
    {
        id: 'browsers',
        label: 'Web Browsers',
        desc: 'Fast, secure & modern browser options',
        icon: Globe,
        color: 'from-blue-500/10 to-cyan-500/10 hover:from-blue-500/15 hover:to-cyan-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:border-blue-500/40 dark:hover:border-blue-400/40',
        type: 'cask',
    },
    {
        id: 'languages',
        label: 'Programming Languages',
        desc: 'Compilers, package managers & runtimes',
        icon: Code,
        color: 'from-cyan-500/10 to-teal-500/10 hover:from-cyan-500/15 hover:to-teal-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 hover:border-cyan-500/40 dark:hover:border-cyan-400/40',
        type: 'formula',
    },
    {
        id: 'databases',
        label: 'Databases & Servers',
        desc: 'SQL, Document caches & messaging queues',
        icon: Database,
        color: 'from-amber-500/10 to-orange-500/10 hover:from-amber-500/15 hover:to-orange-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:border-amber-500/40 dark:hover:border-amber-400/40',
        type: 'formula',
    },
    {
        id: 'devops',
        label: 'DevOps & Containers',
        desc: 'Docker, Kubernetes, AWS & cloud engines',
        icon: Rocket,
        color: 'from-rose-500/10 to-orange-500/10 hover:from-rose-500/15 hover:to-orange-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:border-rose-500/40 dark:hover:border-rose-400/40',
        type: 'formula',
    },
    {
        id: 'cli-tools',
        label: 'CLI Tools & Utilities',
        desc: 'Terminal shell enhancements & helper search tools',
        icon: Cpu,
        color: 'from-violet-500/10 to-purple-500/10 hover:from-violet-500/15 hover:to-purple-500/15 text-violet-600 dark:text-violet-400 border-violet-500/20 hover:border-violet-500/40 dark:hover:border-violet-400/40',
        type: 'formula',
    },
];

const Dashboard = () => {
    const { data: caskData = [], isLoading: isLoadingCasks } = useBrewData("cask");
    const { data: formulaData = [], isLoading: isLoadingFormulae } = useBrewData("formula");
    
    const { recentItems, clearRecent } = useRecentlyViewed();
    const { bookmarks } = useBookmarks();
    const [analyticsTab, setAnalyticsTab] = useState<'cask' | 'formula'>('cask');
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
    const { data: caskAnalytics30d, isLoading: isLoadingCaskAnalytics, error: caskAnalyticsError } = useQuery({
        queryKey: ['analytics-cask', '30d'],
        queryFn: () => fetchCaskAnalytics('30d'),
        staleTime: 1000 * 60 * 10,
    });

    const { data: formulaAnalytics30d, isLoading: isLoadingFormulaAnalytics, error: formulaAnalyticsError } = useQuery({
        queryKey: ['analytics-formula', '30d'],
        queryFn: () => fetchFormulaAnalytics('30d'),
        staleTime: 1000 * 60 * 10,
    });

    const { data: caskMeta = {} } = useQuery({
        queryKey: ['cask-meta'],
        queryFn: fetchCaskMeta,
        staleTime: 1000 * 60 * 60,
    });

    // Map homepages to dynamic lookups
    const homepages = useMemo(() => {
        const map: Record<string, string> = { ...caskMeta };
        caskData.forEach(c => { if (c.token && c.homepage) map[c.token] = c.homepage; });
        formulaData.forEach(f => { if (f.token && f.homepage) map[f.token] = f.homepage; });
        return map;
    }, [caskMeta, caskData, formulaData]);

    const activeAnalytics = analyticsTab === 'cask' ? caskAnalytics30d : formulaAnalytics30d;
    const isLoadingAnalytics = analyticsTab === 'cask' ? isLoadingCaskAnalytics : isLoadingFormulaAnalytics;
    const analyticsError = analyticsTab === 'cask' ? caskAnalyticsError : formulaAnalyticsError;

    const topItems = activeAnalytics?.items?.slice(0, 5) ?? [];
    const maxCount = topItems[0] ? parseInt(topItems[0].count.replace(/,/g, ''), 10) : 1;
    const totalFormatted = activeAnalytics ? formatCount(String(activeAnalytics.total_count)) : null;

    // Derived editorial items from caskData
    const trendingItems = useMemo(() => {
        if (!caskAnalytics30d?.items || !caskData.length) return [];
        return caskAnalytics30d.items
            .slice(0, 12)
            .map((item: any) => caskData.find(c => c.token === item.cask))
            .filter(Boolean) as BrewItem[];
    }, [caskAnalytics30d, caskData]);

    const editorPickItems = useMemo(() => {
        if (!caskData.length) return [];
        return caskData.filter(i => ['raycast', 'warp', 'tableplus', 'zed', 'proxyman', 'cleanshot', 'rectangle', 'orbstack'].includes(i.token)).slice(0, 12);
    }, [caskData]);

    // Metric aggregates
    const totalCasks = caskData.length;
    const totalFormulae = formulaData.length;
    const totalApps = totalCasks + totalFormulae;

    const fossCasks = caskData.filter(i => i.package.isFoss).length;
    const fossFormulae = formulaData.filter(i => i.package.isFoss).length;
    const totalFoss = fossCasks + fossFormulae;
    const fossPercentage = totalApps > 0 ? Math.round((totalFoss / totalApps) * 100) : 0;

    const hasShelfItems = bookmarks.length > 0 || recentItems.length > 0;

    return (
        <div className="sections flex flex-col gap-8 transition-all duration-500 px-0">
            
            {/* 1. Curated Editorial Hero Carousel */}
            {caskData.length > 0 && (
                <div className="w-full">
                    <FeaturedBanner items={caskData} />
                </div>
            )}

            {/* 2. Command Center Stats Grid — Highly compact horizontal strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl p-2.5 shadow-2xs">
                <div className="flex items-center gap-3 px-3 py-1.5 border-r border-zinc-200/30 dark:border-zinc-800/30">
                    <Layers size={18} className="text-emerald-500 shrink-0" />
                    <div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Packages</p>
                        <h4 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                            {isLoadingCasks || isLoadingFormulae ? "..." : totalApps.toLocaleString()}
                        </h4>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 px-3 py-1.5 lg:border-r border-zinc-200/30 dark:border-zinc-800/30">
                    <Cpu size={18} className="text-blue-500 shrink-0" />
                    <div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">CLI Formulae</p>
                        <h4 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                            {isLoadingFormulae ? "..." : totalFormulae.toLocaleString()}
                        </h4>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-3 py-1.5 border-r border-zinc-200/30 dark:border-zinc-800/30">
                    <Layers size={18} className="text-cyan-500 shrink-0" />
                    <div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Desktop Casks</p>
                        <h4 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                            {isLoadingCasks ? "..." : totalCasks.toLocaleString()}
                        </h4>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-3 py-1.5">
                    <ShieldCheck size={18} className="text-purple-500 shrink-0" />
                    <div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Open Source Ratio</p>
                        <h4 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                            {isLoadingCasks || isLoadingFormulae ? "..." : `${fossPercentage}%`}
                        </h4>
                    </div>
                </div>
            </div>

            {/* 3. Curated App Lanes */}
            {trendingItems.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <div className="flex items-center justify-center p-2 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 shadow-xs">
                            <Flame size={16} />
                        </div>
                        <SectionHeader
                            title="Trending Casks"
                            subtitle="Most installed cask packages in the last 30 days"
                        />
                    </div>
                    <AppLane items={trendingItems} />
                </div>
            )}

            {editorPickItems.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <div className="flex items-center justify-center p-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-xs">
                            <Sparkles size={16} />
                        </div>
                        <SectionHeader
                            title="Editor's Picks"
                            subtitle="Hand-picked visual tools and terminal utilities"
                        />
                    </div>
                    <AppLane items={editorPickItems} />
                </div>
            )}

            {/* 4. Beautiful Category Grid Explorer Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center justify-center p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-xs">
                        <LayoutGrid size={16} />
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
                                    "group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 bg-gradient-to-br shadow-xs hover:shadow-md hover:-translate-y-0.5",
                                    cat.color
                                )}
                            >
                                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                                    <Icon size={18} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {cat.label}
                                    </h4>
                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal mt-0.5 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                        {cat.desc}
                                    </p>
                                    <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-bold uppercase tracking-wider bg-white/50 dark:bg-zinc-950/30 px-2 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-800/40">
                                        {cat.type}
                                    </span>
                                </div>
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* 5. Combined Personalized tabbed "My Shelf" Section */}
            {hasShelfItems && (
                <div className="section bg-gradient-to-br from-violet-500/5 via-fuchsia-500/3 to-transparent dark:from-violet-600/5 dark:via-fuchsia-700/2 dark:to-transparent border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-4.5 transition-all duration-300 hover:border-violet-500/20 hover:shadow-lg">
                    <div className="header flex flex-wrap justify-between items-center text-md text-zinc-900 dark:text-zinc-300 mb-3.5 gap-y-3">
                        <div className="flex items-center bg-gray-100/80 dark:bg-zinc-800/85 p-0.5 rounded-xl border border-zinc-200/30 dark:border-zinc-700/30 shadow-inner">
                            {bookmarks.length > 0 && (
                                <button
                                    onClick={() => setShelfTab('bookmarks')}
                                    className={cn("flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                                        shelfTab === 'bookmarks' 
                                            ? "bg-white dark:bg-zinc-700 shadow-md text-violet-600 dark:text-violet-400 scale-[1.02]" 
                                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                    )}
                                >
                                    <Bookmark size={13} />
                                    <span>Bookmarks</span>
                                    <span className="text-[10px] opacity-70">({bookmarks.length})</span>
                                </button>
                            )}
                            {recentItems.length > 0 && (
                                <button
                                    onClick={() => setShelfTab('recents')}
                                    className={cn("flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                                        shelfTab === 'recents' 
                                            ? "bg-white dark:bg-zinc-700 shadow-md text-violet-600 dark:text-violet-400 scale-[1.02]" 
                                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                    )}
                                >
                                    <Clock size={13} />
                                    <span>Recently Viewed</span>
                                    <span className="text-[10px] opacity-70">({recentItems.length})</span>
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
                    </div>

                    <div className="contents">
                        {shelfTab === 'bookmarks' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {bookmarks.slice(0, 4).map((item) => (
                                    <ItemCard key={item.id} item={item} enableBackground={false} />
                                ))}
                            </div>
                        ) : (
                            <RecentlyViewedSection maxVisible={4} />
                        )}
                    </div>
                </div>
            )}

            {/* 6. Analytics installations tabbed section */}
            <div className="section bg-gradient-to-br from-amber-400/5 via-orange-500/3 to-transparent dark:from-amber-500/5 dark:via-orange-600/2 dark:to-transparent border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-4 transition-all duration-300 hover:border-amber-500/20 hover:shadow-lg">
                <div className="header flex flex-col sm:flex-row sm:justify-between sm:items-center text-md text-zinc-900 dark:text-zinc-300 mb-3 gap-y-3">
                    <div className="title flex items-center font-bold text-zinc-900 dark:text-zinc-200 text-lg flex-wrap gap-x-2">
                        <span className="flex items-center justify-center bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 p-2 rounded-xl mr-1 shadow-sm shrink-0">
                            <TrendingUp size={16} />
                        </span>
                        <span>Popular Installations</span>
                        {totalFormatted && (
                            <span className="text-xs font-normal text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full mt-1 sm:mt-0">
                                {totalFormatted} total installs (30d)
                            </span>
                        )}
                    </div>
                    
                    {/* Tab Toggles */}
                    <div className="flex items-center bg-gray-100 dark:bg-zinc-800/80 p-0.5 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 self-start sm:self-auto shrink-0 shadow-inner">
                        {(['cask', 'formula'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setAnalyticsTab(t)}
                                className={cn("px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-300 cursor-pointer",
                                    analyticsTab === t 
                                        ? "bg-white dark:bg-zinc-700 shadow-md text-amber-600 dark:text-amber-400 scale-[1.02]" 
                                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                )}
                            >
                                {t}s
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="contents">
                    {isLoadingAnalytics && (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                            ))}
                        </div>
                    )}
                    {analyticsError && (
                        <p className="text-red-500 text-sm">Failed to load analytics data.</p>
                    )}
                    {!isLoadingAnalytics && !analyticsError && topItems.length === 0 && (
                        <p className="text-zinc-500 text-sm">No data available.</p>
                    )}
                    {!isLoadingAnalytics && !analyticsError && topItems.length > 0 && (
                        <div className="space-y-1">
                            {topItems.map((item: any) => {
                                const name = item.cask || item.formula;
                                const homepage = homepages[name];

                                return (
                                    <AnalyticsItemRow
                                        key={name}
                                        item={item}
                                        homepage={homepage}
                                        maxCount={maxCount}
                                        variant="amber"
                                    />
                                );
                            })}
                        </div>
                    )}
                    <div className="flex justify-end mt-4 pt-2 border-t border-zinc-100/50 dark:border-zinc-800/50">
                        <NavLink to="/analytics">
                            <Button variant="ghost" size="sm" className="hover:bg-amber-500/10 hover:text-amber-600 cursor-pointer">
                                <TrendingUp size={16} className="mr-2" />
                                <span className="text-sm font-medium">View Full Leaderboard</span>
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;