import { ItemCard } from "../ItemCard";
import RecentlyViewedSection from "../ui/RecentlyViewedStrip";
import BookmarksSection from "../ui/BookmarksSection";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useBrewData } from "../../hooks/useBrewData";
import { Button } from "../ui/Button";
import { NavLink } from "react-router-dom";
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { type BrewItem } from '../../types';
import { RefreshCcw, Grid, BrushCleaning, Clock, Shuffle, TrendingUp, Layers, Cpu, ShieldCheck, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatCount, fetchCaskMeta } from "../page/Analytics"; // adjust path
import { AnalyticsItemRow } from "../ui/AnalyticsItemRow";
import { cn } from "../../lib/utils";

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


const STORAGE_KEY = "dashboard_random_picks";
const TTL_MS = 60 * 60 * 1000; // 1 hour

interface StoredPicks {
    indices: number[];
    timestamp: number;
}

const Dashboard = () => {
    const { data: caskData = [], isLoading: isLoadingCasks, error } = useBrewData("cask");
    const { data: formulaData = [], isLoading: isLoadingFormulae } = useBrewData("formula");
    
    const [randomPicks, setRandomPicks] = useState<BrewItem[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { recentItems, clearRecent } = useRecentlyViewed();
    const [filteredData, setFilteredData] = useState<BrewItem[]>(caskData ?? []);
    const [analyticsTab, setAnalyticsTab] = useState<'cask' | 'formula'>('cask');

    const isLoading = isLoadingCasks;

    useEffect(() => {
        if (isLoadingCasks) return;
        else if (error) return;
        else {
            let fdata = caskData?.filter(i => !i.deprecated && !i.disabled) || [];
            fdata = fdata.filter(i => !i.token.startsWith('font-'));
            setFilteredData(fdata);
        }
    }, [caskData, isLoadingCasks, error]);

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

    // Metric aggregates
    const totalCasks = caskData.length;
    const totalFormulae = formulaData.length;
    const totalApps = totalCasks + totalFormulae;

    const fossCasks = caskData.filter(i => i.package.isFoss).length;
    const fossFormulae = formulaData.filter(i => i.package.isFoss).length;
    const totalFoss = fossCasks + fossFormulae;
    const fossPercentage = totalApps > 0 ? Math.round((totalFoss / totalApps) * 100) : 0;


    // Generate new random picks (indices only) based on current data
    const generateRandomIndices = useCallback((): number[] => {

        if (!filteredData.length) return [];
        const dataLen = filteredData.length;
        const numPicks = Math.min(8, dataLen);
        const indicesSet = new Set<number>();
        while (indicesSet.size < numPicks) {
            indicesSet.add(Math.floor(Math.random() * dataLen));
        }
        return Array.from(indicesSet);
    }, [filteredData]);

    // Store indices and timestamp to localStorage
    const storePicks = useCallback((indices: number[]) => {
        const stored: StoredPicks = {
            indices,
            timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }, []);

    // Load stored picks and map them to actual BrewItems
    const loadStoredPicks = useCallback((): BrewItem[] => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        try {
            const stored: StoredPicks = JSON.parse(raw);
            const now = Date.now();
            if (now - stored.timestamp > TTL_MS) {
                // Expired
                return [];
            }

            // Map indices to actual data items, filter out any that are out of bounds
            const items = stored.indices
                .map(idx => filteredData[idx])
                .filter((item): item is BrewItem => item !== undefined);

            return items;
        } catch (e) {
            console.error("Failed to parse stored picks", e);
            return [];
        }
    }, [filteredData]);

    // Refresh random picks (manual or automatic)
    const refreshRandomPicks = useCallback(async () => {
        if (isLoading || !filteredData.length) return;

        setIsRefreshing(true);
        try {
            const newIndices = generateRandomIndices();
            if (newIndices.length) {
                const newPicks = newIndices.map(idx => filteredData[idx]);
                setRandomPicks(newPicks);
                storePicks(newIndices);
            } else {
                setRandomPicks([]);
            }
        } finally {
            setIsRefreshing(false);
        }
    }, [filteredData, isLoading, generateRandomIndices, storePicks]);

    // Initial load and data changes: decide whether to use stored or generate fresh
    useEffect(() => {

        if (isLoading || !filteredData.length) return;

        const storedItems = loadStoredPicks();
        if (storedItems.length) {
            setRandomPicks(storedItems);
        } else {
            // No valid stored picks, generate fresh
            refreshRandomPicks();
        }
    }, [filteredData, isLoading, loadStoredPicks, refreshRandomPicks]);

    // Auto-refresh: check every minute if the stored picks are expired, and refresh if needed
    useEffect(() => {
        if (isLoading) return; // Wait for data to load

        const intervalId = setInterval(() => {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;

            try {
                const stored: StoredPicks = JSON.parse(raw);
                const now = Date.now();
                if (now - stored.timestamp >= TTL_MS) {
                    // Expired, refresh
                    refreshRandomPicks();
                }
            } catch (e) {
                console.error("Failed to parse stored picks in interval", e);
            }
        }, 60000); // check every minute

        return () => clearInterval(intervalId);
    }, [isLoading, refreshRandomPicks]);

    return (
        <div className="sections flex flex-col gap-6 transition-all duration-500 px-0">
            {/* Welcome Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-6 sm:p-8 shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl transition-all duration-500 group-hover:scale-125 pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl transition-all duration-500 group-hover:scale-125 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Registry Online
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                            Discover & Manage Homebrew
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                            BrewLens is a modern, light-speed visual explorer for Homebrew. Search, filter, and track installation statistics for your favorite casks and formulae.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 shrink-0">
                        <NavLink to="/all" className="w-full sm:w-auto">
                            <Button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                                <span>Browse Packages</span>
                                <ArrowRight size={16} />
                            </Button>
                        </NavLink>
                        <NavLink to="/installation" className="w-full sm:w-auto">
                            <Button variant="secondary" className="w-full flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                                <span>Install Guide</span>
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </div>

            {/* Command Center Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-4 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg group">
                    <div className="absolute right-2 top-2 text-emerald-500/10 transition-transform duration-300 group-hover:scale-110 pointer-events-none">
                        <Layers size={40} />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Packages</p>
                    <h3 className="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                        {isLoadingCasks || isLoadingFormulae ? (
                            <span className="inline-block h-8 w-16 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                        ) : (
                            totalApps.toLocaleString()
                        )}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-zinc-400 mt-1">Casks & Formulae</p>
                </div>
                
                <div className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-4 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg group">
                    <div className="absolute right-2 top-2 text-blue-500/10 transition-transform duration-300 group-hover:scale-110 pointer-events-none">
                        <Cpu size={40} />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Formulae</p>
                    <h3 className="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                        {isLoadingFormulae ? (
                            <span className="inline-block h-8 w-16 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                        ) : (
                            totalFormulae.toLocaleString()
                        )}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-zinc-400 mt-1">CLI utilities & tools</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-4 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg group">
                    <div className="absolute right-2 top-2 text-cyan-500/10 transition-transform duration-300 group-hover:scale-110 pointer-events-none">
                        <Layers size={40} />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Casks</p>
                    <h3 className="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                        {isLoadingCasks ? (
                            <span className="inline-block h-8 w-16 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                        ) : (
                            totalCasks.toLocaleString()
                        )}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-zinc-400 mt-1">Desktop apps</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-4 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg group">
                    <div className="absolute right-2 top-2 text-purple-500/10 transition-transform duration-300 group-hover:scale-110 pointer-events-none">
                        <ShieldCheck size={40} />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">Open Source Ratio</p>
                    <h3 className="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                        {isLoadingCasks || isLoadingFormulae ? (
                            <span className="inline-block h-8 w-16 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                        ) : (
                            `${fossPercentage}%`
                        )}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-zinc-400 mt-1">OSS license ratio</p>
                </div>
            </div>

            {/* Recently Viewed Section */}
            {recentItems && recentItems.length > 0 && (
                <div className="section bg-gradient-to-br from-cyan-400/5 via-blue-500/3 to-transparent dark:from-cyan-500/5 dark:via-blue-600/2 dark:to-transparent border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-4 transition-all duration-300 hover:border-cyan-500/20 hover:shadow-lg">
                    <div className="header flex flex-wrap justify-between items-center text-md text-zinc-900 dark:text-zinc-300 mb-2 gap-y-2">
                        <div className="title flex items-center font-bold text-zinc-900 dark:text-zinc-200 text-lg">
                            <span className="flex items-center justify-center bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 p-2 rounded-xl mr-3 shadow-sm">
                                <Clock size={16} />
                            </span>
                            <span>Recently Viewed</span>
                            <span className="ml-2 text-xs font-normal text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full">
                                {recentItems.length} items
                            </span>
                        </div>
                        <div className="action">
                            <Button variant="ghost" size="sm" onClick={() => clearRecent()} className="hover:bg-cyan-500/10 hover:text-cyan-600 cursor-pointer">
                                <BrushCleaning size={16} className="mr-2" /> 
                                <span className="text-sm font-medium">Clear Recents</span>
                            </Button>
                        </div>
                    </div>
                    <div className="contents mt-3">
                        <RecentlyViewedSection />
                    </div>
                </div>
            )}

            {/* Bookmarks Section */}
            <BookmarksSection maxItems={4} />

            {/* Random Picks Section */}
            <div className="section bg-gradient-to-br from-purple-400/5 via-pink-500/3 to-transparent dark:from-purple-600/5 dark:via-pink-700/2 dark:to-transparent border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-4 transition-all duration-300 hover:border-purple-500/20 hover:shadow-lg">
                <div className="header flex justify-between flex-wrap gap-y-2 items-center text-md text-zinc-900 dark:text-zinc-300 mb-2">
                    <div className="title flex items-center font-bold text-zinc-900 dark:text-zinc-200 text-lg">
                        <span className="flex items-center justify-center bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 p-2 rounded-xl mr-3 shadow-sm">
                            <Shuffle size={16} />
                        </span>
                        <span>Random Picks</span>
                    </div>
                    <div className="action flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={refreshRandomPicks}
                            disabled={isRefreshing || isLoading}
                            className="hover:bg-purple-500/10 hover:text-purple-600 cursor-pointer"
                        >
                            <span className="text-sm font-medium flex gap-2 items-center">
                                <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} /> {isRefreshing ? "Refreshing..." : "Refresh"}
                            </span>
                        </Button>
                        <NavLink to={`/all`}>
                            <Button variant="ghost" size="sm" className="hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
                                <Grid size={16} className="mr-2" /> <span className="text-sm font-medium">All Apps</span>
                            </Button>
                        </NavLink>
                    </div>
                </div>
                <div className="contents mt-3">
                    {isLoading && <p className="text-sm text-zinc-400">Loading random picks...</p>}
                    {!isLoading && randomPicks.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {randomPicks.map((item) => (
                                <ItemCard key={item.id} item={item} enableBackground={true} />
                            ))}
                        </div>
                    )}
                    {!isLoading && randomPicks.length === 0 && filteredData.length > 0 && (
                        <p className="text-sm text-zinc-400">No items to display.</p>
                    )}
                </div>
            </div>

            {/* Analytics Section – Tabbed Leaders (30 Days) */}
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