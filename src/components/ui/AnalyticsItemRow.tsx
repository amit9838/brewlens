/**
 * @file AnalyticsItemRow.tsx
 * Standardized row for analytics data, used in both Dashboard and Analytics pages.
 */
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { FaviconImage } from "./FaviconImage";

interface AnalyticsItem {
    number: number;
    cask: string;
    count: string;
    percent: string;
}

interface AnalyticsItemRowProps {
    item: AnalyticsItem;
    homepage?: string;
    maxCount: number;
    variant?: 'default' | 'amber';
}

const formatCount = (count: string) => {
    const n = parseInt(count.replace(/,/g, ''), 10);
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return String(n);
};

export const AnalyticsItemRow = ({ item, homepage, maxCount, variant = 'default' }: AnalyticsItemRowProps) => {
    const count = parseInt(item.count.replace(/,/g, ''), 10);
    const barWidth = Math.max(2, (count / maxCount) * 100);

    const barColor = variant === 'amber'
        ? "bg-gradient-to-r from-amber-400/40 via-orange-500/70 to-orange-500/70"
        : item.number === 1
            ? "bg-gradient-to-r from-cyan-400 to-green-400"
            : item.number <= 3
                ? "bg-green-500"
                : "bg-green-600/70";

    const hoverColor = variant === 'amber'
        ? "hover:border-amber-500/30"
        : "hover:border-green-500/30";

    return (
        <NavLink to={`/cask/${item.cask}`}>
            <div className={cn(
                "flex flex-wrap items-center gap-2 sm:gap-4 px-4 py-3 my-2 rounded-xl transition-all cursor-pointer",
                "bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50",
                hoverColor
            )}>
                {/* Rank */}
                <span className="w-6 text-xs text-zinc-400 text-right shrink-0">{item.number}.</span>

                {/* Favicon */}
                <FaviconImage
                    homepage={homepage}
                    name={item.cask}
                    size={24}
                    className="rounded-md"
                />

                {/* Cask name – takes remaining space, truncates */}
                <span className="flex-1 min-w-0 text-sm font-semibold truncate text-gray-900 dark:text-zinc-100">{item.cask}</span>

                {/* Count and percentage: on mobile combine them, on large show count only */}
                <span className="text-xs text-zinc-500 shrink-0 text-right font-mono">
                    <span className="sm:hidden">{formatCount(item.count)} ({item.percent}%)</span>
                    <span className="hidden sm:inline">{formatCount(item.count)}</span>
                </span>

                {/* Bar – full width on mobile, flexible on larger screens */}
                <div className="w-full sm:flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1 sm:mt-0 shadow-inner">
                    <div
                        className={cn("h-full rounded-full transition-all duration-500", barColor)}
                        style={{ width: `${barWidth}%` }}
                    />
                </div>

                {/* Percentage column – only visible on larger screens */}
                <span className="hidden sm:block w-12 text-xs font-bold text-zinc-500 text-right shrink-0">
                    {item.percent}%
                </span>
            </div>
        </NavLink>
    );
};
