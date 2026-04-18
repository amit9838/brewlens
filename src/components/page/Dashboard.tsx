import { ItemCard } from "../ItemCard";
import RecentlyViewedSection from "../ui/RecentlyViewedStrip";
import BookmarksSection from "../ui/BookmarksSection";
import { useState, useEffect, useCallback } from 'react';
import { useBrewData } from "../../hooks/useBrewData";
import { Button } from "../ui/Button";
import { NavLink } from "react-router-dom";
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { type BrewItem } from '../../types';
import { RefreshCcw, Grid, BrushCleaning } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics, formatCount, fetchCaskMeta } from "../page/Analytics"; // adjust path
import { TrendingUp } from "lucide-react";
import { AnalyticsItemRow } from "../ui/AnalyticsItemRow";


const STORAGE_KEY = "dashboard_random_picks";
const TTL_MS = 60 * 60 * 1000; // 1 hour

interface StoredPicks {
    indices: number[];
    timestamp: number;
}

const Dashboard = () => {
    let { data, isLoading, error } = useBrewData("cask");
    const [randomPicks, setRandomPicks] = useState<BrewItem[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { recentItems, clearRecent } = useRecentlyViewed();
    const [filteredData, setFilteredData] = useState<BrewItem[]>(data ?? []);

    useEffect(() => {
        if (isLoading) return;
        else if (error) return;
        else {
            let fdata = data?.filter(i => !i.deprecated && !i.disabled) || [];
            fdata = fdata.filter(i => !i.token.startsWith('font-'));
            setFilteredData(fdata);
        }
    }, [data, isLoading]);


    // Analytics section query
    const { data: analytics30d, isLoading: isLoadingAnalytics, error: analyticsError } = useQuery({
        queryKey: ['analytics', '30d'],
        queryFn: () => fetchAnalytics('30d'),
        staleTime: 1000 * 60 * 10,
    });

    const { data: caskMeta = {} } = useQuery({
        queryKey: ['cask-meta'],
        queryFn: fetchCaskMeta,
        staleTime: 1000 * 60 * 60,
    });

    const topItems = analytics30d?.items?.slice(0, 5) ?? [];
    const maxCount = topItems[0] ? parseInt(topItems[0].count.replace(/,/g, ''), 10) : 1;
    const totalFormatted = analytics30d ? formatCount(String(analytics30d.total_count)) : null;


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
        <div className="sections flex flex-col gap-4 transition-all duration-500 px-0">
            {/* Recently Viewed Section */}
            {recentItems && recentItems.length > 0 && (
                <div className="section bg-gradient-to-br from-cyan-400/5 via-blue-500/5 to-transparent dark:from-cyan-500/2 dark:via-blue-600/4 dark:to-transparent border border-cyan-200/30 dark:border-cyan-700/5 shadow-md rounded-xl p-4 backdrop-blur-sm transition-all duration-500 hover:shadow-lg">
                    <div className="header flex flex-wrap justify-between items-center text-md text-zinc-900 dark:text-zinc-300 mb-2">
                        <div className="title flex items-center">
                            <span className="bg-cyan-700 mr-3 w-1 h-5 rounded-xs" />
                            Recently Viewed
                        </div>
                        <div className="action">
                            <Button variant="ghost" size="sm" onClick={() => clearRecent()}>
                                <BrushCleaning size={18} /> <span className="text-sm font-medium">Clear Recents</span>
                            </Button>
                        </div>
                    </div>
                    <div className="contents">
                        <RecentlyViewedSection />
                    </div>
                </div>
            )}

            {/* Bookmarks Section */}
            <BookmarksSection maxItems={4} />

            {/* Random Picks Section */}
            <div className="section bg-gradient-to-br from-purple-400/5 via-pink-500/3 to-transparent dark:from-purple-600/5 dark:via-pink-700/3 dark:to-transparent border border-purple-200/30 dark:border-purple-700/10 shadow-md rounded-xl p-4 transition-all duration-500 hover:shadow-lg">
                <div className="header flex justify-between flex-wrap gap-y-2 items-center text-md text-zinc-900 dark:text-zinc-300 mb-2">
                    <div className="title w-50 flex items-center">
                        <span className="bg-purple-700 mr-3 w-1 h-5 rounded-xs" />
                        Random Picks
                    </div>
                    <div className="action flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={refreshRandomPicks}
                            disabled={isRefreshing || isLoading}
                        >
                            <span className="text-sm font-medium flex gap-2">
                                <RefreshCcw size={18} /> {isRefreshing ? "Refreshing..." : "Refresh"}
                            </span>
                        </Button>
                        <NavLink to={`/all`}>
                            <Button variant="ghost" size="sm">
                                <Grid size={18} /> <span className="text-sm font-medium">All Apps</span>
                            </Button>
                        </NavLink>
                    </div>
                </div>
                <div className="contents">
                    {isLoading && <p>Loading random picks...</p>}
                    {!isLoading && randomPicks.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {randomPicks.map((item) => (
                                <ItemCard key={item.id} item={item} enableBackground={true} />
                            ))}
                        </div>
                    )}
                    {!isLoading && randomPicks.length === 0 && filteredData.length > 0 && (
                        <p>No items to display.</p>
                    )}
                </div>
            </div>

            {/* Analytics Section – Top 5 Casks (30 Days) */}
            <div className="section bg-gradient-to-br from-amber-400/5 via-orange-500/5 to-transparent dark:from-amber-500/5 dark:via-orange-600/5 dark:to-transparent border border-amber-200/30 dark:border-amber-700/6 shadow-md rounded-xl p-4 transition-all duration-500 hover:shadow-lg">
                <div className="header flex justify-between items-center text-md text-zinc-900 dark:text-zinc-300 mb-2">
                    <div className="title flex items-center">
                        <span className="bg-amber-700 mr-3 w-1 h-5 rounded-xs" />
                        Top Casks – Last 30 Days
                        {totalFormatted && (
                            <span className="text-xs text-zinc-500 ml-2">
                                (Total: {totalFormatted})
                            </span>
                        )}
                    </div>
                    <div className="action">
                        <NavLink to="/analytics">
                            <Button variant="ghost" size="sm">
                                <TrendingUp size={18} />
                                <span className="text-sm font-medium">View Full Analytics</span>
                            </Button>
                        </NavLink>
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
                        <div className="space-y-2">
                            {topItems.map((item) => {
                                const homepage = caskMeta[item.cask];

                                return (
                                    <AnalyticsItemRow
                                        key={item.cask}
                                        item={item}
                                        homepage={homepage}
                                        maxCount={maxCount}
                                        variant="amber"
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;