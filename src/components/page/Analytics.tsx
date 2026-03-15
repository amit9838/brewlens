import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { TrendingUp } from "lucide-react";
import { NavLink } from "react-router-dom";

type Period = '30d' | '90d' | '365d';

interface AnalyticsItem {
    number: number;
    cask: string;
    count: string;
    percent: string;
}

interface AnalyticsResponse {
    total_count: number;
    start_date: string;
    end_date: string;
    items: AnalyticsItem[];
}

interface CaskMeta {
    token: string;
    homepage: string;
}

const PERIOD_LABELS: Record<Period, string> = {
    '30d': '30 Days',
    '90d': '90 Days',
    '365d': '365 Days',
};

const fetchAnalytics = async (period: Period): Promise<AnalyticsResponse> => {
    const res = await fetch(`https://formulae.brew.sh/api/analytics/cask-install/${period}.json`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
};

const fetchCaskMeta = async (): Promise<Record<string, string>> => {
    const res = await fetch('https://formulae.brew.sh/api/cask.json');
    if (!res.ok) throw new Error('Failed to fetch cask metadata');
    const data: CaskMeta[] = await res.json();
    return Object.fromEntries(data.map(c => [c.token, c.homepage]));
};

const formatCount = (count: string) => {
    const n = parseInt(count.replace(/,/g, ''), 10);
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return String(n);
};

export default function Analytics() {
    const [period, setPeriod] = useState<Period>('30d');
    const [showAll, setShowAll] = useState(false);

    const { data: analytics, isLoading, error } = useQuery({
        queryKey: ['analytics', period],
        queryFn: () => fetchAnalytics(period),
        staleTime: 1000 * 60 * 10,
    });

    const { data: caskMeta = {} } = useQuery({
        queryKey: ['cask-meta'],
        queryFn: fetchCaskMeta,
        staleTime: 1000 * 60 * 60,
    });

    const items = analytics?.items ?? [];
    const displayed = showAll ? items : items.slice(0, 25);
    const maxCount = items[0] ? parseInt(items[0].count.replace(/,/g, ''), 10) : 1;
    const totalFormatted = analytics
        ? formatCount(String(analytics.total_count))
        : null;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp size={20} className="text-green-500" />
                        Top Cask Installs — Last {PERIOD_LABELS[period]}
                    </h2>
                    {totalFormatted && (
                        <p className="text-sm text-zinc-500 mt-0.5">
                            Total Installs: {totalFormatted}
                            {analytics && (
                                <span className="ml-2 opacity-60 text-xs">
                                    {analytics.start_date} → {analytics.end_date}
                                </span>
                            )}
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    {(['30d', '90d', '365d'] as Period[]).map(p => (
                        <Button key={p} isPill size="sm"
                            variant={period === p ? 'primary' : 'outline'}
                            onClick={() => { setPeriod(p); setShowAll(false); }}>
                            {PERIOD_LABELS[p]}
                        </Button>
                    ))}
                </div>
            </div>

            {/* List */}
            {isLoading && (
                <div className="space-y-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                    ))}
                </div>
            )}

            {error && (
                <p className="text-red-500 text-sm">Failed to load analytics data.</p>
            )}

            {!isLoading && !error && (
                <div className="space-y-2">
                    {displayed.map((item) => {
                        const homepage = caskMeta[item.cask];
                        const count = parseInt(item.count.replace(/,/g, ''), 10);
                        const barWidth = Math.max(2, (count / maxCount) * 100);

                        return (
                            <NavLink key={item.cask} to={`/cask/${item.cask}`}>
                                <div
                                    className="flex items-center gap-3 my-2 px-4 py-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-green-500 transition-all cursor-pointer">
                                    {/* Rank */}
                                    <span className="w-6 text-xs text-zinc-400 text-right shrink-0">{item.number}.</span>

                                    {/* Favicon */}
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${homepage}&sz=32`}
                                        onError={(e) => (e.currentTarget.src = '/vite.svg')}
                                        className="w-6 h-6 rounded shrink-0"
                                        alt=""
                                    />

                                    {/* Name */}
                                    <span className="w-44 text-sm font-medium truncate shrink-0">{item.cask}</span>

                                    {/* Count */}
                                    <span className="w-14 text-xs text-zinc-500 shrink-0 text-right">
                                        {formatCount(item.count)}
                                    </span>

                                    {/* Bar */}
                                    <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-500",
                                                item.number === 1 ? "bg-gradient-to-r from-cyan-400 to-green-400"
                                                    : item.number <= 3 ? "bg-green-500"
                                                        : "bg-green-600/70"
                                            )}
                                            style={{ width: `${barWidth}%` }}
                                        />
                                    </div>

                                    {/* Percent */}
                                    <span className="w-12 text-xs font-semibold text-zinc-500 text-right shrink-0">
                                        {item.percent}%
                                    </span>
                                </div>
                            </NavLink>
                        );
                    })}

                    {!showAll && items.length > 25 && (
                        <div className="flex justify-center pt-2">
                            <Button variant="secondary" size="sm" onClick={() => setShowAll(true)}>
                                View All ({items.length})
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
